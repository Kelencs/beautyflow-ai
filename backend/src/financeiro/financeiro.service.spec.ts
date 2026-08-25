import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { FinanceiroService } from './financeiro.service';

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

describe('FinanceiroService', () => {
  let service: FinanceiroService;
  // Achado P1-1 da auditoria geral: datas de EMP001 em financeiro.mock-data.ts agora são
  // relativas a `getHojeBrasilISO()` (mesmo deslocamento do idAgendamento correspondente
  // em agenda.mock-data.ts) — a janela de teste precisa acompanhar isso.
  const hoje = getHojeBrasilISO();
  const periodo = { dataInicio: deslocarDiasISO(hoje, -15), dataFim: deslocarDiasISO(hoje, 5) };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FinanceiroService],
    }).compile();
    service = moduleRef.get(FinanceiroService);
  });

  describe('listar', () => {
    it('owner recebe somente os registros da própria empresa', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      expect(resultado.data.length).toBe(7);
      expect(resultado.data.some((item) => item.idAgendamento === 'AGD101')).toBe(false);
    });

    it('EMP001 nunca recebe registros de EMP002', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      expect(resultado.data.some((item) => item.clienteNome === 'Beatriz Nogueira')).toBe(false);
      expect(resultado.data.some((item) => item.clienteNome === 'Larissa Ferreira')).toBe(false);
    });

    it('profissional vê somente os registros dos próprios atendimentos (idProfissional)', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        periodo,
      );

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.profissionalNome === 'Ana Martins')).toBe(true);
    });

    it('profissional não vê os registros de outro profissional da mesma empresa', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF002' }),
        periodo,
      );

      expect(resultado.data.every((item) => item.profissionalNome === 'Carla Souza')).toBe(true);
      expect(resultado.data.some((item) => item.profissionalNome === 'Ana Martins')).toBe(false);
    });

    it('platform_admin (sem id_empresa) recebe resumo/lista vazios, nunca todas as empresas', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        periodo,
      );

      expect(resultado.data).toEqual([]);
      expect(resultado.resumo).toEqual({
        recebido: 0,
        pendente: 0,
        totalPrevisto: 0,
        totalPagamentos: 0,
      });
    });

    it('filtra por status quando informado', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        ...periodo,
        status: 'PENDENTE',
      });

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.status === 'PENDENTE')).toBe(true);
    });

    it('respeita o intervalo de datas informado (hoje, dinâmico — AGD003)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: hoje,
        dataFim: hoje,
      });

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0]?.idAgendamento).toBe('AGD003');
    });

    it('calcula o resumo (recebido/pendente/totalPrevisto/totalPagamentos) corretamente', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      const somaEsperadaPago = resultado.data.reduce((soma, item) => soma + item.valorPago, 0);
      const somaEsperadaPendente = resultado.data.reduce(
        (soma, item) => soma + item.valorPendente,
        0,
      );
      const somaEsperadaPrevisto = resultado.data.reduce(
        (soma, item) => soma + item.valorAgendamento,
        0,
      );

      expect(resultado.resumo.recebido).toBe(somaEsperadaPago);
      expect(resultado.resumo.pendente).toBe(somaEsperadaPendente);
      expect(resultado.resumo.totalPrevisto).toBe(somaEsperadaPrevisto);
      expect(resultado.resumo.totalPagamentos).toBe(resultado.data.length);
    });

    it('um registro PAGO tem valorPendente zero e um PENDENTE tem valorPago zero', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      const pago = resultado.data.find((item) => item.idAgendamento === 'AGD001');
      const pendente = resultado.data.find((item) => item.idAgendamento === 'AGD003');

      expect(pago?.valorPendente).toBe(0);
      expect(pendente?.valorPago).toBe(0);
      expect(pendente?.idPagamento).toBeNull();
      expect(pendente?.formaPagamento).toBeNull();
    });

    it('a resposta nunca inclui idEmpresa/idProfissional (contrato público)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      for (const item of resultado.data) {
        expect(item).not.toHaveProperty('idEmpresa');
        expect(item).not.toHaveProperty('idProfissional');
      }
    });
  });

  describe('buscarPorId', () => {
    it('retorna o registro quando pertence à empresa do usuário', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'AGD001',
      );

      expect(resultado.idAgendamento).toBe('AGD001');
      expect(resultado.clienteNome).toBe('Mariana Silva');
    });

    it('lança 404 para registro de outra empresa (EMP001 tentando ver registro de EMP002)', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'AGD101'),
      ).toThrow(NotFoundException);
    });

    it('lança 404 para id inexistente', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'AGD999'),
      ).toThrow(NotFoundException);
    });

    it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          'AGD001',
        ),
      ).toThrow(NotFoundException);
    });

    it('profissional recebe 404 ao tentar ver registro de outro profissional (mesma empresa)', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF002' }),
          'AGD001',
        ),
      ).toThrow(NotFoundException);
    });

    it('a resposta de detalhe nunca inclui idEmpresa/idProfissional', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'AGD001',
      );

      expect(resultado).not.toHaveProperty('idEmpresa');
      expect(resultado).not.toHaveProperty('idProfissional');
    });
  });

  describe('obterDataHoraPorPagamento', () => {
    it('retorna um mapa idPagamento -> DATA_HORA só da própria empresa', () => {
      const mapa = service.obterDataHoraPorPagamento(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(mapa.get('PAG001')).toBe(`${deslocarDiasISO(hoje, -3)}T12:00:00-03:00`);
      // PAG101/PAG102 são de EMP002 — nunca devem aparecer no mapa de um usuário EMP001.
      expect(mapa.has('PAG101')).toBe(false);
      expect(mapa.has('PAG102')).toBe(false);
    });

    it('não inclui registros PENDENTE (idPagamento/dataHoraPagamento null)', () => {
      const mapa = service.obterDataHoraPorPagamento(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      // AGD003 e AGD008 são PENDENTE no mock (idPagamento null) — nada a mapear para eles.
      expect(mapa.size).toBeGreaterThan(0);
      expect(
        [...mapa.values()].every((valor) => typeof valor === 'string' && valor.length > 0),
      ).toBe(true);
    });

    it('platform_admin (sem id_empresa) recebe mapa vazio', () => {
      const mapa = service.obterDataHoraPorPagamento(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      );

      expect(mapa.size).toBe(0);
    });
  });
});
