import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cliente, ClienteDetalhado, ClientesResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayClienteIntegracao } from '../n8n-gateway/n8n-gateway.types';
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

/**
 * Converte o shape de integração devolvido pelo APP-WF019 (`clientes.listar`) para o DTO
 * público `Cliente`. A aba CLIENTES (sozinha, sem cruzar com AGENDAMENTOS/PAGAMENTOS —
 * fora do escopo desta Fase 1) não tem coluna para "próximo atendimento" nem para totais
 * de atendimento/gasto.
 *
 * IMPORTANTE (corrigido nesta tarefa): `totalAtendimentos`/`totalGasto` usam `null`, não
 * `0` — `0` afirmaria "sabemos que é zero", o que é falso; a informação real é "ainda não
 * sabemos" (dependeria de AGENDAMENTOS/PAGAMENTOS). Nunca renderizar isto como "0
 * atendimentos"/"R$ 0,00" no frontend (ver ClienteCardList.tsx/ClientesTable.tsx/
 * ClienteDetailsDrawer.tsx). `proximoAtendimento: null` aqui especificamente significa
 * "não sabemos", não "não há" — o tipo já era nullable para o outro significado também,
 * então nenhuma mudança de contrato foi necessária para este campo, só de comentário
 * (ver libs/shared-types/src/clientes.ts).
 *
 * `status` é normalizado defensivamente: qualquer valor além de 'INATIVO' vindo do
 * gateway é tratado como 'ATIVO' (nunca confia cegamente no shape de um valor livre vindo
 * de fora).
 */
function toClienteFromIntegracao(registro: N8nGatewayClienteIntegracao): Cliente {
  return {
    idCliente: registro.idCliente,
    nome: registro.nome,
    telefone: registro.telefone,
    email: registro.email,
    dataNascimento: registro.dataNascimento,
    status: registro.status === 'INATIVO' ? 'INATIVO' : 'ATIVO',
    clienteDesde: registro.clienteDesde ?? '',
    ultimoAtendimento: registro.ultimoAtendimento,
    // Sem fonte na aba CLIENTES isolada nesta Fase 1 — "não sabemos", não "não há".
    proximoAtendimento: null,
    // "Não sabemos ainda" — nunca 0 (ver comentário da função acima).
    totalAtendimentos: null,
    totalGasto: null,
    observacoes: registro.observacoes,
  };
}

@Injectable()
export class ClientesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly n8nGatewayClient: N8nGatewayClient,
  ) {}

  /**
   * Flag por módulo (seção 18/34 do pedido — não uma flag global nem um adapter/
   * repository completo). Default seguro é 'mock' quando ausente/valor desconhecido:
   * atualizar o código nunca troca o comportamento existente sem uma decisão explícita.
   */
  private usaFonteReal(): boolean {
    return this.configService.get<string>('DATA_SOURCE_CLIENTES') === 'n8n';
  }

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
   * lista vazia em vez de assumir acesso amplo. Isso vale nos dois modos (mock/n8n): sem
   * idEmpresa, nunca chega a chamar o gateway.
   *
   * Async por causa do modo `n8n` (chamada HTTP ao gateway) — DashboardService/
   * RelatoriosService, que injetam este service, foram ajustados só para `await` essa
   * chamada (zero mudança de regra de negócio neles; ver relatório da Fase 1).
   */
  async listar(user: AuthenticatedUser): Promise<ClientesResponse> {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    if (this.usaFonteReal()) {
      return this.listarViaGateway(user.idEmpresa);
    }

    const doEmpresa = CLIENTES_MOCK_RECORDS.filter(
      (registro) => registro.idEmpresa === user.idEmpresa,
    );
    return { data: doEmpresa.map(toCliente) };
  }

  /**
   * Nunca cai silenciosamente no mock quando o gateway falha (seção 19/33 do pedido) —
   * propaga um erro técnico controlado (503), sem detalhe interno (URL/API key/stack),
   * para quem chamou. O log técnico com o `code`/`requestId` reais já foi feito dentro de
   * N8nGatewayClient.
   */
  private async listarViaGateway(idEmpresa: string): Promise<ClientesResponse> {
    try {
      const registros = await this.n8nGatewayClient.call<N8nGatewayClienteIntegracao[]>(
        'clientes.listar',
        idEmpresa,
      );
      return { data: registros.map(toClienteFromIntegracao) };
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        throw new ServiceUnavailableException(
          'Não foi possível obter os clientes no momento. Tente novamente em instantes.',
        );
      }
      throw error;
    }
  }

  /**
   * 404 tanto para "não existe" quanto para "existe em outra empresa" — nunca revela a
   * diferença entre os dois casos (evita confirmar a outro tenant que um ID existe).
   *
   * Modo `n8n` (seção 20/21 do pedido): como nesta Fase 1 o APP-WF019 só conhece
   * `clientes.listar` (não existe `clientes.obter`), reaproveita a lista já
   * tenant-scoped e localiza o ID no próprio NestJS — preserva exatamente a mesma
   * proteção (ID inexistente e ID de outro tenant chegam ao mesmo 404). `historico` usa
   * `null` (corrigido nesta tarefa, era `[]`) nesse modo: `[]` afirmaria "sabemos que
   * este cliente não tem nenhum atendimento", o que é falso — a aba CLIENTES sozinha não
   * tem histórico de atendimentos (viria de AGENDAMENTOS, fora do escopo desta fase); a
   * informação real é "ainda não conseguimos carregar isso". Nunca renderizar `null` como
   * "nenhum atendimento registrado" no frontend (ver ClienteDetailsDrawer.tsx).
   */
  async buscarPorId(user: AuthenticatedUser, idCliente: string): Promise<ClienteDetalhado> {
    if (this.usaFonteReal()) {
      const { data } = await this.listar(user);
      const cliente = data.find((item) => item.idCliente === idCliente);
      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado.');
      }
      return { ...cliente, historico: null };
    }

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
