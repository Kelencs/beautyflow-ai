import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rotas acessíveis sem sessão. Tudo que não começar com um destes prefixos exige
 * usuário autenticado — inclusive `/` (que apenas redireciona para `/agenda`) e
 * qualquer módulo futuro do grupo `(app)`, sem precisar manter uma lista separada.
 */
const PUBLIC_ROUTE_PREFIXES = ["/login", "/auth"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Verificação otimista de sessão (lê/atualiza só o cookie, sem consultar public.usuarios)
 * — roda em todo request, conforme o padrão recomendado pelo Next.js 16 e pelo
 * @supabase/ssr para Proxy (frontend/src/proxy.ts). A verificação "segura" (perfil
 * ativo, empresa, etc.) fica na Data Access Layer (src/lib/auth/dal.ts), próxima da
 * fonte de dados, e não aqui.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const publicRoute = isPublicRoute(pathname);

  if (!publicRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const agendaUrl = request.nextUrl.clone();
    agendaUrl.pathname = "/agenda";
    agendaUrl.search = "";
    return NextResponse.redirect(agendaUrl);
  }

  return response;
}
