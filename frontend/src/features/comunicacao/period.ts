import "server-only";

import { addDays, toISODate } from "@/lib/date";
import type { PeriodoComunicacao } from "./types";

/**
 * Mesmo espírito de features/financeiro/period.ts (Hoje / 7 dias / Este mês) — período
 * próprio do módulo, não reaproveita as visões dia/semana/mês da Agenda (propósito
 * diferente: grade de calendário vs. período de apuração de comunicações).
 */
export function calcularPeriodoComunicacao(
  periodo: PeriodoComunicacao,
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
