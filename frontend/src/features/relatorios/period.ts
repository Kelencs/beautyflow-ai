import "server-only";

import { addDays, toISODate } from "@/lib/date";
import type { PresetRelatorio } from "./types";

/**
 * Presets próprios do módulo (Hoje / 7 dias / Este mês / Últimos 30 dias / Este ano),
 * mais um intervalo customizado simples (seção 17 do pedido) — não reaproveita as visões
 * dia/semana/mês da Agenda, que servem outro propósito (grade de calendário).
 */
export function calcularPeriodoRelatorio(
  preset: PresetRelatorio,
  hoje: Date,
  custom: { dataInicio: string; dataFim: string } | null,
): { dataInicio: string; dataFim: string } {
  if (preset === "custom" && custom) {
    return custom;
  }

  if (preset === "hoje") {
    const iso = toISODate(hoje);
    return { dataInicio: iso, dataFim: iso };
  }

  if (preset === "7dias") {
    return { dataInicio: toISODate(addDays(hoje, -6)), dataFim: toISODate(hoje) };
  }

  if (preset === "30dias") {
    return { dataInicio: toISODate(addDays(hoje, -29)), dataFim: toISODate(hoje) };
  }

  if (preset === "ano") {
    return { dataInicio: `${hoje.getFullYear()}-01-01`, dataFim: `${hoje.getFullYear()}-12-31` };
  }

  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  return { dataInicio: toISODate(primeiroDia), dataFim: toISODate(ultimoDia) };
}
