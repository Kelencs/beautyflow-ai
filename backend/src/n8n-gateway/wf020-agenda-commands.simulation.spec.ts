import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Simulação do APP-WF020 (comandos/mutações da Agenda) — mesmo padrão de
 * wf019-workflow.simulation.spec.ts: lê o JSON versionado diretamente, extrai o
 * `jsCode` de cada Code node e executa com `$json`/`$input`/`$('Node')` mockados. Nunca
 * chama n8n Cloud, Google Sheets ou Google Calendar reais.
 */

const WORKFLOW_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'n8n',
  'workflows',
  'app',
  'APP-WF020-agenda-commands.json',
);

interface N8nNode {
  name: string;
  type: string;
  parameters: Record<string, unknown>;
  credentials?: Record<string, { id: string; name: string }>;
  onError?: string;
  alwaysOutputData?: boolean;
}

interface N8nWorkflow {
  nodes: N8nNode[];
  active: boolean;
  connections: Record<string, unknown>;
}

function loadWorkflow(): N8nWorkflow {
  return JSON.parse(fs.readFileSync(WORKFLOW_PATH, 'utf8')) as N8nWorkflow;
}

function getNode(workflow: N8nWorkflow, name: string): N8nNode {
  const node = workflow.nodes.find((n) => n.name === name);
  if (!node) throw new Error(`Node "${name}" não encontrado no JSON do WF020.`);
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

describe('APP-WF020 — simulação do workflow real (JSON versionado)', () => {
  let workflow: N8nWorkflow;

  beforeAll(() => {
    workflow = loadWorkflow();
  });

  describe('estrutura estática do arquivo', () => {
    it('JSON é válido e permanece inativo (active:false) na fonte versionada', () => {
      expect(workflow.active).toBe(false);
    });

    it('tem exatamente 14 nodes', () => {
      expect(workflow.nodes).toHaveLength(14);
    });

    it('Webhook usa POST, Header Auth e "Using Respond to Webhook Node" (responseNode)', () => {
      const webhook = getNode(workflow, 'Webhook - Gateway App Commands');
      expect(webhook.parameters.httpMethod).toBe('POST');
      expect(webhook.parameters.authentication).toBe('headerAuth');
      expect(webhook.parameters.responseMode).toBe('responseNode');
    });

    it('RESPOND - Resultado usa respondWith "json" com o objeto direto, nunca JSON.stringify', () => {
      const node = getNode(workflow, 'RESPOND - Resultado');
      expect(node.parameters.respondWith).toBe('json');
      expect(node.parameters.responseBody).toBe('={{ $json }}');
      expect(node.parameters.responseBody).not.toContain('JSON.stringify');
    });

    it('nenhuma credencial secreta real está versionada (só o placeholder já usado no WF019)', () => {
      const webhook = getNode(workflow, 'Webhook - Gateway App Commands');
      expect(webhook.credentials?.httpHeaderAuth.id).toBe('CONFIGURAR_CREDENCIAL_HEADER_AUTH');
    });

    it('nenhum node n8n-nodes-base.merge existe (convergência sem Merge)', () => {
      const merges = workflow.nodes.filter((n) => n.type.toLowerCase().includes('merge'));
      expect(merges).toEqual([]);
    });

    it('nenhum node duplicado por nome', () => {
      const nomes = workflow.nodes.map((n) => n.name);
      expect(new Set(nomes).size).toBe(nomes.length);
    });

    it('nenhum node Google Calendar existe — sincronização deliberadamente adiada nesta fase', () => {
      const calendarNodes = workflow.nodes.filter(
        (n) => n.type === 'n8n-nodes-base.googleCalendar',
      );
      expect(calendarNodes).toEqual([]);
    });

    it('nenhum node chama WF001-WF019 (nenhum executeWorkflow neste arquivo)', () => {
      const execWorkflowNodes = workflow.nodes.filter(
        (n) => n.type === 'n8n-nodes-base.executeWorkflow',
      );
      expect(execWorkflowNodes).toEqual([]);
    });

    // A sticky note documenta em prosa que EMP001/Calendar/Studio Bella estão AUSENTES
    // deste arquivo (ver seção "Proibido" da nota) — por isso as checagens abaixo
    // excluem o próprio sticky note (documentação, não lógica executável) e auditam só
    // os nodes que efetivamente rodam.
    function nodesExecutaveis(): N8nNode[] {
      return workflow.nodes.filter((n) => n.type !== 'n8n-nodes-base.stickyNote');
    }

    it('nenhum "EMP001" hardcoded em nenhum node executável (fallback de tenant proibido)', () => {
      const textoCompleto = JSON.stringify(nodesExecutaveis());
      expect(textoCompleto).not.toContain('EMP001');
    });

    it('nenhum "BeautyFlow - Studio Bella" nem Calendar ID hardcoded em nenhum node executável', () => {
      const textoCompleto = JSON.stringify(nodesExecutaveis());
      expect(textoCompleto).not.toContain('Studio Bella');
      expect(textoCompleto).not.toContain('group.calendar.google.com');
    });

    it('STATUS só é gravado como literal "CANCELADO" em todo o arquivo (nunca outro valor fixo)', () => {
      const gsCancelar = getNode(workflow, 'GS - Cancelar Agendamento');
      const columns = gsCancelar.parameters.columns as { value: Record<string, string> };
      expect(columns.value.STATUS).toBe("={{ 'CANCELADO' }}");
      // Nenhum outro node escreve um STATUS literal diferente de 'CANCELADO'.
      const outrosStatusLiterais = workflow.nodes
        .flatMap((n) => Object.entries(n.parameters))
        .filter(([, v]) => typeof v === 'string' && /STATUS.*=.*'(?!CANCELADO)[A-Z_]+'/.test(v));
      expect(outrosStatusLiterais).toEqual([]);
    });

    it('GS - Buscar Agendamento filtra por ID_EMPRESA E ID_AGENDAMENTO (nunca só um dos dois)', () => {
      const gs = getNode(workflow, 'GS - Buscar Agendamento');
      const filtros = gs.parameters.filtersUI as { values: Array<Record<string, string>> };
      const colunas = filtros.values.map((f) => f.lookupColumn);
      expect(colunas).toEqual(['ID_EMPRESA', 'ID_AGENDAMENTO']);
    });

    it('GS - Cancelar Agendamento usa ID_AGENDAMENTO como matchingColumns (limitação auditada da operação Update Row no n8n Cloud — tenant já validado antes por GS - Buscar Agendamento + CODE - Localizar E Validar Agendamento)', () => {
      const gs = getNode(workflow, 'GS - Cancelar Agendamento');
      const columns = gs.parameters.columns as {
        matchingColumns: string[];
        value: Record<string, string>;
      };
      expect(columns.matchingColumns).toEqual(['ID_AGENDAMENTO']);
      // ID_EMPRESA continua sendo regravado como valor (nunca hardcoded), mesmo não
      // participando do match — ver sticky note "Match do update" para o risco residual.
      expect(columns.value).toHaveProperty('ID_EMPRESA');
    });

    it('GOOGLE_EVENT_ID nunca é lido nem escrito por nenhum node (Calendar adiado)', () => {
      const gsCancelar = getNode(workflow, 'GS - Cancelar Agendamento');
      const columns = gsCancelar.parameters.columns as { value: Record<string, string> };
      // Nunca é uma das colunas efetivamente GRAVADAS por este comando.
      expect(columns.value).not.toHaveProperty('GOOGLE_EVENT_ID');
      // GOOGLE_EVENT_ID aparece no schema de colunas conhecidas da aba (metadado
      // estrutural, mesmo padrão do WF006/007 legados) e em comentários explicando a
      // decisão de adiar o Calendar — nunca como acesso real de propriedade
      // (`.GOOGLE_EVENT_ID` / `row.GOOGLE_EVENT_ID`) em nenhum Code node.
      for (const node of workflow.nodes) {
        if (node.type !== 'n8n-nodes-base.code') continue;
        const jsCode = node.parameters.jsCode as string;
        expect(jsCode).not.toMatch(/\.GOOGLE_EVENT_ID\b/);
      }
    });
  });

  describe('CODE - Validar Envelope', () => {
    it('reconhece exatamente 1 operação: agenda.cancelar', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agenda.cancelar',
            idEmpresa: 'EMP001',
            requestId: 'r1',
            dados: { idAgendamento: 'AGD001' },
          },
        },
      });
      expect(validado.erro_codigo).toBe('');
    });

    it('qualquer outra operação (ex.: agendamentos.listar, do WF019) vira INVALID_OPERATION', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agendamentos.listar',
            idEmpresa: 'EMP001',
            requestId: 'r2',
            dados: {},
          },
        },
      });
      expect(validado.erro_codigo).toBe('INVALID_OPERATION');
    });

    it('operações futuras ainda não implementadas (agenda.criar/reagendar/concluir) continuam INVALID_OPERATION', () => {
      for (const operacao of [
        'agenda.criar',
        'agenda.reagendar',
        'agenda.concluir',
        'agenda.editar',
      ]) {
        const validado = runCode(workflow, 'CODE - Validar Envelope', {
          json: { body: { operacao, idEmpresa: 'EMP001', requestId: 'r', dados: {} } },
        });
        expect(validado.erro_codigo).toBe('INVALID_OPERATION');
      }
    });

    it('request sem idEmpresa -> TENANT_REQUIRED', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'agenda.cancelar', requestId: 'r3', dados: { idAgendamento: 'X' } },
        },
      });
      expect(validado.erro_codigo).toBe('TENANT_REQUIRED');
    });

    it('dados.idAgendamento ausente -> VALIDATION_ERROR', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: { operacao: 'agenda.cancelar', idEmpresa: 'EMP001', requestId: 'r4', dados: {} },
        },
      });
      expect(validado.erro_codigo).toBe('VALIDATION_ERROR');
    });

    it('motivo com HTML é sanitizado (defesa em profundidade, mesmo já normalizado pelo NestJS)', () => {
      const validado = runCode(workflow, 'CODE - Validar Envelope', {
        json: {
          body: {
            operacao: 'agenda.cancelar',
            idEmpresa: 'EMP001',
            requestId: 'r5',
            dados: { idAgendamento: 'AGD001', motivo: '<script>alert(1)</script>' },
          },
        },
      });
      expect(validado.motivo).not.toContain('<');
      expect(validado.motivo).not.toContain('>');
    });
  });

  describe('CODE - Localizar E Validar Agendamento', () => {
    const CTX_OWNER = {
      requestId: 'r',
      idAgendamento: 'AGD001',
      motivo: 'Motivo de teste',
      chamadorPerfil: 'owner',
      chamadorIdProfissional: '',
    };

    const ROW_AGENDADO = {
      ID_AGENDAMENTO: 'AGD001',
      ID_EMPRESA: 'EMP001',
      ID_CLIENTE: 'CLI1',
      ID_PROFISSIONAL: 'PROF1',
      ID_SERVICO: 'SRV1',
      DATA: '2026-09-02',
      HORA_INICIO: '09:00',
      HORA_FIM: '10:00',
      VALOR: 100,
      STATUS: 'AGENDADO',
    };

    function localizar(
      items: Record<string, unknown>[],
      contexto: Record<string, unknown> = CTX_OWNER,
    ) {
      return runCode(workflow, 'CODE - Localizar E Validar Agendamento', {
        json: {},
        items,
        nodeOutputs: { 'CODE - Validar Envelope': contexto },
      });
    }

    it('agendamento inexistente (0 linhas reais) -> NOT_FOUND', () => {
      const resultado = localizar([{ ID_AGENDAMENTO: undefined }]);
      expect(resultado.erro_codigo).toBe('NOT_FOUND');
    });

    it('AGENDADO válido -> precisaCancelar true, motivo normalizado, timestamps gerados', () => {
      const resultado = localizar([ROW_AGENDADO]);
      expect(resultado.erro_codigo).toBe('');
      expect(resultado.precisaCancelar).toBe(true);
      expect(resultado.motivoNormalizado).toBe('Motivo de teste');
      expect(typeof resultado.dataCancelamento).toBe('string');
      expect(typeof resultado.ultimaAtualizacao).toBe('string');
    });

    it('motivo ausente/vazio -> default "Cancelado pelo usuário"', () => {
      const resultado = localizar([ROW_AGENDADO], { ...CTX_OWNER, motivo: '' });
      expect(resultado.motivoNormalizado).toBe('Cancelado pelo usuário');
    });

    it('CONCLUIDO -> CONFLICT, nunca cancela um atendimento já concluído', () => {
      const resultado = localizar([{ ...ROW_AGENDADO, STATUS: 'CONCLUIDO' }]);
      expect(resultado.erro_codigo).toBe('CONFLICT');
    });

    it('CANCELADO -> idempotente: sucesso sem precisar reescrever (precisaCancelar false, sem erro)', () => {
      const resultado = localizar([{ ...ROW_AGENDADO, STATUS: 'CANCELADO' }]);
      expect(resultado.erro_codigo).toBe('');
      expect(resultado.precisaCancelar).toBe(false);
      // Idempotente nunca recalcula/expõe novos timestamps de cancelamento — não há
      // nada para reescrever, então esses campos nem são produzidos aqui.
      expect(resultado).not.toHaveProperty('dataCancelamento');
      expect(resultado).not.toHaveProperty('motivoNormalizado');
    });

    it('STATUS fora da whitelist real (ex.: PENDENTE) -> UPSTREAM_ERROR, nunca inventa uma transição', () => {
      const resultado = localizar([{ ...ROW_AGENDADO, STATUS: 'PENDENTE' }]);
      expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('duplicidade (2 linhas reais para o mesmo ID_AGENDAMENTO) -> UPSTREAM_ERROR, nunca escolhe uma silenciosamente', () => {
      const resultado = localizar([ROW_AGENDADO, { ...ROW_AGENDADO }]);
      expect(resultado.erro_codigo).toBe('UPSTREAM_ERROR');
    });

    it('profissional cancelando o PRÓPRIO agendamento -> permitido', () => {
      const resultado = localizar([ROW_AGENDADO], {
        ...CTX_OWNER,
        chamadorPerfil: 'profissional',
        chamadorIdProfissional: 'PROF1',
      });
      expect(resultado.erro_codigo).toBe('');
      expect(resultado.precisaCancelar).toBe(true);
    });

    it('profissional tentando cancelar agendamento de OUTRO profissional -> NOT_FOUND (nunca revela que o ID existe)', () => {
      const resultado = localizar([ROW_AGENDADO], {
        ...CTX_OWNER,
        chamadorPerfil: 'profissional',
        chamadorIdProfissional: 'PROF-OUTRO',
      });
      expect(resultado.erro_codigo).toBe('NOT_FOUND');
    });

    it('owner sempre pode localizar (não é restrito por idProfissional)', () => {
      const resultado = localizar([ROW_AGENDADO], { ...CTX_OWNER, chamadorPerfil: 'owner' });
      expect(resultado.erro_codigo).toBe('');
    });
  });

  describe('CODE - Montar Sucesso / CODE - Montar Erro', () => {
    it('monta sucesso a partir do contexto de CODE - Localizar E Validar Agendamento (efetivo)', () => {
      const contexto = { requestId: 'r-sucesso', idAgendamento: 'AGD001', precisaCancelar: true };
      const resultado = runCode(workflow, 'CODE - Montar Sucesso', {
        json: contexto,
        nodeOutputs: { 'CODE - Localizar E Validar Agendamento': contexto },
      });
      expect(resultado).toEqual({
        ok: true,
        data: { idAgendamento: 'AGD001', status: 'CANCELADO' },
        meta: { requestId: 'r-sucesso' },
      });
    });

    it('monta sucesso a partir do contexto idempotente (já cancelado)', () => {
      const contexto = { requestId: 'r-idem', idAgendamento: 'AGD002', precisaCancelar: false };
      const resultado = runCode(workflow, 'CODE - Montar Sucesso', {
        json: contexto,
        nodeOutputs: { 'CODE - Localizar E Validar Agendamento': contexto },
      });
      expect(resultado).toEqual({
        ok: true,
        data: { idAgendamento: 'AGD002', status: 'CANCELADO' },
        meta: { requestId: 'r-idem' },
      });
    });

    it('monta erro no formato padrão { ok:false, error:{code,message}, meta:{requestId} }', () => {
      const resultado = runCode(workflow, 'CODE - Montar Erro', {
        json: {
          erro_codigo: 'NOT_FOUND',
          erro_mensagem: 'Agendamento não encontrado.',
          requestId: 'r-erro',
        },
      });
      expect(resultado).toEqual({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Agendamento não encontrado.' },
        meta: { requestId: 'r-erro' },
      });
      expect(resultado).not.toHaveProperty('stack');
    });
  });

  describe('CODE - Erro Upstream', () => {
    it('produz UPSTREAM_ERROR genérico, nunca expõe detalhe do Sheets', () => {
      const resultado = runCode(workflow, 'CODE - Erro Upstream', {
        json: {},
        nodeOutputs: { 'CODE - Validar Envelope': { requestId: 'r-upstream' } },
      });
      expect(resultado).toEqual({
        erro_codigo: 'UPSTREAM_ERROR',
        erro_mensagem: 'Não foi possível processar o cancelamento no momento.',
        requestId: 'r-upstream',
      });
    });
  });
});
