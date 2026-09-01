import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('aceita configuração vazia (nenhuma variável definida)', () => {
    expect(() => validateEnv({})).not.toThrow();
  });

  it('aceita PORT numérico', () => {
    expect(() => validateEnv({ PORT: '3001' })).not.toThrow();
  });

  it('rejeita PORT não numérico', () => {
    expect(() => validateEnv({ PORT: 'abc' })).toThrow(/PORT deve ser numérica/);
  });

  it("aceita DATA_SOURCE_CLIENTES='mock'", () => {
    expect(() => validateEnv({ DATA_SOURCE_CLIENTES: 'mock' })).not.toThrow();
  });

  it("aceita DATA_SOURCE_CLIENTES='n8n'", () => {
    expect(() => validateEnv({ DATA_SOURCE_CLIENTES: 'n8n' })).not.toThrow();
  });

  it('aceita DATA_SOURCE_CLIENTES ausente/vazio (default seguro é mock no service)', () => {
    expect(() => validateEnv({})).not.toThrow();
    expect(() => validateEnv({ DATA_SOURCE_CLIENTES: '' })).not.toThrow();
  });

  it('rejeita DATA_SOURCE_CLIENTES com valor desconhecido', () => {
    expect(() => validateEnv({ DATA_SOURCE_CLIENTES: 'postgres' })).toThrow(
      /DATA_SOURCE_CLIENTES deve ser 'mock' ou 'n8n'/,
    );
  });

  it("aceita DATA_SOURCE_SERVICOS='mock'", () => {
    expect(() => validateEnv({ DATA_SOURCE_SERVICOS: 'mock' })).not.toThrow();
  });

  it("aceita DATA_SOURCE_SERVICOS='n8n'", () => {
    expect(() => validateEnv({ DATA_SOURCE_SERVICOS: 'n8n' })).not.toThrow();
  });

  it('aceita DATA_SOURCE_SERVICOS ausente/vazio (default seguro é mock no service)', () => {
    expect(() => validateEnv({})).not.toThrow();
    expect(() => validateEnv({ DATA_SOURCE_SERVICOS: '' })).not.toThrow();
  });

  it('rejeita DATA_SOURCE_SERVICOS com valor desconhecido', () => {
    expect(() => validateEnv({ DATA_SOURCE_SERVICOS: 'postgres' })).toThrow(
      /DATA_SOURCE_SERVICOS deve ser 'mock' ou 'n8n'/,
    );
  });

  it('DATA_SOURCE_CLIENTES e DATA_SOURCE_SERVICOS são validados de forma independente', () => {
    expect(() =>
      validateEnv({ DATA_SOURCE_CLIENTES: 'n8n', DATA_SOURCE_SERVICOS: 'mock' }),
    ).not.toThrow();
    expect(() =>
      validateEnv({ DATA_SOURCE_CLIENTES: 'mock', DATA_SOURCE_SERVICOS: 'invalido' }),
    ).toThrow(/DATA_SOURCE_SERVICOS/);
  });
});
