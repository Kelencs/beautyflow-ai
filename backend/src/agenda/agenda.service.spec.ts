import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { ClientesService } from '../clientes/clientes.service';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayAgendamentoIntegracao } from '../n8n-gateway/n8n-gateway.types';
import { ProfissionaisService } from '../profissionais/profissionais.service';
import { ServicosService } from '../servicos/servicos.service';
import { AGENDA_MOCK_RECORDS } from './agenda.mock-data';
import { AgendaService } from './agenda.service';

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

describe('AgendaService', () => {
  const ORIGINAL_ENV = process.env;

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('modo mock (DATA_SOURCE_AGENDA ausente ou "mock" — comportamento existente)', () => {
    let service: AgendaService;
    // Achado P1-1 da auditoria geral: as datas de AGD001-AGD008 agora são relativas a
    // `getHojeBrasilISO()` (ver agenda.mock-data.ts), não mais absolutas em agosto/2026 —
    // a janela de teste precisa acompanhar isso. Margem generosa (-15/+5 dias) cobre
    // confortavelmente todo o intervalo usado pelo mock (hoje-10 a hoje+1) em qualquer dia
    // real de execução, sem precisar ser revisada por avanço do calendário.
    const hoje = getHojeBrasilISO();
    const periodo = { dataInicio: deslocarDiasISO(hoje, -15), dataFim: deslocarDiasISO(hoje, 5) };

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      delete process.env.DATA_SOURCE_AGENDA;

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [
          AgendaService,
          ClientesService,
          ProfissionaisService,
          ServicosService,
          N8nGatewayClient,
        ],
      }).compile();
      service = moduleRef.get(AgendaService);
    });

    it('nunca retorna registros de outra empresa (owner de EMP001)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        periodo,
      );

      // AGD101/AGD102 e seus clientes pertencem a EMP002 no mock (ver agenda.mock-data.ts).
      expect(resultado.data.length).toBeGreaterThan(0);
      expect(
        resultado.data.some(
          (item) => item.idAgendamento === 'AGD101' || item.idAgendamento === 'AGD102',
        ),
      ).toBe(false);
      expect(resultado.data.some((item) => item.clienteNome === 'Beatriz Nogueira')).toBe(false);
    });

    it('owner vê todos os agendamentos da própria empresa, independente do profissional', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        periodo,
      );
      const profissionaisDistintos = new Set(resultado.data.map((item) => item.profissionalNome));

      expect(profissionaisDistintos.size).toBeGreaterThan(1);
    });

    it('profissional só vê os agendamentos do próprio id_profissional', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        periodo,
      );

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.profissionalNome === 'Ana Martins')).toBe(true);
    });

    it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        periodo,
      );

      expect(resultado.data).toEqual([]);
    });

    it('respeita o intervalo de datas informado (hoje, dinâmico — AGD003)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: hoje,
        dataFim: hoje,
      });

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0]?.idAgendamento).toBe('AGD003');
    });

    it('a resposta nunca inclui idEmpresa/idProfissional (contrato público)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        periodo,
      );

      for (const item of resultado.data) {
        expect(item).not.toHaveProperty('idEmpresa');
        expect(item).not.toHaveProperty('idProfissional');
      }
    });

    // Achado P1-1: teste de estabilidade temporal — prova que o mock não depende de uma
    // data absoluta fixa. Se algum dia alguém reintroduzir uma string fixa em
    // agenda.mock-data.ts, este teste quebra imediatamente, no dia seguinte à edição.
    describe('estabilidade temporal (achado P1-1 do Dashboard — ver dashboard.service.ts)', () => {
      it('AGD003 está sempre em "hoje", AGD005 sempre no futuro (hoje+1) e AGD007 sempre no passado (hoje-10)', () => {
        const agd003 = AGENDA_MOCK_RECORDS.find((item) => item.idAgendamento === 'AGD003');
        const agd005 = AGENDA_MOCK_RECORDS.find((item) => item.idAgendamento === 'AGD005');
        const agd007 = AGENDA_MOCK_RECORDS.find((item) => item.idAgendamento === 'AGD007');

        expect(agd003?.data).toBe(hoje);

        expect(agd005?.data).toBe(deslocarDiasISO(hoje, 1));
        expect(agd005 && agd005.data > hoje).toBe(true);

        expect(agd007?.data).toBe(deslocarDiasISO(hoje, -10));
        expect(agd007 && agd007.data < hoje).toBe(true);
      });
    });
  });

  /**
   * Modo `n8n` — nunca chama n8n real (mocka `N8nGatewayClient.call` e os três services
   * de catálogo injetados). Cobre o join (idCliente/idProfissional/idServico -> nome),
   * a regra não-negociável de status/statusConfirmacao, a restrição por perfil
   * (profissional) já existente, ausência de fallback para mock, e as três variantes de
   * inconsistência referencial (cliente/profissional/serviço ausente no catálogo).
   */
  describe('modo n8n (DATA_SOURCE_AGENDA=n8n)', () => {
    let service: AgendaService;
    let gatewayClient: N8nGatewayClient;
    let clientesService: ClientesService;
    let profissionaisService: ProfissionaisService;
    let servicosService: ServicosService;
    let callSpy: jest.SpyInstance<
      ReturnType<N8nGatewayClient['call']>,
      Parameters<N8nGatewayClient['call']>
    >;

    const AGENDAMENTOS_INTEGRACAO_EMP001: N8nGatewayAgendamentoIntegracao[] = [
      {
        idAgendamento: 'AGD-HML-001',
        idCliente: 'CLI-HML-001',
        idProfissional: 'PROF-HML-001',
        idServico: 'SRV-HML-001',
        data: '2026-09-02',
        horaInicio: '09:00',
        horaFim: '10:00',
        valor: 120,
        status: 'AGENDADO',
      },
      {
        idAgendamento: 'AGD-HML-002',
        idCliente: 'CLI-HML-001',
        idProfissional: 'PROF-HML-002',
        idServico: 'SRV-HML-001',
        data: '2026-09-03',
        horaInicio: '11:00',
        horaFim: '12:00',
        valor: 90,
        status: 'CANCELADO',
      },
      // Achado real da homologação contra BEAUTYFLOW_HOMOLOGACAO: AGE_TESTE_WF015_04
      // tem STATUS=CONCLUIDO na fonte — a fonte real sustenta os 3 valores, não só
      // AGENDADO/CANCELADO (premissa anterior corrigida).
      {
        idAgendamento: 'AGE_TESTE_WF015_04',
        idCliente: 'CLI-HML-001',
        idProfissional: 'PROF-HML-001',
        idServico: 'SRV-HML-001',
        data: '2026-08-15',
        horaInicio: '14:00',
        horaFim: '15:00',
        valor: 150,
        status: 'CONCLUIDO',
      },
    ];

    const CLIENTE_HML_001 = {
      idCliente: 'CLI-HML-001',
      nome: 'Mariana Teste',
      telefone: '34999990001',
      email: null,
      dataNascimento: null,
      status: 'ATIVO' as const,
      clienteDesde: '2026-01-01',
      ultimoAtendimento: null,
      proximoAtendimento: null,
      totalAtendimentos: null,
      totalGasto: null,
      observacoes: null,
    };

    const PROFISSIONAL_HML_001 = {
      idProfissional: 'PROF-HML-001',
      nome: 'Beatriz Rocha',
      telefone: null,
      email: null,
      especialidade: null,
      status: 'ATIVO' as const,
      totalAtendimentos: null,
      proximoAtendimento: null,
    };

    const PROFISSIONAL_HML_002 = {
      ...PROFISSIONAL_HML_001,
      idProfissional: 'PROF-HML-002',
      nome: 'Larissa Nunes',
    };

    const SERVICO_HML_001 = {
      idServico: 'SRV-HML-001',
      nome: 'Alongamento em gel',
      descricao: null,
      duracaoMinutos: 60,
      valor: 120,
      status: 'ATIVO' as const,
    };

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV, DATA_SOURCE_AGENDA: 'n8n' };

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [
          AgendaService,
          ClientesService,
          ProfissionaisService,
          ServicosService,
          N8nGatewayClient,
        ],
      }).compile();

      service = moduleRef.get(AgendaService);
      gatewayClient = moduleRef.get(N8nGatewayClient);
      clientesService = moduleRef.get(ClientesService);
      profissionaisService = moduleRef.get(ProfissionaisService);
      servicosService = moduleRef.get(ServicosService);

      callSpy = jest.spyOn(gatewayClient, 'call').mockImplementation((_operacao, idEmpresa) => {
        if (idEmpresa === 'EMP001') return Promise.resolve(AGENDAMENTOS_INTEGRACAO_EMP001 as never);
        return Promise.resolve([] as never);
      });
      jest.spyOn(clientesService, 'listar').mockResolvedValue({ data: [CLIENTE_HML_001] });
      jest
        .spyOn(profissionaisService, 'listar')
        .mockResolvedValue({ data: [PROFISSIONAL_HML_001, PROFISSIONAL_HML_002] });
      jest.spyOn(servicosService, 'listar').mockResolvedValue({ data: [SERVICO_HML_001] });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('chama exatamente agendamentos.listar com o idEmpresa autenticado e dataInicio/dataFim da query', async () => {
      await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      expect(callSpy).toHaveBeenCalledWith('agendamentos.listar', 'EMP001', {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });
    });

    it('status AGENDADO é preservado tal como veio do gateway', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      const item = resultado.data.find((i) => i.idAgendamento === 'AGD-HML-001');
      expect(item?.status).toBe('AGENDADO');
    });

    it('status CANCELADO é preservado tal como veio do gateway', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      const item = resultado.data.find((i) => i.idAgendamento === 'AGD-HML-002');
      expect(item?.status).toBe('CANCELADO');
    });

    // Regressão do achado real de homologação (AGE_TESTE_WF015_04, STATUS=CONCLUIDO em
    // BEAUTYFLOW_HOMOLOGACAO): reconhecido apenas porque a fonte grava esse valor
    // literalmente — nunca inferido por data passada, pagamento ou qualquer heurística.
    it('status CONCLUIDO é preservado tal como veio do gateway (achado real da homologação)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-08-01',
        dataFim: '2026-08-31',
      });

      const item = resultado.data.find((i) => i.idAgendamento === 'AGE_TESTE_WF015_04');
      expect(item?.status).toBe('CONCLUIDO');
      expect(item?.statusConfirmacao).toBeNull();
    });

    it('statusConfirmacao é sempre null para dados da fonte real — nunca inferido de status/data/pagamento', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.statusConfirmacao === null)).toBe(true);
    });

    it('faz o join corretamente: idCliente/idProfissional/idServico viram nome/telefone', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      const item = resultado.data.find((i) => i.idAgendamento === 'AGD-HML-001');
      expect(item).toMatchObject({
        clienteNome: 'Mariana Teste',
        clienteTelefone: '34999990001',
        profissionalNome: 'Beatriz Rocha',
        servicoNome: 'Alongamento em gel',
      });
    });

    it('a resposta nunca inclui idCliente/idProfissional/idServico/idEmpresa (contrato público)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-09-01',
        dataFim: '2026-09-30',
      });

      for (const item of resultado.data) {
        expect(item).not.toHaveProperty('idCliente');
        expect(item).not.toHaveProperty('idProfissional');
        expect(item).not.toHaveProperty('idServico');
        expect(item).not.toHaveProperty('idEmpresa');
      }
    });

    it('profissional continua restrito ao próprio idProfissional (mesma regra do modo mock)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF-HML-002' }),
        { dataInicio: '2026-09-01', dataFim: '2026-09-30' },
      );

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idAgendamento).toBe('AGD-HML-002');
    });

    it('platform_admin (sem id_empresa) nunca chama o gateway', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        { dataInicio: '2026-09-01', dataFim: '2026-09-30' },
      );

      expect(resultado.data).toEqual([]);
      expect(callSpy).not.toHaveBeenCalled();
    });

    it('falha do gateway vira 503 controlado, nunca cai no mock (nenhum AGDxxx do mock aparece)', async () => {
      callSpy.mockImplementation(() => {
        throw new N8nGatewayException('UPSTREAM_ERROR', 'falha simulada', 'req-1');
      });

      await expect(
        service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
          dataInicio: '2026-09-01',
          dataFim: '2026-09-30',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('cliente referenciado ausente no catálogo -> erro controlado (nunca "Cliente desconhecido")', async () => {
      jest.spyOn(clientesService, 'listar').mockResolvedValue({ data: [] });

      await expect(
        service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
          dataInicio: '2026-09-01',
          dataFim: '2026-09-30',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('profissional referenciado ausente no catálogo -> erro controlado (nunca string vazia)', async () => {
      jest.spyOn(profissionaisService, 'listar').mockResolvedValue({ data: [] });

      await expect(
        service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
          dataInicio: '2026-09-01',
          dataFim: '2026-09-30',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('serviço referenciado ausente no catálogo -> erro controlado (nunca string vazia)', async () => {
      jest.spyOn(servicosService, 'listar').mockResolvedValue({ data: [] });

      await expect(
        service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
          dataInicio: '2026-09-01',
          dataFim: '2026-09-30',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
