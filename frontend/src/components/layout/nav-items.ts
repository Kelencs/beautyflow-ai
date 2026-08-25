import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Calendar,
  LayoutDashboard,
  MessageCircle,
  Scissors,
  Settings,
  Users,
  UserSquare2,
  Wallet,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Módulos ainda não implementados exibem "Em breve" em vez de rota funcional. */
  available: boolean;
  /**
   * Só quando `true`: item oculto para qualquer perfil != "owner". A UI é só a primeira
   * camada — a autorização real vive no backend (GET /configuracoes retorna 403 para
   * profissional/platform_admin independente do que a sidebar mostra).
   */
  ownerOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, available: true },
  { href: "/agenda", label: "Agenda", icon: Calendar, available: true },
  { href: "/clientes", label: "Clientes", icon: Users, available: true },
  { href: "/servicos", label: "Serviços", icon: Scissors, available: true },
  { href: "/profissionais", label: "Profissionais", icon: UserSquare2, available: true },
  { href: "/financeiro", label: "Financeiro", icon: Wallet, available: true },
  { href: "/comunicacao", label: "Comunicação", icon: MessageCircle, available: true },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3, available: true },
  { href: "/ia", label: "IA", icon: Bot, available: true, ownerOnly: true },
  { href: "/configuracoes", label: "Configurações", icon: Settings, available: true, ownerOnly: true },
];
