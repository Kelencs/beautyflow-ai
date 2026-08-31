import type { Cliente } from "./types";
import { ClienteStatusBadge } from "./ClienteStatusBadge";
import { formatDateNumericBR, parseISODate } from "@/lib/date";

interface ClientesTableProps {
  clientes: Cliente[];
  onSelect: (cliente: Cliente) => void;
}

/**
 * `null` = a fonte de dados atual ainda não sabe calcular este valor (ex.: modo n8n,
 * que hoje só lê CLIENTES) — nunca mostrar como "R$ 0,00", que afirmaria um gasto zero
 * conhecido. "—" é o traço padrão usado no resto da tela para ausência de informação.
 */
function formatBRL(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/**
 * Visão desktop largo (>= lg, 1024px) — abaixo disso os cards de ClienteCardList.tsx
 * assumem (tablet/notebook estreito e mobile), para não espremer colunas demais.
 * Nunca os dois ao mesmo tempo (breakpoints Tailwind).
 */
export function ClientesTable({ clientes, onSelect }: ClientesTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th scope="col" className="px-4 py-3">
              Cliente
            </th>
            <th scope="col" className="px-4 py-3">
              Telefone
            </th>
            <th scope="col" className="px-4 py-3">
              Último atendimento
            </th>
            <th scope="col" className="px-4 py-3">
              Próximo
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Atendimentos
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Total gasto
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente} className="transition hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">{cliente.nome}</td>
              <td className="px-4 py-3 text-zinc-600">{cliente.telefone}</td>
              <td className="px-4 py-3 text-zinc-600">
                {cliente.ultimoAtendimento ? formatDateNumericBR(parseISODate(cliente.ultimoAtendimento)) : "—"}
              </td>
              <td className="px-4 py-3 text-zinc-600">
                {cliente.proximoAtendimento ? formatDateNumericBR(parseISODate(cliente.proximoAtendimento)) : "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                {cliente.totalAtendimentos ?? "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900">
                {formatBRL(cliente.totalGasto)}
              </td>
              <td className="px-4 py-3">
                <ClienteStatusBadge status={cliente.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(cliente)}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
