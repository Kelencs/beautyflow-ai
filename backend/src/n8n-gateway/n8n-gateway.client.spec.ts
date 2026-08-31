import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { N8nGatewayClient } from './n8n-gateway.client';
import { N8nGatewayException } from './n8n-gateway.exception';

/**
 * Nunca chama n8n real (seção 29 do pedido) — todo `fetch` é mockado via `jest.spyOn`
 * (mantém a tipagem real de `typeof fetch`, sem precisar de `any`/casts soltos). Nenhum
 * teste aqui bate na internet nem depende de rede disponível.
 */
describe('N8nGatewayClient', () => {
  const ORIGINAL_ENV = process.env;
  let client: N8nGatewayClient;
  let fetchSpy: jest.SpiedFunction<typeof fetch>;

  async function buildClient(env: Record<string, string> = {}): Promise<N8nGatewayClient> {
    process.env = {
      ...ORIGINAL_ENV,
      N8N_GATEWAY_URL: 'https://example-n8n.test/webhook/beautyflow-app',
      N8N_GATEWAY_API_KEY: 'placeholder-key-for-test',
      ...env,
    };
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
      providers: [N8nGatewayClient],
    }).compile();
    return moduleRef.get(N8nGatewayClient);
  }

  beforeEach(async () => {
    client = await buildClient();
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function fakeResponse(status: number, json?: () => Promise<unknown>): Response {
    return {
      status,
      json: json ?? (() => Promise.resolve({})),
    } as unknown as Response;
  }

  function requestBody(
    call: [RequestInfo | URL, RequestInit | undefined],
  ): Record<string, unknown> {
    // O client sempre envia `body` como JSON.stringify(...) (uma string) — o cast reflete
    // esse contrato conhecido, não uma conversão genérica de tipo desconhecido.
    return JSON.parse(call[1]?.body as string) as Record<string, unknown>;
  }

  function requestHeaders(
    call: [RequestInfo | URL, RequestInit | undefined],
  ): Record<string, string> {
    return (call[1]?.headers ?? {}) as Record<string, string>;
  }

  it('envia método POST, header da API key e corpo com operacao/idEmpresa/requestId/dados', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({ ok: true, data: [], meta: { requestId: 'do-servidor' } }),
      ),
    );

    await client.call('clientes.listar', 'EMP001', {});

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const call = fetchSpy.mock.calls[0];
    expect(call[0]).toBe('https://example-n8n.test/webhook/beautyflow-app');
    expect(call[1]?.method).toBe('POST');
    expect(requestHeaders(call)['X-BeautyFlow-Gateway-Key']).toBe('placeholder-key-for-test');

    const body = requestBody(call);
    expect(body.operacao).toBe('clientes.listar');
    expect(body.idEmpresa).toBe('EMP001');
    expect(typeof body.requestId).toBe('string');
    expect((body.requestId as string).length).toBeGreaterThan(0);
    expect(body.dados).toEqual({});
  });

  it('gera um requestId diferente a cada chamada', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.resolve({ ok: true, data: [], meta: { requestId: 'x' } })),
    );

    await client.call('clientes.listar', 'EMP001');
    await client.call('clientes.listar', 'EMP001');

    const bodyA = requestBody(fetchSpy.mock.calls[0]);
    const bodyB = requestBody(fetchSpy.mock.calls[1]);
    expect(bodyA.requestId).not.toBe(bodyB.requestId);
  });

  it('resposta ok:true devolve somente o campo data, já desembrulhado', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({ ok: true, data: [{ idCliente: 'CLI001' }], meta: { requestId: 'r1' } }),
      ),
    );

    const resultado = await client.call('clientes.listar', 'EMP001');

    expect(resultado).toEqual([{ idCliente: 'CLI001' }]);
  });

  it('resposta ok:false lança N8nGatewayException com o code/message/requestId do envelope', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({
          ok: false,
          error: { code: 'TENANT_REQUIRED', message: 'id_empresa é obrigatório.' },
          meta: { requestId: 'r2' },
        }),
      ),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'TENANT_REQUIRED',
      message: 'id_empresa é obrigatório.',
      requestId: 'r2',
    });
  });

  it('status HTTP 401 é tratado como AUTH_FAILED sem tentar interpretar o corpo', async () => {
    const jsonSpy = jest.fn();
    fetchSpy.mockResolvedValue(fakeResponse(401, jsonSpy));

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'AUTH_FAILED',
    });
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('status HTTP 403 também é tratado como AUTH_FAILED', async () => {
    fetchSpy.mockResolvedValue(fakeResponse(403));

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'AUTH_FAILED',
    });
  });

  it('JSON de resposta inválido (corpo não parseável) vira UPSTREAM_ERROR', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.reject(new Error('corpo não é JSON'))),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('envelope com formato inesperado (sem meta.requestId) vira UPSTREAM_ERROR', async () => {
    fetchSpy.mockResolvedValue(fakeResponse(200, () => Promise.resolve({ ok: true, data: [] })));

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('erro de rede (fetch rejeita) vira UPSTREAM_ERROR', async () => {
    fetchSpy.mockRejectedValue(new Error('network down'));

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('timeout (AbortError) vira UPSTREAM_ERROR, não uma exceção não tratada', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    fetchSpy.mockRejectedValue(abortError);

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toBeInstanceOf(
      N8nGatewayException,
    );
    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('gateway não configurado (env ausente) lança INTERNAL_ERROR sem chamar fetch', async () => {
    const semConfig = await buildClient({ N8N_GATEWAY_URL: '', N8N_GATEWAY_API_KEY: '' });

    await expect(semConfig.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('a API key nunca aparece no corpo da requisição enviada', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.resolve({ ok: true, data: [], meta: { requestId: 'r3' } })),
    );

    await client.call('clientes.listar', 'EMP001');

    const call = fetchSpy.mock.calls[0];
    expect(call[1]?.body as string).not.toContain('placeholder-key-for-test');
  });

  it('idEmpresa enviado é exatamente o parâmetro recebido (o backend já o resolveu via CurrentUser)', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.resolve({ ok: true, data: [], meta: { requestId: 'r4' } })),
    );

    await client.call('clientes.listar', 'EMP002');

    const body = requestBody(fetchSpy.mock.calls[0]);
    expect(body.idEmpresa).toBe('EMP002');
  });

  /**
   * Reproduz exatamente o que o teste real contra o n8n Cloud observou quando o Webhook
   * estava configurado como "When Last Node Finishes": o corpo HTTP vira o payload bruto
   * do trigger (headers, params, query, body, webhookUrl, executionMode), não o envelope
   * — incluindo, no caso real, o próprio header de autenticação. O client precisa
   * rejeitar esse formato como envelope inválido, nunca tentar "aproveitar" algo dele.
   */
  it('payload bruto do Webhook (headers/webhookUrl/executionMode, sem "ok") é rejeitado como UPSTREAM_ERROR', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({
          headers: { 'x-beautyflow-gateway-key': 'segredo-vazado', authorization: 'Bearer x' },
          params: {},
          query: {},
          body: { operacao: 'clientes.listar', idEmpresa: 'EMP001' },
          webhookUrl: 'https://exemplo.app.n8n.cloud/webhook/beautyflow-app',
          executionMode: 'production',
        }),
      ),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('a exceção lançada nunca carrega headers/API key/webhookUrl/executionMode do payload bruto rejeitado', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({
          headers: { 'x-beautyflow-gateway-key': 'segredo-vazado' },
          webhookUrl: 'https://exemplo.app.n8n.cloud/webhook/beautyflow-app',
          executionMode: 'production',
        }),
      ),
    );

    try {
      await client.call('clientes.listar', 'EMP001');
      throw new Error('deveria ter lançado N8nGatewayException');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : '';
      expect(mensagem).not.toContain('segredo-vazado');
      expect(mensagem).not.toContain('x-beautyflow-gateway-key');
      expect(mensagem).not.toContain('webhookUrl');
      expect(mensagem).not.toContain('executionMode');
    }
  });

  it('wrapper array externo ([{ok:true,...}]) é rejeitado como envelope inválido', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.resolve([{ ok: true, data: [], meta: { requestId: 'r5' } }])),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('wrapper { body: { ok: true, ... } } (não desembrulhado) é rejeitado como envelope inválido', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () =>
        Promise.resolve({ body: { ok: true, data: [], meta: { requestId: 'r6' } } }),
      ),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('JSON duplamente serializado (string, não objeto) é rejeitado como envelope inválido', async () => {
    // response.json() já faz um parse; se o corpo real fosse uma string JSON
    // duas-vezes-serializada, o primeiro parse devolveria uma string, não um objeto.
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.resolve('{"ok":true,"data":[],"meta":{"requestId":"r7"}}')),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('corpo vazio (json() falha ao parsear) nunca é tratado como sucesso — sempre UPSTREAM_ERROR', async () => {
    fetchSpy.mockResolvedValue(
      fakeResponse(200, () => Promise.reject(new Error('Unexpected end of JSON input'))),
    );

    await expect(client.call('clientes.listar', 'EMP001')).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });
});
