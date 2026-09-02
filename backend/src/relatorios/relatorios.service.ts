import { Injectable } from '@nestjs/common';
import type {
  AgendaItem,
  Pagamento,
  RelatorioProfissional,
  RelatorioResumo,
  RelatorioServico,
  RelatorioSerieTemporal,
  RelatoriosResponse,
} from '@beautyflow/shared-types';
import { AgendaService } from '../agenda/agenda.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from '../clientes/clientes.service';
import { ComunicacaoService } from '../comunicacao/comunicacao.service';
import { FinanceiroService } from '../financeiro/financeiro.service';
import type { RelatoriosQuery } from './dto/relatorios-query.dto';
import { filtrarPagamentosDoUniverso } from './relatorios-financeiro.util';

/** Top 5 por quantidade (seções 12/13 do pedido) — nunca preenchido artificialmente além do que existe. */
const TOP_N = 5;

const RESUMO_VAZIO: RelatorioResumo = {
  totalAtendimentos: 0,
  atendimentosConfirmados: 0,
  atendimentosConcluidos: 0,
  atendimentosCancelados: 0,
  valorPrevisto: 0,
  valorRecebido: 0,
  valorPendente: 0,
  clientesNovos: 0,
  comunicacoesEnviadas: 0,
  comunicacoesComFalha: 0,
  taxaConfirmacao: 0,
  taxaCancelamento: 0,
};

function listarDiasDoPeriodo(dataInicio: string, dataFim: string): string[] {
  const dias: string[] = [];
  let atual = new Date(`${dataInicio}T00:00:00Z`).getTime();
  const fim = new Date(`${dataFim}T00:00:00Z`).getTime();
  while (atual <= fim) {
    dias.push(new Date(atual).toISOString().slice(0, 10));
    atual += 86_400_000;
  }
  return dias;
}

function serieVazia(dataInicio: string, dataFim: string): RelatorioSerieTemporal[] {
  return listarDiasDoPeriodo(dataInicio, dataFim).map((data) => ({
    data,
    atendimentos: 0,
    valorPrevisto: 0,
    valorRecebido: 0,
  }));
}

@Injectable()
export class RelatoriosService {
  /**
   * Não cria mocks próprios: deriva tudo das mesmas respostas que Agenda/Clientes/
   * Financeiro/Comunicacao já produzem para seus próprios módulos, chamando exatamente
   * os mesmos métodos `.listar(user, ...)` que os respectivos controllers chamam — cada
   * um já aplica sua própria regra de multi-tenancy/perfil (owner vê a empresa,
   * profissional vê seu próprio escopo via idProfissional, platform_admin recebe vazio),
   * então este service herda essas regras automaticamente sem duplicar nenhuma delas
   * aqui. Em particular, para um usuário `profissional`, `agenda` já vem filtrada só com
   * os próprios atendimentos (AgendaService.listar) — por isso `desempenhoProfissionais`
   * naturalmente tem no máximo 1 linha (a própria) sem nenhum código extra aqui.
   *
   * ServicosService/ProfissionaisService NÃO são injetados: o ranking de serviços/
   * profissionais deriva inteiramente dos nomes já presentes em AgendaItem
   * (servicoNome/profissionalNome, não idServico/idProfissional — a Agenda não expõe
   * esses ids no seu contrato público), não do catálogo de Serviços/Profissionais.
   */
  constructor(
    private readonly agendaService: AgendaService,
    private readonly clientesService: ClientesService,
    private readonly financeiroService: FinanceiroService,
    private readonly comunicacaoService: ComunicacaoService,
  ) {}

  /**
   * Async por causa de ClientesService.listar() e (integração Agenda)
   * AgendaService.listar() (cada um pode chamar o APP-WF019 via HTTP quando o
   * respectivo DATA_SOURCE_* está em `n8n` — ver clientes.service.ts/agenda.service.ts)
   * — mudança mecânica de sincronização, sem nenhuma alteração de regra de negócio deste
   * método. `financeiroService`/`comunicacaoService` continuam síncronos, exatamente
   * como antes.
   */
  async obterRelatorio(
    user: AuthenticatedUser,
    query: RelatoriosQuery,
  ): Promise<RelatoriosResponse> {
    const periodo = { dataInicio: query.dataInicio, dataFim: query.dataFim };

    if (!user.idEmpresa) {
      return {
        periodo,
        resumo: { ...RESUMO_VAZIO },
        servicosMaisRealizados: [],
        desempenhoProfissionais: [],
        serieTemporal: serieVazia(periodo.dataInicio, periodo.dataFim),
      };
    }

    const agenda = (await this.agendaService.listar(user, periodo)).data;
    const clientes = (await this.clientesService.listar(user)).data;
    const financeiro = this.financeiroService.listar(user, periodo);
    const comunicacao = this.comunicacaoService.listar(user, periodo);

    // "Válido"/"realizado" para fins de valor previsto e rankings = não cancelado (seção
    // 10 do pedido: "cancelados não devem compor valor previsto"). totalAtendimentos e a
    // contagem diária de `atendimentos` na série temporal, ao contrário, contam TODOS os
    // status — representam o volume bruto de agendamentos do período, não só o "válido".
    const naoCancelados = agenda.filter((item) => item.status !== 'CANCELADO');

    // atendimentosConfirmados é sobre StatusConfirmacao (confirmação do cliente), não
    // StatusAgendamento — não precisa checar status === 'AGENDADO' à parte porque um
    // atendimento CONCLUIDO/CANCELADO sempre tem statusConfirmacao null (ver
    // shared-types/agenda.ts), então já fica fora desta contagem.
    const confirmados = agenda.filter((item) => item.statusConfirmacao === 'CONFIRMADO').length;
    const concluidos = agenda.filter((item) => item.status === 'CONCLUIDO').length;
    const cancelados = agenda.filter((item) => item.status === 'CANCELADO').length;
    const total = agenda.length;

    const valorPrevisto = naoCancelados.reduce((soma, item) => soma + item.valor, 0);

    const clientesNovos = clientes.filter(
      (cliente) =>
        cliente.clienteDesde >= periodo.dataInicio && cliente.clienteDesde <= periodo.dataFim,
    ).length;

    // Nunca usa financeiro.resumo diretamente: esse resumo é calculado pelo próprio
    // FinanceiroService sobre TODOS os registros do seu mock no período. A integridade
    // dos mocks garante hoje que todo idAgendamento do Financeiro tem contrapartida na
    // Agenda (testado em relatorios.service.spec.ts, "integridade dos mocks"), mas
    // filtrarPagamentosDoUniverso permanece como proteção DEFENSIVA contra referências
    // órfãs — não depende de os mocks nunca voltarem a divergir. Consolida por
    // idAgendamento usando DATA_HORA real (via
    // FinanceiroService.obterDataHoraPorPagamento) quando disponível — ver
    // relatorios-financeiro.util.ts. O universo de atendimentos deste relatório é sempre
    // `agenda` (já filtrada por período/perfil).
    const agendaIds = new Set(agenda.map((item) => item.idAgendamento));
    const dataHoraPorPagamento = this.financeiroService.obterDataHoraPorPagamento(user);
    const pagamentosDoUniverso = filtrarPagamentosDoUniverso(
      financeiro.data,
      agendaIds,
      dataHoraPorPagamento,
    );
    const valorRecebido = pagamentosDoUniverso.reduce(
      (soma, pagamento) => soma + pagamento.valorPago,
      0,
    );
    const valorPendente = pagamentosDoUniverso.reduce(
      (soma, pagamento) => soma + pagamento.valorPendente,
      0,
    );

    const resumo: RelatorioResumo = {
      totalAtendimentos: total,
      atendimentosConfirmados: confirmados,
      atendimentosConcluidos: concluidos,
      atendimentosCancelados: cancelados,
      valorPrevisto,
      valorRecebido,
      valorPendente,
      clientesNovos,
      comunicacoesEnviadas: comunicacao.resumo.enviadas,
      comunicacoesComFalha: comunicacao.resumo.comFalha,
      // Denominador = totalAtendimentos (não só "elegíveis"): decisão simples e
      // documentada (seção 11 do pedido) — 0 quando não há atendimentos, nunca null/NaN.
      taxaConfirmacao: total > 0 ? confirmados / total : 0,
      taxaCancelamento: total > 0 ? cancelados / total : 0,
    };

    return {
      periodo,
      resumo,
      servicosMaisRealizados: agruparServicos(naoCancelados),
      desempenhoProfissionais: agruparProfissionais(naoCancelados),
      serieTemporal: montarSerieTemporal(
        periodo.dataInicio,
        periodo.dataFim,
        agenda,
        pagamentosDoUniverso,
      ),
    };
  }
}

function agruparServicos(itens: AgendaItem[]): RelatorioServico[] {
  const mapa = new Map<string, RelatorioServico>();
  for (const item of itens) {
    const atual = mapa.get(item.servicoNome) ?? {
      nome: item.servicoNome,
      quantidade: 0,
      valorPrevisto: 0,
    };
    atual.quantidade += 1;
    atual.valorPrevisto += item.valor;
    mapa.set(item.servicoNome, atual);
  }
  return Array.from(mapa.values())
    .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome))
    .slice(0, TOP_N);
}

function agruparProfissionais(itens: AgendaItem[]): RelatorioProfissional[] {
  const mapa = new Map<string, RelatorioProfissional>();
  for (const item of itens) {
    const atual = mapa.get(item.profissionalNome) ?? {
      nome: item.profissionalNome,
      quantidadeAtendimentos: 0,
      valorPrevisto: 0,
    };
    atual.quantidadeAtendimentos += 1;
    atual.valorPrevisto += item.valor;
    mapa.set(item.profissionalNome, atual);
  }
  return Array.from(mapa.values())
    .sort(
      (a, b) => b.quantidadeAtendimentos - a.quantidadeAtendimentos || a.nome.localeCompare(b.nome),
    )
    .slice(0, TOP_N);
}

function montarSerieTemporal(
  dataInicio: string,
  dataFim: string,
  agenda: AgendaItem[],
  pagamentos: Pagamento[],
): RelatorioSerieTemporal[] {
  return listarDiasDoPeriodo(dataInicio, dataFim).map((data) => {
    const doDia = agenda.filter((item) => item.data === data);
    const naoCanceladosDoDia = doDia.filter((item) => item.status !== 'CANCELADO');
    const pagamentosDoDia = pagamentos.filter((pagamento) => pagamento.data === data);

    return {
      data,
      atendimentos: doDia.length,
      valorPrevisto: naoCanceladosDoDia.reduce((soma, item) => soma + item.valor, 0),
      valorRecebido: pagamentosDoDia.reduce((soma, pagamento) => soma + pagamento.valorPago, 0),
    };
  });
}
