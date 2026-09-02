"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgendaHeader } from "./AgendaHeader";
import { AgendaSummary } from "./AgendaSummary";
import { AppointmentDetails } from "./AppointmentDetails";
import { DayView } from "./DayView";
import { MonthStatusLegend } from "./MonthStatusLegend";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import type { Agendamento, VisaoAgenda } from "./types";
import {
  addDays,
  addMonths,
  formatLongDate,
  formatMonthYear,
  formatWeekRange,
  getWeekDays,
  parseISODate,
  toISODate,
} from "@/lib/date";

interface AgendaScreenProps {
  /** View e data já resolvidas pelo Server Component (page.tsx) a partir da URL. */
  initialView: VisaoAgenda;
  initialDate: string;
  /** "Hoje" real calculado uma única vez no servidor — nunca recalculado aqui, para não
   *  arriscar divergir do HTML já enviado (hydration mismatch) perto da meia-noite. */
  todayIso: string;
  /**
   * Já vem de GET /agenda (backend NestJS) — não existe mais um mock local de Agenda no
   * frontend (o antigo mock-data.ts foi removido por estar órfão: nenhum componente o
   * importava, ver migração do modelo de status da Agenda).
   */
  agendamentos: Agendamento[];
}

/**
 * Cada navegação (troca de visão, dia anterior/próximo, clique num dia do mês) navega
 * para uma nova URL (?view=...&data=...) em vez de só atualizar estado local: isso faz o
 * Server Component (page.tsx) buscar os dados corretos no backend para o novo período.
 * O `key` que a página passa (view+data) força este componente a remontar a cada
 * navegação, então o estado local abaixo só precisa ser inicializado a partir das props
 * — nunca precisa ressincronizar com uma prop que mudou por baixo dele.
 */
export function AgendaScreen({ initialView, initialDate, todayIso, agendamentos }: AgendaScreenProps) {
  const router = useRouter();
  const [view] = useState<VisaoAgenda>(initialView);
  const [referenceDate] = useState<Date>(() => parseISODate(initialDate));
  const [selected, setSelected] = useState<Agendamento | null>(null);
  const today = parseISODate(todayIso);

  const dateLabel =
    view === "dia"
      ? formatLongDate(referenceDate)
      : view === "semana"
        ? formatWeekRange(getWeekDays(referenceDate))
        : formatMonthYear(referenceDate);

  function navigateTo(nextView: VisaoAgenda, nextDate: Date) {
    const params = new URLSearchParams({ view: nextView, data: toISODate(nextDate) });
    router.push(`/agenda?${params.toString()}`);
  }

  function handleViewChange(next: VisaoAgenda) {
    navigateTo(next, next === "dia" ? today : referenceDate);
  }

  function handlePrev() {
    if (view === "dia") navigateTo("dia", addDays(referenceDate, -1));
    else if (view === "semana") navigateTo("semana", addDays(referenceDate, -7));
    else navigateTo("mes", addMonths(referenceDate, -1));
  }

  function handleNext() {
    if (view === "dia") navigateTo("dia", addDays(referenceDate, 1));
    else if (view === "semana") navigateTo("semana", addDays(referenceDate, 7));
    else navigateTo("mes", addMonths(referenceDate, 1));
  }

  function handleNewAppointment() {
    // MVP: criação de agendamento fica para uma próxima etapa (requer mutação no backend).
  }

  function handleSelectDay(date: Date) {
    navigateTo("dia", date);
  }

  return (
    <div className="flex flex-col gap-6">
      <AgendaHeader
        view={view}
        onViewChange={handleViewChange}
        dateLabel={dateLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onNewAppointment={handleNewAppointment}
      />

      <AgendaSummary view={view} referenceDate={referenceDate} agendamentos={agendamentos} />

      {view === "dia" && <DayView date={referenceDate} agendamentos={agendamentos} onSelect={setSelected} />}
      {view === "semana" && (
        <WeekView referenceDate={referenceDate} today={today} agendamentos={agendamentos} onSelect={setSelected} />
      )}
      {view === "mes" && (
        <>
          <MonthStatusLegend />
          <MonthView
            referenceDate={referenceDate}
            today={today}
            agendamentos={agendamentos}
            onSelect={setSelected}
            onSelectDay={handleSelectDay}
          />
        </>
      )}

      <AppointmentDetails agendamento={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
