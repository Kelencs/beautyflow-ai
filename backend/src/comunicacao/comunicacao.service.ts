import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ComunicacaoItem,
  ComunicacaoResponse,
  ComunicacaoResumo,
} from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { COMUNICACAO_MOCK_RECORDS, type ComunicacaoMockRecord } from './comunicacao.mock-data';
import type { ComunicacaoQuery } from './dto/comunicacao-query.dto';

const RESUMO_VAZIO: ComunicacaoResumo = {
  totalPeriodo: 0,
  enviadas: 0,
  comFalha: 0,
};

function toComunicacaoItem(registro: ComunicacaoMockRecord): ComunicacaoItem {
  return {
    idComunicacao: registro.idComunicacao,
    tipo: registro.tipo,
    clienteNome: registro.clienteNome,
    telefone: registro.telefone,
    dataHora: registro.dataHora,
    mensagem: registro.mensagem,
    status: registro.status,
    idAgendamento: registro.idAgendamento,
    profissionalNome: registro.profissionalNome,
    valorRelacionado: registro.valorRelacionado,
  };
}

function calcularResumo(registros: ComunicacaoItem[]): ComunicacaoResumo {
  return registros.reduce(
    (resumo, registro) => ({
      totalPeriodo: resumo.totalPeriodo + 1,
      enviadas: resumo.enviadas + (registro.status === 'ENVIADA' ? 1 : 0),
      comFalha: resumo.comFalha + (registro.status === 'FALHA' ? 1 : 0),
    }),
    { ...RESUMO_VAZIO },
  );
}

@Injectable()
export class ComunicacaoService {
  /**
   * Filtra SEMPRE por user.idEmpresa (nunca por parâmetro de URL — GET /comunicacao não
   * aceita id_empresa, ver ComunicacaoController). Regras por perfil:
   *
   * - platform_admin (idEmpresa null): resumo/lista vazios, mesmo comportamento seguro
   *   por padrão já usado em todos os demais módulos.
   * - owner: vê todas as comunicações da própria empresa.
   * - profissional: vê SOMENTE as comunicações ligadas aos próprios atendimentos
   *   (idProfissional == o seu), mesma lógica de AgendaService/FinanceiroService. Como
   *   FOLLOWUP não tem vínculo seguro de profissional no schema real (sem
   *   ID_AGENDAMENTO — é reengajamento de cliente, não atendimento específico), os
   *   registros desse tipo têm idProfissional=null no mock e por isso NUNCA aparecem
   *   para um profissional comum (só para owner) — decisão conservadora deliberada, em
   *   vez de inventar uma associação que o schema real não sustenta.
   */
  listar(user: AuthenticatedUser, query: ComunicacaoQuery): ComunicacaoResponse {
    if (!user.idEmpresa) {
      return { resumo: { ...RESUMO_VAZIO }, data: [] };
    }

    const doEmpresa = COMUNICACAO_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );

    const doPeriodo = doEmpresa.filter((registro) => {
      const data = registro.dataHora.slice(0, 10);
      return data >= query.dataInicio && data <= query.dataFim;
    });

    const doPerfil =
      user.perfil === 'profissional'
        ? doPeriodo.filter((registro) => registro.idProfissional === user.idProfissional)
        : doPeriodo;

    const doTipo = query.tipo
      ? doPerfil.filter((registro) => registro.tipo === query.tipo)
      : doPerfil;

    const doStatus = query.status
      ? doTipo.filter((registro) => registro.status === query.status)
      : doTipo;

    const data = doStatus.map(toComunicacaoItem);
    return { resumo: calcularResumo(data), data };
  }

  /**
   * Mesma regra de 404 idêntico (inexistente, de outra empresa, ou fora do escopo do
   * profissional) já usada nos demais módulos — nunca revela a existência cross-tenant
   * nem cross-profissional.
   */
  buscarPorId(user: AuthenticatedUser, idComunicacao: string): ComunicacaoItem {
    const registro = user.idEmpresa
      ? COMUNICACAO_MOCK_RECORDS.find(
          (item) => item.idComunicacao === idComunicacao && item.idEmpresa === user.idEmpresa,
        )
      : undefined;

    if (!registro) {
      throw new NotFoundException('Comunicação não encontrada.');
    }

    if (user.perfil === 'profissional' && registro.idProfissional !== user.idProfissional) {
      throw new NotFoundException('Comunicação não encontrada.');
    }

    return toComunicacaoItem(registro);
  }
}
