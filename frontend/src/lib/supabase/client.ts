import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Client Components ("use client"). Usa apenas a chave
 * pública — nunca a Secret Key, que é exclusiva do backend (NestJS).
 * Não é usado nesta etapa (login/logout são Server Actions), mas faz parte da
 * separação client/server exigida pela arquitetura de autenticação.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver frontend/.env.example).",
    );
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
