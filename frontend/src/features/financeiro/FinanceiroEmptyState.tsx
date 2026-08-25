import { Wallet } from "lucide-react";

interface FinanceiroEmptyStateProps {
  titulo: string;
  descricao: string;
}

/** Mesmo padrão visual do estado vazio de Clientes/Serviços — card tracejado, sem erro. */
export function FinanceiroEmptyState({ titulo, descricao }: FinanceiroEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
      <Wallet className="h-8 w-8 text-zinc-300" aria-hidden="true" />
      <p className="text-sm font-medium text-zinc-600">{titulo}</p>
      <p className="text-sm text-zinc-400">{descricao}</p>
    </div>
  );
}
