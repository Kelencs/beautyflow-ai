/**
 * Contrato de GET /agenda (backend NestJS). O frontend (frontend/src/features/agenda/
 * types.ts) já consome esta API real hoje — não existe mais uma "fase futura" pendente
 * de migração aqui.
 *
 * O status de um agendamento tem dois eixos independentes, que um enum único de 4
 * valores conflava até esta migração (ver auditoria de domínio da Agenda). Os dois
 * nunca devem voltar a ser combinados num único campo:
 *
 * - StatusAgendamento: o ciclo de vida do atendimento em si (ainda vai acontecer, já
 *   aconteceu, ou foi cancelado).
 * - StatusConfirmacao: se o cliente confirmou presença — um dado independente do ciclo
 *   de vida, que só faz sentido enquanto o atendimento ainda está AGENDADO.
 */
export type StatusAgendamento = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';

/**
 * PENDENTE = ainda sem confirmação do cliente; CONFIRMADO = cliente confirmou presença.
 * `null` em AgendaItem.statusConfirmacao significa "não se aplica" (ex.: atendimento já
 * CONCLUIDO ou CANCELADO) — nunca inferir PENDENTE/CONFIRMADO a partir de outro dado
 * (AGENDADO, horário passado, pagamento registrado, lembrete enviado etc.); sem fonte
 * real de confirmação, o valor correto é `null`, nunca um valor fabricado.
 */
export type StatusConfirmacao = 'PENDENTE' | 'CONFIRMADO';

/**
 * Um item de resposta de GET /agenda. Deliberadamente sem idEmpresa/idProfissional —
 * esses ids só existem para o backend filtrar por tenant/profissional antes de montar
 * esta resposta; o cliente nunca precisa (nem deve) recebê-los de volta aqui.
 */
export interface AgendaItem {
  idAgendamento: string;
  clienteNome: string;
  clienteTelefone: string;
  profissionalNome: string;
  servicoNome: string;
  /** Data no formato ISO "YYYY-MM-DD". */
  data: string;
  /** Horário no formato "HH:mm". */
  horaInicio: string;
  horaFim: string;
  status: StatusAgendamento;
  /** Confirmação do cliente — eixo independente de `status` (ver StatusConfirmacao). */
  statusConfirmacao: StatusConfirmacao | null;
  valor: number;
}

export interface AgendaResponse {
  data: AgendaItem[];
}
