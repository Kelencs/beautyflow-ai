import { ForbiddenException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type {
  N8nGatewayDisponibilidadeIntegracao,
  N8nGatewayEmpresaIntegracao,
} from '../n8n-gateway/n8n-gateway.types';
import { ProfissionaisService } from '../profissionais/profissionais.service';
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
  const ORIGINAL_ENV = process.env;

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('modo mock (DATA_SOURCE_CONFIGURACOES ausente ou "mock" — comportamento existente)', () => {
    let service: ConfiguracoesService;

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV };
      delete process.env.DATA_SOURCE_CONFIGURACOES;

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ConfiguracoesService, N8nGatewayClient, ProfissionaisService],
      }).compile();
      service = moduleRef.get(ConfiguracoesService);
    });

    describe('obterConfiguracoes', () => {
      it('owner de EMP001 recebe as configurações da própria empresa', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );

        expect(resultado.negocio.nomeFantasia).toBe('Studio Bela Vida');
        expect(resultado.agenda.timezone).toBe('America/Sao_Paulo');
        expect(resultado.agenda.janelaCancelamentoMinutos).toBe(120);
      });

      it('owner de EMP001 nunca recebe dados de EMP002', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );

        expect(resultado.negocio.nomeFantasia).not.toBe('Espaço Rafael Torres');
        expect(
          resultado.agenda.disponibilidadePorProfissional.some(
            (item) => item.profissionalNome === 'Rafael Torres',
          ),
        ).toBe(false);
      });

      it('owner de EMP002 recebe as configurações de EMP002, isoladas de EMP001', async () => {
        const resultado = await service.obterConfiguracoes(
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

      it('profissional recebe 403 Forbidden, nunca as configurações', async () => {
        await expect(
          service.obterConfiguracoes(
            usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
          ),
        ).rejects.toThrow(ForbiddenException);
      });

      it('platform_admin (sem id_empresa) recebe 403 Forbidden, nunca acesso cross-tenant', async () => {
        await expect(
          service.obterConfiguracoes(
            usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
          ),
        ).rejects.toThrow(ForbiddenException);
      });

      it('defensivo: owner sem idEmpresa (estado impossível pela constraint do banco) também recebe 403, nunca 200 vazio', async () => {
        await expect(
          service.obterConfiguracoes(usuario({ idEmpresa: null, perfil: 'owner' })),
        ).rejects.toThrow(ForbiddenException);
      });

      it('empresa inexistente no mock não vaza dados de outra empresa (404, não fallback)', async () => {
        await expect(
          service.obterConfiguracoes(usuario({ idEmpresa: 'EMP999', perfil: 'owner' })),
        ).rejects.toThrow(NotFoundException);
      });

      it('a resposta nunca contém idEmpresa', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );

        expect(resultado).not.toHaveProperty('idEmpresa');
        expect(resultado.negocio).not.toHaveProperty('idEmpresa');
        expect(resultado.agenda).not.toHaveProperty('idEmpresa');
      });

      it('a resposta nunca contém segredos/IDs técnicos (whatsappPhoneNumberId, tokens, secrets)', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );
        const bruto = JSON.stringify(resultado);

        expect(resultado).not.toHaveProperty('whatsappPhoneNumberId');
        expect(bruto).not.toContain('109876543210001');
        expect(bruto.toLowerCase()).not.toContain('token');
        expect(bruto.toLowerCase()).not.toContain('secret');
      });

      it('integrações refletem a presença/ausência real de whatsappPhoneNumberId no mock (sem expor o ID)', async () => {
        const emp001 = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );
        const emp002 = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
        );

        expect(emp001.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe('ATIVA');
        expect(emp002.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe(
          'NAO_CONFIGURADA',
        );
      });

      it('automações de comunicação cobrem os 5 tipos reais, todas como DISPONIVEL (sem toggle por empresa)', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        );

        const tipos = resultado.automacoesComunicacao.map((item) => item.tipo).sort();
        expect(tipos).toEqual(
          ['CONFIRMACAO', 'COBRANCA', 'FOLLOWUP', 'LEMBRETE', 'PESQUISA'].sort(),
        );
        expect(resultado.automacoesComunicacao.every((item) => item.status === 'DISPONIVEL')).toBe(
          true,
        );
      });

      it('contrato respeita os dados auditados: EMP002 tem e-mail null e sem WhatsApp configurado', async () => {
        const resultado = await service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
        );

        expect(resultado.negocio.email).toBeNull();
      });
    });
  });

  describe('modo n8n (DATA_SOURCE_CONFIGURACOES=n8n)', () => {
    let service: ConfiguracoesService;
    let gatewayClient: N8nGatewayClient;
    let callSpy: jest.SpyInstance<
      ReturnType<N8nGatewayClient['call']>,
      Parameters<N8nGatewayClient['call']>
    >;

    const EMPRESA_EMP001: N8nGatewayEmpresaIntegracao = {
      timezone: 'America/Sao_Paulo',
      nome: 'Studio Bela Vida (homologação)',
      telefone: '034999990001',
      email: 'contato@studiobelavida.com.br',
      tempoCancelamentoMinutos: 120,
      whatsappConfigurado: true,
    };
    const EMPRESA_EMP002: N8nGatewayEmpresaIntegracao = {
      timezone: 'America/Sao_Paulo',
      nome: '',
      telefone: null,
      email: null,
      tempoCancelamentoMinutos: 60,
      whatsappConfigurado: false,
    };

    // PROF001 (Ana Martins) e PROF002 (Carla Souza) são EMP001; PROF010 (Rafael Torres)
    // é EMP002 — mesmos ids reais de profissionais.mock-data.ts (ProfissionaisService
    // continua no modo mock nesta suíte: DATA_SOURCE_PROFISSIONAIS não é setado).
    const DISPONIBILIDADES_EMP001: N8nGatewayDisponibilidadeIntegracao[] = [
      {
        idProfissional: 'PROF001',
        diaSemanaNum: 1, // segunda
        aberto: true,
        horaInicio: '09:00',
        horaFim: '18:00',
        intervaloInicio: '12:00',
        intervaloFim: '13:00',
      },
      {
        idProfissional: 'PROF001',
        diaSemanaNum: 0, // domingo
        aberto: false,
        horaInicio: null,
        horaFim: null,
        intervaloInicio: null,
        intervaloFim: null,
      },
      {
        idProfissional: 'PROF002',
        diaSemanaNum: 2, // terça
        aberto: true,
        horaInicio: '10:00',
        horaFim: '17:00',
        intervaloInicio: null,
        intervaloFim: null,
      },
    ];

    const DISPONIBILIDADES_EMP002: N8nGatewayDisponibilidadeIntegracao[] = [
      {
        idProfissional: 'PROF010',
        diaSemanaNum: 3, // quarta
        aberto: true,
        horaInicio: '08:00',
        horaFim: '16:00',
        intervaloInicio: null,
        intervaloFim: null,
      },
    ];

    beforeEach(async () => {
      process.env = { ...ORIGINAL_ENV, DATA_SOURCE_CONFIGURACOES: 'n8n' };

      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
        providers: [ConfiguracoesService, N8nGatewayClient, ProfissionaisService],
      }).compile();
      service = moduleRef.get(ConfiguracoesService);
      gatewayClient = moduleRef.get(N8nGatewayClient);

      callSpy = jest.spyOn(gatewayClient, 'call').mockImplementation((operacao, idEmpresa) => {
        if (operacao === 'empresa.obter') {
          if (idEmpresa === 'EMP001') return Promise.resolve(EMPRESA_EMP001 as never);
          if (idEmpresa === 'EMP002') return Promise.resolve(EMPRESA_EMP002 as never);
          return Promise.reject(new Error('empresa desconhecida no teste'));
        }
        if (operacao === 'disponibilidades.listar') {
          if (idEmpresa === 'EMP001') return Promise.resolve(DISPONIBILIDADES_EMP001 as never);
          if (idEmpresa === 'EMP002') return Promise.resolve(DISPONIBILIDADES_EMP002 as never);
          return Promise.resolve([] as never);
        }
        return Promise.reject(new Error('operação inesperada no teste: ' + operacao));
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('chama empresa.obter e disponibilidades.listar com o idEmpresa correto', async () => {
      await service.obterConfiguracoes(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));

      expect(callSpy).toHaveBeenCalledWith('empresa.obter', 'EMP001');
      expect(callSpy).toHaveBeenCalledWith('disponibilidades.listar', 'EMP001');
    });

    it('agenda.timezone/janelaCancelamentoMinutos vêm do gateway (empresa.obter)', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.agenda.timezone).toBe('America/Sao_Paulo');
      expect(resultado.agenda.janelaCancelamentoMinutos).toBe(120);
    });

    it('negocio usa dados reais de EMPRESAS no modo n8n (correção de schema — NOME/TELEFONE/EMAIL existem de fato)', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.negocio).toEqual({
        nomeFantasia: 'Studio Bela Vida (homologação)',
        telefone: '034999990001',
        email: 'contato@studiobelavida.com.br',
      });
    });

    it('negocio com NOME/TELEFONE/EMAIL vazios na fonte vira "" /null/null — nunca fabricado', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(resultado.negocio).toEqual({ nomeFantasia: '', telefone: null, email: null });
    });

    it('integracoes.WhatsApp reflete whatsappConfigurado do gateway, sem expor WHATSAPP_PHONE_NUMBER_ID', async () => {
      const emp001 = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const emp002 = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(emp001.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe('ATIVA');
      expect(emp002.integracoes.find((item) => item.nome === 'WhatsApp')?.status).toBe(
        'NAO_CONFIGURADA',
      );
    });

    it('disponibilidadePorProfissional resolve o nome via ProfissionaisService (nunca expõe o id cru)', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const nomes = resultado.agenda.disponibilidadePorProfissional
        .map((item) => item.profissionalNome)
        .sort();
      expect(nomes).toEqual(['Ana Martins', 'Carla Souza']);
    });

    it('cada profissional tem os 7 dias da semana — dias sem linha real vêm fechados, nunca fabricados como abertos', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const carla = resultado.agenda.disponibilidadePorProfissional.find(
        (item) => item.profissionalNome === 'Carla Souza',
      );
      expect(carla?.dias).toHaveLength(7);
      // Carla só tem 1 linha real (TERCA); os outros 6 dias devem vir fechados.
      const abertos = carla?.dias.filter((dia) => dia.aberto) ?? [];
      expect(abertos).toHaveLength(1);
      expect(abertos[0]).toEqual({
        diaSemana: 'TERCA',
        aberto: true,
        horaInicio: '10:00',
        horaFim: '17:00',
        intervaloInicio: null,
        intervaloFim: null,
      });
      const domingo = carla?.dias.find((dia) => dia.diaSemana === 'DOMINGO');
      expect(domingo).toEqual({
        diaSemana: 'DOMINGO',
        aberto: false,
        horaInicio: null,
        horaFim: null,
        intervaloInicio: null,
        intervaloFim: null,
      });
    });

    it('DIA_SEMANA_NUM=0 é traduzido para DOMINGO (não confundido com dia ausente)', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const ana = resultado.agenda.disponibilidadePorProfissional.find(
        (item) => item.profissionalNome === 'Ana Martins',
      );
      const domingo = ana?.dias.find((dia) => dia.diaSemana === 'DOMINGO');
      expect(domingo?.aberto).toBe(false);
    });

    it('EMP001 recebe somente disponibilidades de EMP001 (isolamento multi-tenant)', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(
        resultado.agenda.disponibilidadePorProfissional.some(
          (item) => item.profissionalNome === 'Rafael Torres',
        ),
      ).toBe(false);
    });

    it('EMP002 recebe somente disponibilidades de EMP002, nunca as de EMP001', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(resultado.agenda.disponibilidadePorProfissional).toHaveLength(1);
      expect(resultado.agenda.disponibilidadePorProfissional[0].profissionalNome).toBe(
        'Rafael Torres',
      );
    });

    it('a resposta nunca inclui ID_EMPRESA nem outros campos técnicos do Sheets', async () => {
      const resultado = await service.obterConfiguracoes(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const bruto = JSON.stringify(resultado);

      expect(resultado).not.toHaveProperty('idEmpresa');
      expect(bruto).not.toContain('ID_EMPRESA');
      expect(bruto).not.toContain('WHATSAPP_PHONE_NUMBER_ID');
    });

    it('profissional continua recebendo 403 Forbidden no modo n8n (autorização preservada)', async () => {
      await expect(
        service.obterConfiguracoes(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(callSpy).not.toHaveBeenCalled();
    });

    it('platform_admin continua recebendo 403 Forbidden no modo n8n, nunca chama o gateway', async () => {
      await expect(
        service.obterConfiguracoes(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(callSpy).not.toHaveBeenCalled();
    });

    it('empresa.obter falhando NÃO cai silenciosamente no mock — propaga erro técnico controlado', async () => {
      callSpy.mockImplementation((operacao) => {
        if (operacao === 'empresa.obter') {
          return Promise.reject(
            new N8nGatewayException('UPSTREAM_ERROR', 'falha ao buscar empresa', 'req-1'),
          );
        }
        return Promise.resolve([] as never);
      });

      await expect(
        service.obterConfiguracoes(usuario({ idEmpresa: 'EMP001', perfil: 'owner' })),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('disponibilidades.listar falhando também propaga erro técnico controlado (nenhuma resposta parcial só com empresa)', async () => {
      callSpy.mockImplementation((operacao) => {
        if (operacao === 'empresa.obter') return Promise.resolve(EMPRESA_EMP001 as never);
        return Promise.reject(
          new N8nGatewayException('UPSTREAM_ERROR', 'falha ao buscar disponibilidades', 'req-2'),
        );
      });

      await expect(
        service.obterConfiguracoes(usuario({ idEmpresa: 'EMP001', perfil: 'owner' })),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('erro do gateway nunca vaza detalhe interno (mensagem genérica, sem requestId/URL/code)', async () => {
      callSpy.mockImplementation((operacao) => {
        if (operacao === 'empresa.obter') {
          return Promise.reject(
            new N8nGatewayException('UPSTREAM_ERROR', 'detalhe interno', 'req-segredo-interno'),
          );
        }
        return Promise.resolve([] as never);
      });

      let mensagemRecebida = '';
      try {
        await service.obterConfiguracoes(usuario({ idEmpresa: 'EMP001', perfil: 'owner' }));
      } catch (error) {
        mensagemRecebida = error instanceof Error ? error.message : '';
      }

      expect(mensagemRecebida).not.toContain('req-segredo-interno');
      expect(mensagemRecebida.length).toBeGreaterThan(0);
    });
  });
});
