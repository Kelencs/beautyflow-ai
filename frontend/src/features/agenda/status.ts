import type { StatusAgendamento } from "./types";

/**
 * Único ponto de mapeamento entre status e rótulo/cor/ícone. Nenhum outro arquivo deve
 * decidir a cor de um status "na mão" — sempre importar daqui (StatusBadge e qualquer
 * outro lugar que precise, ex.: o resumo do dia).
 */
export const STATUS_META: Record<
  StatusAgendamento,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    /** Cor de texto isolada (sem fundo) — usada em espaços compactos como o card da Semana. */
    textClass: string;
  }
> = {
  PENDENTE: {
    label: "Pendente",
    badgeClass: "bg-amber-50 text-amber-800 ring-amber-600/20",
    dotClass: "bg-amber-500",
    textClass: "text-amber-700",
  },
  CONFIRMADO: {
    label: "Confirmado",
    badgeClass: "bg-blue-50 text-blue-800 ring-blue-600/20",
    dotClass: "bg-blue-500",
    textClass: "text-blue-700",
  },
  CONCLUIDO: {
    label: "Concluído",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  },
  CANCELADO: {
    label: "Cancelado",
    badgeClass: "bg-rose-50 text-rose-800 ring-rose-600/20",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700",
  },
};

export const STATUS_ORDER: StatusAgendamento[] = [
  "PENDENTE",
  "CONFIRMADO",
  "CONCLUIDO",
  "CANCELADO",
];
