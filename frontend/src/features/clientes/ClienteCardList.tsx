import { ChevronRight } from "lucide-react";
import type { Cliente } from "./types";
import { ClienteStatusBadge } from "./ClienteStatusBadge";
import { formatDateNumericBR, parseISODate } from "@/lib/date";

interface ClienteCardListProps {
  clientes: Cliente[];
  onSelect: (cliente: Cliente) => void;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/**
 * Visão tablet/notebook estreito + mobile (< lg, 1024px) — a tabela desktop
 * (ClientesTable.tsx) fica só para telas largas, para nunca espremer colunas.
 */
export function ClienteCardList({ clientes, onSelect }: ClienteCardListProps) {
  return (
    <ul className="flex flex-col gap-2.5 lg:hidden">
      {clientes.map((cliente) => (
        <li key={cliente.idCliente}>
          <button
            type="button"
            onClick={() => onSelect(cliente)}
            aria-label={`Ver detalhes de ${cliente.nome}`}
            className="flex w-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{cliente.nome}</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">{cliente.telefone}</p>
              </div>
              <ClienteStatusBadge status={cliente.status} className="shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-4">
              <div>
                <p className="text-zinc-400">Último</p>
                <p className="mt-0.5 font-medium text-zinc-700">
                  {cliente.ultimoAtendimento ? formatDateNumericBR(parseISODate(cliente.ultimoAtendimento)) : "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Próximo</p>
                <p className="mt-0.5 font-medium text-zinc-700">
                  {cliente.proximoAtendimento ? formatDateNumericBR(parseISODate(cliente.proximoAtendimento)) : "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Atendimentos</p>
                <p className="mt-0.5 font-medium text-zinc-700">
                  {cliente.totalAtendimentos} atendimento{cliente.totalAtendimentos === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Total gasto</p>
                <p className="mt-0.5 font-semibold text-zinc-900">{formatBRL(cliente.totalGasto)}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 border-t border-zinc-100 pt-2.5 text-xs font-semibold text-violet-700">
              Ver detalhes
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
