import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayServicoIntegracao } from '../n8n-gateway/n8n-gateway.types';
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
  const ORIGINAL_ENV = process.env;

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('modo mock (DATA_SOURCE_SERVICOS ausente ou "mock" — comportamento existente)', () => {
    let service: ServicosService;

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      delete process.env.DATA_SOURCE_SERVICOS;

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ServicosService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ServicosService);
    });

    describe('listar', () => {
      it('owner recebe somente os serviços da própria empresa', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.length).toBe(8);
        expect(resultado.data.some((servico) => servico.idServico === 'SRV101')).toBe(false);
      });

      it('EMP001 nunca recebe serviços de EMP002', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.some((servico) => servico.nome === 'Coloração')).toBe(false);
      });

      it('profissional vê o mesmo catálogo da empresa (ativos e inativos) — regra documentada em servicos.service.ts', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        );

        expect(resultado.data.length).toBe(8);
        expect(resultado.data.some((servico) => servico.status === 'INATIVO')).toBe(true);
      });

      it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        );

        expect(resultado.data).toEqual([]);
      });

      it('a resposta nunca inclui idEmpresa (contrato público)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        for (const servico of resultado.data) {
          expect(servico).not.toHaveProperty('idEmpresa');
        }
      });

      it('descricao conhecida do mock continua intacta (nunca vira null)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
        const alongamento = resultado.data.find((servico) => servico.idServico === 'SRV001');

        expect(alongamento?.descricao).toBe(
          'Alongamento completo das unhas com gel, acabamento uniforme e resistente.',
        );
      });
    });

    describe('buscarPorId', () => {
      it('retorna o serviço quando pertence à empresa do usuário', async () => {
        const resultado = await service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
          'SRV001',
        );

        expect(resultado.idServico).toBe('SRV001');
        expect(resultado.nome).toBe('Alongamento em gel');
      });

      it('lança 404 para serviço de outra empresa (EMP001 tentando ver serviço de EMP002)', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV101'),
        ).rejects.toThrow(NotFoundException);
      });

      it('lança 404 para id inexistente', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV999'),
        ).rejects.toThrow(NotFoundException);
      });

      it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', async () => {
        await expect(
          service.buscarPorId(
            usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
            'SRV001',
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  /**
   * Modo `n8n` — nunca chama n8n real (mocka `N8nGatewayClient.call`). Cobre os mesmos
   * critérios já aplicados a Clientes na Fase 1: isolamento EMP001/EMP002, política de
   * perfil preservada, `:id` via lista tenant-scoped + 404, ausência de fallback
   * silencioso, e `descricao` repassada honestamente (presente ou `null`, nunca
   * fabricada) — a coluna DESCRICAO existe de fato na fonte real (corrigido nesta
   * tarefa).
   */
  describe('modo n8n (DATA_SOURCE_SERVICOS=n8n)', () => {
    let service: ServicosService;
    let gatewayClient: N8nGatewayClient;
    let callSpy: jest.SpyInstance<
      ReturnType<N8nGatewayClient['call']>,
      Parameters<N8nGatewayClient['call']>
    >;

    const SERVICOS_INTEGRACAO_EMP001: N8nGatewayServicoIntegracao[] = [
      {
        idServico: 'SRV-HML-001',
        nome: 'Alongamento em gel (homologação)',
        descricao: 'Alongamento completo das unhas com gel.',
        status: 'ATIVO',
        duracaoMinutos: 120,
        valor: 120,
      },
    ];

    const SERVICOS_INTEGRACAO_EMP002: N8nGatewayServicoIntegracao[] = [
      {
        idServico: 'SRV-HML-101',
        nome: 'Corte e escova (homologação)',
        descricao: null,
        status: 'ATIVO',
        duracaoMinutos: 60,
        valor: 80,
      },
    ];

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV, DATA_SOURCE_SERVICOS: 'n8n' };

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ServicosService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ServicosService);
      gatewayClient = moduleRef.get(N8nGatewayClient);

      callSpy = jest.spyOn(gatewayClient, 'call').mockImplementation((_operacao, idEmpresa) => {
        if (idEmpresa === 'EMP001') return Promise.resolve(SERVICOS_INTEGRACAO_EMP001 as never);
        if (idEmpresa === 'EMP002') return Promise.resolve(SERVICOS_INTEGRACAO_EMP002 as never);
        return Promise.resolve([] as never);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('chama o gateway com a operação servicos.listar e o idEmpresa do usuário autenticado', async () => {
      await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(callSpy).toHaveBeenCalledWith('servicos.listar', 'EMP001');
    });

    it('mapeia duracaoMinutos/valor/status corretamente do shape de integração', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data[0]).toMatchObject({
        idServico: 'SRV-HML-001',
        nome: 'Alongamento em gel (homologação)',
        duracaoMinutos: 120,
        valor: 120,
        status: 'ATIVO',
      });
    });

    it('descricao presente na fonte n8n é repassada tal como o WF019 normalizou (nunca fabricada/substituída pelo nome)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data[0].descricao).toBe('Alongamento completo das unhas com gel.');
    });

    it('descricao null vinda do gateway (WF019 já normalizou vazio/ausente) permanece null, nunca vira string fabricada', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP002', perfil: 'owner' }));

      expect(resultado.data[0].descricao).toBeNull();
    });

    it('EMP001 recebe somente os serviços de EMP001 (isolamento multi-tenant via gateway)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idServico).toBe('SRV-HML-001');
    });

    it('EMP002 recebe somente os serviços de EMP002, nunca os de EMP001', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP002', perfil: 'owner' }));

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idServico).toBe('SRV-HML-101');
      expect(resultado.data.some((servico) => servico.idServico === 'SRV-HML-001')).toBe(false);
    });

    it('profissional mantém a mesma política de perfil (vê o catálogo da própria empresa)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      );

      expect(resultado.data).toHaveLength(1);
      expect(callSpy).toHaveBeenCalledWith('servicos.listar', 'EMP001');
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

      for (const servico of resultado.data) {
        expect(servico).not.toHaveProperty('idEmpresa');
        expect(servico).not.toHaveProperty('ID_EMPRESA');
      }
    });

    it('GET /servicos/:id localiza o serviço na lista já tenant-scoped (sem operação servicos.obter)', async () => {
      const resultado = await service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'SRV-HML-001',
      );

      expect(resultado.idServico).toBe('SRV-HML-001');
    });

    it('GET /servicos/:id de outro tenant resulta em 404 (mesmo comportamento do modo mock)', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV-HML-101'),
      ).rejects.toThrow(NotFoundException);
    });

    it('GET /servicos/:id inexistente resulta em 404', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'SRV999'),
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
