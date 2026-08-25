import type { Agendamento, VisaoAgenda } from "./types";
import { getWeekDays, isSameDay, isSameMonth, parseISODate } from "@/lib/date";
import { cn } from "@/lib/cn";

interface AgendaSummaryProps {
  view: VisaoAgenda;
  referenceDate: Date;
  agendamentos: Agendamento[];
}

const PERIODO_LABEL: Record<VisaoAgenda, string> = {
  dia: "hoje",
  semana: "na semana",
  mes: "no mês",
};

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    value,
  );
}

/** Filtra os agendamentos que pertencem ao período da visão atual — sem duplicar a lógica por card. */
function filtrarPorPeriodo(agendamentos: Agendamento[], view: VisaoAgenda, referenceDate: Date): Agendamento[] {
  if (view === "dia") {
    return agendamentos.filter((a) => isSameDay(parseISODate(a.data), referenceDate));
  }
  if (view === "semana") {
    const dias = getWeekDays(referenceDate);
    return agendamentos.filter((a) => {
      const data = parseISODate(a.data);
      return dias.some((dia) => isSameDay(dia, data));
    });
  }
  return agendamentos.filter((a) => isSameMonth(parseISODate(a.data), referenceDate));
}

/** Cartões discretos de contexto do período selecionado — nunca deve virar um mini-dashboard financeiro. */
export function AgendaSummary({ view, referenceDate, agendamentos }: AgendaSummaryProps) {
  const doPeriodo = filtrarPorPeriodo(agendamentos, view, referenceDate);
  const confirmados = doPeriodo.filter((a) => a.status === "CONFIRMADO").length;
  const pendentes = doPeriodo.filter((a) => a.status === "PENDENTE").length;
  const concluidos = doPeriodo.filter((a) => a.status === "CONCLUIDO").length;
  const cancelados = doPeriodo.filter((a) => a.status === "CANCELADO").length;
  const previsto = doPeriodo
    .filter((a) => a.status !== "CANCELADO")
    .reduce((soma, a) => soma + a.valor, 0);

  const periodo = PERIODO_LABEL[view];
  // Concluídos/cancelados só como texto auxiliar discreto do card "Agendamentos", e só
  // na visão Mês — em Dia/Semana essa quebra por status normalmente não agrega nada
  // (poucos itens, já visíveis na grade inteira).
  const auxiliarAgendamentos =
    view === "mes"
      ? `${concluidos} concluído${concluidos === 1 ? "" : "s"} · ${cancelados} cancelado${cancelados === 1 ? "" : "s"}`
      : null;

  const cards: { label: string; value: string; auxiliar: string | null }[] = [
    { label: `Agendamentos ${periodo}`, value: String(doPeriodo.length), auxiliar: auxiliarAgendamentos },
    { label: "Confirmados", value: String(confirmados), auxiliar: null },
    { label: "Pendentes", value: String(pendentes), auxiliar: null },
    { label: `Previsto ${periodo}`, value: formatBRL(previsto), auxiliar: null },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3",
          )}
        >
          <dt className="text-xs text-zinc-500">{card.label}</dt>
          <dd className="mt-0.5 text-lg font-semibold text-zinc-900 sm:text-xl">{card.value}</dd>
          {card.auxiliar && <dd className="mt-0.5 truncate text-[11px] text-zinc-400">{card.auxiliar}</dd>}
        </div>
      ))}
    </dl>
  );
}
