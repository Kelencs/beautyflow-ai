"use client";

import { CalendarX2 } from "lucide-react";
import { AppointmentCard } from "./AppointmentCard";
import type { Agendamento } from "./types";
import { isSameDay, parseISODate } from "@/lib/date";

interface DayViewProps {
  date: Date;
  agendamentos: Agendamento[];
  onSelect: (agendamento: Agendamento) => void;
}

export function DayView({ date, agendamentos, onSelect }: DayViewProps) {
  const doDia = agendamentos
    .filter((a) => isSameDay(parseISODate(a.data), date))
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  if (doDia.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <CalendarX2 className="h-8 w-8 text-zinc-300" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-600">Nenhum agendamento neste dia.</p>
        <p className="text-sm text-zinc-400">Aproveite para organizar sua agenda ou divulgar horários livres.</p>
      </div>
    );
  }

  return (
    <ol className="relative flex flex-col gap-4 sm:gap-5">
      {doDia.map((agendamento) => (
        <li key={agendamento.idAgendamento} className="flex items-start gap-3 sm:gap-4">
          <span
            className="w-12 shrink-0 pt-3 text-right text-xs font-semibold tabular-nums text-zinc-400 sm:w-14 sm:text-sm"
            aria-hidden="true"
          >
            {agendamento.horaInicio}
          </span>
          <AppointmentCard agendamento={agendamento} variant="full" onSelect={onSelect} />
        </li>
      ))}
    </ol>
  );
}
