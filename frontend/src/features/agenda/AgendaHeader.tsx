"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { VisaoAgenda } from "./types";
import { cn } from "@/lib/cn";

interface AgendaHeaderProps {
  view: VisaoAgenda;
  onViewChange: (view: VisaoAgenda) => void;
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onNewAppointment: () => void;
}

const VIEW_OPTIONS: { value: VisaoAgenda; label: string }[] = [
  { value: "dia", label: "Hoje" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
];

export function AgendaHeader({ view, onViewChange, dateLabel, onPrev, onNext, onNewAppointment }: AgendaHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Agenda</h1>
        <p className="text-sm text-zinc-500">Gerencie seus atendimentos e acompanhe sua rotina.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            role="tablist"
            aria-label="Visualização da agenda"
            className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-0.5"
          >
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={view === option.value}
                onClick={() => onViewChange(option.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                  view === option.value
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-1 py-0.5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Período anterior"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-[9rem] px-1 text-center text-sm font-medium text-zinc-700 sm:min-w-[13rem]">
              {dateLabel}
            </span>
            <button
              type="button"
              onClick={onNext}
              aria-label="Próximo período"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewAppointment}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo agendamento
        </button>
      </div>
    </div>
  );
}
