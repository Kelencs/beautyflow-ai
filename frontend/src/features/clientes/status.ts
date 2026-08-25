import type { StatusCliente } from "./types";

/**
 * Único ponto de mapeamento entre status de cliente e rótulo/cor — mesmo padrão de
 * features/agenda/status.ts. Nenhum outro arquivo decide a cor de um status "na mão".
 */
export const CLIENTE_STATUS_META: Record<
  StatusCliente,
  { label: string; badgeClass: string; dotClass: string; textClass: string }
> = {
  ATIVO: {
    label: "Ativo",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  },
  INATIVO: {
    label: "Inativo",
    badgeClass: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
    dotClass: "bg-zinc-400",
    textClass: "text-zinc-500",
  },
};
