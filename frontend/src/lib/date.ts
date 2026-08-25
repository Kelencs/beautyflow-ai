/**
 * Utilitários de data em pt-BR usando somente `Date`/`Intl` nativos — sem dependência
 * externa (date-fns etc.), suficiente para a navegação Hoje/Semana/Mês da Agenda.
 * Todas as datas são tratadas como "wall clock" local (sem fuso), já que os dados desta
 * etapa são mockados e comparados só por ano/mês/dia.
 */

const WEEKDAY_SHORT_PT_BR = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"] as const;

/** Converte um Date para "YYYY-MM-DD" (chave usada nos dados mockados). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * "Hoje" real, no fuso de referência do projeto (America/Sao_Paulo) — não no fuso do
 * processo Node, que pode divergir em produção (ex.: servidor em UTC) e dar o dia
 * errado perto da meia-noite. Retorna um Date local "wall clock", no mesmo padrão das
 * demais funções deste módulo. Sempre calculado no servidor (frontend/src/app/(app)/
 * agenda/page.tsx) e passado como prop para a Agenda — nunca recalculado de novo no
 * client, para não arriscar divergir do HTML já renderizado (hydration mismatch).
 */
export function getHojeBrasil(): Date {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const ano = Number(partes.find((parte) => parte.type === "year")?.value);
  const mes = Number(partes.find((parte) => parte.type === "month")?.value);
  const dia = Number(partes.find((parte) => parte.type === "day")?.value);

  return new Date(ano, mes - 1, dia);
}

/** Interpreta "YYYY-MM-DD" como data local (evita o parse UTC de `new Date(string)`). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  return next;
}

/** Início da semana (segunda-feira), como a Agenda exige colunas SEG—DOM. */
export function startOfWeek(date: Date): Date {
  const day = date.getDay(); // 0 = domingo
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(stripTime(date), diffToMonday);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Os 7 dias (SEG—DOM) da semana que contém `date`. */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Grade de 6 semanas (42 dias, começando na segunda) para a visão Mês — inclui dias do
 * mês anterior/seguinte para preencher a grade, como em qualquer calendário mensal.
 */
export function getMonthGrid(date: Date): Date[] {
  const firstOfMonth = startOfMonth(date);
  const gridStart = startOfWeek(firstOfMonth);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function formatWeekdayShort(date: Date): string {
  return WEEKDAY_SHORT_PT_BR[date.getDay()];
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

/** "dd/mm/aaaa" — usado fora da Agenda (ex.: módulo Clientes) onde o ano precisa aparecer. */
export function formatDateNumericBR(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatMonthYear(date: Date): string {
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatWeekRange(weekDays: Date[]): string {
  const start = weekDays[0];
  const end = weekDays[weekDays.length - 1];
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(end);
    return `${start.getDate()} – ${end.getDate()} de ${month}`;
  }
  return `${formatShortDate(start)} – ${formatLongDate(end)}`;
}

export function formatWeekdayLong(date: Date): string {
  const label = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}
