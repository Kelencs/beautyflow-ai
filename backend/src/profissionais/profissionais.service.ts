import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profissional, ProfissionaisResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PROFISSIONAIS_MOCK_RECORDS, type ProfissionalMockRecord } from './profissionais.mock-data';

function toProfissional(registro: ProfissionalMockRecord): Profissional {
  return {
    idProfissional: registro.idProfissional,
    nome: registro.nome,
    telefone: registro.telefone,
    email: registro.email,
    especialidade: registro.especialidade,
    status: registro.status,
    totalAtendimentos: registro.totalAtendimentos,
    proximoAtendimento: registro.proximoAtendimento,
  };
}

@Injectable()
export class ProfissionaisService {
  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL).
   *
   * Decisão de regra de negócio (profissional): `profissional` vê a mesma equipe que
   * `owner` — todos os profissionais da própria empresa, ativos e inativos. A equipe
   * completa pode ser necessária em fluxos como agendamento e encaminhamento de
   * clientes; não existe hoje regra de negócio real que restrinja um profissional a "ver
   * só a si mesmo", então não inventei essa restrição.
   *
   * platform_admin (idEmpresa null): mesmo comportamento seguro por padrão já usado em
   * Agenda/Clientes/ServicosService — retorna lista vazia em vez de assumir acesso amplo.
   */
  listar(user: AuthenticatedUser): ProfissionaisResponse {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    const doEmpresa = PROFISSIONAIS_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toProfissional) };
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos.
   */
  buscarPorId(user: AuthenticatedUser, idProfissional: string): Profissional {
    const registro = user.idEmpresa
      ? PROFISSIONAIS_MOCK_RECORDS.find(
          (item) => item.idProfissional === idProfissional && item.idEmpresa === user.idEmpresa,
        )
      : undefined;

    if (!registro) {
      throw new NotFoundException('Profissional não encontrado.');
    }

    return toProfissional(registro);
  }
}
