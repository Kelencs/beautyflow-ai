import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Servico, ServicosResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayServicoIntegracao } from '../n8n-gateway/n8n-gateway.types';
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

/**
 * Converte o shape de integração devolvido pelo APP-WF019 (`servicos.listar`) para o DTO
 * público `Servico`. `descricao` vem já normalizada pelo workflow (`DESCRICAO` da aba
 * real — a coluna existe de fato; uma premissa anterior de que não existia estava
 * errada) e só é repassada aqui, nunca fabricada como string vazia/nome do serviço/texto
 * genérico. `duracaoMinutos`/`valor` já chegam normalizados e validados pelo workflow
 * (nunca NaN/negativo — a operação inteira falha lá se algum for inválido, não descarta
 * a linha). `status` é normalizado defensivamente, mesmo padrão de
 * `toClienteFromIntegracao`.
 */
function toServicoFromIntegracao(registro: N8nGatewayServicoIntegracao): Servico {
  return {
    idServico: registro.idServico,
    nome: registro.nome,
    descricao: registro.descricao,
    duracaoMinutos: registro.duracaoMinutos,
    valor: registro.valor,
    status: registro.status === 'INATIVO' ? 'INATIVO' : 'ATIVO',
  };
}

@Injectable()
export class ServicosService {
  constructor(
    private readonly configService: ConfigService,
    private readonly n8nGatewayClient: N8nGatewayClient,
  ) {}

  /** Flag por módulo (mesmo padrão de ClientesService/DATA_SOURCE_CLIENTES). */
  private usaFonteReal(): boolean {
    return this.configService.get<string>('DATA_SOURCE_SERVICOS') === 'n8n';
  }

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
   * Isso vale nos dois modos (mock/n8n): sem idEmpresa, nunca chega a chamar o gateway.
   *
   * Async por causa do modo `n8n` — mesmo motivo/mesmo padrão de ClientesService.listar()
   * na Fase 1. DashboardService (único outro consumidor) só precisou de `await`.
   */
  async listar(user: AuthenticatedUser): Promise<ServicosResponse> {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    if (this.usaFonteReal()) {
      return this.listarViaGateway(user.idEmpresa);
    }

    const doEmpresa = SERVICOS_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toServico) };
  }

  /**
   * Nunca cai silenciosamente no mock quando o gateway falha — mesmo padrão de
   * ClientesService.listarViaGateway.
   */
  private async listarViaGateway(idEmpresa: string): Promise<ServicosResponse> {
    try {
      const registros = await this.n8nGatewayClient.call<N8nGatewayServicoIntegracao[]>(
        'servicos.listar',
        idEmpresa,
      );
      return { data: registros.map(toServicoFromIntegracao) };
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        throw new ServiceUnavailableException(
          'Não foi possível obter os serviços no momento. Tente novamente em instantes.',
        );
      }
      throw error;
    }
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos.
   *
   * Modo `n8n`: como o APP-WF019 só conhece `servicos.listar` (não existe
   * `servicos.obter` nesta fase), reaproveita a lista já tenant-scoped e localiza o ID no
   * próprio NestJS — mesmo padrão já aprovado em Clientes (seção 21 do pedido da Fase 2).
   */
  async buscarPorId(user: AuthenticatedUser, idServico: string): Promise<Servico> {
    if (this.usaFonteReal()) {
      const { data } = await this.listar(user);
      const servico = data.find((item) => item.idServico === idServico);
      if (!servico) {
        throw new NotFoundException('Serviço não encontrado.');
      }
      return servico;
    }

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
