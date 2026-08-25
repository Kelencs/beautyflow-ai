/**
 * Contrato de Relatórios vem de `@beautyflow/shared-types` (GET /relatorios do backend
 * NestJS) — sem duplicar aqui, mesmo padrão já usado em features/financeiro/comunicacao.
 */
export type {
  RelatorioProfissional,
  RelatorioResumo,
  RelatorioServico,
  RelatorioSerieTemporal,
  RelatoriosResponse,
} from "@beautyflow/shared-types";

/**
 * Presets de período — "custom" usa dataInicio/dataFim informados diretamente na URL em
 * vez de calculados a partir de um preset (ver period.ts, que é `server-only`).
 */
export type PresetRelatorio = "hoje" | "7dias" | "mes" | "30dias" | "ano" | "custom";

export const PRESET_RELATORIO_LABEL: Record<Exclude<PresetRelatorio, "custom">, string> = {
  hoje: "Hoje",
  "7dias": "7 dias",
  mes: "Este mês",
  "30dias": "Últimos 30 dias",
  ano: "Este ano",
};
