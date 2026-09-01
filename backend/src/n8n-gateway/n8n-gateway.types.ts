/**
 * Tipos internos do gateway NestJS -> APP-WF019. Deliberadamente NÃO misturados com
 * `@beautyflow/shared-types` (ver seção 24 do pedido da Fase 1): o envelope técnico do
 * n8n é um detalhe de integração interna do backend, não um contrato público exposto ao
 * frontend. Só mudam se essa fronteira mudar.
 */

/** Operações reconhecidas pelo APP-WF019 nesta fase (Fase 2: + `servicos.listar`). */
export type N8nGatewayOperation = 'clientes.listar' | 'servicos.listar';

/**
 * Código de erro técnico do envelope. `AUTH_FAILED` nunca aparece dentro de um envelope
 * JSON vindo do WF019 — a autenticação é rejeitada pelo próprio Header Auth do Webhook,
 * antes de qualquer node de negócio rodar (ver n8n-gateway.client.ts), então o NestJS é
 * quem produz esse código a partir do status HTTP (401/403), não o corpo da resposta.
 */
export type N8nGatewayErrorCode =
  | 'AUTH_FAILED'
  | 'TENANT_REQUIRED'
  | 'INVALID_OPERATION'
  | 'VALIDATION_ERROR'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

export interface N8nGatewaySuccessEnvelope<T> {
  ok: true;
  data: T;
  meta: { requestId: string };
}

export interface N8nGatewayErrorEnvelope {
  ok: false;
  error: { code: string; message: string };
  meta: { requestId: string };
}

export type N8nGatewayEnvelope<T> = N8nGatewaySuccessEnvelope<T> | N8nGatewayErrorEnvelope;

/**
 * Nunca confia cegamente no shape devolvido pelo n8n (seção 25 do pedido — "resposta
 * inválida -> erro técnico"). Valida só a estrutura do envelope; o conteúdo de `data` é
 * responsabilidade de quem chama `N8nGatewayClient.call()`.
 */
export function isN8nGatewayEnvelope(value: unknown): value is N8nGatewayEnvelope<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const envelope = value as Record<string, unknown>;

  if (typeof envelope.ok !== 'boolean') {
    return false;
  }
  if (typeof envelope.meta !== 'object' || envelope.meta === null) {
    return false;
  }
  if (typeof (envelope.meta as Record<string, unknown>).requestId !== 'string') {
    return false;
  }

  if (envelope.ok === true) {
    return 'data' in envelope;
  }

  const error = envelope.error;
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as Record<string, unknown>).code === 'string' &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Shape de integração de um cliente, já normalizado pelo APP-WF019 a partir da aba
 * CLIENTES (ver n8n/workflows/app/APP-WF019-gateway-app.json) — nunca inclui
 * `ID_EMPRESA` nem colunas técnicas. `clienteDesde`/`ultimoAtendimento` vêm de
 * `DATA_CADASTRO`/`ULTIMO_ATENDIMENTO`; CLIENTES não tem coluna para "próximo
 * atendimento" nem totais de atendimento/gasto (dependeriam de AGENDAMENTOS/PAGAMENTOS,
 * fora do escopo desta Fase 1) — por isso não aparecem aqui. A conversão para o DTO
 * público `Cliente` (que preenche esses campos ausentes com um valor neutro documentado)
 * acontece em clientes.service.ts, não no workflow.
 */
export interface N8nGatewayClienteIntegracao {
  idCliente: string;
  nome: string;
  telefone: string;
  email: string | null;
  dataNascimento: string | null;
  status: string;
  clienteDesde: string | null;
  ultimoAtendimento: string | null;
  observacoes: string | null;
}

/**
 * Shape de integração de um serviço, já normalizado pelo APP-WF019 a partir da aba
 * SERVICOS — nunca inclui `ID_EMPRESA` nem colunas técnicas. Schema real confirmado:
 * `ID_SERVICO`, `ID_EMPRESA`, `NOME`, `CATEGORIA`, `DESCRICAO`, `DURACAO_MIN`,
 * `TEMPO_INTERVALO_MIN`, `VALOR`, `STATUS`, `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`.
 * `CATEGORIA`, `TEMPO_INTERVALO_MIN`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem na
 * planilha mas não fazem parte do contrato público `Servico` — decisão de escopo (não
 * foram pedidos, não é dado de catálogo exibido ao usuário), nem chegam a ser lidos pelo
 * workflow. `descricao` **existe** na aba real (uma premissa anterior errada dizia que
 * não existia) — vem já normalizada pelo WF019 (`trim()`, vazio/ausente vira `null`,
 * nunca fabricada/substituída pelo nome). `duracaoMinutos`/`valor` já chegam validados
 * como number finito e não-negativo — o WF019 recusa a operação inteira (não apenas
 * descarta a linha) quando algum valor não normaliza (ver `CODE - Normalizar Serviços`),
 * então nunca chegam aqui como NaN/negativo.
 */
export interface N8nGatewayServicoIntegracao {
  idServico: string;
  nome: string;
  descricao: string | null;
  status: string;
  duracaoMinutos: number;
  valor: number;
}
