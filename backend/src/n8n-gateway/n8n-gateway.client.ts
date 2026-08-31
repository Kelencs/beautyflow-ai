import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { N8nGatewayException } from './n8n-gateway.exception';
import { isN8nGatewayEnvelope, type N8nGatewayOperation } from './n8n-gateway.types';

/** Leitura: 10s (seção 16 do pedido — sem motivo técnico para outro valor nesta fase). */
const TIMEOUT_MS = 10_000;

const HEADER_GATEWAY_KEY = 'X-BeautyFlow-Gateway-Key';

/**
 * Camada única e reutilizável de chamada ao APP-WF019 (NestJS -> n8n). Usa `fetch`/
 * `AbortController` nativos do runtime (Node >=20 já os expõe globalmente — ver
 * backend/package.json "engines") em vez de instalar Axios só para isto (seção 16 do
 * pedido). Não é um adapter/repository genérico (seção 14) — só sabe fazer uma coisa:
 * POST para o gateway com o envelope padrão e devolver `data` já desembrulhado, ou
 * lançar `N8nGatewayException` em qualquer falha técnica.
 *
 * `idEmpresa` é sempre o parâmetro recebido de quem chama `call()` — nunca lido de
 * `request`/cookie/header do browser aqui. Quem já resolveu isso via
 * `SupabaseAuthGuard`/`@CurrentUser()` é responsável por passá-lo (ver
 * clientes.service.ts).
 *
 * Sem retry nesta primeira versão (seção 17 do pedido) — decisão deliberada para
 * observar comportamento/latência reais antes de adicionar essa complexidade.
 */
@Injectable()
export class N8nGatewayClient {
  private readonly logger = new Logger(N8nGatewayClient.name);

  constructor(private readonly configService: ConfigService) {}

  async call<T>(
    operacao: N8nGatewayOperation,
    idEmpresa: string,
    dados: Record<string, unknown> = {},
  ): Promise<T> {
    const gatewayUrl = this.configService.get<string>('N8N_GATEWAY_URL');
    const gatewayApiKey = this.configService.get<string>('N8N_GATEWAY_API_KEY');
    const requestId = randomUUID();

    if (!gatewayUrl || !gatewayApiKey) {
      // Nunca loga qual das duas falta com detalhe — só que o gateway não está pronto.
      this.logger.warn(`[${requestId}] ${operacao}: gateway n8n não configurado`);
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
      // upstream a tempo — não introduz um 7º código (seção 9 do pedido pede só 6).
      throw new N8nGatewayException(
        'UPSTREAM_ERROR',
        'Não foi possível conectar ao serviço de integração.',
        requestId,
      );
    } finally {
      clearTimeout(timeoutHandle);
    }

    // 401/403: o Header Auth do Webhook do WF019 rejeitou ANTES de qualquer node de
    // negócio rodar (ver n8n/workflows/app/APP-WF019-gateway-app.json) — a resposta
    // nesse caso é do próprio n8n, não o envelope {ok,...} do workflow, então nunca
    // tentamos fazer `.json()` dela aqui.
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

    // Log técnico mínimo (seção 26 do pedido): requestId, operação, duração — nunca
    // nome/telefone/e-mail/corpo completo da resposta.
    this.logger.log(`[${requestId}] ${operacao}: sucesso (${duracaoMs}ms)`);

    return body.data as T;
  }
}
