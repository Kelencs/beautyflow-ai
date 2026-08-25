/**
 * Contrato de Financeiro vem de `@beautyflow/shared-types` (GET /financeiro do backend
 * NestJS) — sem duplicar aqui, mesmo padrão já usado em features/agenda, features/clientes
 * e features/servicos.
 */
export type {
  FinanceiroResponse,
  FinanceiroResumo,
  FormaPagamento,
  Pagamento,
  StatusPagamento,
} from "@beautyflow/shared-types";

/** Filtro de status da lista — puramente de UI, aplicado no frontend (ver FinanceiroScreen). */
export type FiltroStatusPagamento = "todos" | "PAGO" | "PENDENTE" | "PARCIAL";

/** Período de consulta — vira dataInicio/dataFim ao chamar GET /financeiro (ver period.ts). */
export type PeriodoFinanceiro = "hoje" | "7dias" | "mes";

/** Rótulo de cada período — em types.ts (não period.ts) porque period.ts é `server-only`
 *  (calcularPeriodoFinanceiro) e este rótulo é usado por componentes client (FinanceiroHeader). */
export const PERIODO_LABEL: Record<PeriodoFinanceiro, string> = {
  hoje: "Hoje",
  "7dias": "7 dias",
  mes: "Este mês",
};
