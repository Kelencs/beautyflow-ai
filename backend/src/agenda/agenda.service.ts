import { Injectable } from '@nestjs/common';
import type { AgendaItem, AgendaResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AGENDA_MOCK_RECORDS, type AgendaMockRecord } from './agenda.mock-data';
import type { AgendaQuery } from './dto/agenda-query.dto';

function toAgendaItem(registro: AgendaMockRecord): AgendaItem {
  return {
    idAgendamento: registro.idAgendamento,
    clienteNome: registro.clienteNome,
    clienteTelefone: registro.clienteTelefone,
    profissionalNome: registro.profissionalNome,
    servicoNome: registro.servicoNome,
    data: registro.data,
    horaInicio: registro.horaInicio,
    horaFim: registro.horaFim,
    status: registro.status,
    valor: registro.valor,
  };
}

@Injectable()
export class AgendaService {
  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL — a
   * rota não aceita esse parâmetro, ver AgendaController). Regras por perfil:
   *
   * - platform_admin (idEmpresa null, por chk_usuarios_empresa_obrigatoria): sem
   *   endpoint administrativo cross-tenant dedicado ainda, retorna lista vazia em vez
   *   de assumir acesso amplo — comportamento seguro por padrão até existir uma rota
   *   administrativa própria e explícita para esse caso.
   * - owner: vê todos os agendamentos da própria empresa.
   * - profissional: vê somente os agendamentos com idProfissional == o seu.
   */
  listar(user: AuthenticatedUser, query: AgendaQuery): AgendaResponse {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    const doEmpresa = AGENDA_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );

    const doPeriodo = doEmpresa.filter(
      (registro) => registro.data >= query.dataInicio && registro.data <= query.dataFim,
    );

    const visiveis =
      user.perfil === 'profissional'
        ? doPeriodo.filter((registro) => registro.idProfissional === user.idProfissional)
        : doPeriodo;

    return { data: visiveis.map(toAgendaItem) };
  }
}
