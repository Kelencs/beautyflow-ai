import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/features/auth/LoginForm";

const MENSAGENS_ERRO: Record<string, string> = {
  inativo: "Sua conta está inativa. Entre em contato com o administrador.",
  sem_perfil: "Sua conta ainda não está configurada no BeautyFlow. Entre em contato com o administrador.",
  sessao_invalida: "Sua sessão não é mais válida. Faça login novamente.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/agenda");
  }

  const { erro } = await props.searchParams;
  const mensagemErro = typeof erro === "string" ? MENSAGENS_ERRO[erro] : undefined;

  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Sparkles className="h-5.5 w-5.5" aria-hidden="true" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-zinc-900">BeautyFlow</span>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-zinc-900">Bem-vinda de volta</h1>
          <p className="text-sm text-zinc-500">Acesse sua conta para gerenciar seus atendimentos.</p>
        </div>
      </div>

      {mensagemErro && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700">
          {mensagemErro}
        </p>
      )}

      <LoginForm />

      <p className="text-center text-sm text-zinc-500">
        Não possui acesso?
        <br />
        Entre em contato com o administrador.
      </p>
    </div>
  );
}
