"use client";

import { AppointmentCard } from "./AppointmentCard";
import type { Agendamento } from "./types";
import { getMonthGrid, isSameDay, isSameMonth, parseISODate } from "@/lib/date";
import { cn } from "@/lib/cn";

interface MonthViewProps {
  referenceDate: Date;
  today: Date;
  agendamentos: Agendamento[];
  onSelect: (agendamento: Agendamento) => void;
  onSelectDay: (date: Date) => void;
}

const WEEKDAY_HEADERS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
/** Chips visíveis por célula no desktop antes de mostrar "+N" — mantém a grade legível. */
const MAX_CHIPS_DESKTOP = 3;

export function MonthView({ referenceDate, today, agendamentos, onSelect, onSelectDay }: MonthViewProps) {
  const dias = getMonthGrid(referenceDate);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
        {WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="px-2 py-2 text-center text-xs font-semibold tracking-wide text-zinc-500">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {dias.map((dia, index) => {
          const doDia = agendamentos
            .filter((a) => isSameDay(parseISODate(a.data), dia))
            .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
          const isToday = isSameDay(dia, today);
          const foraDoMes = !isSameMonth(dia, referenceDate);
          const visiveis = doDia.slice(0, MAX_CHIPS_DESKTOP);
          const restantes = doDia.length - visiveis.length;

          return (
            <div
              key={dia.toISOString()}
              className={cn(
                "flex min-h-20 flex-col gap-1 border-b border-r border-zinc-100 p-1.5 sm:min-h-28 sm:p-2",
                index % 7 === 6 && "border-r-0",
                foraDoMes && "bg-zinc-50/60",
              )}
            >
              <button
                type="button"
                onClick={() => onSelectDay(dia)}
                aria-label={`Ver agenda do dia ${dia.getDate()}`}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center self-end rounded-full text-xs font-semibold sm:self-start",
                  isToday
                    ? "bg-violet-600 text-white"
                    : foraDoMes
                      ? "text-zinc-300 hover:bg-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-100",
                )}
              >
                {dia.getDate()}
              </button>

              {doDia.length > 0 && (
                <span
                  className="self-end rounded-full bg-violet-100 px-1.5 text-[10px] font-semibold text-violet-700 sm:hidden"
                  aria-hidden="true"
                >
                  {doDia.length}
                </span>
              )}

              <div className="hidden flex-col gap-0.5 sm:flex">
                {visiveis.map((agendamento) => (
                  <AppointmentCard
                    key={agendamento.idAgendamento}
                    agendamento={agendamento}
                    variant="chip"
                    onSelect={onSelect}
                  />
                ))}
                {restantes > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectDay(dia)}
                    className="px-1.5 py-0.5 text-left text-[11px] font-medium text-violet-700 hover:underline"
                  >
                    +{restantes} atendimento{restantes > 1 ? "s" : ""}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
