import { Injectable, NotFoundException } from '@nestjs/common';
import type { Servico, ServicosResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { SERVICOS_MOCK_RECORDS, type ServicoMockRecord } from './servicos.mock-data';

function toServico(registro: ServicoMockRecord): Servico {
  return {
    idServico: registro.idServico,
    nome: registro.nome,
    descricao: registro.descricao,
    duracaoMinutos: registro.duracaoMinutos,
    valor: registro.valor,
    status: registro.status,
  };
}

@Injectable()
export class ServicosService {
  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL).
   *
   * Decisão de regra de negócio (profissional): igual a ClientesService — `profissional`
   * vê o mesmo catálogo que `owner`, ativos e inativos, todos os serviços da própria
   * empresa. Serviços são catálogo da empresa, não um recurso vinculado a um
   * profissional específico (o schema real de SERVICOS, confirmado nos workflows n8n,
   * não tem nenhuma coluna de profissional) — não existe regra de negócio real para
   * restringir por profissional aqui.
   *
   * platform_admin (idEmpresa null): mesmo comportamento seguro por padrão já usado em
   * AgendaService/ClientesService — retorna lista vazia em vez de assumir acesso amplo.
   */
  listar(user: AuthenticatedUser): ServicosResponse {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    const doEmpresa = SERVICOS_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toServico) };
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos.
   */
  buscarPorId(user: AuthenticatedUser, idServico: string): Servico {
    const registro = user.idEmpresa
      ? SERVICOS_MOCK_RECORDS.find(
          (item) => item.idServico === idServico && item.idEmpresa === user.idEmpresa,
        )
      : undefined;

    if (!registro) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return toServico(registro);
  }
}
