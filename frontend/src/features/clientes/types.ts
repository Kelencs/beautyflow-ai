/**
 * Contrato de Clientes vem de `@beautyflow/shared-types` (GET /clientes do backend
 * NestJS) — sem duplicar aqui, mesmo padrão já usado em features/agenda/types.ts.
 */
export type { Cliente, ClienteDetalhado, ClienteHistoricoItem, StatusCliente } from "@beautyflow/shared-types";

/** Filtro da lista de clientes — puramente de UI, aplicado no frontend (ver ClientesScreen). */
export type FiltroCliente = "todos" | "ativos" | "inativos" | "com-proximo" | "sem-proximo" | "recorrentes";
