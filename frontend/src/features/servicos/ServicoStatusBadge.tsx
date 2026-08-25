import { SERVICO_STATUS_META } from "./status";
import type { StatusServico } from "./types";
import { cn } from "@/lib/cn";

interface ServicoStatusBadgeProps {
  status: StatusServico;
  className?: string;
}

/** Nunca representa o status só pela cor — sempre com rótulo de texto. */
export function ServicoStatusBadge({ status, className }: ServicoStatusBadgeProps) {
  const meta = SERVICO_STATUS_META[status];
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
