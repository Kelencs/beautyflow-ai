"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary da área autenticada (achado P2-2 da auditoria geral) — captura exceções
 * não tratadas em qualquer página dentro de `(app)`, no lugar da tela de erro padrão do
 * Next.js. Renderiza dentro de `AppLayout` (que já envolve `{children}` com `AppShell`),
 * então não precisa recriar sidebar/header aqui — só o conteúdo da área de erro, no mesmo
 * padrão visual dos `<Modulo>ErrorState` (ex.: AgendaErrorState.tsx).
 *
 * Nunca exibe `error.message`/`error.digest`/stack trace ao usuário — mensagem sempre
 * genérica e amigável, por segurança (evita vazar detalhes internos de uma falha de
 * backend/rede) e por UX (a dona do salão não precisa ver um "código de erro").
 */
export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    // Só para depuração no console do navegador — nunca é exibido na interface.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-zinc-700">Não foi possível carregar esta página</p>
      <p className="max-w-sm text-sm text-zinc-500">
        Ocorreu um erro inesperado. Você pode tentar novamente.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Tentar novamente
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
