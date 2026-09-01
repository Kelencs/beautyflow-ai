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

    it('uma terceira operação (ex.: agenda.listar) continua INVALID_OPERATION', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: { body: { operacao: 'agenda.listar', idEmpresa: 'EMP001', requestId: 'r3' } },
      });
      expect(validado.erro_codigo).toBe('INVALID_OPERATION');
    });
  });

  describe('Fase 2 — estrutura do branch de Serviços', () => {
    it('SWITCH - Operação existe e roteia clientes.listar/servicos.listar', () => {
      const sw = getNode(workflow, 'SWITCH - Operação');
      const values = (sw.parameters.rules as { values: Array<Record<string, unknown>> }).values;
      const chaves = values.map((v) => v.outputKey);
      expect(chaves).toEqual(['clientes.listar', 'servicos.listar']);
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
});
