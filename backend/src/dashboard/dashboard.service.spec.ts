import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AgendaService } from '../agenda/agenda.service';
import { ClientesService } from '../clientes/clientes.service';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { ProfissionaisService } from '../profissionais/profissionais.service';
import { ServicosService } from '../servicos/servicos.service';
import { deslocarDiasISO, getHojeBrasilISO, getHoraAgoraBrasil } from './dashboard-date.util';
import { DashboardService } from './dashboard.service';

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

describe('DashboardService', () => {
  let service: DashboardService;
  // Achado P1-1 da auditoria geral: AGD001-AGD008 agora são gerados com deslocamento
  // relativo a `getHojeBrasilISO()` (ver agenda.mock-data.ts), não mais datas absolutas
  // fixas — os testes abaixo, que fixam `dataReferenciaISO` para serem determinísticos,
  // precisam apontar para o dia relativo correto (offset -3 = AGD001/AGD002, offset -2 =
  // AGD004, offset -1 = nenhum agendamento), não mais para uma string de agosto/2026.
  const hoje = getHojeBrasilISO();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      // ConfigModule/N8nGatewayClient: ClientesService agora depende dos dois (ver
      // clientes.service.ts) — DATA_SOURCE_CLIENTES fica ausente aqui, então
      // ClientesService continua no modo mock de sempre; DashboardService em si não
      // muda nenhuma regra.
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
      providers: [
        DashboardService,
        AgendaService,
        ClientesService,
        ServicosService,
        ProfissionaisService,
        N8nGatewayClient,
      ],
    }).compile();
    service = moduleRef.get(DashboardService);
  });

  it('owner recebe apenas métricas da própria empresa (hoje-3: 2 agendamentos EMP001, 0 de EMP002 incorporados)', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      deslocarDiasISO(hoje, -3),
    );

    expect(resultado.resumo.agendamentosHoje).toBe(2);
    expect(resultado.resumo.confirmadosHoje).toBe(2);
    expect(resultado.resumo.pendentesHoje).toBe(0);
    expect(resultado.resumo.previstoHoje).toBe(210);
    expect(resultado.resumo.totalClientes).toBe(8);
    expect(resultado.resumo.clientesAtivos).toBe(6);
    expect(resultado.resumo.profissionaisAtivos).toBe(4);
    expect(resultado.resumo.servicosAtivos).toBe(6);
  });

  it('EMP001 nunca incorpora agendamentos/clientes/profissionais/serviços de EMP002', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      deslocarDiasISO(hoje, -3),
    );

    const nomes = resultado.proximosAtendimentos.map((item) => item.clienteNome);
    expect(nomes).not.toContain('Beatriz Nogueira');
    expect(nomes).not.toContain('Larissa Ferreira');
  });

  it('profissional recebe a Agenda filtrada pelo próprio id_profissional (hoje-2, só PROF002 tem agendamento)', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF002' }),
      deslocarDiasISO(hoje, -2),
    );

    expect(resultado.resumo.agendamentosHoje).toBe(1);
    expect(resultado.proximoAtendimento?.profissionalNome).toBe('Carla Souza');
  });

  it('profissional sem agendamento no dia não vê agendamentos de outro profissional da mesma empresa', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      deslocarDiasISO(hoje, -2),
    );

    expect(resultado.resumo.agendamentosHoje).toBe(0);
  });

  it('próximo atendimento correto: primeiro por horário entre os pendentes/confirmados do dia', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      deslocarDiasISO(hoje, -3),
    );

    expect(resultado.proximoAtendimento).toEqual({
      idAgendamento: 'AGD001',
      horario: '09:00',
      clienteNome: 'Mariana Silva',
      servicoNome: 'Alongamento em gel',
      profissionalNome: 'Ana Martins',
      status: 'CONFIRMADO',
    });
    expect(resultado.proximosAtendimentos.map((item) => item.idAgendamento)).toEqual([
      'AGD001',
      'AGD002',
    ]);
  });

  it('nenhum agendamento no dia -> próximo = null e lista vazia', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      deslocarDiasISO(hoje, -1),
    );

    expect(resultado.resumo.agendamentosHoje).toBe(0);
    expect(resultado.proximoAtendimento).toBeNull();
    expect(resultado.proximosAtendimentos).toEqual([]);
  });

  it('a resposta nunca inclui idEmpresa/idProfissional (contrato público)', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      deslocarDiasISO(hoje, -3),
    );

    expect(resultado.resumo).not.toHaveProperty('idEmpresa');
    for (const item of resultado.proximosAtendimentos) {
      expect(item).not.toHaveProperty('idEmpresa');
      expect(item).not.toHaveProperty('idProfissional');
    }
  });

  it('platform_admin (sem id_empresa) recebe resumo seguro/vazio, nunca dados cross-tenant', async () => {
    const resultado = await service.obterResumo(
      usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      deslocarDiasISO(hoje, -3),
    );

    expect(resultado.resumo.agendamentosHoje).toBe(0);
    expect(resultado.resumo.totalClientes).toBe(0);
    expect(resultado.proximoAtendimento).toBeNull();
    expect(resultado.proximosAtendimentos).toEqual([]);
  });

  // Achado P1-1 da auditoria geral: até aqui, todo teste fixa `dataReferenciaISO` (para
  // ser determinístico) — nenhum exercitava o caminho REAL de produção, em que o
  // controller nunca informa esse parâmetro e `obterResumo` cai no default
  // `getHojeBrasilISO()`. Esta suíte cobre exatamente esse caminho, sem passar nenhuma
  // data fixa, provando que o resumo de "hoje" funciona no dia real de execução —
  // qualquer que ele seja — porque AGD003 (o único agendamento de EMP001 na Agenda para
  // "hoje") agora é gerado com base na mesma `getHojeBrasilISO()` que o Dashboard usa.
  describe('obterResumo sem dataReferenciaISO (caminho real de produção — nunca uma data fixa)', () => {
    it('usa o dia real de hoje em América/São Paulo: AGD003 (PENDENTE, R$70) é o único agendamento de hoje no mock', async () => {
      const resultado = await service.obterResumo(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.resumo.agendamentosHoje).toBe(1);
      expect(resultado.resumo.confirmadosHoje).toBe(0);
      expect(resultado.resumo.pendentesHoje).toBe(1);
      expect(resultado.resumo.previstoHoje).toBe(70);
    });

    it('encontra o próximo atendimento de hoje quando ainda não passou do horário (AGD003, 14:30); não retorna nada já ocorrido', async () => {
      const horaAgora = getHoraAgoraBrasil();
      const resultado = await service.obterResumo(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      if (horaAgora < '14:30') {
        expect(resultado.proximoAtendimento?.idAgendamento).toBe('AGD003');
        expect(resultado.proximosAtendimentos.map((item) => item.idAgendamento)).toEqual([
          'AGD003',
        ]);
      } else {
        expect(resultado.proximoAtendimento).toBeNull();
        expect(resultado.proximosAtendimentos).toEqual([]);
      }
    });
  });
});
