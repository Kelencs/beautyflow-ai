import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AgendaCancelarResponse, AgendaItem, AgendaResponse } from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from '../clientes/clientes.service';
import { N8nGatewayCommandsClient } from '../n8n-gateway/n8n-gateway-commands.client';
import type { N8nGatewayCancelarAgendamentoDados } from '../n8n-gateway/n8n-gateway-commands.types';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type { N8nGatewayAgendamentoIntegracao } from '../n8n-gateway/n8n-gateway.types';
import { ProfissionaisService } from '../profissionais/profissionais.service';
import { ServicosService } from '../servicos/servicos.service';
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
    statusConfirmacao: registro.statusConfirmacao,
    valor: registro.valor,
  };
}

@Injectable()
export class AgendaService {
  private readonly logger = new Logger(AgendaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly n8nGatewayClient: N8nGatewayClient,
    private readonly n8nGatewayCommandsClient: N8nGatewayCommandsClient,
    private readonly clientesService: ClientesService,
    private readonly profissionaisService: ProfissionaisService,
    private readonly servicosService: ServicosService,
  ) {}

  /** Flag por módulo (mesmo padrão de Clientes/Serviços/Profissionais/Configurações). */
  private usaFonteReal(): boolean {
    return this.configService.get<string>('DATA_SOURCE_AGENDA') === 'n8n';
  }

  /**
   * Filtra SEMPRE por authenticatedUser.idEmpresa (nunca por um valor vindo da URL — a
   * rota não aceita esse parâmetro, ver AgendaController). Regras por perfil preservadas
   * nos dois modos (mock/n8n):
   *
   * - platform_admin (idEmpresa null, por chk_usuarios_empresa_obrigatoria): sem
   *   endpoint administrativo cross-tenant dedicado ainda, retorna lista vazia em vez de
   *   assumir acesso amplo — comportamento seguro por padrão, ANTES de qualquer chamada
   *   ao gateway/mock (nunca chega a `usaFonteReal()`).
   * - owner: vê todos os agendamentos da própria empresa, dentro do período pedido.
   * - profissional: vê somente os agendamentos com idProfissional == o seu.
   *
   * Async por causa do modo `n8n` (chamada HTTP ao gateway + joins) — mesmo padrão já
   * aplicado em Clientes/Serviços/Profissionais. DashboardService/RelatoriosService
   * (únicos outros consumidores) só precisaram de `await`.
   */
  async listar(user: AuthenticatedUser, query: AgendaQuery): Promise<AgendaResponse> {
    if (!user.idEmpresa) {
      return { data: [] };
    }

    if (this.usaFonteReal()) {
      return this.listarViaGateway(user, query);
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

  /**
   * `agendamentos.listar` devolve só o mínimo operacional + IDs — nomes de cliente/
   * profissional/serviço NÃO são resolvidos pelo workflow (ver n8n-gateway.types.ts,
   * N8nGatewayAgendamentoIntegracao). O join é feito inteiramente aqui, buscando os três
   * catálogos em paralelo com a própria chamada ao gateway (Promise.all) — nenhum dos
   * três serviços injetados depende de AgendaService, então não há ciclo de DI.
   *
   * Nunca cai silenciosamente no mock quando o gateway falha — mesmo padrão de Clientes/
   * Serviços/Profissionais (erro técnico controlado 503, nunca detalhe interno).
   *
   * `statusConfirmacao` é sempre `null` para dados vindos da fonte real, qualquer que
   * seja `status` (AGENDADO, CONCLUIDO ou CANCELADO): a regra não-negociável desta
   * integração é nunca inferir PENDENTE/CONFIRMADO a partir de AGENDADO, CONCLUIDO,
   * horário, pagamento ou lembrete enviado — só o NestJS acrescenta esse `null` ao
   * contrato público, o workflow nunca fabrica esse campo.
   */
  private async listarViaGateway(
    user: AuthenticatedUser,
    query: AgendaQuery,
  ): Promise<AgendaResponse> {
    const idEmpresa = user.idEmpresa as string;

    try {
      const [registros, clientes, profissionais, servicos] = await Promise.all([
        this.n8nGatewayClient.call<N8nGatewayAgendamentoIntegracao[]>(
          'agendamentos.listar',
          idEmpresa,
          { dataInicio: query.dataInicio, dataFim: query.dataFim },
        ),
        this.clientesService.listar(user),
        this.profissionaisService.listar(user),
        this.servicosService.listar(user),
      ]);

      // Preserva exatamente a regra atual: profissional só vê os próprios agendamentos.
      // O gateway devolve `idProfissional` como dado interno só para viabilizar este
      // filtro — nunca aparece no contrato público (AgendaItem não tem esse campo).
      const visiveis =
        user.perfil === 'profissional'
          ? registros.filter((registro) => registro.idProfissional === user.idProfissional)
          : registros;

      const clientesPorId = new Map(clientes.data.map((cliente) => [cliente.idCliente, cliente]));
      const profissionaisPorId = new Map(
        profissionais.data.map((profissional) => [profissional.idProfissional, profissional]),
      );
      const servicosPorId = new Map(servicos.data.map((servico) => [servico.idServico, servico]));

      const itens: AgendaItem[] = visiveis.map((registro) => {
        const cliente = clientesPorId.get(registro.idCliente);
        const profissional = profissionaisPorId.get(registro.idProfissional);
        const servico = servicosPorId.get(registro.idServico);

        if (!cliente || !profissional || !servico) {
          // Inconsistência referencial da fonte (um agendamento aponta para um cliente/
          // profissional/serviço que não existe mais no catálogo) — nunca fabricamos um
          // nome placeholder ("Cliente desconhecido", string vazia) para escondê-la:
          // isso seria inventar informação. Falha controlada e genérica: nenhum ID
          // aparece na mensagem devolvida ao cliente, nem no log técnico.
          this.logger.warn(
            'agendamentos.listar: referência inconsistente entre Agenda e Clientes/Profissionais/Serviços.',
          );
          throw new ServiceUnavailableException(
            'Não foi possível carregar a agenda no momento. Tente novamente em instantes.',
          );
        }

        return {
          idAgendamento: registro.idAgendamento,
          clienteNome: cliente.nome,
          clienteTelefone: cliente.telefone,
          profissionalNome: profissional.nome,
          servicoNome: servico.nome,
          data: registro.data,
          horaInicio: registro.horaInicio,
          horaFim: registro.horaFim,
          status: registro.status,
          statusConfirmacao: null,
          valor: registro.valor,
        };
      });

      return { data: itens };
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        throw new ServiceUnavailableException(
          'Não foi possível obter a agenda no momento. Tente novamente em instantes.',
        );
      }
      // Já é um erro controlado (ServiceUnavailableException da checagem de
      // integridade referencial acima, ou propagado de dentro de Clientes/
      // Profissionais/ServicosService) — repassa como está, nunca mascara.
      throw error;
    }
  }

  /**
   * PATCH /agenda/:id/cancelar — primeira (e única, nesta fase) operação de escrita da
   * Agenda, via APP-WF020 (`agenda.cancelar`). Ver auditoria da escrita da Agenda para a
   * arquitetura completa; resumo das decisões aplicadas aqui:
   *
   * - `idEmpresa` vem SEMPRE de `user.idEmpresa` (nunca de parâmetro/body — o
   *   AgendaController não aceita esse campo). platform_admin (idEmpresa null) é negado
   *   ANTES de qualquer chamada ao gateway — diferente do read-only `listar()`, uma
   *   mutação não tem um "resultado vazio" seguro para devolver, então nega
   *   explicitamente (ForbiddenException) em vez de retornar silenciosamente.
   * - Escrita só existe em modo `n8n` (`DATA_SOURCE_AGENDA=n8n`) nesta primeira fase —
   *   modo mock nunca simula uma mutação em memória (mascararia a ausência real de
   *   persistência) nem cai silenciosamente para "sucesso": falha com erro controlado.
   * - `chamadorPerfil`/`chamadorIdProfissional` são enviados ao workflow só para ele
   *   aplicar a regra "profissional só cancela o próprio agendamento" na MESMA leitura
   *   que já localiza a linha real (evita uma segunda chamada de rede só para descobrir
   *   o dono do agendamento antes de autorizar) — a IDENTIDADE do chamador continua
   *   resolvida inteiramente aqui no NestJS (SupabaseAuthGuard), nunca do browser.
   * - `NOT_FOUND` do gateway cobre tanto "não existe no tenant" quanto "existe mas é de
   *   outro profissional" (quando o chamador é profissional) — as duas convergem no
   *   mesmo 404 genérico, nunca revelando a diferença (mesmo princípio de
   *   `buscarPorId` em Clientes/Serviços/Profissionais).
   * - `CONFLICT` (ex.: agendamento já `CONCLUIDO`) vira 409. Cancelar um `CANCELADO` NÃO
   *   é erro — é idempotente, o workflow devolve sucesso sem reescrever nada, e este
   *   método simplesmente repassa esse sucesso como está.
   */
  async cancelar(
    user: AuthenticatedUser,
    idAgendamento: string,
    motivo: string,
  ): Promise<AgendaCancelarResponse> {
    if (!user.idEmpresa) {
      throw new ForbiddenException('Você não tem permissão para cancelar este agendamento.');
    }

    if (!this.usaFonteReal()) {
      throw new ServiceUnavailableException(
        'O cancelamento de agendamentos ainda não está disponível neste ambiente.',
      );
    }

    const dados: N8nGatewayCancelarAgendamentoDados = {
      idAgendamento,
      motivo,
      chamadorPerfil: user.perfil,
      chamadorIdProfissional: user.idProfissional ?? '',
    };

    try {
      return await this.n8nGatewayCommandsClient.call<AgendaCancelarResponse>(
        'agenda.cancelar',
        user.idEmpresa,
        dados,
      );
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        if (error.code === 'NOT_FOUND') {
          throw new NotFoundException('Agendamento não encontrado.');
        }
        if (error.code === 'CONFLICT') {
          throw new ConflictException('Este atendimento não pode ser cancelado no estado atual.');
        }
        throw new ServiceUnavailableException(
          'Não foi possível cancelar o agendamento no momento. Tente novamente em instantes.',
        );
      }
      throw error;
    }
  }
}
