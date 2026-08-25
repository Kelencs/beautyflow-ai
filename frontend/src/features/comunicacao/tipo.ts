import {
  Bell,
  CalendarCheck,
  ClipboardList,
  MessageCircleQuestion,
  type LucideIcon,
  UserRoundCheck,
  Wallet,
} from "lucide-react";
import type { TipoComunicacao } from "./types";

/**
 * Único ponto de mapeamento entre tipo de comunicação e rótulo/ícone/cor — nunca só cor
 * (ver seção 13 do pedido do módulo). CONFIRMACAO = mensagem ligada ao agendamento;
 * LEMBRETE = mensagem pré-atendimento; são deliberadamente distinguíveis (seção 26).
 */
export const TIPO_COMUNICACAO_META: Record<
  TipoComunicacao,
  { label: string; icon: LucideIcon; textClass: string; badgeClass: string }
> = {
  CONFIRMACAO: {
    label: "Confirmação",
    icon: CalendarCheck,
    textClass: "text-blue-700",
    badgeClass: "bg-blue-50 text-blue-800 ring-blue-600/20",
  },
  LEMBRETE: {
    label: "Lembrete",
    icon: Bell,
    textClass: "text-amber-700",
    badgeClass: "bg-amber-50 text-amber-800 ring-amber-600/20",
  },
  PESQUISA: {
    label: "Pesquisa",
    icon: ClipboardList,
    textClass: "text-violet-700",
    badgeClass: "bg-violet-50 text-violet-800 ring-violet-600/20",
  },
  FOLLOWUP: {
    label: "Follow-up",
    icon: UserRoundCheck,
    textClass: "text-teal-700",
    badgeClass: "bg-teal-50 text-teal-800 ring-teal-600/20",
  },
  COBRANCA: {
    label: "Cobrança",
    icon: Wallet,
    textClass: "text-rose-700",
    badgeClass: "bg-rose-50 text-rose-800 ring-rose-600/20",
  },
  OUTRO: {
    label: "Outro",
    icon: MessageCircleQuestion,
    textClass: "text-zinc-600",
    badgeClass: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  },
};
