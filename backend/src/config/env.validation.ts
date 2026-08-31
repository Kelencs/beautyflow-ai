const DATA_SOURCE_CLIENTES_VALORES_VALIDOS = new Set(['mock', 'n8n']);

/**
 * Validação mínima do `ConfigModule` (ver backend/src/app.module.ts). Lançar aqui impede
 * o boot da aplicação (comportamento do Nest) — por isso só valida o que é seguro exigir
 * sempre (formato de PORT, valor de DATA_SOURCE_CLIENTES quando presente).
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

  const dataSourceClientes = config.DATA_SOURCE_CLIENTES;
  if (
    typeof dataSourceClientes === 'string' &&
    dataSourceClientes !== '' &&
    !DATA_SOURCE_CLIENTES_VALORES_VALIDOS.has(dataSourceClientes)
  ) {
    throw new Error(
      "Variável de ambiente inválida: DATA_SOURCE_CLIENTES deve ser 'mock' ou 'n8n' (ver backend/.env.example).",
    );
  }

  return config;
}
