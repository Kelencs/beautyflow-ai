import type { StatusAgendamento, StatusConfirmacao } from "./types";

interface StatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
  /** Cor de texto isolada (sem fundo) — usada em espaços compactos como o card da Semana. */
  textClass: string;
}

/**
 * Ciclo de vida do atendimento (eixo 1 de 2 — ver StatusAgendamento em
 * @beautyflow/shared-types). Único ponto de mapeamento entre este status e
 * rótulo/cor/ícone: nenhum outro arquivo deve decidir a cor "na mão" — sempre importar
 * daqui (StatusBadge, AppointmentCard, MonthStatusLegend, AgendaSummary).
 */
export const STATUS_AGENDAMENTO_META: Record<StatusAgendamento, StatusMeta> = {
  AGENDADO: {
    label: "Agendado",
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

export const STATUS_AGENDAMENTO_ORDER: StatusAgendamento[] = ["AGENDADO", "CONCLUIDO", "CANCELADO"];

/**
 * Confirmação do cliente (eixo 2 de 2 — ver StatusConfirmacao em @beautyflow/shared-
 * types). Só se aplica enquanto o atendimento está AGENDADO; fora disso o valor de
 * origem é sempre `null` (não há meta correspondente para "sem confirmação aplicável" —
 * cada consumidor decide como exibir esse `null`, tipicamente com um "—").
 */
export const STATUS_CONFIRMACAO_META: Record<StatusConfirmacao, StatusMeta> = {
  PENDENTE: {
    label: "Pendente",
    badgeClass: "bg-amber-50 text-amber-800 ring-amber-600/20",
    dotClass: "bg-amber-500",
    textClass: "text-amber-700",
  },
  CONFIRMADO: {
    label: "Confirmado",
    badgeClass: "bg-violet-50 text-violet-800 ring-violet-600/20",
    dotClass: "bg-violet-500",
    textClass: "text-violet-700",
  },
};

export const STATUS_CONFIRMACAO_ORDER: StatusConfirmacao[] = ["PENDENTE", "CONFIRMADO"];
