import { INTENCAO_META } from "./intencao";
import type { IaIntencao, IaIntencaoCodigo } from "./types";
import { cn } from "@/lib/cn";

interface IntencaoBadgeProps {
  codigo: IaIntencaoCodigo;
  intencoes: IaIntencao[];
  className?: string;
}

/** Texto (nome amigável vindo do backend) + ícone — nunca representa a intenção só pela cor. */
export function IntencaoBadge({ codigo, intencoes, className }: IntencaoBadgeProps) {
  const meta = INTENCAO_META[codigo];
  const nome = intencoes.find((item) => item.codigo === codigo)?.nome ?? codigo;
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
      {nome}
    </span>
  );
}
