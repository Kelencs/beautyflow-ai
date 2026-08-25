import type { StatusServico } from "./types";

/**
 * Único ponto de mapeamento entre status de serviço e rótulo/cor — mesmo padrão de
 * features/agenda/status.ts e features/clientes/status.ts.
 */
export const SERVICO_STATUS_META: Record<
  StatusServico,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ATIVO: {
    label: "Ativo",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
  },
  INATIVO: {
    label: "Inativo",
    badgeClass: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
    dotClass: "bg-zinc-400",
  },
};
