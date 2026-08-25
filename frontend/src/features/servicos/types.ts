/**
 * Contrato de Serviços vem de `@beautyflow/shared-types` (GET /servicos do backend
 * NestJS) — sem duplicar aqui, mesmo padrão já usado em features/agenda e features/clientes.
 */
export type { Servico, StatusServico } from "@beautyflow/shared-types";

/** Filtro da lista de serviços — puramente de UI, aplicado no frontend (ver ServicosScreen). */
export type FiltroServico = "todos" | "ativos" | "inativos";
