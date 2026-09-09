import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { N8nGatewayException } from './n8n-gateway.exception';
import { isN8nGatewayEnvelope } from './n8n-gateway.types';
import type { N8nGatewayCommandOperation } from './n8n-gateway-commands.types';

/** Mesmo valor de N8nGatewayClient (seção 16 da Fase 1) — sem motivo técnico para outro. */
const TIMEOUT_MS = 10_000;

const HEADER_GATEWAY_KEY = 'X-BeautyFlow-Gateway-Key';

/**
 * Camada única de chamada ao APP-WF020 (comandos/mutações da Agenda) — NestJS -> n8n.
 * Deliberadamente um cliente SEPARADO de `N8nGatewayClient` (que só fala com o APP-WF019,
 * read-only), embora repita a maior parte da mecânica de rede: usa suas PRÓPRIAS
 * variáveis de ambiente (`N8N_GATEWAY_COMMANDS_URL`/`N8N_GATEWAY_COMMANDS_API_KEY`),
 * nunca as mesmas de `N8N_GATEWAY_URL`/`N8N_GATEWAY_API_KEY` — uma reconfiguração
 * acidental do gateway de leitura nunca pode fazer uma escrita apontar para o lugar
 * errado (e vice-versa), e os dois lados ficam testáveis/observáveis isoladamente (ver
 * auditoria da escrita da Agenda, decisão da seção 19: "separar leitura e comandos").
 *
 * Sem retry, mesmo padrão de N8nGatewayClient — decisão deliberada para observar
 * comportamento real antes de adicionar essa complexidade a uma operação que MUTA dado.
 */
@Injectable()
export class N8nGatewayCommandsClient {
  private readonly logger = new Logger(N8nGatewayCommandsClient.name);

  constructor(private readonly configService: ConfigService) {}

  async call<T>(
    operacao: N8nGatewayCommandOperation,
    idEmpresa: string,
    dados: Record<string, unknown> = {},
  ): Promise<T> {
    const gatewayUrl = this.configService.get<string>('N8N_GATEWAY_COMMANDS_URL');
    const gatewayApiKey = this.configService.get<string>('N8N_GATEWAY_COMMANDS_API_KEY');
    const requestId = randomUUID();

    if (!gatewayUrl || !gatewayApiKey) {
      // Nunca loga qual das duas falta com detalhe — só que o gateway não está pronto.
      this.logger.warn(`[${requestId}] ${operacao}: gateway de comandos n8n não configurado`);
      throw new N8nGatewayException(
        'INTERNAL_ERROR',
        'Serviço de integração não configurado.',
        requestId,
      );
    }

    const startedAt = Date.now();
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [HEADER_GATEWAY_KEY]: gatewayApiKey,
        },
        body: JSON.stringify({ operacao, idEmpresa, requestId, dados }),
        signal: controller.signal,
      });
    } catch (error) {
      const duracaoMs = Date.now() - startedAt;
      const foiTimeout = error instanceof Error && error.name === 'AbortError';
      this.logger.warn(
        `[${requestId}] ${operacao}: ${foiTimeout ? 'timeout' : 'erro de rede'} (${duracaoMs}ms)`,
      );
      // Timeout classificado como UPSTREAM_ERROR: não recebemos resposta válida do
      // upstream a tempo — nunca assume que a mutação NÃO aconteceu do lado do n8n (ver
      // agenda.service.ts para como o chamador deve tratar isso: erro controlado, nunca
      // retry automático silencioso).
      throw new N8nGatewayException(
        'UPSTREAM_ERROR',
        'Não foi possível conectar ao serviço de integração.',
        requestId,
      );
    } finally {
      clearTimeout(timeoutHandle);
    }

    // 401/403: o Header Auth do próprio Webhook do WF020 rejeitou ANTES de qualquer node
    // de negócio rodar — mesma lógica de N8nGatewayClient.
    if (response.status === 401 || response.status === 403) {
      this.logger.warn(`[${requestId}] ${operacao}: falha de autenticação no gateway`);
      throw new N8nGatewayException(
        'AUTH_FAILED',
        'Falha de autenticação com o serviço de integração.',
        requestId,
      );
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      this.logger.warn(`[${requestId}] ${operacao}: corpo de resposta inválido`);
      throw new N8nGatewayException(
        'UPSTREAM_ERROR',
        'O serviço de integração devolveu uma resposta inesperada.',
        requestId,
      );
    }

    if (!isN8nGatewayEnvelope(body)) {
      this.logger.warn(`[${requestId}] ${operacao}: envelope de resposta com formato inesperado`);
      throw new N8nGatewayException(
        'UPSTREAM_ERROR',
        'O serviço de integração devolveu um formato inesperado.',
        requestId,
      );
    }

    const duracaoMs = Date.now() - startedAt;

    if (!body.ok) {
      this.logger.warn(`[${requestId}] ${operacao}: erro ${body.error.code} (${duracaoMs}ms)`);
      throw new N8nGatewayException(body.error.code, body.error.message, body.meta.requestId);
    }

    // Log técnico mínimo (mesmo padrão de N8nGatewayClient): requestId, operação,
    // duração — nunca idAgendamento/motivo/corpo completo da resposta.
    this.logger.log(`[${requestId}] ${operacao}: sucesso (${duracaoMs}ms)`);

    return body.data as T;
  }
}
