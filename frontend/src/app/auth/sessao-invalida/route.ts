import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MOTIVOS_VALIDOS = new Set(["inativo", "sem_perfil"]);

/**
 * Encerra a sessão Supabase quando a DAL (src/lib/auth/dal.ts) detecta um estado
 * inválido (usuário inativo ou sem registro em public.usuarios). Existe como Route
 * Handler — e não uma chamada direta dentro da DAL — porque só Route Handlers, Server
 * Actions e o Proxy têm permissão para gravar cookies; um Server Component (onde a DAL
 * roda) não pode encerrar sessão durante o render (ver data-security.md).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const motivoRecebido = request.nextUrl.searchParams.get("motivo");
  const motivo = motivoRecebido && MOTIVOS_VALIDOS.has(motivoRecebido) ? motivoRecebido : "sessao_invalida";

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?erro=${motivo}`;

  return NextResponse.redirect(loginUrl);
}
