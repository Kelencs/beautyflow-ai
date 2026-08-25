import type { StatusPagamento } from "./types";

/**
 * Único ponto de mapeamento entre status de pagamento e rótulo/cor — mesmo padrão de
 * features/agenda/status.ts e features/servicos/status.ts. PENDENTE usa rose (nenhum
 * valor recebido ainda) em vez do amber usado pela Agenda para o mesmo nome de status —
 * aqui o significado é diferente ("nada pago"), então a cor mais chamativa é deliberada.
 */
export const PAGAMENTO_STATUS_META: Record<
  StatusPagamento,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PAGO: {
    label: "Pago",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
  },
  PARCIAL: {
    label: "Parcial",
    badgeClass: "bg-amber-50 text-amber-800 ring-amber-600/20",
    dotClass: "bg-amber-500",
  },
  PENDENTE: {
    label: "Pendente",
    badgeClass: "bg-rose-50 text-rose-800 ring-rose-600/20",
    dotClass: "bg-rose-500",
  },
};
