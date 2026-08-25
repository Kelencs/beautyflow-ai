import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UsuarioAutenticado, UsuarioRow } from "@/features/auth/types";

/**
 * Data Access Layer da autenticação (ver node_modules/next/dist/docs/01-app/02-guides/
 * data-security.md e authentication.md — padrão "DAL" recomendado pelo Next.js 16).
 * Único ponto que resolve o usuário autenticado + seu perfil em public.usuarios.
 * `cache()` evita repetir a consulta se vários componentes do mesmo request chamarem
 * esta função (ex.: layout e página).
 *
 * Verificação em duas camadas, nenhuma delas dispensável:
 * 1. `supabase.auth.getUser()` — existe sessão Supabase válida? (revalida contra o
 *    servidor de Auth, ao contrário de `getSession()`, que não deve ser confiada
 *    no servidor).
 * 2. Linha correspondente em public.usuarios, com `ativo = true` — sessão Supabase
 *    válida sozinha não basta (requisito explícito desta etapa).
 *
 * Estados inválidos (sem linha em usuarios, ou ativo = false) redirecionam para uma
 * Route Handler dedicada (src/app/auth/sessao-invalida/route.ts) em vez de chamar
 * signOut() diretamente aqui: Server Components não têm permissão para gravar cookies
 * durante o render (ver data-security.md, "Avoiding side-effects during rendering"),
 * então encerrar a sessão precisa acontecer num contexto que possa escrevê-los.
 */
export const getUsuarioAutenticado = cache(async (): Promise<UsuarioAutenticado> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id_usuario, id_empresa, id_profissional, nome, email, perfil, ativo")
    .eq("id_usuario", user.id)
    .maybeSingle()
    .overrideTypes<UsuarioRow, { merge: false }>();

  if (error || !usuario) {
    redirect("/auth/sessao-invalida?motivo=sem_perfil");
  }

  if (!usuario.ativo) {
    redirect("/auth/sessao-invalida?motivo=inativo");
  }

  return {
    idUsuario: usuario.id_usuario,
    idEmpresa: usuario.id_empresa,
    idProfissional: usuario.id_profissional,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  };
});
