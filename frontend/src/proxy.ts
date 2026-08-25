import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy (substitui o antigo `middleware.ts` a partir do Next.js 16 — ver
 * frontend/AGENTS.md e node_modules/next/dist/docs/.../proxy.md). Roda antes de toda
 * rota e é o único lugar com permissão de escrever cookies de sessão em todo request,
 * por isso concentra a atualização/verificação otimista de sessão do Supabase aqui.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
