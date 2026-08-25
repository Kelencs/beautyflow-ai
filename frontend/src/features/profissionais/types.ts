/**
 * Contrato de Profissionais vem de `@beautyflow/shared-types` (GET /profissionais do
 * backend NestJS) — sem duplicar aqui, mesmo padrão de features/clientes e features/servicos.
 */
export type { Profissional, StatusProfissional } from "@beautyflow/shared-types";

/** Filtro da lista — puramente de UI, aplicado no frontend (ver ProfissionaisScreen). */
export type FiltroProfissional = "todos" | "ativos" | "inativos";
