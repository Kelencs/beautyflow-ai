/**
 * Tipos internos do gateway de COMANDOS NestJS -> APP-WF020. Deliberadamente um arquivo
 * separado de n8n-gateway.types.ts (que descreve só o APP-WF019, read-only): comandos e
 * leituras são workflows distintos, com taxonomias de erro distintas (ver
 * N8nGatewayCommandErrorCode abaixo) — misturar os dois neste ponto criaria acoplamento
 * desnecessário entre um lado estável/homologado (leitura) e um lado novo (escrita).
 * Envelope técnico (`N8nGatewayEnvelope`/`isN8nGatewayEnvelope`) continua o mesmo formato
 * e é reaproveitado de n8n-gateway.types.ts sem duplicação — só a lista de operações e de
 * códigos de erro é própria de cada gateway.
 */

/**
 * Operações reconhecidas pelo APP-WF020 nesta fase — exclusivo para mutações da Agenda.
 * `agenda.criar`/`agenda.reagendar`/`agenda.concluir` são deliberadamente NÃO
 * implementadas ainda (ver auditoria da escrita da Agenda) — adicioná-las exige voltar
 * aqui E ao fluxo real do workflow, mesmo padrão já usado no APP-WF019.
 */
export type N8nGatewayCommandOperation = 'agenda.cancelar';

/**
 * Código de erro do envelope de comandos. Inclui os 6 códigos técnicos já usados pelo
 * APP-WF019 (mesmo significado: `AUTH_FAILED` nunca vem no corpo — é produzido pelo
 * NestJS a partir do status HTTP 401/403, ver n8n-gateway-commands.client.ts) mais dois
 * códigos de DOMÍNIO que uma operação de escrita precisa e uma `.listar`/`.obter`
 * read-only nunca precisou:
 * - `NOT_FOUND`: o agendamento não existe no tenant do chamador, OU existe mas pertence
 *   a outro profissional (quando o chamador é `profissional`) — as duas situações
 *   convergem PROPOSITALMENTE no mesmo código/mensagem genérica, nunca revelando a
 *   diferença (mesmo princípio de `buscarPorId` em Clientes/Serviços/Profissionais).
 * - `CONFLICT`: o agendamento existe e pertence ao chamador, mas seu estado atual não
 *   permite a transição pedida (ex.: já está `CONCLUIDO`).
 */
export type N8nGatewayCommandErrorCode =
  | 'AUTH_FAILED'
  | 'TENANT_REQUIRED'
  | 'INVALID_OPERATION'
  | 'VALIDATION_ERROR'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT';

/**
 * `dados` enviado ao APP-WF020 para `agenda.cancelar`. `chamadorPerfil`/
 * `chamadorIdProfissional` vêm de `AuthenticatedUser` (resolvido pelo SupabaseAuthGuard),
 * nunca do corpo da requisição do browser — existem só para o workflow aplicar a regra
 * "profissional só cancela o próprio agendamento" no mesmo passo em que já localiza a
 * linha real (ver agenda.service.ts e a auditoria da escrita da Agenda, seção 17,
 * "Regras de Autoridade": o NestJS resolve a IDENTIDADE do chamador, o workflow aplica a
 * regra sobre a linha que só ele acabou de ler).
 */
// `type` (não `interface`) deliberadamente: precisa satisfazer estruturalmente
// `Record<string, unknown>` (o parâmetro `dados` de N8nGatewayCommandsClient.call) sem
// exigir uma asserção de tipo no call site — só um alias de objeto (não uma interface
// nomeada) recebe essa checagem de índice implícita do TypeScript.
export type N8nGatewayCancelarAgendamentoDados = {
  idAgendamento: string;
  motivo: string;
  chamadorPerfil: string;
  chamadorIdProfissional: string;
};

/**
 * Shape de sucesso devolvido por `agenda.cancelar` — mínimo de propósito (ver
 * `AgendaCancelarResponse` em `@beautyflow/shared-types`, que este shape alimenta
 * diretamente sem transformação: os dois são idênticos porque não há nenhum dado
 * interno a esconder aqui).
 */
export interface N8nGatewayCancelarAgendamentoResultado {
  idAgendamento: string;
  status: 'CANCELADO';
}
