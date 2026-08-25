import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ConfiguracoesService } from './configuracoes.service';

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

describe('ConfiguracoesService', () => {
  let service: ConfiguracoesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfiguracoesService],
    }).compile();
    service = moduleRef.get(ConfiguracoesService);
  });

  describe('obterConfiguracoes', () => {
    it('owner de EMP001 recebe as configurações da própria empresa', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.negocio.nomeFantasia).toBe('Studio Bela Vida');
      expect(resultado.agenda.timezone).toBe('America/Sao_Paulo');
      expect(resultado.agenda.janelaCancelamentoMinutos).toBe(120);
    });

    it('owner de EMP001 nunca recebe dados de EMP002', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.negocio.nomeFantasia).not.toBe('Espaço Rafael Torres');
      expect(
        resultado.agenda.disponibilidadePorProfissional.some(
          (item) => item.profissionalNome === 'Rafael Torres',
        ),
      ).toBe(false);
    });

    it('owner de EMP002 recebe as configurações de EMP002, isoladas de EMP001', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(resultado.negocio.nomeFantasia).toBe('Espaço Rafael Torres');
      expect(resultado.agenda.janelaCancelamentoMinutos).toBe(60);
      expect(
        resultado.agenda.disponibilidadePorProfissional.every(
          (item) => item.profissionalNome === 'Rafael Torres',
        ),
      ).toBe(true);
    });

    it('profissional recebe 403 Forbidden, nunca as configurações', () => {
      expect(() =>
        service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        ),
      ).toThrow(ForbiddenException);
    });

    it('platform_admin (sem id_empresa) recebe 403 Forbidden, nunca acesso cross-tenant', () => {
      expect(() =>
        service.obterConfiguracoes(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        ),
      ).toThrow(ForbiddenException);
    });

    it('defensivo: owner sem idEmpresa (estado impossível pela constraint do banco) também recebe 403, nunca 200 vazio', () => {
      expect(() =>
        service.obterConfiguracoes(usuario({ idEmpresa: null, perfil: 'owner' })),
      ).toThrow(ForbiddenException);
    });

    it('empresa inexistente no mock não vaza dados de outra empresa (404, não fallback)', () => {
      expect(() =>
        service.obterConfiguracoes(usuario({ idEmpresa: 'EMP999', perfil: 'owner' })),
      ).toThrow(NotFoundException);
    });

    it('a resposta nunca contém idEmpresa', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado).not.toHaveProperty('idEmpresa');
      expect(resultado.negocio).not.toHaveProperty('idEmpresa');
      expect(resultado.agenda).not.toHaveProperty('idEmpresa');
    });

    it('a resposta nunca contém segredos/IDs técnicos (whatsappPhoneNumberId, tokens, secrets)', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const bruto = JSON.stringify(resultado);

      expect(resultado).not.toHaveProperty('whatsappPhoneNumberId');
      expect(bruto).not.toContain('109876543210001');
      expect(bruto.toLowerCase()).not.toContain('token');
      expect(bruto.toLowerCase()).not.toContain('secret');
    });

    it('integrações refletem a presença/ausência real de whatsappPhoneNumberId no mock (sem expor o ID)', () => {
      const emp001 = service.obterConfiguracoes(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
      const emp002 = service.obterConfiguracoes(usuario({ idEmpresa: 'EMP002', perfil: 'owner' }));

      expect(emp001.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe('ATIVA');
      expect(emp002.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe(
        'NAO_CONFIGURADA',
      );
    });

    it('automações de comunicação cobrem os 5 tipos reais, todas como DISPONIVEL (sem toggle por empresa)', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const tipos = resultado.automacoesComunicacao.map((item) => item.tipo).sort();
      expect(tipos).toEqual(['CONFIRMACAO', 'COBRANCA', 'FOLLOWUP', 'LEMBRETE', 'PESQUISA'].sort());
      expect(resultado.automacoesComunicacao.every((item) => item.status === 'DISPONIVEL')).toBe(
        true,
      );
    });

    it('contrato respeita os dados auditados: EMP002 tem e-mail null e sem WhatsApp configurado', () => {
      const resultado = service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(resultado.negocio.email).toBeNull();
    });
  });
});
