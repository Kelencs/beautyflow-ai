import { STATUS_META } from "./status";
import { StatusBadge } from "./StatusBadge";
import type { Agendamento } from "./types";
import { cn } from "@/lib/cn";

interface AppointmentCardProps {
  agendamento: Agendamento;
  variant?: "full" | "compact" | "chip";
  onSelect: (agendamento: Agendamento) => void;
}

/**
 * Um único componente de cartão de agendamento, com 3 densidades visuais reaproveitadas
 * em Dia ("full"), Semana ("compact") e Mês ("chip") — evita duplicar a lógica/estilo de
 * cartão em cada visão.
 */
export function AppointmentCard({ agendamento, variant = "full", onSelect }: AppointmentCardProps) {
  const meta = STATUS_META[agendamento.status];
  const isCancelado = agendamento.status === "CANCELADO";

  if (variant === "chip") {
    const accessibleLabel = `${agendamento.horaInicio} — ${agendamento.clienteNome}, ${meta.label}`;
    return (
      <button
        type="button"
        onClick={() => onSelect(agendamento)}
        title={accessibleLabel}
        aria-label={accessibleLabel}
        className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] leading-tight text-zinc-700 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-600"
      >
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dotClass)} aria-hidden="true" />
        <span className="shrink-0 tabular-nums text-zinc-500" aria-hidden="true">
          {agendamento.horaInicio}
        </span>
        <span
          className={cn("truncate font-medium", isCancelado && "text-zinc-400 line-through")}
          aria-hidden="true"
        >
          {agendamento.clienteNome}
        </span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => onSelect(agendamento)}
        className={cn(
          "flex w-full flex-col gap-0.5 rounded-lg border border-zinc-200 bg-white p-2 text-left shadow-sm transition hover:border-violet-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-600",
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-medium tabular-nums text-zinc-500">
            {agendamento.horaInicio}–{agendamento.horaFim}
          </span>
          <span className="flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dotClass)} aria-hidden="true" />
            <span className={cn("text-[10px] font-medium", meta.textClass)}>{meta.label}</span>
          </span>
        </div>
        <span className={cn("truncate text-sm font-semibold text-zinc-900", isCancelado && "text-zinc-400 line-through")}>
          {agendamento.clienteNome}
        </span>
        <span className="truncate text-xs text-zinc-500">{agendamento.servicoNome}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(agendamento)}
      className="flex w-full items-stretch overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-violet-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    >
      <span className={cn("w-1.5 shrink-0", meta.dotClass)} aria-hidden="true" />
      <span className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <span className="min-w-0">
          <span className={cn("block truncate text-sm font-semibold text-zinc-900", isCancelado && "text-zinc-400 line-through")}>
            {agendamento.clienteNome}
          </span>
          <span className="block truncate text-sm text-zinc-500">{agendamento.servicoNome}</span>
          <span className="mt-1 block text-xs text-zinc-400">
            {agendamento.horaInicio} — {agendamento.horaFim} · {agendamento.profissionalNome}
          </span>
        </span>
        <StatusBadge status={agendamento.status} />
      </span>
    </button>
  );
}
