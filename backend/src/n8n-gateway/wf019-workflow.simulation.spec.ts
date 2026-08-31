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
});
