import { CLIENTE_STATUS_META } from "./status";
import type { StatusCliente } from "./types";
import { cn } from "@/lib/cn";

interface ClienteStatusBadgeProps {
  status: StatusCliente;
  className?: string;
}

/** Nunca representa o status só pela cor — sempre com rótulo de texto (ver StatusBadge da Agenda). */
export function ClienteStatusBadge({ status, className }: ClienteStatusBadgeProps) {
  const meta = CLIENTE_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
