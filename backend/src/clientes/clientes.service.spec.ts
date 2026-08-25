import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from './clientes.service';

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

describe('ClientesService', () => {
  let service: ClientesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ClientesService],
    }).compile();
    service = moduleRef.get(ClientesService);
  });

  describe('listar', () => {
    it('owner recebe somente os clientes da própria empresa', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.length).toBe(8);
      expect(resultado.data.some((cliente) => cliente.idCliente === 'CLI101')).toBe(false);
    });

    it('EMP001 nunca recebe clientes de EMP002', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.some((cliente) => cliente.nome === 'Beatriz Nogueira')).toBe(false);
    });

    it('profissional vê os clientes da empresa (mesma regra do owner — ver decisão documentada em clientes.service.ts)', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      );

      expect(resultado.data.length).toBe(8);
    });

    it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', () => {
      const resultado = service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      );

      expect(resultado.data).toEqual([]);
    });

    it('a resposta nunca inclui idEmpresa (contrato público)', () => {
      const resultado = service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      for (const cliente of resultado.data) {
        expect(cliente).not.toHaveProperty('idEmpresa');
      }
    });
  });

  describe('buscarPorId', () => {
    it('retorna o cliente com histórico quando pertence à empresa do usuário', () => {
      const resultado = service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'CLI001',
      );

      expect(resultado.idCliente).toBe('CLI001');
      expect(resultado.nome).toBe('Mariana Silva');
      expect(resultado.historico.length).toBeGreaterThan(0);
    });

    it('lança 404 para cliente de outra empresa (EMP001 tentando ver cliente de EMP002)', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI101'),
      ).toThrow(NotFoundException);
    });

    it('lança 404 para id inexistente', () => {
      expect(() =>
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI999'),
      ).toThrow(NotFoundException);
    });

    it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', () => {
      expect(() =>
        service.buscarPorId(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          'CLI001',
        ),
      ).toThrow(NotFoundException);
    });
  });
});
