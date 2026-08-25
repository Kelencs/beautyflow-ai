import { Injectable, NotFoundException } from '@nestjs/common';
import type { FinanceiroResponse, FinanceiroResumo, Pagamento } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { FINANCEIRO_MOCK_RECORDS, type FinanceiroMockRecord } from './financeiro.mock-data';
import type { FinanceiroQuery } from './dto/financeiro-query.dto';

const RESUMO_VAZIO: FinanceiroResumo = {
  recebido: 0,
  pendente: 0,
  totalPrevisto: 0,
  totalPagamentos: 0,
};

function toPagamento(registro: FinanceiroMockRecord): Pagamento {
  return {
    idAgendamento: registro.idAgendamento,
    idPagamento: registro.idPagamento,
    clienteNome: registro.clienteNome,
    servicoNome: registro.servicoNome,
    profissionalNome: registro.profissionalNome,
    data: registro.data,
    valorAgendamento: registro.valorAgendamento,
    valorPago: registro.valorPago,
    valorPendente: registro.valorPendente,
    formaPagamento: registro.formaPagamento,
    status: registro.status,
  };
}

function calcularResumo(registros: Pagamento[]): FinanceiroResumo {
  return registros.reduce(
    (resumo, registro) => ({
      recebido: resumo.recebido + registro.valorPago,
      pendente: resumo.pendente + registro.valorPendente,
      totalPrevisto: resumo.totalPrevisto + registro.valorAgendamento,
      totalPagamentos: resumo.totalPagamentos + 1,
    }),
    { ...RESUMO_VAZIO },
  );
}

@Injectable()
export class FinanceiroService {
  /**
   * Filtra SEMPRE por user.idEmpresa (nunca por parâmetro de URL — GET /financeiro não
   * aceita id_empresa, ver FinanceiroController). Regras por perfil:
   *
   * - platform_admin (idEmpresa null): resumo/lista vazios, mesmo comportamento seguro
   *   por padrão já usado em Agenda/Clientes/Serviços/Profissionais/Dashboard — sem
   *   visão financeira cross-tenant automática.
   * - owner: vê todos os pagamentos/pendências da própria empresa.
   * - profissional: vê SOMENTE os registros dos próprios atendimentos (idProfissional ==
   *   o seu), replicando a mesma lógica de AgendaService.listar(). Decisão deliberada e
   *   DIFERENTE da usada em Clientes/Serviços/Profissionais (onde profissional vê a
   *   empresa inteira, porque não existe vínculo exclusivo cliente/serviço<->
   *   profissional no schema real): dados financeiros são sensíveis por natureza — cada
   *   registro aqui JÁ pertence a um atendimento com profissional definido (mesmo campo
   *   idProfissional usado pela Agenda), então não há necessidade de expor o financeiro
   *   completo da empresa a um profissional comum; o escopo "só meus atendimentos" é
   *   tanto mais seguro quanto mais coerente com o que a Agenda já mostra a esse mesmo
   *   profissional.
   */
  listar(user: AuthenticatedUser, query: FinanceiroQuery): FinanceiroResponse {
    if (!user.idEmpresa) {
      return { resumo: { ...RESUMO_VAZIO }, data: [] };
    }

    const doEmpresa = FINANCEIRO_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );

    const doPeriodo = doEmpresa.filter(
      (registro) => registro.data >= query.dataInicio && registro.data <= query.dataFim,
    );

    const doPerfil =
      user.perfil === 'profissional'
        ? doPeriodo.filter((registro) => registro.idProfissional === user.idProfissional)
        : doPeriodo;

    const doStatus = query.status
      ? doPerfil.filter((registro) => registro.status === query.status)
      : doPerfil;

    const data = doStatus.map(toPagamento);
    return { resumo: calcularResumo(data), data };
  }

  /**
   * Busca por idAgendamento — não por idPagamento, porque registros PENDENTE não têm
   * idPagamento real (nenhuma linha em PAGAMENTOS existe ainda, ver financeiro.ts). Todo
   * registro financeiro sempre tem um idAgendamento válido, por isso ele é o
   * identificador de rota mais robusto para este recurso.
   *
   * Mesma regra de 404 idêntico (inexistente ou de outra empresa) já usada em
   * Clientes/Serviços/Profissionais — nunca revela a existência cross-tenant. Para
   * profissional, aplica-se também o escopo "só meus atendimentos" (ver listar()): um
   * agendamento de outro profissional na mesma empresa retorna 404, não 403 — mesmo
   * padrão de não revelar existência a quem não deveria enxergar aquele registro.
   */
  buscarPorId(user: AuthenticatedUser, idAgendamento: string): Pagamento {
    const registro = user.idEmpresa
      ? FINANCEIRO_MOCK_RECORDS.find(
          (item) => item.idAgendamento === idAgendamento && item.idEmpresa === user.idEmpresa,
        )
      : undefined;

    if (!registro) {
      throw new NotFoundException('Registro financeiro não encontrado.');
    }

    if (user.perfil === 'profissional' && registro.idProfissional !== user.idProfissional) {
      throw new NotFoundException('Registro financeiro não encontrado.');
    }

    return toPagamento(registro);
  }

  /**
   * Uso interno (NÃO chamado pelo FinanceiroController — nunca exposto via HTTP): mapa
   * idPagamento -> DATA_HORA do pagamento, para módulos internos (ex.: RelatoriosService)
   * consolidarem corretamente "qual registro é o mais recente" quando houver mais de uma
   * linha para o mesmo idAgendamento (schema real de PAGAMENTOS é transacional — ver
   * financeiro.ts). DATA_HORA nunca faz parte do contrato público `Pagamento`; só
   * idPagamento (que já é público) identifica a entrada no mapa. Registros PENDENTE
   * (idPagamento null) não entram no mapa — não há timestamp real para eles.
   */
  obterDataHoraPorPagamento(user: AuthenticatedUser): Map<string, string> {
    const mapa = new Map<string, string>();
    if (!user.idEmpresa) {
      return mapa;
    }

    for (const registro of FINANCEIRO_MOCK_RECORDS) {
      if (
        registro.idEmpresa === user.idEmpresa &&
        registro.idPagamento &&
        registro.dataHoraPagamento
      ) {
        mapa.set(registro.idPagamento, registro.dataHoraPagamento);
      }
    }
    return mapa;
  }
}
