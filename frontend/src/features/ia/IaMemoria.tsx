import { User } from "lucide-react";
import type { IaMemoria as IaMemoriaType } from "./types";

interface IaMemoriaProps {
  memoria: IaMemoriaType;
}

/**
 * "Memória do atendimento" — explica de forma amigável a IA_MEMORIA real (contexto de
 * conversa por cliente). Mostra só nome do cliente, nunca o conteúdo da conversa (não é
 * um editor de IA_MEMORIA, seção 12 do pedido).
 */
export function IaMemoria({ memoria }: IaMemoriaProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Memória do atendimento</h2>
        <p className="mt-0.5 text-xs text-zinc-500">{memoria.descricao}</p>
      </div>

      {memoria.clientes.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-400">Nenhum cliente com memória ativa no momento.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {memoria.clientes.map((cliente) => (
            <li
              key={cliente.clienteNome}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
            >
              <User className="h-3 w-3 text-zinc-400" aria-hidden="true" />
              {cliente.clienteNome}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
