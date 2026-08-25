/**
 * Validação mínima do `ConfigModule` (ver backend/src/app.module.ts). Lançar aqui impede
 * o boot da aplicação (comportamento do Nest) — por isso só valida o que é seguro exigir
 * sempre (formato de PORT). SUPABASE_URL/SUPABASE_SECRET_KEY continuam propositalmente
 * fora daqui: SupabaseService (src/database/supabase.service.ts) já falha de forma clara
 * no primeiro uso quando ausentes, e isso precisa continuar permitindo build/test/dev sem
 * um projeto Supabase real configurado (decisão da Fase 0B, preservada nesta etapa).
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const port = config.PORT;
  if (port !== undefined && port !== '' && Number.isNaN(Number(port))) {
    throw new Error(
      'Variável de ambiente inválida: PORT deve ser numérica (ver backend/.env.example).',
    );
  }

  return config;
}
