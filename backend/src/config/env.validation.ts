const DATA_SOURCE_VALORES_VALIDOS = new Set(['mock', 'n8n']);

/** Valida uma flag `DATA_SOURCE_<MODULO>` — mesma regra para todas (mock/n8n/ausente). */
function validarDataSource(config: Record<string, unknown>, nomeVariavel: string): void {
  const valor = config[nomeVariavel];
  if (typeof valor === 'string' && valor !== '' && !DATA_SOURCE_VALORES_VALIDOS.has(valor)) {
    throw new Error(
      `Variável de ambiente inválida: ${nomeVariavel} deve ser 'mock' ou 'n8n' (ver backend/.env.example).`,
    );
  }
}

/**
 * Validação mínima do `ConfigModule` (ver backend/src/app.module.ts). Lançar aqui impede
 * o boot da aplicação (comportamento do Nest) — por isso só valida o que é seguro exigir
 * sempre (formato de PORT, valor de cada DATA_SOURCE_* quando presente).
 * SUPABASE_URL/SUPABASE_SECRET_KEY e N8N_GATEWAY_URL/N8N_GATEWAY_API_KEY continuam
 * propositalmente fora daqui: SupabaseService/N8nGatewayClient já falham de forma clara
 * no primeiro uso quando ausentes, e isso precisa continuar permitindo build/test/dev sem
 * esses serviços configurados (decisão da Fase 0B, preservada nesta etapa).
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const port = config.PORT;
  if (port !== undefined && port !== '' && Number.isNaN(Number(port))) {
    throw new Error(
      'Variável de ambiente inválida: PORT deve ser numérica (ver backend/.env.example).',
    );
  }

  validarDataSource(config, 'DATA_SOURCE_CLIENTES');
  validarDataSource(config, 'DATA_SOURCE_SERVICOS');
  validarDataSource(config, 'DATA_SOURCE_PROFISSIONAIS');
  validarDataSource(config, 'DATA_SOURCE_CONFIGURACOES');
  validarDataSource(config, 'DATA_SOURCE_AGENDA');

  return config;
}
