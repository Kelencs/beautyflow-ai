import type { StatusAgendamento } from "./agenda";

/**
 * Contrato de GET /dashboard (backend NestJS). Inteiramente derivado dos mocks/regras já
 * existentes de Agenda/Clientes/Serviços/Profissionais — nenhum dado novo é inventado
 * aqui (ver DashboardService).
 */
export interface DashboardResumo {
  agendamentosHoje: number;
  confirmadosHoje: number;
  pendentesHoje: number;
  previstoHoje: number;
  totalClientes: number;
  clientesAtivos: number;
  profissionaisAtivos: number;
  servicosAtivos: number;
}

export interface DashboardProximoAtendimento {
  idAgendamento: string;
  /** Horário de início, formato "HH:mm". */
  horario: string;
  clienteNome: string;
  servicoNome: string;
  profissionalNome: string;
  status: StatusAgendamento;
}

export interface DashboardResponse {
  resumo: DashboardResumo;
  proximoAtendimento: DashboardProximoAtendimento | null;
  proximosAtendimentos: DashboardProximoAtendimento[];
}
