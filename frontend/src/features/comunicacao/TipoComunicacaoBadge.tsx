import { TIPO_COMUNICACAO_META } from "./tipo";
import type { TipoComunicacao } from "./types";
import { cn } from "@/lib/cn";

interface TipoComunicacaoBadgeProps {
  tipo: TipoComunicacao;
  className?: string;
}

/** Texto + ícone + cor discreta — nunca representa o tipo só pela cor (seção 13 do pedido). */
export function TipoComunicacaoBadge({ tipo, className }: TipoComunicacaoBadgeProps) {
  const meta = TIPO_COMUNICACAO_META[tipo];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
