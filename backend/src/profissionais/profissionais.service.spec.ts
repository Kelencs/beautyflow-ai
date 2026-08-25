import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ProfissionaisService } from './profissionais.service';

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

describe('ProfissionaisService', () => {
  let service: ProfissionaisService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProfissionaisService],
    }).compile();
    service = moduleRef.get(ProfissionaisService);
  });

  describe('listar', () => {
    it('owner recebe somente os profissionais da própria empresa', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.length).toBe(6);
      expect(resultado.data.some((profissional) => profissional.idProfissional === 'PROF010')).toBe(
        false,
      );
    });

    it('EMP001 nunca recebe profissionais de EMP002', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.some((profissional) => profissional.nome === 'Rafael Torres')).toBe(
        false,
      );
    });

    it('profissional recebe os profissionais da própria empresa (mesma regra do owner — decisão documentada em profissionais.service.ts)', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      );

      expect(resultado.data.length).toBe(6);
      expect(resultado.data.some((profissional) => profissional.status === 'INATIVO')).toBe(true);
    });

    it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      );

      expect(resultado.data).toEqual([]);
    });

    it('a resposta nunca inclui idEmpresa (contrato público)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      for (const profissional of resultado.data) {
        expect(profissional).not.toHaveProperty('idEmpresa');
      }
    });
  });

  describe('buscarPorId', () => {
    it('retorna o profissional quando pertence à empresa do usuário', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'PROF001',
      );

      expect(resultado.idProfissional).toBe('PROF001');
      expect(resultado.nome).toBe('Ana Martins');
    });

    it('lança 404 para profissional de outra empresa (EMP001 tentando ver profissional de EMP002)', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF010'),
      ).toThrow(NotFoundException);
    });

    it('lança 404 para id inexistente', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF999'),
      ).toThrow(NotFoundException);
    });

    it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          'PROF001',
        ),
      ).toThrow(NotFoundException);
    });
  });
});
