import "server-only";

import { addDays, toISODate } from "@/lib/date";
import type { PeriodoFinanceiro } from "./types";

/**
 * Intervalo de datas a buscar no backend para cada período — mesmo espírito de
 * features/agenda/backend.ts (calcularPeriodoBusca), mas com opções próprias do
 * Financeiro (Hoje / 7 dias / Este mês), pedidas explicitamente para este módulo em vez
 * de reaproveitar as visões dia/semana/mês da Agenda (que têm outro propósito — grade de
 * calendário, não período de apuração financeira).
 */
export function calcularPeriodoFinanceiro(
  periodo: PeriodoFinanceiro,
  hoje: Date,
): { dataInicio: string; dataFim: string } {
  if (periodo === "hoje") {
    const iso = toISODate(hoje);
    return { dataInicio: iso, dataFim: iso };
  }

  if (periodo === "7dias") {
    return { dataInicio: toISODate(addDays(hoje, -6)), dataFim: toISODate(hoje) };
  }

  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  return { dataInicio: toISODate(primeiroDia), dataFim: toISODate(ultimoDia) };
}
