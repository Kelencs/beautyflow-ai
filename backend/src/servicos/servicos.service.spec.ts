import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ServicosService } from './servicos.service';

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

describe('ServicosService', () => {
  let service: ServicosService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ServicosService],
    }).compile();
    service = moduleRef.get(ServicosService);
  });

  describe('listar', () => {
    it('owner recebe somente os serviços da própria empresa', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.length).toBe(8);
      expect(resultado.data.some((servico) => servico.idServico === 'SRV101')).toBe(false);
    });

    it('EMP001 nunca recebe serviços de EMP002', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.some((servico) => servico.nome === 'Coloração')).toBe(false);
    });

    it('profissional vê o mesmo catálogo da empresa (ativos e inativos) — regra documentada em servicos.service.ts', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      );

      expect(resultado.data.length).toBe(8);
      expect(resultado.data.some((servico) => servico.status === 'INATIVO')).toBe(true);
    });

    it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      );

      expect(resultado.data).toEqual([]);
    });

    it('a resposta nunca inclui idEmpresa (contrato público)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      for (const servico of resultado.data) {
        expect(servico).not.toHaveProperty('idEmpresa');
      }
    });
  });

  describe('buscarPorId', () => {
    it('retorna o serviço quando pertence à empresa do usuário', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'SRV001',
      );

      expect(resultado.idServico).toBe('SRV001');
      expect(resultado.nome).toBe('Alongamento em gel');
    });

    it('lança 404 para serviço de outra empresa (EMP001 tentando ver serviço de EMP002)', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV101'),
      ).toThrow(NotFoundException);
    });

    it('lança 404 para id inexistente', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV999'),
      ).toThrow(NotFoundException);
    });

    it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          'SRV001',
        ),
      ).toThrow(NotFoundException);
    });
  });
});
