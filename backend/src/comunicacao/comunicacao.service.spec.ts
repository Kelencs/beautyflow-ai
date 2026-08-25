import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { ComunicacaoService } from './comunicacao.service';

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

describe('ComunicacaoService', () => {
  let service: ComunicacaoService;
  // Achado P1-1 da auditoria geral: MSG001/LEM001/COB001/COB002/MSG002/LEM002/PES001
  // (vinculados a idAgendamento de EMP001) agora têm `dataHora` relativa a
  // `getHojeBrasilISO()` (ver comunicacao.mock-data.ts); FUP001 (sem idAgendamento) segue
  // fixo em '2026-07-15', por design — por isso o limite INFERIOR do período continua
  // literal ('2026-07-01', para sempre incluir FUP001) e só o limite SUPERIOR passa a
  // acompanhar "hoje" dinamicamente, com folga.
  const hoje = getHojeBrasilISO();
  const periodo = { dataInicio: '2026-07-01', dataFim: deslocarDiasISO(hoje, 5) };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ComunicacaoService],
    }).compile();
    service = moduleRef.get(ComunicacaoService);
  });

  describe('listar', () => {
    it('owner recebe somente as comunicações da própria empresa', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      expect(resultado.data.length).toBe(8);
      expect(resultado.data.some((item) => item.idComunicacao === 'MSG101')).toBe(false);
    });

    it('EMP001 nunca recebe comunicações de EMP002', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      expect(resultado.data.some((item) => item.clienteNome === 'Beatriz Nogueira')).toBe(false);
      expect(resultado.data.some((item) => item.clienteNome === 'Larissa Ferreira')).toBe(false);
    });

    it('profissional vê somente as comunicações dos próprios atendimentos (idProfissional)', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        periodo,
      );

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.profissionalNome === 'Ana Martins')).toBe(true);
    });

    it('profissional nunca recebe FOLLOWUP (sem vínculo seguro de profissional no schema real)', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        periodo,
      );

      expect(resultado.data.some((item) => item.tipo === 'FOLLOWUP')).toBe(false);
    });

    it('owner vê o FOLLOWUP (sem restrição de escopo)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      expect(resultado.data.some((item) => item.tipo === 'FOLLOWUP')).toBe(true);
    });

    it('platform_admin (sem id_empresa) recebe resumo/lista vazios, nunca todas as empresas', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        periodo,
      );

      expect(resultado.data).toEqual([]);
      expect(resultado.resumo).toEqual({ totalPeriodo: 0, enviadas: 0, comFalha: 0 });
    });

    it('filtra por tipo quando informado', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        ...periodo,
        tipo: 'COBRANCA',
      });

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.tipo === 'COBRANCA')).toBe(true);
    });

    it('filtra por status quando informado', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        ...periodo,
        status: 'FALHA',
      });

      expect(resultado.data.length).toBeGreaterThan(0);
      expect(resultado.data.every((item) => item.status === 'FALHA')).toBe(true);
    });

    it('respeita o intervalo de datas informado', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), {
        dataInicio: '2026-07-01',
        dataFim: '2026-07-31',
      });

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0]?.idComunicacao).toBe('FUP001');
    });

    it('calcula o resumo (totalPeriodo/enviadas/comFalha) corretamente', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      const enviadasEsperadas = resultado.data.filter((item) => item.status === 'ENVIADA').length;
      const falhasEsperadas = resultado.data.filter((item) => item.status === 'FALHA').length;

      expect(resultado.resumo.totalPeriodo).toBe(resultado.data.length);
      expect(resultado.resumo.enviadas).toBe(enviadasEsperadas);
      expect(resultado.resumo.comFalha).toBe(falhasEsperadas);
    });

    it('a resposta nunca inclui idEmpresa/idProfissional (contrato público)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      for (const item of resultado.data) {
        expect(item).not.toHaveProperty('idEmpresa');
        expect(item).not.toHaveProperty('idProfissional');
      }
    });

    it('a resposta nunca expõe credenciais/payload técnico (nenhuma chave de token/segredo)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), periodo);

      for (const item of resultado.data) {
        expect(item).not.toHaveProperty('phoneNumberId');
        expect(item).not.toHaveProperty('accessToken');
        expect(item).not.toHaveProperty('whatsappMessageId');
      }
    });
  });

  describe('buscarPorId', () => {
    it('retorna a comunicação quando pertence à empresa do usuário', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'MSG001',
      );

      expect(resultado.idComunicacao).toBe('MSG001');
      expect(resultado.clienteNome).toBe('Mariana Silva');
    });

    it('lança 404 para comunicação de outra empresa (EMP001 tentando ver registro de EMP002)', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'MSG101'),
      ).toThrow(NotFoundException);
    });

    it('lança 404 para id inexistente', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'MSG999'),
      ).toThrow(NotFoundException);
    });

    it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          'MSG001',
        ),
      ).toThrow(NotFoundException);
    });

    it('profissional recebe 404 ao tentar ver comunicação de outro profissional (mesma empresa)', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF002' }),
          'MSG001',
        ),
      ).toThrow(NotFoundException);
    });

    it('profissional recebe 404 ao tentar ver um FOLLOWUP (sem vínculo de profissional)', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
          'FUP001',
        ),
      ).toThrow(NotFoundException);
    });
  });
});
