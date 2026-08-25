import { STATUS_META } from "./status";
import type { StatusAgendamento } from "./types";
import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: StatusAgendamento;
  className?: string;
}

/**
 * Nunca representa o status só pela cor: sempre com um rótulo de texto ao lado do
 * indicador colorido (acessibilidade — não depender exclusivamente de cor).
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = STATUS_META[status];
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
