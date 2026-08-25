"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LoginState, UsuarioRow } from "./types";

const MENSAGEM_CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos.";
const MENSAGEM_ERRO_TECNICO = "Não foi possível entrar agora. Tente novamente em instantes.";
const MENSAGEM_CONTA_SEM_PERFIL =
  "Sua conta ainda não está configurada no BeautyFlow. Entre em contato com o administrador.";
const MENSAGEM_CONTA_INATIVA = "Sua conta está inativa. Entre em contato com o administrador.";

/**
 * Server Action de login (ver node_modules/next/dist/docs/.../authentication.md —
 * padrão "Sign-up and login functionality" com Server Actions + useActionState).
 * Validação dupla, além da checagem otimista feita depois pelo proxy: aqui o usuário
 * recebe feedback imediato na própria tela, sem round-trip por `/agenda`.
 */
export async function login(_prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    // Erros de credencial e de conexão/técnicos recebem a mesma mensagem genérica de
    // credencial inválida quando plausivelmente é isso; qualquer outro caso usa a
    // mensagem técnica genérica — nunca repassar `authError.message`/status ao usuário.
    if (authError?.status === 400 || authError?.code === "invalid_credentials") {
      return { error: MENSAGEM_CREDENCIAIS_INVALIDAS };
    }
    return { error: MENSAGEM_ERRO_TECNICO };
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("ativo")
    .eq("id_usuario", authData.user.id)
    .maybeSingle()
    .overrideTypes<Pick<UsuarioRow, "ativo">, { merge: false }>();

  if (usuarioError || !usuario) {
    await supabase.auth.signOut();
    return { error: MENSAGEM_CONTA_SEM_PERFIL };
  }

  if (!usuario.ativo) {
    await supabase.auth.signOut();
    return { error: MENSAGEM_CONTA_INATIVA };
  }

  redirect("/agenda");
}

/** Server Action de logout — invocada via <form action={logout}> (ver AppHeader). */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
