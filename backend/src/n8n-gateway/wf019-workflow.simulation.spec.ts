import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Simulação dos Code nodes reais do APP-WF019 (lê o JSON versionado diretamente, nunca
 * uma cópia) + verificação estrutural do node de resposta final. Não chama n8n Cloud nem
 * Google Sheets — só executa o JavaScript exatamente como está no arquivo, com
 * `$json`/`$input`/`$('Node')` mockados (mesmo padrão já usado neste projeto para validar
 * workflows n8n antes de importar).
 *
 * Existe para provar, no repositório, que uma regressão como `JSON.stringify($json)` no
 * `RESPOND - Resultado` (causa raiz do body HTTP vazio observado no teste real — ver
 * n8n/documentacao/app/APP-WF019.md) não volte a acontecer sem quebrar este teste.
 */

const WORKFLOW_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'n8n',
  'workflows',
  'app',
  'APP-WF019-gateway-app.json',
);

interface N8nNode {
  name: string;
  type: string;
  parameters: Record<string, unknown>;
}

interface N8nWorkflow {
  nodes: N8nNode[];
  active: boolean;
}

function loadWorkflow(): N8nWorkflow {
  return JSON.parse(fs.readFileSync(WORKFLOW_PATH, 'utf8')) as N8nWorkflow;
}

function getNode(workflow: N8nWorkflow, name: string): N8nNode {
  const node = workflow.nodes.find((n) => n.name === name);
  if (!node) throw new Error(`Node "${name}" não encontrado no JSON do WF019.`);
  return node;
}

function runCode(
  workflow: N8nWorkflow,
  nodeName: string,
  options: {
    json: Record<string, unknown>;
    items?: Record<string, unknown>[];
    nodeOutputs?: Record<string, Record<string, unknown>>;
  },
): Record<string, unknown> {
  const jsCode = getNode(workflow, nodeName).parameters.jsCode as string;
  const $json = options.json;
  const $input = { all: () => (options.items ?? [options.json]).map((item) => ({ json: item })) };
  const $ = (referenced: string) => ({
    first: () => ({ json: options.nodeOutputs?.[referenced] ?? {} }),
  });
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('$json', '$input', '$', `${jsCode}\n`) as (
    j: unknown,
    i: unknown,
    d: unknown,
  ) => Array<{ json: Record<string, unknown> }>;
  return fn($json, $input, $)[0].json;
}

describe('APP-WF019 — simulação do workflow real (JSON versionado)', () => {
  let workflow: N8nWorkflow;

  beforeAll(() => {
    workflow = loadWorkflow();
  });

  it('permanece inativo (active:false) na fonte versionada', () => {
    expect(workflow.active).toBe(false);
  });

  describe('RESPOND - Resultado (regressão do body HTTP vazio)', () => {
    it('usa respondWith "json" com o objeto direto, nunca uma string pré-serializada', () => {
      const node = getNode(workflow, 'RESPOND - Resultado');

      expect(node.parameters.respondWith).toBe('json');
      // A causa raiz real: `JSON.stringify($json)` devolve uma STRING, e o node
      // "Respond to Webhook" em modo "json" espera o objeto para serializar sozinho —
      // usar JSON.stringify aqui produziu body HTTP vazio em teste real no n8n Cloud.
      expect(node.parameters.responseBody).toBe('={{ $json }}');
      expect(node.parameters.responseBody).not.toContain('JSON.stringify');
    });

    it('o Webhook usa "Using Respond to Webhook Node" (responseNode), nunca "When Last Node Finishes"', () => {
      const webhook = getNode(workflow, 'Webhook - Gateway App');

      // "lastNode" foi a configuração que vazou o payload bruto do trigger (headers,
      // webhookUrl, executionMode, incluindo o header de autenticação) em teste real.
      expect(webhook.parameters.responseMode).toBe('responseNode');
    });
  });

  describe('clientes.listar EMP001 — envelope final conceitual', () => {
    const LINHA_SHEETS_EMP001 = {
      ID_CLIENTE: 'CLI-HML-001',
      ID_EMPRESA: 'EMP001',
      NOME: 'Mariana Teste',
      TELEFONE: '34999990001',
      EMAIL: 'mariana.teste@exemplo.com',
      STATUS: 'ATIVO',
      DATA_CADASTRO: '2026-01-01T10:00:00.000Z',
      ULTIMO_ATENDIMENTO: null,
      OBSERVACOES: null,
    };

    it('produz exatamente { ok: true, data: [...EMP001...], meta: { requestId } }', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'clientes.listar', idEmpresa: 'EMP001', requestId: 'teste' },
        },
      });
      expect(validado.erro_codigo).toBe('');

      const normalizado = runCode(workflow, 'CODE - Normalizar Clientes', {
        json: {},
        items: [LINHA_SHEETS_EMP001],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      // Exatamente o shape pedido: objeto único, não array externo, não string.
      expect(respostaFinal).toEqual({
        ok: true,
        data: [
          {
            idCliente: 'CLI-HML-001',
            nome: 'Mariana Teste',
            telefone: '34999990001',
            email: 'mariana.teste@exemplo.com',
            dataNascimento: null,
            status: 'ATIVO',
            clienteDesde: '2026-01-01',
            ultimoAtendimento: null,
            observacoes: null,
          },
        ],
        meta: { requestId: 'teste' },
      });
      expect(Array.isArray(respostaFinal)).toBe(false);
      expect(typeof respostaFinal).not.toBe('string');
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
    });
  });

  describe('erro converge para o mesmo formato de envelope', () => {
    it('TENANT_REQUIRED produz { ok: false, error: { code, message }, meta: { requestId } }', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'clientes.listar', requestId: 'teste-erro' } },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Erro', { json: validado });

      expect(respostaFinal).toEqual({
        ok: false,
        error: { code: 'TENANT_REQUIRED', message: 'idEmpresa é obrigatório.' },
        meta: { requestId: 'teste-erro' },
      });
      expect(respostaFinal).not.toHaveProperty('stack');
    });
  });

  /**
   * Fase 2 — adiciona `servicos.listar` sem regredir `clientes.listar` (seção 32 do
   * pedido). Cobre exatamente os pontos exigidos: as duas operações continuam
   * reconhecidas, uma 3ª operação vira INVALID_OPERATION, o branch de Serviços existe
   * (SWITCH + GS + filtro ID_EMPRESA), a normalização remove ID_EMPRESA, a resposta
   * continua um objeto único, e nenhuma credencial secreta foi versionada.
   */
  describe('Fase 2 — reconhecimento de operações', () => {
    it('clientes.listar continua reconhecido (regressão)', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'clientes.listar', idEmpresa: 'EMP001', requestId: 'r1' } },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('servicos.listar é reconhecido', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'servicos.listar', idEmpresa: 'EMP001', requestId: 'r2' } },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('profissionais.listar é reconhecido (Fase 3)', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'profissionais.listar', idEmpresa: 'EMP001', requestId: 'r3' } },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('uma sétima operação (ex.: agenda.listar) continua INVALID_OPERATION', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'agenda.listar', idEmpresa: 'EMP001', requestId: 'r4' } },
      });
      expect(validado.erro_codigo).toBe('INVALID_OPERATION');
    });

    it('agendamentos.listar é reconhecido (integração da Agenda real)', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'agendamentos.listar', idEmpresa: 'EMP001', requestId: 'r5' } },
      });
      expect(validado.erro_codigo).toBe('');
    });
  });

  describe('Fase 2 — estrutura do branch de Serviços', () => {
    it('SWITCH - Operação existe e roteia as seis operações read-only suportadas', () => {
      const sw = getNode(workflow, 'SWITCH - Operação');
      const values = (sw.parameters.rules as { values: Array<Record<string, unknown>> }).values;
      const chaves = values.map((v) => v.outputKey);
      expect(chaves).toEqual([
        'clientes.listar',
        'servicos.listar',
        'profissionais.listar',
        'empresa.obter',
        'disponibilidades.listar',
        'agendamentos.listar',
      ]);
    });

    it('GS - Buscar Serviços filtra por ID_EMPRESA e reutiliza a credencial já existente', () => {
      const gs = getNode(workflow, 'GS - Buscar Serviços');
      const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };

      expect(filtros.values).toEqual([
        { lookupColumn: 'ID_EMPRESA', lookupValue: '={{ $json.idEmpresa }}' },
      ]);
      expect(
        (gs as unknown as { credentials: { googleSheetsOAuth2Api: { id: string } } }).credentials
          .googleSheetsOAuth2Api.id,
      ).toBe('bV94b0kU1RKmLn1F');
    });

    it('nenhuma credencial secreta real está versionada (só placeholders/ids técnicos já usados no projeto)', () => {
      const webhook = getNode(workflow, 'Webhook - Gateway App') as unknown as {
        credentials: { httpHeaderAuth: { id: string } };
      };
      expect(webhook.credentials.httpHeaderAuth.id).toBe('CONFIGURAR_CREDENCIAL_HEADER_AUTH');
    });
  });

  describe('servicos.listar EMP001 — envelope final conceitual', () => {
    const LINHA_SHEETS_EMP001 = {
      ID_SERVICO: 'SRV-HML-001',
      ID_EMPRESA: 'EMP001',
      NOME: 'Alongamento em gel',
      CATEGORIA: 'Unhas',
      DESCRICAO: 'Alongamento completo das unhas com gel.',
      STATUS: 'ATIVO',
      DURACAO_MIN: 120,
      TEMPO_INTERVALO_MIN: 15,
      VALOR: 120,
      DATA_CADASTRO: '2026-01-01T10:00:00.000Z',
      ULTIMA_ATUALIZACAO: '2026-02-01T10:00:00.000Z',
    };

    it('produz exatamente { ok: true, data: [...EMP001...], meta: { requestId } } — nunca ID_EMPRESA/CATEGORIA/datas/headers/webhookUrl/executionMode', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'servicos.listar', idEmpresa: 'EMP001', requestId: 'teste-srv' },
        },
      });

      const normalizado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: [LINHA_SHEETS_EMP001],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      // toEqual (estrito, não toMatchObject) prova ao mesmo tempo o shape correto E a
      // ausência de qualquer campo extra (CATEGORIA/DATA_CADASTRO/ULTIMA_ATUALIZACAO/
      // TEMPO_INTERVALO_MIN/ID_EMPRESA) — se algum vazasse, este toEqual falharia.
      expect(respostaFinal).toEqual({
        ok: true,
        data: [
          {
            idServico: 'SRV-HML-001',
            nome: 'Alongamento em gel',
            descricao: 'Alongamento completo das unhas com gel.',
            status: 'ATIVO',
            duracaoMinutos: 120,
            valor: 120,
          },
        ],
        meta: { requestId: 'teste-srv' },
      });
      expect(Array.isArray(respostaFinal)).toBe(false);
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
    });

    it('Sheets vazio (placeholder sem ID_SERVICO) -> sucesso com data: []', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: [{ ID_SERVICO: undefined }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-vazio' } },
      });
      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({ ok: true, data: [], meta: { requestId: 'r-vazio' } });
    });

    it('erro técnico ao buscar SERVICOS converge para UPSTREAM_ERROR (mesmo node compartilhado de Clientes)', () => {
      const erro = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-srv' } },
      });
      expect(erro.erro_codigo).toBe('UPSTREAM_ERROR');

      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: erro });
      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível consultar os dados no momento.',
        },
        meta: { requestId: 'r-erro-srv' },
      });
    });
  });

  /**
   * Hardening (v1.3) — pedido explícito: dado obrigatório inválido em UM serviço real da
   * empresa nunca pode ser descartado silenciosamente nem virar lista parcial. A operação
   * INTEIRA falha (`erro_codigo: UPSTREAM_ERROR`) — só a linha placeholder de busca
   * legitimamente vazia (sem ID_SERVICO) segue para sucesso.
   */
  describe('Fase 2 (hardening) — CODE - Normalizar Serviços: válido vs. falha da operação inteira', () => {
    function normalizarLinhas(
      rows: Record<string, unknown>[],
    ):
      | { ok: true; servicos: Record<string, unknown>[] }
      | { ok: false; erro_codigo: string; erro_mensagem: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return {
          ok: false,
          erro_codigo: resultado.erro_codigo as string,
          erro_mensagem: resultado.erro_mensagem as string,
        };
      }
      return { ok: true, servicos: resultado.servicos as Record<string, unknown>[] };
    }

    function normalizarUmaLinha(row: Record<string, unknown>) {
      return normalizarLinhas([row]);
    }

    const BASE = { ID_SERVICO: 'SRV1', NOME: 'Teste', STATUS: 'ATIVO' };

    it('serviço totalmente válido é aceito com STATUS ATIVO', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        STATUS: 'ATIVO',
        DURACAO_MIN: 60,
        VALOR: 90,
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0]).toMatchObject({
          status: 'ATIVO',
          duracaoMinutos: 60,
          valor: 90,
        });
      }
    });

    it('serviço totalmente válido é aceito com STATUS INATIVO', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        STATUS: 'INATIVO',
        DURACAO_MIN: 60,
        VALOR: 90,
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].status).toBe('INATIVO');
      }
    });

    it('STATUS com trim/case diferente ("  ativo  ") é normalizado para ATIVO', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        STATUS: '  ativo  ',
        DURACAO_MIN: 60,
        VALOR: 90,
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].status).toBe('ATIVO');
      }
    });

    it('VALOR em formato BR ("R$ 1.250,50") é normalizado corretamente', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: 'R$ 1.250,50' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].valor).toBe(1250.5);
      }
    });

    it('VALOR com vírgula decimal simples ("90,50") é normalizado corretamente', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: '90,50' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].valor).toBe(90.5);
      }
    });

    it('STATUS desconhecido ("ATIV") faz a operação falhar — nunca vira ATIVO por default', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'ATIV', DURACAO_MIN: 60, VALOR: 90 });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('STATUS desconhecido ("PENDENTE"/"DESATIVADO") faz a operação falhar', () => {
      expect(
        normalizarUmaLinha({ ...BASE, STATUS: 'PENDENTE', DURACAO_MIN: 60, VALOR: 90 }).ok,
      ).toBe(false);
      expect(
        normalizarUmaLinha({ ...BASE, STATUS: 'DESATIVADO', DURACAO_MIN: 60, VALOR: 90 }).ok,
      ).toBe(false);
    });

    it('STATUS vazio/ausente faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, STATUS: '', DURACAO_MIN: 60, VALOR: 90 }).ok).toBe(
        false,
      );
      expect(
        normalizarUmaLinha({ ...BASE, STATUS: undefined, DURACAO_MIN: 60, VALOR: 90 }).ok,
      ).toBe(false);
    });

    it('NOME vazio/ausente faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, NOME: '', DURACAO_MIN: 60, VALOR: 90 }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, NOME: '   ', DURACAO_MIN: 60, VALOR: 90 }).ok).toBe(
        false,
      );
      expect(normalizarUmaLinha({ ...BASE, NOME: undefined, DURACAO_MIN: 60, VALOR: 90 }).ok).toBe(
        false,
      );
    });

    it('DURACAO_MIN inválida (texto não numérico) faz a operação falhar — nunca vira 0 fabricado', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 'abc', VALOR: 50 });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('DURACAO_MIN negativa faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, DURACAO_MIN: -10, VALOR: 50 }).ok).toBe(false);
    });

    it('VALOR inválido (texto não numérico) faz a operação falhar — nunca vira 0 fabricado', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: 'gratis' });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('VALOR negativo faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: -10 }).ok).toBe(false);
    });

    it('1 serviço corrompido entre 3 reais faz a operação INTEIRA falhar — nunca devolve os 2 bons e omite o ruim', () => {
      const resultado = normalizarLinhas([
        { ...BASE, ID_SERVICO: 'SRV1', DURACAO_MIN: 60, VALOR: 80 },
        { ...BASE, ID_SERVICO: 'SRV2', STATUS: 'ATIV', DURACAO_MIN: 45, VALOR: 60 },
        { ...BASE, ID_SERVICO: 'SRV3', DURACAO_MIN: 30, VALOR: 40 },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('erro de dado corrompido converge para o envelope padrão de erro, sem expor linha/ID_EMPRESA/planilha/stack', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: [{ ...BASE, ID_EMPRESA: 'EMP001', STATUS: 'ATIV', DURACAO_MIN: 60, VALOR: 90 }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompido' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Um ou mais serviços cadastrados possuem dados inválidos.',
        },
        meta: { requestId: 'r-corrompido' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('EMP001');
      expect(textoCompleto).not.toContain('SRV1');
      expect(textoCompleto).not.toContain('BEAUTYFLOW');
      expect(envelopeErro).not.toHaveProperty('stack');
      expect(envelopeErro).not.toHaveProperty('credential');
    });

    /**
     * Correção de schema: DESCRICAO EXISTE de fato na aba real (uma premissa anterior
     * deste projeto de que não existia estava errada). Agora é mapeada — preenchida vira
     * string normalizada/trim; vazia/ausente vira `null`; nunca fabricada nem substituída
     * pelo NOME. `descricao` é opcional: sozinha, nunca faz a operação falhar.
     */
    it('DESCRICAO preenchida com espaços extras é normalizada (trim)', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        DURACAO_MIN: 60,
        VALOR: 50,
        DESCRICAO: ' Alongamento em gel ',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].descricao).toBe('Alongamento em gel');
      }
    });

    it('DESCRICAO vazia ("") vira null, nunca string vazia nem o NOME', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: 50, DESCRICAO: '' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].descricao).toBeNull();
      }
    });

    it('DESCRICAO ausente vira null, nunca fabricada', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: 50 });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].descricao).toBeNull();
      }
    });

    it('DESCRICAO só com espaços ("   ") também vira null (trim vazio)', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        DURACAO_MIN: 60,
        VALOR: 50,
        DESCRICAO: '   ',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0].descricao).toBeNull();
      }
    });

    it('DESCRICAO ausente/vazia sozinha nunca faz a operação falhar (é opcional, diferente de NOME/STATUS/DURACAO_MIN/VALOR)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DURACAO_MIN: 60, VALOR: 50, DESCRICAO: '' });
      expect(resultado.ok).toBe(true);
    });

    it('CATEGORIA, DATA_CADASTRO, ULTIMA_ATUALIZACAO e TEMPO_INTERVALO_MIN nunca vazam no shape de integração (não fazem parte do contrato público)', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        DURACAO_MIN: 60,
        VALOR: 50,
        CATEGORIA: 'Unhas',
        TEMPO_INTERVALO_MIN: 15,
        DATA_CADASTRO: '2026-01-01T10:00:00.000Z',
        ULTIMA_ATUALIZACAO: '2026-02-01T10:00:00.000Z',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos[0]).toEqual({
          idServico: 'SRV1',
          nome: 'Teste',
          status: 'ATIVO',
          duracaoMinutos: 60,
          valor: 50,
          descricao: null,
        });
      }
    });

    it('IF - Serviço Inválido Na Fonte existe e verifica erro_codigo', () => {
      const node = getNode(workflow, 'IF - Serviço Inválido Na Fonte');
      const cond = (
        node.parameters.conditions as {
          conditions: Array<{ leftValue: string }>;
        }
      ).conditions[0];
      expect(cond.leftValue).toBe('={{ !!$json.erro_codigo }}');
    });
  });

  /**
   * Hardening v1.4 — pedido explícito: ausência de ID_SERVICO só pode ser tratada como
   * "busca vazia" (placeholder legítimo do alwaysOutputData) quando NENHUM outro campo
   * operacional de serviço está presente. Uma linha real com NOME/STATUS/DURACAO_MIN/
   * VALOR preenchidos mas ID_SERVICO vazio é dado corrompido — nunca "nenhum serviço".
   */
  describe('Fase 2 (hardening v1.4) — distinção entre placeholder vazio e linha corrompida', () => {
    function normalizar(
      rows: Record<string, unknown>[],
    ): { ok: true; servicos: Record<string, unknown>[] } | { ok: false; erro_codigo: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return { ok: false, erro_codigo: resultado.erro_codigo as string };
      }
      return { ok: true, servicos: resultado.servicos as Record<string, unknown>[] };
    }

    it('1. objeto realmente vazio ({}) -> sucesso com data: []', () => {
      const resultado = normalizar([{}]);
      expect(resultado).toEqual({ ok: true, servicos: [] });
    });

    it('2. placeholder técnico equivalente do alwaysOutputData (todos os campos undefined) -> sucesso com data: []', () => {
      const resultado = normalizar([
        {
          ID_SERVICO: undefined,
          NOME: undefined,
          STATUS: undefined,
          DURACAO_MIN: undefined,
          VALOR: undefined,
        },
      ]);
      expect(resultado).toEqual({ ok: true, servicos: [] });
    });

    it('3. NOME presente sem ID_SERVICO -> UPSTREAM_ERROR (nunca "nenhum serviço")', () => {
      const resultado = normalizar([{ ID_SERVICO: '', NOME: 'Manicure' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4. STATUS presente sem ID_SERVICO -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_SERVICO: '', STATUS: 'ATIVO' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('5. VALOR presente sem ID_SERVICO -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_SERVICO: null, VALOR: 50 }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('6. DURACAO_MIN presente sem ID_SERVICO -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_SERVICO: '', DURACAO_MIN: 60 }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('DESCRICAO presente sem ID_SERVICO também conta como linha real corrompida -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_SERVICO: '', DESCRICAO: 'Alguma descrição' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('7. linha completa e válida (ID_SERVICO presente) continua funcionando normalmente', () => {
      const resultado = normalizar([
        { ID_SERVICO: 'SRV001', NOME: 'Corte', STATUS: 'ATIVO', DURACAO_MIN: 60, VALOR: 80 },
      ]);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.servicos).toEqual([
          {
            idServico: 'SRV001',
            nome: 'Corte',
            status: 'ATIVO',
            duracaoMinutos: 60,
            valor: 80,
            descricao: null,
          },
        ]);
      }
    });

    it('9. erro de linha corrompida sem ID_SERVICO nunca expõe o dado bruto da linha', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Serviços', {
        json: {},
        items: [{ ID_SERVICO: '', NOME: 'Manicure Secreta', ID_EMPRESA: 'EMP001' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompido-2' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Um ou mais serviços cadastrados possuem dados inválidos.',
        },
        meta: { requestId: 'r-corrompido-2' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('Manicure Secreta');
      expect(textoCompleto).not.toContain('EMP001');
      expect(envelopeErro).not.toHaveProperty('stack');
    });

    it('preserva as validações já existentes: STATUS ATIV (com ID_SERVICO presente) ainda falha', () => {
      const resultado = normalizar([
        { ID_SERVICO: 'SRV1', NOME: 'Teste', STATUS: 'ATIV', DURACAO_MIN: 60, VALOR: 50 },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('preserva as validações já existentes: NOME ausente (com ID_SERVICO presente) ainda falha', () => {
      const resultado = normalizar([
        { ID_SERVICO: 'SRV1', STATUS: 'ATIVO', DURACAO_MIN: 60, VALOR: 50 },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('preserva as validações já existentes: VALOR/DURACAO_MIN inválidos (com ID_SERVICO presente) ainda falham', () => {
      expect(
        normalizar([
          { ID_SERVICO: 'SRV1', NOME: 'T', STATUS: 'ATIVO', DURACAO_MIN: 60, VALOR: 'gratis' },
        ]).ok,
      ).toBe(false);
      expect(
        normalizar([
          { ID_SERVICO: 'SRV1', NOME: 'T', STATUS: 'ATIVO', DURACAO_MIN: 'abc', VALOR: 50 },
        ]).ok,
      ).toBe(false);
    });

    it('preserva a regra de "nenhuma lista parcial": 1 linha corrompida sem ID_SERVICO entre 2 válidas reprova tudo', () => {
      const resultado = normalizar([
        { ID_SERVICO: 'SRV1', NOME: 'Corte', STATUS: 'ATIVO', DURACAO_MIN: 60, VALOR: 80 },
        { ID_SERVICO: '', NOME: 'Corrompido' },
        { ID_SERVICO: 'SRV3', NOME: 'Escova', STATUS: 'ATIVO', DURACAO_MIN: 30, VALOR: 40 },
      ]);
      expect(resultado.ok).toBe(false);
    });
  });

  /**
   * Fase 3 — adiciona `profissionais.listar` sem regredir `clientes.listar`/
   * `servicos.listar`. Schema real PROFISSIONAIS revalidado diretamente em
   * AGE-WF004/COM-WF013/COM-WF014 (únicos workflows existentes que leem essa aba): só
   * ID_EMPRESA, ID_PROFISSIONAL, NOME e STATUS são colunas reais confirmadas — não existe
   * TELEFONE/EMAIL/ESPECIALIDADE na planilha hoje.
   */
  describe('Fase 3 — estrutura do branch de Profissionais', () => {
    it('GS - Buscar Profissionais filtra por ID_EMPRESA e reutiliza a credencial já existente', () => {
      const gs = getNode(workflow, 'GS - Buscar Profissionais');
      const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };

      expect(filtros.values).toEqual([
        { lookupColumn: 'ID_EMPRESA', lookupValue: '={{ $json.idEmpresa }}' },
      ]);
      expect(
        (gs as unknown as { credentials: { googleSheetsOAuth2Api: { id: string } } }).credentials
          .googleSheetsOAuth2Api.id,
      ).toBe('bV94b0kU1RKmLn1F');
    });

    it('IF - Profissional Inválido Na Fonte existe e verifica erro_codigo', () => {
      const node = getNode(workflow, 'IF - Profissional Inválido Na Fonte');
      const cond = (
        node.parameters.conditions as {
          conditions: Array<{ leftValue: string }>;
        }
      ).conditions[0];
      expect(cond.leftValue).toBe('={{ !!$json.erro_codigo }}');
    });

    it('workflow continua active:false e sem credenciais reais (regressão)', () => {
      expect(workflow.active).toBe(false);
      const webhook = getNode(workflow, 'Webhook - Gateway App') as unknown as {
        credentials: { httpHeaderAuth: { id: string } };
      };
      expect(webhook.credentials.httpHeaderAuth.id).toBe('CONFIGURAR_CREDENCIAL_HEADER_AUTH');
    });
  });

  describe('profissionais.listar EMP001 — envelope final conceitual', () => {
    // Linha com as 12 colunas reais confirmadas (correção de schema) — prova que só os 6
    // campos do contrato público saem, mesmo com todas as colunas reais presentes na
    // fonte.
    const LINHA_SHEETS_EMP001 = {
      ID_PROFISSIONAL: 'PROF-HML-001',
      ID_EMPRESA: 'EMP001',
      NOME: 'Ana Martins',
      ESPECIALIDADE: 'Nail Designer',
      TELEFONE: '034999998888',
      EMAIL: 'ana.martins@exemplo.com',
      GOOGLE_CALENDAR_ID: 'calendario-interno-123',
      DURACAO_INTERVALO_MIN: 15,
      STATUS: 'ATIVO',
      DATA_ADMISSAO: '2024-01-10',
      DATA_CADASTRO: '2026-01-01T10:00:00.000Z',
      ULTIMA_ATUALIZACAO: '2026-02-01T10:00:00.000Z',
    };

    it('produz exatamente { ok: true, data: [...EMP001...], meta: { requestId } } — nunca ID_EMPRESA/GOOGLE_CALENDAR_ID/DURACAO_INTERVALO_MIN/datas/headers/webhookUrl/executionMode', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'profissionais.listar', idEmpresa: 'EMP001', requestId: 'teste-prof' },
        },
      });
      expect(validado.erro_codigo).toBe('');

      const normalizado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: [LINHA_SHEETS_EMP001],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      // toEqual (estrito, não toMatchObject) prova ao mesmo tempo o shape correto E a
      // ausência de qualquer campo extra (ID_EMPRESA/GOOGLE_CALENDAR_ID/
      // DURACAO_INTERVALO_MIN/DATA_ADMISSAO/DATA_CADASTRO/ULTIMA_ATUALIZACAO) — se algum
      // vazasse, este toEqual falharia. ESPECIALIDADE/TELEFONE/EMAIL agora SÃO mapeados
      // (correção de schema desta tarefa).
      expect(respostaFinal).toEqual({
        ok: true,
        data: [
          {
            idProfissional: 'PROF-HML-001',
            nome: 'Ana Martins',
            especialidade: 'Nail Designer',
            telefone: '034999998888',
            email: 'ana.martins@exemplo.com',
            status: 'ATIVO',
          },
        ],
        meta: { requestId: 'teste-prof' },
      });
      expect(Array.isArray(respostaFinal)).toBe(false);
      expect(typeof respostaFinal).not.toBe('string');
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
    });

    it('Sheets vazio (placeholder sem ID_PROFISSIONAL) -> sucesso com data: []', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: [{ ID_PROFISSIONAL: undefined }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-vazio-prof' } },
      });
      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({ ok: true, data: [], meta: { requestId: 'r-vazio-prof' } });
    });

    it('erro técnico ao buscar PROFISSIONAIS converge para UPSTREAM_ERROR (mesmo node compartilhado de Clientes/Serviços)', () => {
      const erro = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-prof' } },
      });
      expect(erro.erro_codigo).toBe('UPSTREAM_ERROR');

      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: erro });
      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível consultar os dados no momento.',
        },
        meta: { requestId: 'r-erro-prof' },
      });
    });
  });

  /**
   * Fase 3 (hardening) — mesmo padrão de rigor já validado em Serviços: ID_PROFISSIONAL/
   * NOME/STATUS obrigatórios, STATUS com whitelist explícita (nunca default), e qualquer
   * campo obrigatório inválido em UM profissional real reprova a operação INTEIRA — nunca
   * lista parcial.
   */
  describe('Fase 3 (hardening) — CODE - Normalizar Profissionais: válido vs. falha da operação inteira', () => {
    function normalizarLinhas(
      rows: Record<string, unknown>[],
    ):
      | { ok: true; profissionais: Record<string, unknown>[] }
      | { ok: false; erro_codigo: string; erro_mensagem: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return {
          ok: false,
          erro_codigo: resultado.erro_codigo as string,
          erro_mensagem: resultado.erro_mensagem as string,
        };
      }
      return { ok: true, profissionais: resultado.profissionais as Record<string, unknown>[] };
    }

    function normalizarUmaLinha(row: Record<string, unknown>) {
      return normalizarLinhas([row]);
    }

    const BASE = { ID_PROFISSIONAL: 'PROF1', NOME: 'Teste', STATUS: 'ATIVO' };

    it('profissional totalmente válido é aceito com STATUS ATIVO', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'ATIVO' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0]).toEqual({
          idProfissional: 'PROF1',
          nome: 'Teste',
          especialidade: null,
          telefone: null,
          email: null,
          status: 'ATIVO',
        });
      }
    });

    it('profissional totalmente válido é aceito com STATUS INATIVO', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'INATIVO' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0].status).toBe('INATIVO');
      }
    });

    it('STATUS com trim/case diferente ("  ativo  ") é normalizado para ATIVO', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: '  ativo  ' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0].status).toBe('ATIVO');
      }
    });

    it('STATUS desconhecido ("ATIV") faz a operação falhar — nunca vira ATIVO por default', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'ATIV' });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('STATUS desconhecido ("PENDENTE"/"DESATIVADO") faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, STATUS: 'PENDENTE' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, STATUS: 'DESATIVADO' }).ok).toBe(false);
    });

    it('STATUS vazio/ausente faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, STATUS: '' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, STATUS: undefined }).ok).toBe(false);
    });

    it('NOME vazio/ausente faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, NOME: '' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, NOME: '   ' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, NOME: undefined }).ok).toBe(false);
    });

    /**
     * Correção de schema: ESPECIALIDADE/TELEFONE/EMAIL EXISTEM de fato na aba real (uma
     * premissa anterior desta fase, de que não existiam, estava incompleta). Agora são
     * mapeados — preenchido vira string normalizada/trim; vazio/ausente vira `null`;
     * nunca fabricado nem inferido de outro campo. Os três são opcionais: sozinhos, nunca
     * fazem a operação falhar (diferente de NOME/STATUS). TELEFONE nunca é convertido
     * para número (preserva zero à esquerda/precisão).
     */
    it('ESPECIALIDADE preenchida com espaços extras é normalizada (trim)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ESPECIALIDADE: ' Nail Designer ' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0].especialidade).toBe('Nail Designer');
      }
    });

    it('ESPECIALIDADE vazia/ausente vira null, nunca fabricada ou inferida do NOME', () => {
      expect(normalizarUmaLinha({ ...BASE, ESPECIALIDADE: '' }).ok).toBe(true);
      const r1 = normalizarUmaLinha({ ...BASE, ESPECIALIDADE: '' });
      if (r1.ok) expect(r1.profissionais[0].especialidade).toBeNull();
      const r2 = normalizarUmaLinha({ ...BASE });
      if (r2.ok) expect(r2.profissionais[0].especialidade).toBeNull();
    });

    it('TELEFONE é preservado como string, exatamente como veio (nunca convertido para Number — preserva zero à esquerda)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, TELEFONE: '034999998888' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0].telefone).toBe('034999998888');
        expect(typeof resultado.profissionais[0].telefone).toBe('string');
      }
    });

    it('TELEFONE vazio/ausente vira null, nunca fabricado', () => {
      const r1 = normalizarUmaLinha({ ...BASE, TELEFONE: '' });
      if (r1.ok) expect(r1.profissionais[0].telefone).toBeNull();
      const r2 = normalizarUmaLinha({ ...BASE });
      if (r2.ok) expect(r2.profissionais[0].telefone).toBeNull();
    });

    it('EMAIL preenchido com espaços extras é normalizado (trim)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, EMAIL: ' profissional@teste.com ' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0].email).toBe('profissional@teste.com');
      }
    });

    it('EMAIL vazio/ausente vira null — sozinho, nunca faz a operação falhar', () => {
      const resultado = normalizarUmaLinha({ ...BASE, EMAIL: '' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.profissionais[0].email).toBeNull();
    });

    it('GOOGLE_CALENDAR_ID, DURACAO_INTERVALO_MIN, DATA_ADMISSAO, DATA_CADASTRO e ULTIMA_ATUALIZACAO nunca vazam no shape de integração (não fazem parte do contrato público)', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        ESPECIALIDADE: 'Nail Designer',
        TELEFONE: '034999998888',
        EMAIL: 'ana@teste.com',
        GOOGLE_CALENDAR_ID: 'calendario-interno-999',
        DURACAO_INTERVALO_MIN: 15,
        DATA_ADMISSAO: '2024-01-01',
        DATA_CADASTRO: '2026-01-01T10:00:00.000Z',
        ULTIMA_ATUALIZACAO: '2026-02-01T10:00:00.000Z',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais[0]).toEqual({
          idProfissional: 'PROF1',
          nome: 'Teste',
          especialidade: 'Nail Designer',
          telefone: '034999998888',
          email: 'ana@teste.com',
          status: 'ATIVO',
        });
      }
    });

    it('1 profissional corrompido entre 3 reais faz a operação INTEIRA falhar — nunca devolve os 2 bons e omite o ruim', () => {
      const resultado = normalizarLinhas([
        { ID_PROFISSIONAL: 'PROF1', NOME: 'Ana', STATUS: 'ATIVO' },
        { ID_PROFISSIONAL: 'PROF2', NOME: 'Carla', STATUS: 'ATIV' },
        { ID_PROFISSIONAL: 'PROF3', NOME: 'Julia', STATUS: 'INATIVO' },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('erro de dado corrompido converge para o envelope padrão de erro, sem expor linha/ID_EMPRESA/planilha/stack', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: [{ ...BASE, ID_EMPRESA: 'EMP001', STATUS: 'ATIV' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompido-prof' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Um ou mais profissionais cadastrados possuem dados inválidos.',
        },
        meta: { requestId: 'r-corrompido-prof' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('EMP001');
      expect(textoCompleto).not.toContain('PROF1');
      expect(textoCompleto).not.toContain('BEAUTYFLOW');
      expect(envelopeErro).not.toHaveProperty('stack');
      expect(envelopeErro).not.toHaveProperty('credential');
    });
  });

  /**
   * Fase 3 (hardening, revisado na correção de schema v1.7) — mesma distinção de
   * placeholder x linha corrompida já validada em Serviços (v1.4), adaptada a
   * Profissionais: agora reconhece TODAS as 10 colunas reais além de ID_PROFISSIONAL
   * (NOME/STATUS/ESPECIALIDADE/TELEFONE/EMAIL/GOOGLE_CALENDAR_ID/DURACAO_INTERVALO_MIN/
   * DATA_ADMISSAO/DATA_CADASTRO/ULTIMA_ATUALIZACAO) como "outro campo" — a versão
   * anterior só reconhecia NOME/STATUS, o que classificaria incorretamente uma linha
   * corrompida com só, por exemplo, TELEFONE preenchido como "busca vazia".
   */
  describe('Fase 3 (hardening) — distinção entre placeholder vazio e linha corrompida (Profissionais)', () => {
    function normalizar(
      rows: Record<string, unknown>[],
    ): { ok: true; profissionais: Record<string, unknown>[] } | { ok: false; erro_codigo: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return { ok: false, erro_codigo: resultado.erro_codigo as string };
      }
      return { ok: true, profissionais: resultado.profissionais as Record<string, unknown>[] };
    }

    it('1. objeto realmente vazio ({}) -> sucesso com data: []', () => {
      const resultado = normalizar([{}]);
      expect(resultado).toEqual({ ok: true, profissionais: [] });
    });

    it('2. placeholder técnico equivalente do alwaysOutputData (todos os campos reais undefined) -> sucesso com data: []', () => {
      const resultado = normalizar([
        {
          ID_PROFISSIONAL: undefined,
          NOME: undefined,
          STATUS: undefined,
          ESPECIALIDADE: undefined,
          TELEFONE: undefined,
          EMAIL: undefined,
          GOOGLE_CALENDAR_ID: undefined,
          DURACAO_INTERVALO_MIN: undefined,
          DATA_ADMISSAO: undefined,
          DATA_CADASTRO: undefined,
          ULTIMA_ATUALIZACAO: undefined,
        },
      ]);
      expect(resultado).toEqual({ ok: true, profissionais: [] });
    });

    it('3. NOME presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR (nunca "nenhum profissional")', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', NOME: 'Manicure' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4. STATUS presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: null, STATUS: 'ATIVO' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4b. ESPECIALIDADE presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', ESPECIALIDADE: 'Manicure' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4c. TELEFONE presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', TELEFONE: '034999998888' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4d. EMAIL presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', EMAIL: 'x@teste.com' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4e. GOOGLE_CALENDAR_ID presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', GOOGLE_CALENDAR_ID: 'cal-123' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4f. DURACAO_INTERVALO_MIN presente (mesmo valor 0) sem ID_PROFISSIONAL -> UPSTREAM_ERROR (0 não é "ausente")', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', DURACAO_INTERVALO_MIN: 0 }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4g. DATA_ADMISSAO presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', DATA_ADMISSAO: '2024-01-01' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('5. linha completa e válida (ID_PROFISSIONAL presente) continua funcionando normalmente', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: 'PROF001', NOME: 'Ana', STATUS: 'ATIVO' }]);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.profissionais).toEqual([
          {
            idProfissional: 'PROF001',
            nome: 'Ana',
            especialidade: null,
            telefone: null,
            email: null,
            status: 'ATIVO',
          },
        ]);
      }
    });

    it('6. erro de linha corrompida sem ID_PROFISSIONAL nunca expõe o dado bruto da linha', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Profissionais', {
        json: {},
        items: [{ ID_PROFISSIONAL: '', NOME: 'Cabeleireira Secreta', ID_EMPRESA: 'EMP001' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompido-prof-2' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Um ou mais profissionais cadastrados possuem dados inválidos.',
        },
        meta: { requestId: 'r-corrompido-prof-2' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('Cabeleireira Secreta');
      expect(textoCompleto).not.toContain('EMP001');
      expect(envelopeErro).not.toHaveProperty('stack');
    });

    it('preserva as validações já existentes: STATUS ATIV (com ID_PROFISSIONAL presente) ainda falha', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: 'PROF1', NOME: 'Teste', STATUS: 'ATIV' }]);
      expect(resultado.ok).toBe(false);
    });

    it('preserva as validações já existentes: NOME ausente (com ID_PROFISSIONAL presente) ainda falha', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: 'PROF1', STATUS: 'ATIVO' }]);
      expect(resultado.ok).toBe(false);
    });

    it('preserva a regra de "nenhuma lista parcial": 1 linha corrompida sem ID_PROFISSIONAL entre 2 válidas reprova tudo', () => {
      const resultado = normalizar([
        { ID_PROFISSIONAL: 'PROF1', NOME: 'Ana', STATUS: 'ATIVO' },
        { ID_PROFISSIONAL: '', NOME: 'Corrompido' },
        { ID_PROFISSIONAL: 'PROF3', NOME: 'Julia', STATUS: 'INATIVO' },
      ]);
      expect(resultado.ok).toBe(false);
    });
  });

  /**
   * Camada read-only completa — adiciona `empresa.obter` e `disponibilidades.listar`
   * (Configurações) sem regredir as três operações já existentes.
   */
  describe('Camada read-only completa — reconhecimento das 6 operações', () => {
    it('clientes.listar/servicos.listar/profissionais.listar continuam reconhecidos (regressão)', () => {
      for (const operacao of ['clientes.listar', 'servicos.listar', 'profissionais.listar']) {
        const validado = runCode(workflow, 'CODE - Validar Envelope', {
          json: { body: { operacao, idEmpresa: 'EMP001', requestId: 'r-regressao' } },
        });
        expect(validado.erro_codigo).toBe('');
      }
    });

    it('empresa.obter é reconhecido', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'empresa.obter', idEmpresa: 'EMP001', requestId: 'r1' } },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('disponibilidades.listar é reconhecido', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'disponibilidades.listar', idEmpresa: 'EMP001', requestId: 'r2' },
        },
      });
      expect(validado.erro_codigo).toBe('');
    });

    // Corrigido nesta tarefa (integração da Agenda real): `agendamentos.listar` ERA o
    // exemplo de operação ainda bloqueada aqui — agora é a 6ª operação reconhecida (ver
    // describe "agendamentos.listar EMP001" abaixo); o exemplo de operação desconhecida
    // vira `agenda.criar` (write, fora do escopo desta integração read-only).
    it('uma sétima operação (ex.: agenda.criar) continua INVALID_OPERATION', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'agenda.criar', idEmpresa: 'EMP001', requestId: 'r3' } },
      });
      expect(validado.erro_codigo).toBe('INVALID_OPERATION');
    });

    it('IF - Empresa Inválida Na Fonte e IF - Disponibilidade Inválida Na Fonte existem e verificam erro_codigo', () => {
      for (const nome of [
        'IF - Empresa Inválida Na Fonte',
        'IF - Disponibilidade Inválida Na Fonte',
      ]) {
        const node = getNode(workflow, nome);
        const cond = (node.parameters.conditions as { conditions: Array<{ leftValue: string }> })
          .conditions[0];
        expect(cond.leftValue).toBe('={{ !!$json.erro_codigo }}');
      }
    });

    it('GS - Buscar Empresa e GS - Buscar Disponibilidades filtram por ID_EMPRESA e reutilizam a credencial já existente', () => {
      for (const nome of ['GS - Buscar Empresa', 'GS - Buscar Disponibilidades']) {
        const gs = getNode(workflow, nome);
        const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };
        expect(filtros.values).toEqual([
          { lookupColumn: 'ID_EMPRESA', lookupValue: '={{ $json.idEmpresa }}' },
        ]);
        expect(
          (gs as unknown as { credentials: { googleSheetsOAuth2Api: { id: string } } }).credentials
            .googleSheetsOAuth2Api.id,
        ).toBe('bV94b0kU1RKmLn1F');
      }
    });

    it('workflow continua active:false e sem credenciais reais (regressão)', () => {
      expect(workflow.active).toBe(false);
      const webhook = getNode(workflow, 'Webhook - Gateway App') as unknown as {
        credentials: { httpHeaderAuth: { id: string } };
      };
      expect(webhook.credentials.httpHeaderAuth.id).toBe('CONFIGURAR_CREDENCIAL_HEADER_AUTH');
    });
  });

  describe('empresa.obter EMP001 — envelope final conceitual (operação singular)', () => {
    // Linha com as 18 colunas reais confirmadas (correção de schema) — prova que só os 6
    // campos do contrato público saem, mesmo com todas as colunas reais presentes na
    // fonte.
    const LINHA_SHEETS_EMP001 = {
      ID_EMPRESA: 'EMP001',
      NOME: 'Studio Bella',
      CNPJ: '12.345.678/0001-90',
      TELEFONE: '5534999999999',
      EMAIL: 'contato@studiobella.com.br',
      ENDERECO: 'Rua das Flores, 123',
      CIDADE: 'Uberlândia',
      UF: 'MG',
      CEP: '38400-000',
      TIMEZONE: 'America/Sao_Paulo',
      HORARIO_FUNCIONAMENTO: '09:00-18:00',
      TEMPO_CANCELAMENTO_MIN: 120,
      WHATSAPP_PHONE_NUMBER_ID: '109876543210001',
      WHATSAPP_WABA_ID: 'waba-interno-999',
      GOOGLE_CALENDAR_ID: 'calendario-interno-empresa-123',
      STATUS: 'ATIVO',
      DATA_CADASTRO: '2024-01-01T10:00:00.000Z',
      ULTIMA_ATUALIZACAO: '2026-01-01T10:00:00.000Z',
    };

    it('produz exatamente { ok: true, data: {...} } — data é o OBJETO direto, nunca um array — e nunca ID_EMPRESA/CNPJ/ENDERECO/WHATSAPP_PHONE_NUMBER_ID/WHATSAPP_WABA_ID/GOOGLE_CALENDAR_ID/STATUS/datas/headers/webhookUrl', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'empresa.obter', idEmpresa: 'EMP001', requestId: 'teste-empresa' },
        },
      });
      expect(validado.erro_codigo).toBe('');

      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [LINHA_SHEETS_EMP001],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      // toEqual (estrito, não toMatchObject) prova ao mesmo tempo o shape correto E a
      // ausência de qualquer campo extra das 18 colunas reais — se algum vazasse, isto
      // falharia.
      expect(respostaFinal).toEqual({
        ok: true,
        data: {
          nome: 'Studio Bella',
          telefone: '5534999999999',
          email: 'contato@studiobella.com.br',
          timezone: 'America/Sao_Paulo',
          tempoCancelamentoMinutos: 120,
          whatsappConfigurado: true,
        },
        meta: { requestId: 'teste-empresa' },
      });
      expect(Array.isArray(respostaFinal.data)).toBe(false);
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
      const textoCompleto = JSON.stringify(respostaFinal);
      expect(textoCompleto).not.toContain('109876543210001');
      expect(textoCompleto).not.toContain('waba-interno-999');
      expect(textoCompleto).not.toContain('calendario-interno-empresa-123');
      expect(textoCompleto).not.toContain('12.345.678/0001-90');
      expect(textoCompleto).not.toContain('Rua das Flores');
    });

    it('NOME preenchido com espaços extras é normalizado (trim)', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, NOME: ' Studio Bella ' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-nome-trim' } },
      });
      expect((normalizado.empresa as Record<string, unknown>).nome).toBe('Studio Bella');
    });

    it('NOME vazio/ausente vira "" (mesmo tipo não-nulo do contrato), nunca fabricado', () => {
      const vazio = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, NOME: '' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-nome-vazio' } },
      });
      expect((vazio.empresa as Record<string, unknown>).nome).toBe('');

      const ausente = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, NOME: undefined }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-nome-ausente' } },
      });
      expect((ausente.empresa as Record<string, unknown>).nome).toBe('');
    });

    it('TELEFONE é preservado como string, exatamente como veio (nunca convertido para Number)', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, TELEFONE: ' 034999999999 ' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-telefone' } },
      });
      const telefone = (normalizado.empresa as Record<string, unknown>).telefone;
      expect(telefone).toBe('034999999999');
      expect(typeof telefone).toBe('string');
    });

    it('TELEFONE vazio/ausente vira null, nunca fabricado', () => {
      const vazio = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, TELEFONE: '' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-tel-vazio' } },
      });
      expect((vazio.empresa as Record<string, unknown>).telefone).toBeNull();
    });

    it('EMAIL preenchido com espaços extras é normalizado (trim)', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, EMAIL: ' contato@studio.com ' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-email-trim' } },
      });
      expect((normalizado.empresa as Record<string, unknown>).email).toBe('contato@studio.com');
    });

    it('EMAIL vazio/ausente vira null, nunca fabricado', () => {
      const vazio = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, EMAIL: '' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-email-vazio' } },
      });
      expect((vazio.empresa as Record<string, unknown>).email).toBeNull();
    });

    it('whatsappConfigurado é false quando WHATSAPP_PHONE_NUMBER_ID está vazio/ausente', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ...LINHA_SHEETS_EMP001, WHATSAPP_PHONE_NUMBER_ID: '' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-sem-whatsapp' } },
      });
      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect((respostaFinal.data as Record<string, unknown>).whatsappConfigurado).toBe(false);
    });

    it('linha corrompida: CNPJ/ENDERECO/STATUS/GOOGLE_CALENDAR_ID presentes sem ID_EMPRESA -> UPSTREAM_ERROR (nunca objeto parcial)', () => {
      const casos = [
        { CNPJ: '12.345.678/0001-90' },
        { ENDERECO: 'Rua X, 123' },
        { STATUS: 'ATIVO' },
        { GOOGLE_CALENDAR_ID: 'cal-x' },
        { WHATSAPP_WABA_ID: 'waba-x' },
        { DATA_CADASTRO: '2024-01-01' },
      ];
      for (const campoExtra of casos) {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [{ ID_EMPRESA: undefined, ...campoExtra }],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompida' } },
        });
        expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
      }
    });

    it('Sheets vazio (nenhuma linha real para o idEmpresa) -> UPSTREAM_ERROR, nunca "sucesso vazio" (operação singular)', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ID_EMPRESA: undefined }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-vazio-empresa' } },
      });

      expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    /**
     * Hardening de duplicidade (último ajuste antes da homologação): o filtro
     * `ID_EMPRESA` do node Sheets deveria garantir no máximo 1 linha real por chamada,
     * mas `CODE - Normalizar Empresa` nunca confia cegamente nisso. Se 2+ linhas reais
     * vierem para a mesma chamada, a operação INTEIRA falha — nunca escolhe a
     * primeira/última silenciosamente, nunca mescla dados de duas linhas.
     */
    describe('hardening de duplicidade — 2+ linhas reais para o mesmo ID_EMPRESA', () => {
      const LINHA_VALIDA = {
        ID_EMPRESA: 'EMP001',
        NOME: 'Studio Bella',
        TIMEZONE: 'America/Sao_Paulo',
        TEMPO_CANCELAMENTO_MIN: 120,
        WHATSAPP_PHONE_NUMBER_ID: '109876543210001',
      };

      it('1. nenhuma empresa real -> erro controlado (UPSTREAM_ERROR)', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [{}],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-0' } },
        });
        expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
      });

      it('2. exatamente uma empresa real -> sucesso', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [LINHA_VALIDA],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-1' } },
        });
        expect(normalizado).not.toHaveProperty('erro_codigo');
        expect((normalizado.empresa as Record<string, unknown>).nome).toBe('Studio Bella');
      });

      it('3. duas linhas reais para o mesmo ID_EMPRESA -> UPSTREAM_ERROR (nunca escolhe uma, nunca mescla)', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [LINHA_VALIDA, { ...LINHA_VALIDA, NOME: 'Studio Bella (duplicata)' }],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-2' } },
        });
        expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
        expect(normalizado).not.toHaveProperty('empresa');
      });

      it('4. três linhas reais para o mesmo ID_EMPRESA -> UPSTREAM_ERROR', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [LINHA_VALIDA, LINHA_VALIDA, LINHA_VALIDA],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-3' } },
        });
        expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
      });

      it('5. placeholder do alwaysOutputData + uma linha real -> sucesso com a linha real (placeholder nunca conta como duplicidade)', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [{}, LINHA_VALIDA],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-placeholder' } },
        });
        expect(normalizado).not.toHaveProperty('erro_codigo');
        expect((normalizado.empresa as Record<string, unknown>).nome).toBe('Studio Bella');
      });

      it('6. duplicidade não vaza ID_EMPRESA/nome/telefone/WHATSAPP_PHONE_NUMBER_ID nem no envelope de erro', () => {
        const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
          json: {},
          items: [LINHA_VALIDA, { ...LINHA_VALIDA, NOME: 'Studio Bella (duplicata)' }],
          nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-dup-segredo' } },
        });
        const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

        expect(envelopeErro).toEqual({
          ok: false,
          error: {
            code: 'UPSTREAM_ERROR',
            message: 'Não foi possível carregar as configurações da empresa.',
          },
          meta: { requestId: 'r-dup-segredo' },
        });
        const textoCompleto = JSON.stringify(envelopeErro);
        expect(textoCompleto).not.toContain('EMP001');
        expect(textoCompleto).not.toContain('Studio Bella');
        expect(textoCompleto).not.toContain('109876543210001');
        expect(envelopeErro).not.toHaveProperty('stack');
        expect(envelopeErro).not.toHaveProperty('credential');
      });
    });

    it('TIMEZONE ausente/vazio faz a operação falhar (campo essencial)', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ID_EMPRESA: 'EMP001', TEMPO_CANCELAMENTO_MIN: 60 }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-sem-tz' } },
      });
      expect(normalizado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('TEMPO_CANCELAMENTO_MIN inválido (texto não numérico ou negativo) faz a operação falhar', () => {
      const invalido1 = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [
          { ID_EMPRESA: 'EMP001', TIMEZONE: 'America/Sao_Paulo', TEMPO_CANCELAMENTO_MIN: 'abc' },
        ],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-tc-invalido' } },
      });
      expect(invalido1.erro_codigo).toBe('UPSTREAM_ERROR');

      const invalido2 = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [
          { ID_EMPRESA: 'EMP001', TIMEZONE: 'America/Sao_Paulo', TEMPO_CANCELAMENTO_MIN: -10 },
        ],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-tc-negativo' } },
      });
      expect(invalido2.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('erro de empresa inválida converge para o envelope padrão de erro, sem expor ID_EMPRESA/planilha/stack', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Empresa', {
        json: {},
        items: [{ ID_EMPRESA: 'EMP001' }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-empresa' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível carregar as configurações da empresa.',
        },
        meta: { requestId: 'r-erro-empresa' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('EMP001');
      expect(envelopeErro).not.toHaveProperty('stack');
    });

    it('erro técnico ao buscar EMPRESAS converge para UPSTREAM_ERROR (mesmo node compartilhado das demais operações)', () => {
      const erro = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-tecnico-empresa' } },
      });
      expect(erro.erro_codigo).toBe('UPSTREAM_ERROR');

      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: erro });
      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível consultar os dados no momento.',
        },
        meta: { requestId: 'r-erro-tecnico-empresa' },
      });
    });
  });

  describe('disponibilidades.listar EMP001 — envelope final conceitual', () => {
    // Linha com as 10 colunas reais confirmadas (correção de schema) — prova que
    // ID_DISPONIBILIDADE e DIA_SEMANA (texto) nunca vazam, mesmo presentes na fonte.
    const LINHA_ABERTA = {
      ID_DISPONIBILIDADE: 'DISP001',
      ID_PROFISSIONAL: 'PROF001',
      ID_EMPRESA: 'EMP001',
      DIA_SEMANA_NUM: 1,
      DIA_SEMANA: 'SEGUNDA',
      ATIVO: 'SIM',
      HORA_INICIO: '09:00',
      HORA_FIM: '18:00',
      INTERVALO_INICIO: '12:00',
      INTERVALO_FIM: '13:00',
    };

    it('produz exatamente { ok: true, data: [...] } — nunca ID_EMPRESA/ID_DISPONIBILIDADE/DIA_SEMANA/headers/webhookUrl/executionMode', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'disponibilidades.listar',
            idEmpresa: 'EMP001',
            requestId: 'teste-disp',
          },
        },
      });
      expect(validado.erro_codigo).toBe('');

      const normalizado = runCode(workflow, 'CODE - Normalizar Disponibilidades', {
        json: {},
        items: [LINHA_ABERTA],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({
        ok: true,
        data: [
          {
            idProfissional: 'PROF001',
            diaSemanaNum: 1,
            aberto: true,
            horaInicio: '09:00',
            horaFim: '18:00',
            intervaloInicio: '12:00',
            intervaloFim: '13:00',
          },
        ],
        meta: { requestId: 'teste-disp' },
      });
      expect(Array.isArray(respostaFinal.data)).toBe(true);
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
      const textoCompleto = JSON.stringify(respostaFinal);
      expect(textoCompleto).not.toContain('DISP001');
      expect(textoCompleto).not.toContain('SEGUNDA');
    });

    it('Sheets vazio (placeholder sem ID_PROFISSIONAL) -> sucesso com data: []', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Disponibilidades', {
        json: {},
        items: [{ ID_PROFISSIONAL: undefined }],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-vazio-disp' } },
      });
      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({ ok: true, data: [], meta: { requestId: 'r-vazio-disp' } });
    });

    it('erro técnico ao buscar DISPONIBILIDADES converge para UPSTREAM_ERROR (mesmo node compartilhado das demais operações)', () => {
      const erro = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-disp' } },
      });
      expect(erro.erro_codigo).toBe('UPSTREAM_ERROR');

      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: erro });
      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível consultar os dados no momento.',
        },
        meta: { requestId: 'r-erro-disp' },
      });
    });
  });

  /**
   * Hardening de Disponibilidades — mesmo padrão de rigor já validado em
   * Serviços/Profissionais: ID_PROFISSIONAL/DIA_SEMANA_NUM/ATIVO obrigatórios,
   * HORA_INICIO/HORA_FIM obrigatórios quando ATIVO='SIM', e qualquer campo obrigatório
   * inválido em UMA disponibilidade real reprova a operação INTEIRA — nunca lista
   * parcial.
   */
  describe('Camada read-only — CODE - Normalizar Disponibilidades: válido vs. falha da operação inteira', () => {
    function normalizarLinhas(
      rows: Record<string, unknown>[],
    ):
      | { ok: true; disponibilidades: Record<string, unknown>[] }
      | { ok: false; erro_codigo: string; erro_mensagem: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Disponibilidades', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return {
          ok: false,
          erro_codigo: resultado.erro_codigo as string,
          erro_mensagem: resultado.erro_mensagem as string,
        };
      }
      return {
        ok: true,
        disponibilidades: resultado.disponibilidades as Record<string, unknown>[],
      };
    }

    function normalizarUmaLinha(row: Record<string, unknown>) {
      return normalizarLinhas([row]);
    }

    const BASE = {
      ID_PROFISSIONAL: 'PROF1',
      DIA_SEMANA_NUM: 1,
      ATIVO: 'SIM',
      HORA_INICIO: '09:00',
      HORA_FIM: '18:00',
    };

    it('dia aberto totalmente válido é aceito', () => {
      const resultado = normalizarUmaLinha(BASE);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.disponibilidades[0]).toEqual({
          idProfissional: 'PROF1',
          diaSemanaNum: 1,
          aberto: true,
          horaInicio: '09:00',
          horaFim: '18:00',
          intervaloInicio: null,
          intervaloFim: null,
        });
      }
    });

    it('dia fechado (ATIVO=NAO) é aceito mesmo sem HORA_INICIO/HORA_FIM', () => {
      const resultado = normalizarUmaLinha({
        ID_PROFISSIONAL: 'PROF1',
        DIA_SEMANA_NUM: 0,
        ATIVO: 'NAO',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.disponibilidades[0].aberto).toBe(false);
        expect(resultado.disponibilidades[0].horaInicio).toBeNull();
        expect(resultado.disponibilidades[0].horaFim).toBeNull();
      }
    });

    it('ATIVO com trim/case diferente ("  sim  ") é normalizado para aberto=true', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ATIVO: '  sim  ' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.disponibilidades[0].aberto).toBe(true);
    });

    it('ATIVO desconhecido ("SIMM"/"ATIVO") faz a operação falhar — nunca vira SIM ou NAO por default', () => {
      expect(normalizarUmaLinha({ ...BASE, ATIVO: 'SIMM' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, ATIVO: 'ATIVO' }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, ATIVO: '' }).ok).toBe(false);
    });

    it('DIA_SEMANA_NUM fora de 0-6 faz a operação falhar', () => {
      expect(normalizarUmaLinha({ ...BASE, DIA_SEMANA_NUM: 7 }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, DIA_SEMANA_NUM: -1 }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, DIA_SEMANA_NUM: 'segunda' }).ok).toBe(false);
    });

    it('DIA_SEMANA_NUM=0 (domingo) é válido — 0 nunca é confundido com ausência', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DIA_SEMANA_NUM: 0 });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.disponibilidades[0].diaSemanaNum).toBe(0);
    });

    it('dia aberto (ATIVO=SIM) sem HORA_INICIO ou HORA_FIM faz a operação falhar', () => {
      expect(
        normalizarUmaLinha({ ID_PROFISSIONAL: 'PROF1', DIA_SEMANA_NUM: 1, ATIVO: 'SIM' }).ok,
      ).toBe(false);
      expect(
        normalizarUmaLinha({
          ID_PROFISSIONAL: 'PROF1',
          DIA_SEMANA_NUM: 1,
          ATIVO: 'SIM',
          HORA_INICIO: '09:00',
        }).ok,
      ).toBe(false);
    });

    it('INTERVALO_INICIO/INTERVALO_FIM são opcionais mesmo com o dia aberto', () => {
      const resultado = normalizarUmaLinha(BASE);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.disponibilidades[0].intervaloInicio).toBeNull();
        expect(resultado.disponibilidades[0].intervaloFim).toBeNull();
      }
    });

    it('1 disponibilidade corrompida entre 3 reais faz a operação INTEIRA falhar — nunca devolve as 2 boas e omite a ruim', () => {
      const resultado = normalizarLinhas([
        { ...BASE, ID_PROFISSIONAL: 'PROF1' },
        {
          ID_PROFISSIONAL: 'PROF2',
          DIA_SEMANA_NUM: 8,
          ATIVO: 'SIM',
          HORA_INICIO: '09:00',
          HORA_FIM: '18:00',
        },
        { ...BASE, ID_PROFISSIONAL: 'PROF3' },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('erro de dado corrompido converge para o envelope padrão de erro, sem expor linha/ID_EMPRESA/planilha/stack', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Disponibilidades', {
        json: {},
        items: [
          { ID_PROFISSIONAL: 'PROF1', ID_EMPRESA: 'EMP001', DIA_SEMANA_NUM: 99, ATIVO: 'SIM' },
        ],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-corrompido-disp' } },
      });
      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: normalizado });

      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Uma ou mais disponibilidades cadastradas possuem dados inválidos.',
        },
        meta: { requestId: 'r-corrompido-disp' },
      });
      const textoCompleto = JSON.stringify(envelopeErro);
      expect(textoCompleto).not.toContain('EMP001');
      expect(envelopeErro).not.toHaveProperty('stack');
    });
  });

  /**
   * Placeholder x linha corrompida (Disponibilidades, revisado na correção de schema —
   * 10 colunas reais confirmadas) — mesma distinção já validada em Serviços/
   * Profissionais: ID_DISPONIBILIDADE/DIA_SEMANA_NUM/DIA_SEMANA/ATIVO/HORA_INICIO/
   * HORA_FIM/INTERVALO_INICIO/INTERVALO_FIM são os "outros campos" possíveis — a versão
   * anterior só reconhecia 6 deles (sem ID_DISPONIBILIDADE/DIA_SEMANA), o que
   * classificaria incorretamente uma linha corrompida com só, por exemplo,
   * ID_DISPONIBILIDADE preenchido como "busca vazia".
   */
  describe('Camada read-only — distinção entre placeholder vazio e linha corrompida (Disponibilidades)', () => {
    function normalizar(
      rows: Record<string, unknown>[],
    ):
      | { ok: true; disponibilidades: Record<string, unknown>[] }
      | { ok: false; erro_codigo: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Disponibilidades', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r' } },
      });
      if ('erro_codigo' in resultado) {
        return { ok: false, erro_codigo: resultado.erro_codigo as string };
      }
      return {
        ok: true,
        disponibilidades: resultado.disponibilidades as Record<string, unknown>[],
      };
    }

    it('1. objeto realmente vazio ({}) -> sucesso com data: []', () => {
      const resultado = normalizar([{}]);
      expect(resultado).toEqual({ ok: true, disponibilidades: [] });
    });

    it('2. placeholder técnico equivalente do alwaysOutputData (todas as 9 colunas reais além de ID_PROFISSIONAL undefined) -> sucesso com data: []', () => {
      const resultado = normalizar([
        {
          ID_PROFISSIONAL: undefined,
          ID_DISPONIBILIDADE: undefined,
          DIA_SEMANA_NUM: undefined,
          DIA_SEMANA: undefined,
          ATIVO: undefined,
          HORA_INICIO: undefined,
          HORA_FIM: undefined,
          INTERVALO_INICIO: undefined,
          INTERVALO_FIM: undefined,
        },
      ]);
      expect(resultado).toEqual({ ok: true, disponibilidades: [] });
    });

    it('3. DIA_SEMANA_NUM presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR (nunca "nenhuma disponibilidade")', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', DIA_SEMANA_NUM: 1 }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('3b. ID_DISPONIBILIDADE presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', ID_DISPONIBILIDADE: 'DISP001' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('3c. DIA_SEMANA (texto) presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: null, DIA_SEMANA: 'TERCA' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('4. ATIVO presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: null, ATIVO: 'SIM' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('5. HORA_INICIO presente sem ID_PROFISSIONAL -> UPSTREAM_ERROR', () => {
      const resultado = normalizar([{ ID_PROFISSIONAL: '', HORA_INICIO: '09:00' }]);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('6. linha completa e válida (ID_PROFISSIONAL presente) continua funcionando normalmente', () => {
      const resultado = normalizar([
        {
          ID_PROFISSIONAL: 'PROF001',
          DIA_SEMANA_NUM: 1,
          ATIVO: 'SIM',
          HORA_INICIO: '09:00',
          HORA_FIM: '18:00',
        },
      ]);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.disponibilidades).toEqual([
          {
            idProfissional: 'PROF001',
            diaSemanaNum: 1,
            aberto: true,
            horaInicio: '09:00',
            horaFim: '18:00',
            intervaloInicio: null,
            intervaloFim: null,
          },
        ]);
      }
    });

    it('preserva a regra de "nenhuma lista parcial": 1 linha corrompida sem ID_PROFISSIONAL entre 2 válidas reprova tudo', () => {
      const resultado = normalizar([
        {
          ID_PROFISSIONAL: 'PROF1',
          DIA_SEMANA_NUM: 1,
          ATIVO: 'SIM',
          HORA_INICIO: '09:00',
          HORA_FIM: '18:00',
        },
        { ID_PROFISSIONAL: '', DIA_SEMANA_NUM: 2 },
        { ID_PROFISSIONAL: 'PROF3', DIA_SEMANA_NUM: 3, ATIVO: 'NAO' },
      ]);
      expect(resultado.ok).toBe(false);
    });
  });

  describe('agendamentos.listar EMP001 — envelope final conceitual', () => {
    const DADOS_PERIODO = { dataInicio: '2026-09-01', dataFim: '2026-09-30' };

    // Linha com as 17 colunas reais confirmadas — prova que ID_EMPRESA e as colunas
    // técnicas (DURACAO_MIN/ORIGEM/OBSERVACOES/GOOGLE_EVENT_ID/DATA_CRIACAO/
    // ULTIMA_ATUALIZACAO/DATA_CANCELAMENTO/MOTIVO_CANCELAMENTO) nunca vazam, mesmo
    // presentes na fonte.
    const LINHA_AGENDADA = {
      ID_AGENDAMENTO: 'AGD001',
      ID_EMPRESA: 'EMP001',
      ID_CLIENTE: 'CLI001',
      ID_PROFISSIONAL: 'PROF001',
      ID_SERVICO: 'SRV001',
      DATA: '2026-09-02',
      HORA_INICIO: '09:00',
      HORA_FIM: '10:00',
      DURACAO_MIN: 60,
      VALOR: 120,
      STATUS: 'AGENDADO',
      ORIGEM: 'whatsapp',
      OBSERVACOES: 'Cliente pediu horário pela manhã.',
      GOOGLE_EVENT_ID: 'gcal-evt-123',
      DATA_CRIACAO: '2026-08-20T10:00:00.000Z',
      ULTIMA_ATUALIZACAO: '2026-08-20T10:00:00.000Z',
      DATA_CANCELAMENTO: '',
      MOTIVO_CANCELAMENTO: '',
    };

    it('produz exatamente { ok: true, data: [...] } — nunca ID_EMPRESA/DURACAO_MIN/ORIGEM/OBSERVACOES/GOOGLE_EVENT_ID/datas técnicas/headers/webhookUrl/executionMode', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agendamentos.listar',
            idEmpresa: 'EMP001',
            requestId: 'teste-age',
            dados: DADOS_PERIODO,
          },
        },
      });
      expect(validado.erro_codigo).toBe('');

      const normalizado = runCode(workflow, 'CODE - Normalizar Agendamentos', {
        json: {},
        items: [LINHA_AGENDADA],
        nodeOutputs: { 'CODE - Validar Envelope': validado },
      });

      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({
        ok: true,
        data: [
          {
            idAgendamento: 'AGD001',
            idCliente: 'CLI001',
            idProfissional: 'PROF001',
            idServico: 'SRV001',
            data: '2026-09-02',
            horaInicio: '09:00',
            horaFim: '10:00',
            valor: 120,
            status: 'AGENDADO',
          },
        ],
        meta: { requestId: 'teste-age' },
      });
      expect(Array.isArray(respostaFinal.data)).toBe(true);
      expect(respostaFinal).not.toHaveProperty('ID_EMPRESA');
      expect(respostaFinal).not.toHaveProperty('headers');
      expect(respostaFinal).not.toHaveProperty('webhookUrl');
      expect(respostaFinal).not.toHaveProperty('executionMode');
      const textoCompleto = JSON.stringify(respostaFinal);
      expect(textoCompleto).not.toContain('EMP001');
      expect(textoCompleto).not.toContain('gcal-evt-123');
      expect(textoCompleto).not.toContain('whatsapp');
      expect(textoCompleto).not.toContain('Cliente pediu');
    });

    it('Sheets vazio (placeholder sem ID_AGENDAMENTO) -> sucesso com data: []', () => {
      const normalizado = runCode(workflow, 'CODE - Normalizar Agendamentos', {
        json: {},
        items: [{ ID_AGENDAMENTO: undefined }],
        nodeOutputs: {
          'CODE - Validar Envelope': { requestId: 'r-vazio-age', dados: DADOS_PERIODO },
        },
      });
      const respostaFinal = runCode(workflow, 'CODE - Montar Sucesso', { json: normalizado });

      expect(respostaFinal).toEqual({ ok: true, data: [], meta: { requestId: 'r-vazio-age' } });
    });

    it('erro técnico ao buscar AGENDAMENTOS converge para UPSTREAM_ERROR (mesmo node compartilhado das demais operações)', () => {
      const erro = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-erro-age' } },
      });
      expect(erro.erro_codigo).toBe('UPSTREAM_ERROR');

      const envelopeErro = runCode(workflow, 'CODE - Montar Erro', { json: erro });
      expect(envelopeErro).toEqual({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'Não foi possível consultar os dados no momento.',
        },
        meta: { requestId: 'r-erro-age' },
      });
    });

    it('GS - Buscar Agendamentos filtra por ID_EMPRESA e reutiliza a credencial já existente (período fica a cargo do Code node)', () => {
      const gs = getNode(workflow, 'GS - Buscar Agendamentos');
      const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };

      expect(filtros.values).toEqual([
        { lookupColumn: 'ID_EMPRESA', lookupValue: '={{ $json.idEmpresa }}' },
      ]);
      expect(
        (gs as unknown as { credentials: { googleSheetsOAuth2Api: { id: string } } }).credentials
          .googleSheetsOAuth2Api.id,
      ).toBe('bV94b0kU1RKmLn1F');
    });
  });

  /**
   * Hardening de Agendamentos — mesmo padrão de rigor já validado em Serviços/
   * Profissionais/Disponibilidades: ID_AGENDAMENTO/ID_CLIENTE/ID_PROFISSIONAL/
   * ID_SERVICO/DATA/HORA_INICIO/HORA_FIM/VALOR/STATUS obrigatórios, STATUS restrito à
   * whitelist real (AGENDADO/CONCLUIDO/CANCELADO — nunca PENDENTE/CONFIRMADO) — a
   * homologação contra BEAUTYFLOW_HOMOLOGACAO encontrou uma linha real
   * (AGE_TESTE_WF015_04) com STATUS=CONCLUIDO, corrigindo a premissa anterior de que só
   * AGENDADO/CANCELADO existiam — e qualquer campo obrigatório inválido em UM
   * agendamento real reprova a operação INTEIRA — nunca lista parcial. Cobre também o
   * corte por período (dataInicio/dataFim) e a validação defensiva de presença/formato
   * desses dois parâmetros.
   */
  describe('Camada read-only — CODE - Normalizar Agendamentos: válido vs. falha da operação inteira', () => {
    function normalizarLinhas(
      rows: Record<string, unknown>[],
      dados: Record<string, unknown> = { dataInicio: '2026-01-01', dataFim: '2026-12-31' },
    ):
      | { ok: true; agendamentos: Record<string, unknown>[] }
      | { ok: false; erro_codigo: string; erro_mensagem: string } {
      const resultado = runCode(workflow, 'CODE - Normalizar Agendamentos', {
        json: {},
        items: rows,
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r', dados } },
      });
      if ('erro_codigo' in resultado) {
        return {
          ok: false,
          erro_codigo: resultado.erro_codigo as string,
          erro_mensagem: resultado.erro_mensagem as string,
        };
      }
      return { ok: true, agendamentos: resultado.agendamentos as Record<string, unknown>[] };
    }

    function normalizarUmaLinha(row: Record<string, unknown>) {
      return normalizarLinhas([row]);
    }

    const BASE = {
      ID_AGENDAMENTO: 'AGD1',
      ID_CLIENTE: 'CLI1',
      ID_PROFISSIONAL: 'PROF1',
      ID_SERVICO: 'SRV1',
      DATA: '2026-06-15',
      HORA_INICIO: '09:00',
      HORA_FIM: '10:00',
      VALOR: 100,
      STATUS: 'AGENDADO',
    };

    it('1. operação agendamentos.listar aceita (regressão do teste de reconhecimento)', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agendamentos.listar',
            idEmpresa: 'EMP001',
            requestId: 'r1',
            dados: { dataInicio: '2026-01-01', dataFim: '2026-12-31' },
          },
        },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('2. operação desconhecida continua INVALID_OPERATION', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'agenda.criar', idEmpresa: 'EMP001', requestId: 'r2' } },
      });
      expect(validado.erro_codigo).toBe('INVALID_OPERATION');
    });

    it('3. request sem tenant continua TENANT_REQUIRED', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agendamentos.listar',
            requestId: 'r3',
            dados: { dataInicio: '2026-01-01', dataFim: '2026-12-31' },
          },
        },
      });
      expect(validado.erro_codigo).toBe('TENANT_REQUIRED');
    });

    it('4. GS - Buscar Agendamentos tem o filtro ID_EMPRESA presente (regressão)', () => {
      const gs = getNode(workflow, 'GS - Buscar Agendamentos');
      const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };
      expect(filtros.values.some((f) => f.lookupColumn === 'ID_EMPRESA')).toBe(true);
    });

    it('5. período é respeitado: linha real válida fora de dataInicio/dataFim é excluída do resultado (sem falhar a operação)', () => {
      const resultado = normalizarLinhas([{ ...BASE, DATA: '2026-01-01' }], {
        dataInicio: '2026-06-01',
        dataFim: '2026-06-30',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.agendamentos).toEqual([]);
    });

    it('5b. período é respeitado: linha dentro do intervalo [dataInicio, dataFim] é incluída (limites inclusivos)', () => {
      const resultado = normalizarLinhas(
        [
          { ...BASE, ID_AGENDAMENTO: 'AGD-INI', DATA: '2026-06-01' },
          { ...BASE, ID_AGENDAMENTO: 'AGD-FIM', DATA: '2026-06-30' },
        ],
        { dataInicio: '2026-06-01', dataFim: '2026-06-30' },
      );
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.agendamentos.map((a) => a.idAgendamento)).toEqual(['AGD-INI', 'AGD-FIM']);
      }
    });

    it('6. 0 linhas (placeholder legítimo) = sucesso []', () => {
      const resultado = normalizarLinhas([{ ID_AGENDAMENTO: undefined }]);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.agendamentos).toEqual([]);
    });

    it('7. uma linha AGENDADO válida é aceita e mapeada corretamente', () => {
      const resultado = normalizarUmaLinha(BASE);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.agendamentos).toEqual([
          {
            idAgendamento: 'AGD1',
            idCliente: 'CLI1',
            idProfissional: 'PROF1',
            idServico: 'SRV1',
            data: '2026-06-15',
            horaInicio: '09:00',
            horaFim: '10:00',
            valor: 100,
            status: 'AGENDADO',
          },
        ]);
      }
    });

    it('8. uma linha CANCELADO válida é aceita', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'CANCELADO' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.agendamentos[0].status).toBe('CANCELADO');
    });

    it('9. STATUS CONFIRMADO -> UPSTREAM_ERROR (fonte real não sustenta esse valor)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'CONFIRMADO' });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    // Corrigido na homologação (achado real: AGE_TESTE_WF015_04, STATUS=CONCLUIDO em
    // BEAUTYFLOW_HOMOLOGACAO) — CONCLUIDO agora é aceito, com o mesmo mapeamento de
    // statusConfirmacao:null dos demais status (nunca inferido por qualquer heurística).
    it('10. uma linha CONCLUIDO válida é aceita (fonte real grava esse valor literalmente)', () => {
      const resultado = normalizarUmaLinha({ ...BASE, STATUS: 'CONCLUIDO' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.agendamentos[0].status).toBe('CONCLUIDO');
    });

    it('10b. STATUS CONCLUIDO real (AGE_TESTE_WF015_04, achado da homologação) produz envelope de sucesso com statusConfirmacao ausente no shape de integração', () => {
      const resultado = normalizarUmaLinha({
        ...BASE,
        ID_AGENDAMENTO: 'AGE_TESTE_WF015_04',
        STATUS: 'CONCLUIDO',
      });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.agendamentos).toEqual([
          {
            idAgendamento: 'AGE_TESTE_WF015_04',
            idCliente: 'CLI1',
            idProfissional: 'PROF1',
            idServico: 'SRV1',
            data: '2026-06-15',
            horaInicio: '09:00',
            horaFim: '10:00',
            valor: 100,
            status: 'CONCLUIDO',
          },
        ]);
        // O shape de integração não produz statusConfirmacao — é o NestJS
        // (agenda.service.ts) quem sempre acrescenta null, nunca o workflow.
        expect(resultado.agendamentos[0]).not.toHaveProperty('statusConfirmacao');
      }
    });

    it('11. STATUS vazio/inválido -> UPSTREAM_ERROR', () => {
      const vazio = normalizarUmaLinha({ ...BASE, STATUS: '' });
      expect(vazio.ok).toBe(false);
      const invalido = normalizarUmaLinha({ ...BASE, STATUS: 'PENDENTE' });
      expect(invalido.ok).toBe(false);
    });

    it('12. VALOR inválido (não numérico ou negativo) -> UPSTREAM_ERROR', () => {
      const naoNumerico = normalizarUmaLinha({ ...BASE, VALOR: 'abc' });
      expect(naoNumerico.ok).toBe(false);
      const negativo = normalizarUmaLinha({ ...BASE, VALOR: -10 });
      expect(negativo.ok).toBe(false);
    });

    it('13. ID_AGENDAMENTO ausente em linha real (outro campo presente) -> UPSTREAM_ERROR, nunca "nenhum agendamento"', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ID_AGENDAMENTO: undefined });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('14a. referência obrigatória ausente (ID_CLIENTE) -> UPSTREAM_ERROR', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ID_CLIENTE: undefined });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('14b. referência obrigatória ausente (ID_PROFISSIONAL) -> UPSTREAM_ERROR', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ID_PROFISSIONAL: undefined });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('14c. referência obrigatória ausente (ID_SERVICO) -> UPSTREAM_ERROR', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ID_SERVICO: undefined });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('14d. DATA ausente -> UPSTREAM_ERROR', () => {
      const resultado = normalizarUmaLinha({ ...BASE, DATA: undefined });
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('14e. HORA_INICIO/HORA_FIM ausentes ou em formato inesperado -> UPSTREAM_ERROR', () => {
      expect(normalizarUmaLinha({ ...BASE, HORA_INICIO: undefined }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, HORA_FIM: undefined }).ok).toBe(false);
      expect(normalizarUmaLinha({ ...BASE, HORA_INICIO: 'manhã' }).ok).toBe(false);
    });

    it('15. nunca devolve ID_EMPRESA', () => {
      const resultado = normalizarUmaLinha({ ...BASE, ID_EMPRESA: 'EMP001' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) expect(resultado.agendamentos[0]).not.toHaveProperty('ID_EMPRESA');
    });

    it('16. nunca devolve GOOGLE_EVENT_ID', () => {
      const resultado = normalizarUmaLinha({ ...BASE, GOOGLE_EVENT_ID: 'gcal-evt-999' });
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        expect(resultado.agendamentos[0]).not.toHaveProperty('GOOGLE_EVENT_ID');
        expect(JSON.stringify(resultado.agendamentos)).not.toContain('gcal-evt-999');
      }
    });

    it('17. preserva a regra de "nenhuma lista parcial": 1 linha corrompida sem ID_AGENDAMENTO entre 2 válidas reprova tudo', () => {
      const resultado = normalizarLinhas([
        { ...BASE, ID_AGENDAMENTO: 'AGD1' },
        { ...BASE, ID_AGENDAMENTO: undefined, ID_CLIENTE: 'CLI-corrompido' },
        { ...BASE, ID_AGENDAMENTO: 'AGD3' },
      ]);
      expect(resultado.ok).toBe(false);
    });

    it('18. dataInicio/dataFim ausentes -> VALIDATION_ERROR (validação técnica defensiva, não regra de negócio)', () => {
      const resultado = runCode(workflow, 'CODE - Normalizar Agendamentos', {
        json: {},
        items: [BASE],
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-sem-periodo' } },
      });
      expect(resultado.erro_codigo).toBe('VALIDATION_ERROR');
    });

    it('19. dataInicio/dataFim em formato inválido -> VALIDATION_ERROR', () => {
      const resultado = runCode(workflow, 'CODE - Normalizar Agendamentos', {
        json: {},
        items: [BASE],
        nodeOutputs: {
          'CODE - Validar Envelope': {
            requestId: 'r-periodo-invalido',
            dados: { dataInicio: '01/06/2026', dataFim: '30/06/2026' },
          },
        },
      });
      expect(resultado.erro_codigo).toBe('VALIDATION_ERROR');
    });
  });
});
