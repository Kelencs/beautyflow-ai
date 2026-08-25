"use client";

import { AppointmentCard } from "./AppointmentCard";
import type { Agendamento } from "./types";
import { formatWeekdayShort, getWeekDays, isSameDay, parseISODate } from "@/lib/date";
import { cn } from "@/lib/cn";

interface WeekViewProps {
  referenceDate: Date;
  today: Date;
  agendamentos: Agendamento[];
  onSelect: (agendamento: Agendamento) => void;
}

/**
 * Desktop: 7 colunas (SEG—DOM) lado a lado. Mobile: pilha vertical de seções por dia —
 * 7 colunas espremidas não caberiam de forma legível numa tela pequena.
 */
export function WeekView({ referenceDate, today, agendamentos, onSelect }: WeekViewProps) {
  const dias = getWeekDays(referenceDate);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-7 md:gap-3">
      {dias.map((dia) => {
        const doDia = agendamentos
          .filter((a) => isSameDay(parseISODate(a.data), dia))
          .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
        const isToday = isSameDay(dia, today);

        return (
          <div key={dia.toISOString()} className="min-w-0">
            <div
              className={cn(
                "mb-2 flex items-center justify-between rounded-lg px-2 py-1.5 md:flex-col md:items-center md:gap-0.5 md:py-2",
                isToday ? "bg-violet-50" : "bg-transparent",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold tracking-wide text-zinc-500",
                  isToday && "text-violet-700",
                )}
              >
                {formatWeekdayShort(dia)}
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold text-zinc-700 md:h-7 md:w-7",
                  isToday && "bg-violet-600 text-white",
                )}
              >
                {dia.getDate()}
              </span>
            </div>

            {doDia.length === 0 ? (
              <p className="hidden text-center text-xs text-zinc-300 md:block">—</p>
            ) : (
              <div className="flex flex-col gap-2">
                {doDia.map((agendamento) => (
                  <AppointmentCard
                    key={agendamento.idAgendamento}
                    agendamento={agendamento}
                    variant="compact"
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
