/**
 * Tipos do domínio de Agenda do BeautyFlow App.
 *
 * `StatusAgendamento`/o formato base de `Agendamento` vêm de `@beautyflow/shared-types`
 * (contrato real de GET /agenda do backend NestJS) — não duplicados aqui. `Agendamento`
 * estende esse contrato com ids internos opcionais (idEmpresa/idCliente/idProfissional/
 * idServico): nenhum componente visual os lê hoje, mas os mocks locais (mock-data.ts)
 * continuam os fornecendo para referência/testes, por isso ficam como campos extras
 * opcionais em vez de removidos.
 */

import type { AgendaItem, StatusAgendamento as StatusAgendamentoCompartilhado } from "@beautyflow/shared-types";

export type StatusAgendamento = StatusAgendamentoCompartilhado;

export interface Agendamento extends AgendaItem {
  idEmpresa?: string;
  idCliente?: string;
  idProfissional?: string;
  idServico?: string;
}

export type VisaoAgenda = "dia" | "semana" | "mes";
