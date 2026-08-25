/**
 * Contrato de Comunicação vem de `@beautyflow/shared-types` (GET /comunicacao do backend
 * NestJS) — sem duplicar aqui, mesmo padrão já usado em features/financeiro e features/agenda.
 */
export type {
  ComunicacaoItem,
  ComunicacaoResponse,
  ComunicacaoResumo,
  StatusComunicacao,
  TipoComunicacao,
} from "@beautyflow/shared-types";

/** Filtro de tipo da lista — puramente de UI, aplicado no frontend (ver ComunicacaoScreen). */
export type FiltroTipoComunicacao = "todos" | "CONFIRMACAO" | "LEMBRETE" | "PESQUISA" | "FOLLOWUP" | "COBRANCA";

/** Filtro de status da lista — puramente de UI, aplicado no frontend (ver ComunicacaoScreen). */
export type FiltroStatusComunicacao = "todos" | "ENVIADA" | "FALHA";

/** Período de consulta — vira dataInicio/dataFim ao chamar GET /comunicacao (ver period.ts). */
export type PeriodoComunicacao = "hoje" | "7dias" | "mes";

/** Rótulo de cada período — em types.ts (não period.ts, que é `server-only`) para uso em componentes client. */
export const PERIODO_COMUNICACAO_LABEL: Record<PeriodoComunicacao, string> = {
  hoje: "Hoje",
  "7dias": "7 dias",
  mes: "Este mês",
};
