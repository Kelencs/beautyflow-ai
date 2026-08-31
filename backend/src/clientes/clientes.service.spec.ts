import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayClienteIntegracao } from '../n8n-gateway/n8n-gateway.types';
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
  const ORIGINAL_ENV = process.env;

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('modo mock (DATA_SOURCE_CLIENTES ausente ou "mock" — comportamento existente)', () => {
    let service: ClientesService;

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      delete process.env.DATA_SOURCE_CLIENTES;

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ClientesService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ClientesService);
    });

    describe('listar', () => {
      it('owner recebe somente os clientes da própria empresa', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.length).toBe(8);
        expect(resultado.data.some((cliente) => cliente.idCliente === 'CLI101')).toBe(false);
      });

      it('EMP001 nunca recebe clientes de EMP002', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        expect(resultado.data.some((cliente) => cliente.nome === 'Beatriz Nogueira')).toBe(false);
      });

      it('profissional vê os clientes da empresa (mesma regra do owner — ver decisão documentada em clientes.service.ts)', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        );

        expect(resultado.data.length).toBe(8);
      });

      it('platform_admin (sem id_empresa) recebe lista vazia, nunca todas as empresas', async () => {
        const resultado = await service.listar(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        );

        expect(resultado.data).toEqual([]);
      });

      it('a resposta nunca inclui idEmpresa (contrato público)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

        for (const cliente of resultado.data) {
          expect(cliente).not.toHaveProperty('idEmpresa');
        }
      });

      it('valores numéricos conhecidos do mock continuam intactos (nunca viram null)', async () => {
        const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
        const mariana = resultado.data.find((cliente) => cliente.idCliente === 'CLI001');

        expect(mariana?.totalAtendimentos).toBe(5);
        expect(mariana?.totalGasto).toBe(540);
        expect(mariana?.totalAtendimentos).not.toBeNull();
        expect(mariana?.totalGasto).not.toBeNull();
      });
    });

    describe('buscarPorId', () => {
      it('retorna o cliente com histórico quando pertence à empresa do usuário', async () => {
        const resultado = await service.buscarPorId(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
          'CLI001',
        );

        expect(resultado.idCliente).toBe('CLI001');
        expect(resultado.nome).toBe('Mariana Silva');
        expect(resultado.historico).not.toBeNull();
        expect(resultado.historico?.length).toBeGreaterThan(0);
      });

      it('lança 404 para cliente de outra empresa (EMP001 tentando ver cliente de EMP002)', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI101'),
        ).rejects.toThrow(NotFoundException);
      });

      it('lança 404 para id inexistente', async () => {
        await expect(
          service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI999'),
        ).rejects.toThrow(NotFoundException);
      });

      it('platform_admin (sem id_empresa) sempre recebe 404, nunca acesso cross-tenant', async () => {
        await expect(
          service.buscarPorId(
            usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
            'CLI001',
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  /**
   * Modo `n8n` — nunca chama n8n real (mocka `N8nGatewayClient.call`, seção 30 do
   * pedido). Cobre exatamente os critérios da seção 30: isolamento EMP001/EMP002,
   * política de perfil preservada, `:id` via lista tenant-scoped + 404, e ausência de
   * fallback silencioso para o mock quando o gateway falha.
   */
  describe('modo n8n (DATA_SOURCE_CLIENTES=n8n)', () => {
    let service: ClientesService;
    let gatewayClient: N8nGatewayClient;
    let callSpy: jest.SpyInstance<
      ReturnType<N8nGatewayClient['call']>,
      Parameters<N8nGatewayClient['call']>
    >;

    const CLIENTES_INTEGRACAO_EMP001: N8nGatewayClienteIntegracao[] = [
      {
        idCliente: 'CLI900',
        nome: 'Regina Alves',
        telefone: '(34) 99000-0001',
        email: 'regina@email.com',
        dataNascimento: null,
        status: 'ATIVO',
        clienteDesde: '2026-01-01',
        ultimoAtendimento: '2026-08-01',
        observacoes: null,
      },
    ];

    const CLIENTES_INTEGRACAO_EMP002: N8nGatewayClienteIntegracao[] = [
      {
        idCliente: 'CLI901',
        nome: 'Outra Empresa',
        telefone: '(11) 90000-0002',
        email: null,
        dataNascimento: null,
        status: 'ATIVO',
        clienteDesde: '2026-02-01',
        ultimoAtendimento: null,
        observacoes: null,
      },
    ];

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV, DATA_SOURCE_CLIENTES: 'n8n' };

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ClientesService, N8nGatewayClient],
      }).compile();
      service = moduleRef.get(ClientesService);
      gatewayClient = moduleRef.get(N8nGatewayClient);

      callSpy = jest.spyOn(gatewayClient, 'call').mockImplementation((_operacao, idEmpresa) => {
        if (idEmpresa === 'EMP001') return Promise.resolve(CLIENTES_INTEGRACAO_EMP001 as never);
        if (idEmpresa === 'EMP002') return Promise.resolve(CLIENTES_INTEGRACAO_EMP002 as never);
        return Promise.resolve([] as never);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('chama o gateway com a operação clientes.listar e o idEmpresa do usuário autenticado', async () => {
      await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(callSpy).toHaveBeenCalledWith('clientes.listar', 'EMP001');
    });

    it('EMP001 recebe somente os clientes de EMP001 (isolamento multi-tenant via gateway)', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idCliente).toBe('CLI900');
    });

    it('totalAtendimentos e totalGasto NUNCA viram 0 artificialmente — ficam null (dado ainda não disponível, não "sabemos que é zero")', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data[0].totalAtendimentos).toBeNull();
      expect(resultado.data[0].totalGasto).toBeNull();
      expect(resultado.data[0].totalAtendimentos).not.toBe(0);
      expect(resultado.data[0].totalGasto).not.toBe(0);
    });

    it('proximoAtendimento permanece desconhecido (null) — a aba CLIENTES sozinha não permite calculá-lo', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(resultado.data[0].proximoAtendimento).toBeNull();
    });

    it('EMP002 recebe somente os clientes de EMP002, nunca os de EMP001', async () => {
      const resultado = await service.listar(usuario({ idEmpresa: 'EMP002', perfil: 'owner' }));

      expect(resultado.data).toHaveLength(1);
      expect(resultado.data[0].idCliente).toBe('CLI901');
      expect(resultado.data.some((cliente) => cliente.idCliente === 'CLI900')).toBe(false);
    });

    it('profissional mantém a mesma política de perfil (vê os clientes da própria empresa)', async () => {
      const resultado = await service.listar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
      );

      expect(resultado.data).toHaveLength(1);
      expect(callSpy).toHaveBeenCalledWith('clientes.listar', 'EMP001');
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

      for (const cliente of resultado.data) {
        expect(cliente).not.toHaveProperty('idEmpresa');
        expect(cliente).not.toHaveProperty('ID_EMPRESA');
      }
    });

    it('GET /clientes/:id localiza o cliente na lista já tenant-scoped (sem operação clientes.obter)', async () => {
      const resultado = await service.buscarPorId(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'CLI900',
      );

      expect(resultado.idCliente).toBe('CLI900');
      // null, não [] — [] afirmaria "sabemos que não há histórico", o que seria falso
      // (a aba CLIENTES sozinha não permite carregar histórico de atendimentos).
      expect(resultado.historico).toBeNull();
    });

    it('GET /clientes/:id de outro tenant resulta em 404 (mesmo comportamento do modo mock)', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI901'),
      ).rejects.toThrow(NotFoundException);
    });

    it('GET /clientes/:id inexistente resulta em 404', async () => {
      await expect(
        service.buscarPorId(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }), 'CLI999'),
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
      expect(mensagemRecebida).not.toContain('UPSTREAM_ERROR');
      expect(mensagemRecebida.length).toBeGreaterThan(0);
    });
  });
});
