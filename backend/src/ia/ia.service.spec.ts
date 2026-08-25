import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { IaService } from './ia.service';

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

describe('IaService', () => {
  let service: IaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [IaService],
    }).compile();
    service = moduleRef.get(IaService);
  });

  describe('obterConfiguracao', () => {
    it('owner de EMP001 recebe somente a configuração de IA da própria empresa', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.resumo.status).toBe('PREPARADA');
      expect(resultado.resumo.modelo).toBe('models/gemini-3-flash-preview');
      expect(resultado.resumo.totalInteracoes).toBe(6);
    });

    it('owner de EMP001 nunca recebe dados de EMP002', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(
        resultado.interacoesRecentes.some((item) => item.clienteNome === 'Beatriz Nogueira'),
      ).toBe(false);
      expect(
        resultado.interacoesRecentes.some((item) => item.clienteNome === 'Larissa Ferreira'),
      ).toBe(false);
    });

    // Achado M1 da auditoria final: EMP002 é vazio (sem interações/memória), então um bug
    // de isolamento que misturasse dados entre empresas não seria pego pelos testes acima
    // (não haveria nada de EMP002 para vazar). EMP003 tem cliente, mensagem e interação
    // exclusivos e não-vazios, o que torna este teste capaz de detectar essa classe de
    // regressão de fato.
    it('owner de EMP001 nunca recebe dados de EMP003 (isolamento multi-tenant efetivo)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const bruto = JSON.stringify(resultado);

      expect(resultado.interacoesRecentes.some((item) => item.idInteracao === 'IA-EMP003-01')).toBe(
        false,
      );
      expect(
        resultado.interacoesRecentes.some(
          (item) => item.clienteNome === 'Cliente Exclusivo EMP003',
        ),
      ).toBe(false);
      expect(
        resultado.memoria.clientes.some((item) => item.clienteNome === 'Cliente Exclusivo EMP003'),
      ).toBe(false);
      expect(bruto).not.toContain('Cliente Exclusivo EMP003');
      expect(bruto).not.toContain('Mensagem exclusiva da EMP003');
      expect(bruto).not.toContain('EMP003');
      expect(resultado).not.toHaveProperty('idEmpresa');
    });

    it('owner de EMP003 recebe somente os próprios dados de EMP003, nunca os de EMP001', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP003', perfil: 'owner' }),
      );

      expect(resultado.resumo.status).toBe('PREPARADA');
      expect(resultado.resumo.totalInteracoes).toBe(1);
      expect(resultado.interacoesRecentes).toHaveLength(1);
      expect(resultado.interacoesRecentes[0].idInteracao).toBe('IA-EMP003-01');
      expect(resultado.interacoesRecentes[0].clienteNome).toBe('Cliente Exclusivo EMP003');
      expect(resultado.memoria.clientes).toEqual([{ clienteNome: 'Cliente Exclusivo EMP003' }]);
      expect(
        resultado.interacoesRecentes.some((item) => item.clienteNome === 'Mariana Silva'),
      ).toBe(false);
      expect(resultado).not.toHaveProperty('idEmpresa');
    });

    it('owner de EMP002 recebe a configuração isolada de EMP002 (não configurada, sem interações)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP002', perfil: 'owner' }),
      );

      expect(resultado.resumo.status).toBe('NAO_CONFIGURADA');
      expect(resultado.resumo.totalInteracoes).toBe(0);
      expect(resultado.interacoesRecentes).toEqual([]);
      expect(resultado.memoria.clientes).toEqual([]);
    });

    it('profissional recebe 403 Forbidden, nunca a configuração de IA', () => {
      expect(() =>
        service.obterConfiguracao(
          usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        ),
      ).toThrow(ForbiddenException);
    });

    it('platform_admin (sem id_empresa) recebe 403 Forbidden, nunca acesso cross-tenant', () => {
      expect(() =>
        service.obterConfiguracao(
          usuario({ idEmpresa: null, idProfissional: null, perfil: 'platform_admin' }),
        ),
      ).toThrow(ForbiddenException);
    });

    it('empresa inexistente no mock não vaza dados de outra empresa (404, não fallback)', () => {
      expect(() =>
        service.obterConfiguracao(usuario({ idEmpresa: 'EMP999', perfil: 'owner' })),
      ).toThrow(NotFoundException);
    });

    it('a resposta nunca contém idEmpresa', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado).not.toHaveProperty('idEmpresa');
      expect(resultado.resumo).not.toHaveProperty('idEmpresa');
      for (const interacao of resultado.interacoesRecentes) {
        expect(interacao).not.toHaveProperty('idEmpresa');
      }
    });

    it('a resposta nunca contém API key, secrets, tokens ou prompt interno', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const bruto = JSON.stringify(resultado).toLowerCase();

      expect(bruto).not.toContain('apikey');
      expect(bruto).not.toContain('api_key');
      expect(bruto).not.toContain('token');
      expect(bruto).not.toContain('secret');
      expect(bruto).not.toContain('prompt');
      expect(bruto).not.toContain('phone_number_id');
    });

    it('intenções correspondem exatamente ao domínio real auditado em WF003 (4 branches + OUTRO)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const codigos = resultado.intencoes.map((item) => item.codigo).sort();
      expect(codigos).toEqual(
        ['AGENDAR', 'CANCELAR', 'CONSULTAR_DISPONIBILIDADE', 'OUTRO', 'REAGENDAR'].sort(),
      );
    });

    it('interações recentes vêm ordenadas da mais recente para a mais antiga', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const datas = resultado.interacoesRecentes.map((item) => item.dataHora);
      const ordenadas = [...datas].sort((a, b) => b.localeCompare(a));
      expect(datas).toEqual(ordenadas);
    });

    // Achado P1-1 da auditoria geral: este teste usava a string fixa '2026-08-24'. O mock
    // (ia.mock-data.ts) agora gera `dataHora` a partir de `getHojeBrasilISO()` +
    // `deslocarDiasISO()` (nunca uma data absoluta), então o teste também precisa comparar
    // contra "hoje" calculado em tempo de execução — assim ele permanece correto em
    // qualquer dia real em que rodar, sem depender de a suíte ser executada num dia
    // específico do calendário.
    it('interacoesHoje conta somente interações com dataHora de hoje (data calculada em runtime, não fixa)', () => {
      const hoje = getHojeBrasilISO();
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const contagemManual = resultado.interacoesRecentes.filter((item) =>
        item.dataHora.startsWith(hoje),
      ).length;
      expect(resultado.resumo.interacoesHoje).toBe(contagemManual);

      // IA001 e IA002 são geradas com offset 0 dias em relação a "hoje" (ver
      // ia.mock-data.ts) — são sempre "hoje", qualquer que seja a data real de execução.
      expect(resultado.resumo.interacoesHoje).toBe(2);
      const idsDeHoje = resultado.interacoesRecentes
        .filter((item) => item.dataHora.startsWith(hoje))
        .map((item) => item.idInteracao)
        .sort();
      expect(idsDeHoje).toEqual(['IA001', 'IA002']);
    });

    it('interação de dias anteriores (IA003, "hoje - 2 dias") nunca é contada como interação de hoje', () => {
      const hoje = getHojeBrasilISO();
      const ontem = deslocarDiasISO(hoje, -2);
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const ia003 = resultado.interacoesRecentes.find((item) => item.idInteracao === 'IA003');
      expect(ia003).toBeDefined();
      expect(ia003?.dataHora.startsWith(ontem)).toBe(true);
      expect(ia003?.dataHora.startsWith(hoje)).toBe(false);
    });

    it('clientesComMemoriaAtiva do resumo bate com a lista da seção memoria', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.resumo.clientesComMemoriaAtiva).toBe(resultado.memoria.clientes.length);
      expect(resultado.resumo.clientesComMemoriaAtiva).toBeGreaterThan(0);
    });

    it('confianca de cada interação está sempre entre 0 e 1 (autodeclarada pelo modelo)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      for (const interacao of resultado.interacoesRecentes) {
        expect(interacao.confianca).toBeGreaterThanOrEqual(0);
        expect(interacao.confianca).toBeLessThanOrEqual(1);
      }
    });

    it('status de processamento das interações é sempre PROCESSADA (único valor real observado nos workflows)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.interacoesRecentes.every((item) => item.status === 'PROCESSADA')).toBe(true);
    });
  });

  describe('minimização de dados — previewMensagem', () => {
    it('toda interação pública possui previewMensagem', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      expect(resultado.interacoesRecentes.length).toBeGreaterThan(0);
      for (const interacao of resultado.interacoesRecentes) {
        expect(typeof interacao.previewMensagem).toBe('string');
        expect(interacao.previewMensagem.length).toBeGreaterThan(0);
      }
    });

    it('a interação pública NÃO possui a propriedade "mensagem" (mensagem completa)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      for (const interacao of resultado.interacoesRecentes) {
        expect(interacao).not.toHaveProperty('mensagem');
      }
    });

    it('mensagem abaixo do limite permanece intacta no preview (IA002, sem reticências)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const curta = resultado.interacoesRecentes.find((item) => item.idInteracao === 'IA002');
      expect(curta?.previewMensagem).toBe('Vocês têm horário livre no sábado de manhã?');
      expect(curta?.previewMensagem.endsWith('…')).toBe(false);
    });

    it('mensagem acima do limite é truncada no preview (IA001, com reticências)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      const longa = resultado.interacoesRecentes.find((item) => item.idInteracao === 'IA001');
      expect(longa?.previewMensagem.endsWith('…')).toBe(true);
      expect(longa?.previewMensagem.length).toBeLessThan(150);
    });

    it('todo previewMensagem respeita o limite padrão de 120 caracteres (+ 1 para a reticência)', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );

      for (const interacao of resultado.interacoesRecentes) {
        const semReticencia = interacao.previewMensagem.endsWith('…')
          ? interacao.previewMensagem.slice(0, -1)
          : interacao.previewMensagem;
        expect(semReticencia.length).toBeLessThanOrEqual(120);
      }
    });

    it('o conteúdo completo da mensagem longa nunca aparece no JSON público de GET /ia', () => {
      const resultado = service.obterConfiguracao(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
      );
      const bruto = JSON.stringify(resultado);

      // Trecho final da mensagem completa de IA001 no mock — só existiria no JSON se a
      // mensagem completa tivesse vazado (o preview corta bem antes deste trecho).
      expect(bruto).not.toContain('alguma vaga disponível nesses dias');
    });
  });
});
