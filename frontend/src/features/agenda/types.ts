/**
 * Tipos do domínio de Agenda do BeautyFlow App.
 *
 * `StatusAgendamento`/`StatusConfirmacao`/o formato base de `Agendamento` vêm de
 * `@beautyflow/shared-types` (contrato real de GET /agenda do backend NestJS) — não
 * duplicados aqui. Os dois status são eixos independentes (ciclo de vida x confirmação
 * do cliente — ver o comentário de `StatusAgendamento` em shared-types/agenda.ts):
 * nenhum componente deve voltar a tratá-los como um único valor combinado.
 *
 * `Agendamento` estende `AgendaItem` com ids internos opcionais (idEmpresa/idCliente/
 * idProfissional/idServico): nenhum componente visual os lê hoje. Mantidos como campos
 * extras opcionais (não removidos) porque o mock isolado do backend (backend/src/agenda/
 * agenda.mock-data.ts) os fornece na mesma forma — o frontend já não tem um mock local
 * próprio de Agenda (removido por estar órfão: `/agenda` consome só GET /agenda real).
 */

import type {
  AgendaItem,
  StatusAgendamento as StatusAgendamentoCompartilhado,
  StatusConfirmacao as StatusConfirmacaoCompartilhado,
} from "@beautyflow/shared-types";

export type StatusAgendamento = StatusAgendamentoCompartilhado;
export type StatusConfirmacao = StatusConfirmacaoCompartilhado;

export interface Agendamento extends AgendaItem {
  idEmpresa?: string;
  idCliente?: string;
  idProfissional?: string;
  idServico?: string;
}

export type VisaoAgenda = "dia" | "semana" | "mes";
