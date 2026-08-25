import Link from "next/link";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface ConfiguracoesErrorStateProps {
  titulo: string;
  mensagem: string;
  proibido?: boolean;
}

/**
 * Mesmo padrão visual dos demais módulos, com uma variação: 403 (profissional tentando
 * acessar configurações administrativas) usa um ícone/tom diferente de um erro real de
 * backend — nunca "erro inesperado" para uma permissão negada de propósito (seção 26).
 */
export function ConfiguracoesErrorState({ titulo, mensagem, proibido }: ConfiguracoesErrorStateProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Configurações</h1>
        <p className="text-sm text-zinc-500">Gerencie as preferências e informações do seu negócio.</p>
      </div>

      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-20 text-center ${
          proibido ? "border-amber-200 bg-amber-50/40" : "border-rose-200 bg-rose-50/40"
        }`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            proibido ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
          }`}
        >
          {proibido ? (
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          )}
        </span>
        <p className="text-sm font-medium text-zinc-700">{titulo}</p>
        <p className="max-w-sm text-sm text-zinc-500">{mensagem}</p>
        {!proibido && (
          <Link
            href="/configuracoes"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Tentar novamente
          </Link>
        )}
      </div>
    </div>
  );
}
