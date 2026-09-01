import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Profissional, ProfissionaisResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayProfissionalIntegracao } from '../n8n-gateway/n8n-gateway.types';
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

/**
 * Converte o shape de integração devolvido pelo APP-WF019 (`profissionais.listar`) para o
 * DTO público `Profissional`. A aba PROFISSIONAIS real (correção de schema desta tarefa)
 * tem 12 colunas — `especialidade`/`telefone`/`email` **existem** de fato e são
 * repassados tal como o WF019 já normalizou (trim, vazio/ausente vira `null`, nunca
 * fabricados/inferidos por nome ou serviço). `totalAtendimentos`/`proximoAtendimento`
 * continuam `null` pelo mesmo motivo de `toClienteFromIntegracao` em clientes.service.ts:
 * dependeriam de AGENDAMENTOS, fora do escopo desta fase — "ainda não sabemos", não "é
 * zero"/"não há". `status` é normalizado defensivamente (mesmo padrão de
 * Clientes/Serviços), embora o WF019 já garanta upstream que só chega aqui
 * `'ATIVO'`/`'INATIVO'`.
 */
function toProfissionalFromIntegracao(registro: N8nGatewayProfissionalIntegracao): Profissional {
  return {
    idProfissional: registro.idProfissional,
    nome: registro.nome,
    telefone: registro.telefone,
    email: registro.email,
    especialidade: registro.especialidade,
    status: registro.status === 'INATIVO' ? 'INATIVO' : 'ATIVO',
    totalAtendimentos: null,
    proximoAtendimento: null,
  };
}

@Injectable()
export class ProfissionaisService {
  constructor(
    private readonly configService: ConfigService,
    private readonly n8nGatewayClient: N8nGatewayClient,
  ) {}

  /** Flag por módulo (mesmo padrão de Clientes/ServicosService). */
  private usaFonteReal(): boolean {
    return this.configService.get<string>('DATA_SOURCE_PROFISSIONAIS') === 'n8n';
  }

  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL).
   *
   * Decisão de regra de negócio (profissional): preservada exatamente como já estava —
   * `profissional` vê a mesma equipe que `owner`, todos os profissionais da própria
   * empresa, ativos e inativos. Não existe hoje regra real que restrinja um profissional a
   * "ver só a si mesmo"; nada nesta fase altera essa política.
   *
   * platform_admin (idEmpresa null): mesmo comportamento seguro por padrão já usado em
   * Agenda/Clientes/ServicosService — retorna lista vazia em vez de assumir acesso amplo.
   * Isso vale nos dois modos (mock/n8n): sem idEmpresa, nunca chega a chamar o gateway.
   *
   * Async por causa do modo `n8n` — mesmo motivo/mesmo padrão de Clientes/ServicosService
   * nas Fases 1/2. DashboardService (único outro consumidor) só precisou de `await`.
   */
  async listar(user: AuthenticatedUser): Promise<ProfissionaisResponse> {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    if (this.usaFonteReal()) {
      return this.listarViaGateway(user.idEmpresa);
    }

    const doEmpresa = PROFISSIONAIS_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toProfissional) };
  }

  /**
   * Nunca cai silenciosamente no mock quando o gateway falha — mesmo padrão de
   * Clientes/ServicosService.listarViaGateway.
   */
  private async listarViaGateway(idEmpresa: string): Promise<ProfissionaisResponse> {
    try {
      const registros = await this.n8nGatewayClient.call<N8nGatewayProfissionalIntegracao[]>(
        'profissionais.listar',
        idEmpresa,
      );
      return { data: registros.map(toProfissionalFromIntegracao) };
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        throw new ServiceUnavailableException(
          'Não foi possível obter os profissionais no momento. Tente novamente em instantes.',
        );
      }
      throw error;
    }
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos.
   *
   * Modo `n8n`: como o APP-WF019 só conhece `profissionais.listar` (não existe
   * `profissionais.obter` nesta fase), reaproveita a lista já tenant-scoped e localiza o
   * ID no próprio NestJS — mesmo padrão já aprovado em Clientes/Serviços.
   */
  async buscarPorId(user: AuthenticatedUser, idProfissional: string): Promise<Profissional> {
    if (this.usaFonteReal()) {
      const { data } = await this.listar(user);
      const profissional = data.find((item) => item.idProfissional === idProfissional);
      if (!profissional) {
        throw new NotFoundException('Profissional não encontrado.');
      }
      return profissional;
    }

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
