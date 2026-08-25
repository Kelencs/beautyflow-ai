import { Injectable, NotFoundException } from '@nestjs/common';
import type { Cliente, ClienteDetalhado, ClientesResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CLIENTES_HISTORICO_MOCK,
  CLIENTES_MOCK_RECORDS,
  type ClienteMockRecord,
} from './clientes.mock-data';

function toCliente(registro: ClienteMockRecord): Cliente {
  return {
    idCliente: registro.idCliente,
    nome: registro.nome,
    telefone: registro.telefone,
    email: registro.email,
    dataNascimento: registro.dataNascimento,
    status: registro.status,
    clienteDesde: registro.clienteDesde,
    ultimoAtendimento: registro.ultimoAtendimento,
    proximoAtendimento: registro.proximoAtendimento,
    totalAtendimentos: registro.totalAtendimentos,
    totalGasto: registro.totalGasto,
    observacoes: registro.observacoes,
  };
}

@Injectable()
export class ClientesService {
  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL).
   *
   * Decisão de regra de negócio (profissional): nesta etapa, `profissional` vê os
   * mesmos clientes que `owner` — todos os clientes da própria empresa. Não existe hoje
   * (nem no schema real de CLIENTES usado pelos workflows n8n, nem no mock) um vínculo
   * exclusivo cliente<->profissional; qualquer profissional do salão pode atender
   * qualquer cliente da empresa, e precisa conseguir localizá-lo (ex.: para agendar).
   * Restringir por profissional exigiria inventar um vínculo que não existe na regra de
   * negócio real do BeautyFlow — por isso a filtragem aqui é só por empresa, igual ao
   * owner. Caso essa regra mude no futuro, o ponto de ajuste é só este método.
   *
   * platform_admin (idEmpresa null): mesmo comportamento seguro por padrão já usado em
   * AgendaService — sem endpoint administrativo cross-tenant dedicado ainda, retorna
   * lista vazia em vez de assumir acesso amplo.
   */
  listar(user: AuthenticatedUser): ClientesResponse {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    const doEmpresa = CLIENTES_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toCliente) };
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos (evita confirmar a outro tenant que um ID existe).
   */
  buscarPorId(user: AuthenticatedUser, idCliente: string): ClienteDetalhado {
    const registro = user.idEmpresa
      ? CLIENTES_MOCK_RECORDS.find(
          (item) => item.idCliente === idCliente && item.idEmpresa === user.idEmpresa,
        )
      : undefined;

    if (!registro) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return {
      ...toCliente(registro),
      historico: CLIENTES_HISTORICO_MOCK[registro.idCliente] ?? [],
    };
  }
}
