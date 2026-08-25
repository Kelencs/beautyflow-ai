import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers
 * (qualquer lugar com acesso a `next/headers`). Usa apenas a chave pública
 * (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) — a Secret Key nunca deve existir no frontend.
 * As policies de RLS (ver supabase/migrations) são o mecanismo real de autorização aqui.
 *
 * `setAll` pode ser chamado a partir de um Server Component (ex.: durante o render de
 * uma página), onde o Next.js não permite gravar cookies — o try/catch é o padrão
 * documentado pelo próprio pacote @supabase/ssr para esse caso: a sessão já é mantida
 * atualizada via `src/proxy.ts`, que roda em todo request e tem permissão de escrita.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver frontend/.env.example).",
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component — sem permissão para setar cookies.
          // Inofensivo: a sessão é atualizada em toda navegação por src/proxy.ts.
        }
      },
    },
  });
}
