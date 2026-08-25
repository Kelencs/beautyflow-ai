import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
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
  let service: AgendaService;
  // Achado P1-1 da auditoria geral: as datas de AGD001-AGD008 agora são relativas a
  // `getHojeBrasilISO()` (ver agenda.mock-data.ts), não mais absolutas em agosto/2026 —
  // a janela de teste precisa acompanhar isso. Margem generosa (-15/+5 dias) cobre
  // confortavelmente todo o intervalo usado pelo mock (hoje-10 a hoje+1) em qualquer dia
  // real de execução, sem precisar ser revisada por avanço do calendário.
  const hoje = getHojeBrasilISO();
  const periodo = { dataInicio: deslocarDiasISO(hoje, -15), dataFim: deslocarDiasISO(hoje, 5) };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AgendaService],
    }).compile();
    service = moduleRef.get(AgendaService);
  });

  it('nunca retorna registros de outra empresa (owner de EMP001)', () => {
    const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

    // AGD101/AGD102 e seus clientes pertencem a EMP002 no mock (ver agenda.mock-data.ts).
    expect(resultado.data.length).toBeGreaterThan(0);
    expect(
      resultado.data.some(
        (item) => item.idAgendamento === 'AGD101' || item.idAgendamento === 'AGD102',
      ),
    ).toBe(false);
    expect(resultado.data.some((item) => item.clienteNome === 'Beatriz Nogueira')).toBe(false);
  });

  it('owner vê todos os agendamentos da própria empresa, independente do profissional', () => {
    const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);
    const profissionaisDistintos = new Set(resultado.data.map((item) => item.profissionalNome));

    expect(profissionaisDistintos.size).toBeGreaterThan(1);
  });

  it('profissional só vê os agendamentos do próprio id_profissional', () => {
    const resultado = service.listar(
      usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      periodo,
    );

    expect(resultado.data.length).toBeGreaterThan(0);
    expect(resultado.data.every((item) => item.profissionalNome === 'Ana Martins')).toBe(true);
  });

  it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', () => {
    const resultado = service.listar(
      usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      periodo,
    );

    expect(resultado.data).toEqual([]);
  });

  it('respeita o intervalo de datas informado (hoje, dinâmico — AGD003)', () => {
    const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
      dataInicio: hoje,
      dataFim: hoje,
    });

    expect(resultado.data).toHaveLength(1);
    expect(resultado.data[0]?.idAgendamento).toBe('AGD003');
  });

  it('a resposta nunca inclui idEmpresa/idProfissional (contrato público)', () => {
    const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

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
