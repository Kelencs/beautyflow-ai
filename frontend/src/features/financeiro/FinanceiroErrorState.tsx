import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface FinanceiroErrorStateProps {
  titulo: string;
  mensagem: string;
}

/** Mesmo padrão visual de ServicosErrorState/ClientesErrorState — consistência entre módulos. */
export function FinanceiroErrorState({ titulo, mensagem }: FinanceiroErrorStateProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Financeiro</h1>
        <p className="text-sm text-zinc-500">Acompanhe recebimentos e valores pendentes do negócio.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-zinc-700">{titulo}</p>
        <p className="max-w-sm text-sm text-zinc-500">{mensagem}</p>
        <Link
          href="/financeiro"
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Tentar novamente
        </Link>
      </div>
    </div>
  );
}
