import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AGENDA_MOCK_RECORDS } from '../agenda/agenda.mock-data';
import { AgendaService } from '../agenda/agenda.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from '../clientes/clientes.service';
import { COMUNICACAO_MOCK_RECORDS } from '../comunicacao/comunicacao.mock-data';
import { ComunicacaoService } from '../comunicacao/comunicacao.service';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { FINANCEIRO_MOCK_RECORDS } from '../financeiro/financeiro.mock-data';
import { FinanceiroService } from '../financeiro/financeiro.service';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { PROFISSIONAIS_MOCK_RECORDS } from '../profissionais/profissionais.mock-data';
import { RelatoriosService } from './relatorios.service';

function usuario(overrides: Partial<AuthenticatedUser>): AuthenticatedUser {
  return {
    idUsuario: 'usr-1',
    idEmpresa: 'EMP001',
    idProfissional: null,
    nome: 'Usuário Teste',
    email: 'teste@exemplo.com',
    perfil: 'owner',
    ...overrides,
  };
}

describe('RelatoriosService', () => {
  let service: RelatoriosService;
  let agendaService: AgendaService;
  let clientesService: ClientesService;
  let financeiroService: FinanceiroService;
  let comunicacaoService: ComunicacaoService;
  // Achado P1-1 da auditoria geral: as datas de EMP001 em Agenda/Financeiro/Comunicação
  // agora são relativas a `getHojeBrasilISO()`, não mais absolutas em agosto/2026 — esta
  // janela (nome "agosto" mantido só para minimizar o diff, hoje já não descreve o mês
  // real) precisa acompanhar isso. Margem generosa (-15/+5 dias) cobre confortavelmente
  // todo o intervalo usado pelo mock (hoje-10 a hoje+1), em qualquer dia real de execução.
  const hoje = getHojeBrasilISO();
  const agosto = { dataInicio: deslocarDiasISO(hoje, -15), dataFim: deslocarDiasISO(hoje, 5) };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // ConfigModule/N8nGatewayClient: ClientesService agora depende dos dois (ver
      // clientes.service.ts) — DATA_SOURCE_CLIENTES fica ausente aqui, então
      // ClientesService continua no modo mock de sempre; RelatoriosService em si não
      // muda nenhuma regra.
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
      providers: [
        RelatoriosService,
        AgendaService,
        ClientesService,
        FinanceiroService,
        ComunicacaoService,
        N8nGatewayClient,
      ],
    }).compile();

    service = moduleRef.get(RelatoriosService);
    agendaService = moduleRef.get(AgendaService);
    clientesService = moduleRef.get(ClientesService);
    financeiroService = moduleRef.get(FinanceiroService);
    comunicacaoService = moduleRef.get(ComunicacaoService);
  });

  describe('obterRelatorio', () => {
    it('owner recebe o total de atendimentos da própria empresa (agosto/2026)', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const agendaEsperada = agendaService.listar(owner, agosto).data;
      expect(resultado.resumo.totalAtendimentos).toBe(agendaEsperada.length);
      // atendimentosConfirmados é sobre StatusConfirmacao (confirmação do cliente), não
      // sobre StatusAgendamento (ver relatorios.service.ts e shared-types/agenda.ts).
      expect(resultado.resumo.atendimentosConfirmados).toBe(
        agendaEsperada.filter((item) => item.statusConfirmacao === 'CONFIRMADO').length,
      );
      expect(resultado.resumo.atendimentosConcluidos).toBe(
        agendaEsperada.filter((item) => item.status === 'CONCLUIDO').length,
      );
      expect(resultado.resumo.atendimentosCancelados).toBe(
        agendaEsperada.filter((item) => item.status === 'CANCELADO').length,
      );
    });

    it('valorPrevisto exclui agendamentos CANCELADO', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const agendaEsperada = agendaService.listar(owner, agosto).data;
      const somaEsperada = agendaEsperada
        .filter((item) => item.status !== 'CANCELADO')
        .reduce((soma, item) => soma + item.valor, 0);

      expect(resultado.resumo.valorPrevisto).toBe(somaEsperada);
      expect(resultado.resumo.atendimentosCancelados).toBeGreaterThan(0);
    });

    it('valorRecebido/valorPendente vêm do Financeiro, restritos ao universo de atendimentos da Agenda', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const agendaIds = new Set(
        agendaService.listar(owner, agosto).data.map((item) => item.idAgendamento),
      );
      const financeiroEsperado = financeiroService.listar(owner, agosto);
      const somaRecebidoEsperada = financeiroEsperado.data
        .filter((pagamento) => agendaIds.has(pagamento.idAgendamento))
        .reduce((soma, pagamento) => soma + pagamento.valorPago, 0);
      const somaPendenteEsperada = financeiroEsperado.data
        .filter((pagamento) => agendaIds.has(pagamento.idAgendamento))
        .reduce((soma, pagamento) => soma + pagamento.valorPendente, 0);

      expect(resultado.resumo.valorRecebido).toBe(somaRecebidoEsperada);
      expect(resultado.resumo.valorPendente).toBe(somaPendenteEsperada);

      // Com a integridade dos mocks corrigida (todo idAgendamento do Financeiro agora
      // tem contrapartida na Agenda — ver "integridade dos mocks" abaixo), o filtro não
      // remove mais nada em agosto/2026: bate 1:1 com o resumo bruto do FinanceiroService.
      expect(resultado.resumo.valorRecebido).toBe(financeiroEsperado.resumo.recebido);
      expect(resultado.resumo.valorPendente).toBe(financeiroEsperado.resumo.pendente);
    });

    it('REGRESSÃO: recebido + pendente sempre bate com valorPrevisto quando não há registros órfãos', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      // Com a integridade dos mocks corrigida, todo agendamento não cancelado tem
      // exatamente um registro financeiro correspondente — recebido+pendente bate com
      // valorPrevisto (ambos os lados agora derivam do mesmo universo de agendamentos).
      expect(resultado.resumo.valorRecebido + resultado.resumo.valorPendente).toBe(
        resultado.resumo.valorPrevisto,
      );
    });

    it('REGRESSÃO: reproduz o teste manual reportado (preset 7 dias) com os valores corretos pós-correção de integridade', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      // Achado P1-1: a janela era literal ('2026-08-18' a '2026-08-24') porque coincidia
      // com o intervalo hoje-6..hoje da época em que este teste foi escrito. Agora que
      // AGD001/002/003/004/006/008 são gerados com o MESMO deslocamento relativo a
      // getHojeBrasilISO() (offsets -3,-3,0,-2,-6,-5 — todos dentro de [-6,0]), a janela
      // "hoje-6 a hoje" continua capturando exatamente o mesmo conjunto de 6 registros,
      // em qualquer dia real de execução — os valores esperados abaixo NÃO mudam.
      const seteDias = { dataInicio: deslocarDiasISO(hoje, -6), dataFim: hoje };
      const resultado = await service.obterRelatorio(owner, seteDias);

      // Antes da correção de integridade, AGD006 (hoje-6) e AGD008 (hoje-5) eram órfãos
      // (existiam só no Financeiro) e ficavam de fora da Agenda — o preset de 7 dias
      // mostrava atendimentos=4/previsto=420/recebido=310/pendente=110. Como as duas
      // datas caem DENTRO da janela de 7 dias, adicioná-las à Agenda com as MESMAS datas
      // (exigido pelo pedido: nunca inventar datas para forçar um resultado) muda esses
      // números — são os valores corretos agora, não um erro: atendimentos=6,
      // previsto=540, recebido=370, pendente=170. O importante, validado abaixo, é que a
      // identidade recebido+pendente=previsto continua batendo.
      expect(resultado.resumo.totalAtendimentos).toBe(6);
      expect(resultado.resumo.valorPrevisto).toBe(540);
      expect(resultado.resumo.valorRecebido).toBe(370);
      expect(resultado.resumo.valorPendente).toBe(170);
      expect(resultado.resumo.valorRecebido + resultado.resumo.valorPendente).toBe(540);
    });

    it('pagamento PARCIAL continua contabilizado corretamente em valorRecebido e valorPendente (AGD002)', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const seteDias = { dataInicio: deslocarDiasISO(hoje, -6), dataFim: hoje };
      const resultado = await service.obterRelatorio(owner, seteDias);

      const agd002 = financeiroService
        .listar(owner, seteDias)
        .data.find((item) => item.idAgendamento === 'AGD002');
      expect(agd002?.status).toBe('PARCIAL');
      expect(agd002?.valorPago).toBe(50);
      expect(agd002?.valorPendente).toBe(40);

      // O valor parcial de AGD002 (R$50 pago + R$40 pendente) precisa estar refletido no
      // resumo agregado — não pode ter sido descartado junto com os órfãos.
      expect(resultado.resumo.valorRecebido).toBeGreaterThanOrEqual(50);
      expect(resultado.resumo.valorPendente).toBeGreaterThanOrEqual(40);
    });

    it('comunicacoesEnviadas/comFalha vêm exatamente do resumo do ComunicacaoService', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const comunicacaoEsperada = comunicacaoService.listar(owner, agosto).resumo;
      expect(resultado.resumo.comunicacoesEnviadas).toBe(comunicacaoEsperada.enviadas);
      expect(resultado.resumo.comunicacoesComFalha).toBe(comunicacaoEsperada.comFalha);
    });

    it('clientesNovos conta somente clientes com clienteDesde dentro do período', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const clientesEsperados = (await clientesService.listar(owner)).data.filter(
        (cliente) =>
          cliente.clienteDesde >= agosto.dataInicio && cliente.clienteDesde <= agosto.dataFim,
      ).length;

      expect(resultado.resumo.clientesNovos).toBe(clientesEsperados);
    });

    it('taxaConfirmacao e taxaCancelamento seguem a fórmula documentada (confirmados|cancelados / total)', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);
      const {
        totalAtendimentos,
        atendimentosConfirmados,
        atendimentosCancelados,
        taxaConfirmacao,
        taxaCancelamento,
      } = resultado.resumo;

      expect(taxaConfirmacao).toBeCloseTo(atendimentosConfirmados / totalAtendimentos);
      expect(taxaCancelamento).toBeCloseTo(atendimentosCancelados / totalAtendimentos);
    });

    // Migração do modelo de status: um atendimento CONCLUIDO tem statusConfirmacao null
    // (não se aplica mais, ver shared-types/agenda.ts) — nunca deve ser contado em
    // atendimentosConfirmados, mesmo havendo CONCLUIDO no período (AGD006/007/008/101).
    it('atendimentosConfirmados nunca conta atendimentos CONCLUIDO (statusConfirmacao null)', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const agendaEsperada = agendaService.listar(owner, agosto).data;
      const concluidosNoPeriodo = agendaEsperada.filter((item) => item.status === 'CONCLUIDO');
      expect(concluidosNoPeriodo.length).toBeGreaterThan(0);
      expect(concluidosNoPeriodo.every((item) => item.statusConfirmacao === null)).toBe(true);

      const confirmadosReais = agendaEsperada.filter(
        (item) => item.statusConfirmacao === 'CONFIRMADO',
      ).length;
      expect(resultado.resumo.atendimentosConfirmados).toBe(confirmadosReais);
      expect(resultado.resumo.atendimentosConfirmados).toBeLessThan(agendaEsperada.length);
    });

    it('EMP001 nunca recebe dados de EMP002 (ranking de profissionais/serviços)', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      expect(resultado.desempenhoProfissionais.some((item) => item.nome === 'Rafael Torres')).toBe(
        false,
      );
      expect(resultado.servicosMaisRealizados.some((item) => item.nome === 'Corte e escova')).toBe(
        false,
      );
    });

    it('ranking de serviços/profissionais soma quantidade e valorPrevisto corretamente e ordena por quantidade desc', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      for (let i = 1; i < resultado.desempenhoProfissionais.length; i += 1) {
        expect(
          resultado.desempenhoProfissionais[i - 1].quantidadeAtendimentos,
        ).toBeGreaterThanOrEqual(resultado.desempenhoProfissionais[i].quantidadeAtendimentos);
      }

      const totalPorProfissionais = resultado.desempenhoProfissionais.reduce(
        (soma, item) => soma + item.quantidadeAtendimentos,
        0,
      );
      const totalNaoCancelado =
        resultado.resumo.totalAtendimentos - resultado.resumo.atendimentosCancelados;
      expect(totalPorProfissionais).toBe(totalNaoCancelado);
    });

    it('profissional recebe métricas de Agenda/Financeiro restritas ao próprio idProfissional', async () => {
      const profissional = usuario({
        idEmpresa: 'EMP001',
        perfil: 'profissional',
        idProfissional: 'PROF001',
      });
      const resultado = await service.obterRelatorio(profissional, agosto);

      const agendaEsperada = agendaService.listar(profissional, agosto).data;
      expect(resultado.resumo.totalAtendimentos).toBe(agendaEsperada.length);
      expect(resultado.desempenhoProfissionais.every((item) => item.nome === 'Ana Martins')).toBe(
        true,
      );
      expect(resultado.desempenhoProfissionais.length).toBeLessThanOrEqual(1);
    });

    it('platform_admin (sem id_empresa) recebe relatório seguro/vazio, nunca cross-tenant', async () => {
      const admin = usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' });
      const resultado = await service.obterRelatorio(admin, agosto);

      expect(resultado.resumo.totalAtendimentos).toBe(0);
      expect(resultado.resumo.valorPrevisto).toBe(0);
      expect(resultado.resumo.valorRecebido).toBe(0);
      expect(resultado.servicosMaisRealizados).toEqual([]);
      expect(resultado.desempenhoProfissionais).toEqual([]);
    });

    it('período sem nenhum dado retorna resumo zerado e série temporal zerada, não erro', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const periodoVazio = { dataInicio: '2020-01-01', dataFim: '2020-01-01' };
      const resultado = await service.obterRelatorio(owner, periodoVazio);

      expect(resultado.resumo.totalAtendimentos).toBe(0);
      expect(resultado.resumo.taxaConfirmacao).toBe(0);
      expect(resultado.resumo.taxaCancelamento).toBe(0);
      expect(resultado.serieTemporal).toHaveLength(1);
      expect(resultado.serieTemporal[0]).toEqual({
        data: '2020-01-01',
        atendimentos: 0,
        valorPrevisto: 0,
        valorRecebido: 0,
      });
    });

    it('serieTemporal tem uma entrada por dia do período, em ordem cronológica', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const periodo = { dataInicio: '2026-08-01', dataFim: '2026-08-05' };
      const resultado = await service.obterRelatorio(owner, periodo);

      expect(resultado.serieTemporal.map((item) => item.data)).toEqual([
        '2026-08-01',
        '2026-08-02',
        '2026-08-03',
        '2026-08-04',
        '2026-08-05',
      ]);
    });

    it('a soma diária de atendimentos na série temporal bate com totalAtendimentos do resumo', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      const somaSerie = resultado.serieTemporal.reduce((soma, dia) => soma + dia.atendimentos, 0);
      expect(somaSerie).toBe(resultado.resumo.totalAtendimentos);
    });

    it('o período de resposta reflete exatamente o período consultado', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      expect(resultado.periodo).toEqual(agosto);
    });

    it('a resposta nunca expõe idEmpresa/idProfissional em nenhuma seção', async () => {
      const owner = usuario({ idEmpresa: 'EMP001', perfil: 'owner' });
      const resultado = await service.obterRelatorio(owner, agosto);

      expect(resultado.resumo).not.toHaveProperty('idEmpresa');
      for (const item of [
        ...resultado.servicosMaisRealizados,
        ...resultado.desempenhoProfissionais,
      ]) {
        expect(item).not.toHaveProperty('idEmpresa');
        expect(item).not.toHaveProperty('idProfissional');
      }
    });
  });

  /**
   * Testes de integridade dos MOCKS em si (não do comportamento de RelatoriosService) —
   * garantem que a causa raiz da divergência de R$ 120 (idAgendamento usado por
   * Financeiro/Comunicação sem contrapartida na Agenda) não volta a existir
   * silenciosamente se algum mock for editado no futuro sem atualizar os outros.
   */
  describe('integridade dos mocks (Agenda × Financeiro × Comunicação)', () => {
    it('todo Financeiro.idAgendamento existe na Agenda, na mesma empresa', () => {
      for (const pagamento of FINANCEIRO_MOCK_RECORDS) {
        const agendamento = AGENDA_MOCK_RECORDS.find(
          (item) => item.idAgendamento === pagamento.idAgendamento,
        );

        expect(agendamento).toBeDefined();
        expect(agendamento?.idEmpresa).toBe(pagamento.idEmpresa);
      }
    });

    it('toda Comunicação com idAgendamento != null existe na Agenda, na mesma empresa', () => {
      const comComAgendamento = COMUNICACAO_MOCK_RECORDS.filter(
        (item) => item.idAgendamento !== null,
      );
      expect(comComAgendamento.length).toBeGreaterThan(0);

      for (const comunicacao of comComAgendamento) {
        const agendamento = AGENDA_MOCK_RECORDS.find(
          (item) => item.idAgendamento === comunicacao.idAgendamento,
        );

        expect(agendamento).toBeDefined();
        expect(agendamento?.idEmpresa).toBe(comunicacao.idEmpresa);
      }
    });

    it('nenhum ID cross-tenant é usado para satisfazer o vínculo (idEmpresa deve bater dos dois lados)', () => {
      for (const pagamento of FINANCEIRO_MOCK_RECORDS) {
        const agendamentoComMesmoId = AGENDA_MOCK_RECORDS.find(
          (item) => item.idAgendamento === pagamento.idAgendamento,
        );
        // Nunca deve existir um caso em que o idAgendamento bate mas a empresa diverge —
        // isso indicaria um vínculo satisfeito "por acaso" com o registro de outro tenant.
        if (agendamentoComMesmoId) {
          expect(agendamentoComMesmoId.idEmpresa).toBe(pagamento.idEmpresa);
        }
      }

      for (const comunicacao of COMUNICACAO_MOCK_RECORDS) {
        if (!comunicacao.idAgendamento) continue;
        const agendamentoComMesmoId = AGENDA_MOCK_RECORDS.find(
          (item) => item.idAgendamento === comunicacao.idAgendamento,
        );
        if (agendamentoComMesmoId) {
          expect(agendamentoComMesmoId.idEmpresa).toBe(comunicacao.idEmpresa);
        }
      }
    });

    it('nenhum idAgendamento do Financeiro/Comunicação está órfão (sem correspondência alguma na Agenda)', () => {
      const agendaIds = new Set(AGENDA_MOCK_RECORDS.map((item) => item.idAgendamento));

      const orfaosFinanceiro = FINANCEIRO_MOCK_RECORDS.filter(
        (pagamento) => !agendaIds.has(pagamento.idAgendamento),
      );
      const orfaosComunicacao = COMUNICACAO_MOCK_RECORDS.filter(
        (item) => item.idAgendamento !== null && !agendaIds.has(item.idAgendamento),
      );

      expect(orfaosFinanceiro).toEqual([]);
      expect(orfaosComunicacao).toEqual([]);
    });
  });

  // Achado P2-3 da auditoria geral: Agenda/Financeiro/Comunicação referenciavam
  // idProfissional='PROF010' para Rafael Torres/EMP002, enquanto o catálogo de
  // Profissionais definia esse mesmo profissional como 'PROF101' — uma referência órfã
  // (nunca vazou ao contrato público, já que idProfissional é campo interno, mas quebraria
  // silenciosamente qualquer futuro cruzamento por ID). Corrigido padronizando para
  // 'PROF010' (a grafia usada de forma consistente por 3 módulos). Este teste prova a
  // integridade de forma geral — por idProfissional+idEmpresa, não pelo nome
  // "Rafael Torres" — para pegar qualquer referência órfã futura, não só esta específica.
  describe('integridade dos mocks (idProfissional × Profissionais)', () => {
    it('todo idProfissional referenciado por Agenda/Financeiro/Comunicação existe no catálogo de Profissionais, na mesma empresa', () => {
      const catalogo = new Set(
        PROFISSIONAIS_MOCK_RECORDS.map((item) => `${item.idEmpresa}::${item.idProfissional}`),
      );

      const referencias = [
        ...AGENDA_MOCK_RECORDS.map((item) => ({
          idEmpresa: item.idEmpresa,
          idProfissional: item.idProfissional,
          origem: `agenda:${item.idAgendamento}`,
        })),
        ...FINANCEIRO_MOCK_RECORDS.map((item) => ({
          idEmpresa: item.idEmpresa,
          idProfissional: item.idProfissional,
          origem: `financeiro:${item.idAgendamento}`,
        })),
        ...COMUNICACAO_MOCK_RECORDS.filter((item) => item.idProfissional !== null).map((item) => ({
          idEmpresa: item.idEmpresa,
          idProfissional: item.idProfissional as string,
          origem: `comunicacao:${item.idComunicacao}`,
        })),
      ];

      // Garante que o teste está de fato exercitando referências reais, não passando
      // trivialmente por falta de dado.
      expect(referencias.length).toBeGreaterThan(0);

      const orfaos = referencias.filter(
        (referencia) => !catalogo.has(`${referencia.idEmpresa}::${referencia.idProfissional}`),
      );
      expect(orfaos).toEqual([]);
    });
  });
});
