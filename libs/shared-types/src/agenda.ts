/**
 * Contrato de GET /agenda (backend NestJS). Espelha o mesmo formato de status usado
 * pela Agenda mockada do frontend (frontend/src/features/agenda/types.ts) — quando o
 * frontend passar a consumir esta API de verdade (fase futura), é este o tipo a importar
 * em vez de duplicar a definição.
 */
export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';

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
  valor: number;
}

export interface AgendaResponse {
  data: AgendaItem[];
}
