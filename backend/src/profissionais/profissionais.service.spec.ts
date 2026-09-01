import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayProfissionalIntegracao } from '../n8n-gateway/n8n-gateway.types';
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
  const ORIGINAL_ENV = process.env;

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('modo mock (DATA_SOURCE_PROFISSIONAIS ausente ou "mock" — comportamento existente)', () => {
    let service: ProfissionaisService;

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      delete process.env.DATA_SOURCE_PROFISSIONAIS;

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ProfissionaisService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ProfissionaisService);
    });

    describe('listar', () => {
      it('owner recebe somente os profissionais da própria empresa', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.length).toBe(6);
        expect(
          resultado.data.some((profissional) => profissional.idProfissional === 'PROF010'),
        ).toBe(false);
      });

      it('EMP001 nunca recebe profissionais de EMP002', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.some((profissional) => profissional.nome === 'Rafael Torres')).toBe(
          false,
        );
      });

      it('profissional recebe os profissionais da própria empresa (mesma regra do owner — decisão documentada em profissionais.service.ts)', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        );

        expect(resultado.data.length).toBe(6);
        expect(resultado.data.some((profissional) => profissional.status === 'INATIVO')).toBe(true);
      });

      it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        );

        expect(resultado.data).toEqual([]);
      });

      it('a resposta nunca inclui idEmpresa (contrato público)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        for (const profissional of resultado.data) {
          expect(profissional).not.toHaveProperty('idEmpresa');
        }
      });

      it('totalAtendimentos do mock continua numérico (nunca vira null no modo mock)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
        const ana = resultado.data.find((p) => p.idProfissional === 'PROF001');

        expect(ana?.totalAtendimentos).toBe(42);
      });
    });

    describe('buscarPorId', () => {
      it('retorna o profissional quando pertence à empresa do usuário', async () => {
        const resultado = await service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
          'PROF001',
        );

        expect(resultado.idProfissional).toBe('PROF001');
        expect(resultado.nome).toBe('Ana Martins');
      });

      it('lança 404 para profissional de outra empresa (EMP001 tentando ver profissional de EMP002)', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF010'),
        ).rejects.toThrow(NotFoundException);
      });

      it('lança 404 para id inexistente', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF999'),
        ).rejects.toThrow(NotFoundException);
      });

      it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', async () => {
        await expect(
          service.buscarPorId(
            usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
            'PROF001',
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('modo n8n (DATA_SOURCE_PROFISSIONAIS=n8n)', () => {
    let service: ProfissionaisService;
    let gatewayClient: N8nGatewayClient;
    let callSpy: jest.SpyInstance<
      ReturnType<N8nGatewayClient['call']>,
      Parameters<N8nGatewayClient['call']>
    >;

    const PROFISSIONAIS_INTEGRACAO_EMP001: N8nGatewayProfissionalIntegracao[] = [
      {
        idProfissional: 'PROF-HML-001',
        nome: 'Ana Martins (homologação)',
        especialidade: 'Nail Designer',
        telefone: '034999998888',
        email: 'ana.hml@exemplo.com',
        status: 'ATIVO',
      },
      {
        idProfissional: 'PROF-HML-002',
        nome: 'Carla Souza (homologação)',
        especialidade: null,
        telefone: null,
        email: null,
        status: 'INATIVO',
      },
    ];

    const PROFISSIONAIS_INTEGRACAO_EMP002: N8nGatewayProfissionalIntegracao[] = [
      {
        idProfissional: 'PROF-HML-101',
        nome: 'Rafael Torres (homologação)',
        especialidade: 'Cabeleireiro',
        telefone: '011981112233',
        email: null,
        status: 'ATIVO',
      },
    ];

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV, DATA_SOURCE_PROFISSIONAIS: 'n8n' };

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ProfissionaisService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ProfissionaisService);
      gatewayClient = moduleRef.get(N8nGatewayClient);

      callSpy = jest.spyOn(gatewayClient, 'call').mockImplementation((_operacao, idEmpresa) => {
        if (idEmpresa === 'EMP001')
          return Promise.resolve(PROFISSIONAIS_INTEGRACAO_EMP001 as never);
        if (idEmpresa === 'EMP002')
          return Promise.resolve(PROFISSIONAIS_INTEGRACAO_EMP002 as never);
        return Promise.resolve([] as never);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('chama o gateway com a operação profissionais.listar e o idEmpresa do usuário autenticado', async () => {
      await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(callSpy).toHaveBeenCalledWith('profissionais.listar', 'EMP001');
    });

    it('repassa telefone/email/especialidade reais vindos do gateway (nunca fabricados) — totalAtendimentos/proximoAtendimento continuam null (dependeriam de AGENDAMENTOS)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data[0]).toEqual({
        idProfissional: 'PROF-HML-001',
        nome: 'Ana Martins (homologação)',
        telefone: '034999998888',
        email: 'ana.hml@exemplo.com',
        especialidade: 'Nail Designer',
        status: 'ATIVO',
        totalAtendimentos: null,
        proximoAtendimento: null,
      });
    });

    it('telefone/email/especialidade null vindos do gateway (WF019 já normalizou vazio/ausente) permanecem null, nunca viram string fabricada', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
      const carla = resultado.data.find((p) => p.idProfissional === 'PROF-HML-002');

      expect(carla).toEqual({
        idProfissional: 'PROF-HML-002',
        nome: 'Carla Souza (homologação)',
        telefone: null,
        email: null,
        especialidade: null,
        status: 'INATIVO',
        totalAtendimentos: null,
        proximoAtendimento: null,
      });
    });

    it('preserva o STATUS real vindo do gateway (ATIVO e INATIVO, nunca defaultado para ATIVO)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.find((p) => p.idProfissional === 'PROF-HML-001')?.status).toBe('ATIVO');
      expect(resultado.data.find((p) => p.idProfissional === 'PROF-HML-002')?.status).toBe(
        'INATIVO',
      );
    });

    it('EMP001 recebe somente os profissionais de EMP001 (isolamento multi-tenant via gateway)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data.map((p) => p.idProfissional)).toEqual(['PROF-HML-001', 'PROF-HML-002']);
    });

    it('EMP002 recebe somente os profissionais de EMP002, nunca os de EMP001', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP002', perfil: 'owner' }));

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idProfissional).toBe('PROF-HML-101');
      expect(
        resultado.data.some((profissional) => profissional.idProfissional === 'PROF-HML-001'),
      ).toBe(false);
    });

    it('profissional mantém a mesma política de perfil (vê a equipe inteira da própria empresa)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF-HML-001' }),
      );

      expect(resultado.data).toHaveLength(2);
      expect(callSpy).toHaveBeenCalledWith('profissionais.listar', 'EMP001');
    });

    it('platform_admin (sem id_empresa) recebe lista vazia sem sequer chamar o gateway', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
      );

      expect(resultado.data).toEqual([]);
      expect(callSpy).not.toHaveBeenCalled();
    });

    it('a resposta nunca inclui ID_EMPRESA nem outros campos técnicos do Sheets', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      for (const profissional of resultado.data) {
        expect(profissional).not.toHaveProperty('idEmpresa');
        expect(profissional).not.toHaveProperty('ID_EMPRESA');
      }
    });

    it('GET /profissionais/:id localiza o profissional na lista já tenant-scoped (sem operação profissionais.obter)', async () => {
      const resultado = await service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'PROF-HML-002',
      );

      expect(resultado.idProfissional).toBe('PROF-HML-002');
      expect(resultado.status).toBe('INATIVO');
    });

    it('GET /profissionais/:id de outro tenant resulta em 404 (mesmo comportamento do modo mock)', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF-HML-101'),
      ).rejects.toThrow(NotFoundException);
    });

    it('GET /profissionais/:id inexistente resulta em 404', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'PROF999'),
      ).rejects.toThrow(NotFoundException);
    });

    it('gateway falhando NÃO cai silenciosamente no mock — propaga erro técnico controlado', async () => {
      callSpy.mockRejectedValue(
        new N8nGatewayException(
          'UPSTREAM_ERROR',
          'Não foi possível conectar ao serviço de integração.',
          'req-1',
        ),
      );

      await expect(
        service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' })),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('erro do gateway nunca vaza detalhe interno (mensagem genérica, sem requestId/URL/code)', async () => {
      callSpy.mockRejectedValue(
        new N8nGatewayException(
          'UPSTREAM_ERROR',
          'Não foi possível conectar ao serviço de integração.',
          'req-segredo-interno',
        ),
      );

      let mensagemRecebida = '';
      try {
        await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
      } catch (error) {
        mensagemRecebida = error instanceof Error ? error.message : '';
      }

      expect(mensagemRecebida).not.toContain('req-segredo-interno');
      expect(mensagemRecebida.length).toBeGreaterThan(0);
    });
  });
});
