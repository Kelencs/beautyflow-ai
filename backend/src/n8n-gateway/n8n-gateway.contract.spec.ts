import { isN8nGatewayEnvelope } from './n8n-gateway.types';

/**
 * Contract test do envelope esperado do APP-WF019 (seção 31 do pedido) — testa só o
 * formato do envelope (`isN8nGatewayEnvelope`), sem HTTP/rede. `n8n-gateway.client.spec.ts`
 * cobre o comportamento do client em cima disso.
 */
describe('contrato do envelope APP-WF019', () => {
  it('aceita o envelope de sucesso: { ok: true, data, meta: { requestId } }', () => {
    expect(
      isN8nGatewayEnvelope({
        ok: true,
        data: [{ idCliente: 'CLI001' }],
        meta: { requestId: 'r1' },
      }),
    ).toBe(true);
  });

  it('aceita data vazio como sucesso válido (lista vazia é sucesso, não erro — seção 9 do pedido)', () => {
    expect(isN8nGatewayEnvelope({ ok: true, data: [], meta: { requestId: 'r1' } })).toBe(true);
  });

  it('aceita o envelope de erro: { ok: false, error: { code, message }, meta: { requestId } }', () => {
    expect(
      isN8nGatewayEnvelope({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'operacao é obrigatória.' },
        meta: { requestId: 'r2' },
      }),
    ).toBe(true);
  });

  it('não exige empresaId no meta (seção 8 do pedido — NestJS já conhece o tenant)', () => {
    // Não é um requisito positivo diferente do já coberto acima; documenta a decisão:
    // um envelope válido não precisa (e não deve) trazer empresaId.
    const envelope = { ok: true, data: [], meta: { requestId: 'r1' } };
    expect(isN8nGatewayEnvelope(envelope)).toBe(true);
    expect(envelope.meta).not.toHaveProperty('empresaId');
  });

  it('rejeita quando falta meta.requestId', () => {
    expect(isN8nGatewayEnvelope({ ok: true, data: [], meta: {} })).toBe(false);
  });

  it('rejeita quando falta meta por completo', () => {
    expect(isN8nGatewayEnvelope({ ok: true, data: [] })).toBe(false);
  });

  it('rejeita erro sem code', () => {
    expect(
      isN8nGatewayEnvelope({ ok: false, error: { message: 'x' }, meta: { requestId: 'r1' } }),
    ).toBe(false);
  });

  it('rejeita erro sem message', () => {
    expect(
      isN8nGatewayEnvelope({ ok: false, error: { code: 'X' }, meta: { requestId: 'r1' } }),
    ).toBe(false);
  });

  it('rejeita quando ok não é booleano', () => {
    expect(isN8nGatewayEnvelope({ ok: 'true', data: [], meta: { requestId: 'r1' } })).toBe(false);
  });

  it('rejeita null/undefined/tipos primitivos', () => {
    expect(isN8nGatewayEnvelope(null)).toBe(false);
    expect(isN8nGatewayEnvelope(undefined)).toBe(false);
    expect(isN8nGatewayEnvelope('string')).toBe(false);
    expect(isN8nGatewayEnvelope(42)).toBe(false);
  });

  it('rejeita ok:true sem o campo data', () => {
    expect(isN8nGatewayEnvelope({ ok: true, meta: { requestId: 'r1' } })).toBe(false);
  });
});
