import "server-only";

import type { AgendaItem } from "@beautyflow/shared-types";
import { getWeekDays, getMonthGrid, toISODate } from "@/lib/date";
import type { Agendamento, VisaoAgenda } from "./types";

/**
 * `AgendaItem` (contrato público do backend) já satisfaz `Agendamento` estruturalmente
 * — `Agendamento` só adiciona campos opcionais que o backend não devolve (ver types.ts).
 * Mantido como função nomeada explícita (em vez de usar o item diretamente) para dar um
 * único lugar para adaptar se os dois contratos divergirem no futuro.
 */
export function toAgendamento(item: AgendaItem): Agendamento {
  return item;
}

/**
 * Intervalo de datas a buscar no backend para cada visão — sempre o mínimo necessário
 * para renderizar a visão atual (nunca uma janela maior "por segurança"; o limite do
 * backend é 60 dias, bem acima do máximo usado aqui, que é a grade mensal de 42 dias):
 * - dia: só o próprio dia.
 * - semana: os 7 dias exibidos (SEG—DOM).
 * - mes: os até 42 dias da grade mensal (inclui dias do mês anterior/seguinte visíveis
 *   na grade — ver getMonthGrid), não só os dias do mês corrente.
 */
export function calcularPeriodoBusca(view: VisaoAgenda, referenceDate: Date): { dataInicio: string; dataFim: string } {
  if (view === "dia") {
    const iso = toISODate(referenceDate);
    return { dataInicio: iso, dataFim: iso };
  }

  if (view === "semana") {
    const dias = getWeekDays(referenceDate);
    return { dataInicio: toISODate(dias[0]), dataFim: toISODate(dias[dias.length - 1]) };
  }

  const grade = getMonthGrid(referenceDate);
  return { dataInicio: toISODate(grade[0]), dataFim: toISODate(grade[grade.length - 1]) };
}
