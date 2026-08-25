import {
  CalendarClock,
  CalendarPlus,
  CalendarX,
  type LucideIcon,
  MessageCircleQuestion,
  Search,
} from "lucide-react";
import type { IaIntencaoCodigo } from "./types";

/**
 * Único ponto de mapeamento entre código de intenção e ícone/cor — nunca só cor. Códigos
 * confirmados no Switch real de WF003 (AGENDAR/CONSULTAR_DISPONIBILIDADE/REAGENDAR/
 * CANCELAR) + OUTRO (default de normalização quando a intenção não bate com nenhum dos 4).
 */
export const INTENCAO_META: Record<IaIntencaoCodigo, { icon: LucideIcon; badgeClass: string }> = {
  AGENDAR: { icon: CalendarPlus, badgeClass: "bg-blue-50 text-blue-800 ring-blue-600/20" },
  CONSULTAR_DISPONIBILIDADE: { icon: Search, badgeClass: "bg-violet-50 text-violet-800 ring-violet-600/20" },
  REAGENDAR: { icon: CalendarClock, badgeClass: "bg-amber-50 text-amber-800 ring-amber-600/20" },
  CANCELAR: { icon: CalendarX, badgeClass: "bg-rose-50 text-rose-800 ring-rose-600/20" },
  OUTRO: { icon: MessageCircleQuestion, badgeClass: "bg-zinc-100 text-zinc-600 ring-zinc-500/20" },
};
