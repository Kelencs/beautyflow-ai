import { STATUS_META, STATUS_ORDER } from "./status";
import { cn } from "@/lib/cn";

/**
 * Legenda pequena e discreta só da visão Mês — bolinha + texto (nunca só cor), lendo a
 * mesma fonte central de status (STATUS_META/STATUS_ORDER) usada pelos chips do
 * calendário, StatusBadge e AppointmentCard. Nenhuma cor é redefinida aqui.
 */
export function MonthStatusLegend() {
  return (
    <ul
      aria-label="Legenda de status dos agendamentos"
      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500"
    >
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        return (
          <li key={status} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.dotClass)} aria-hidden="true" />
            <span>{meta.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
