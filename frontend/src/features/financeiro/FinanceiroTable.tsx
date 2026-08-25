import type { Pagamento } from "./types";
import { PagamentoStatusBadge } from "./PagamentoStatusBadge";
import { formatBRL } from "./format";

interface FinanceiroTableProps {
  pagamentos: Pagamento[];
  onSelect: (pagamento: Pagamento) => void;
}

/**
 * Visão desktop largo (>= lg, 1024px) — abaixo disso os cards de PagamentoCardList.tsx
 * assumem. Mesma lição já aplicada em Clientes/Serviços: usar lg desde o início, não
 * esperar a tabela apertar para só depois trocar por cards (colunas: Data, Cliente,
 * Serviço, Valor, Pago, Pendente, Status, Ação).
 */
export function FinanceiroTable({ pagamentos, onSelect }: FinanceiroTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th scope="col" className="px-4 py-3">
              Data
            </th>
            <th scope="col" className="px-4 py-3">
              Cliente
            </th>
            <th scope="col" className="px-4 py-3">
              Serviço
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Valor
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Pago
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Pendente
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
          {pagamentos.map((pagamento) => (
            <tr key={pagamento.idAgendamento} className="transition hover:bg-zinc-50">
              <td className="px-4 py-3 text-zinc-600">
                {new Intl.DateTimeFormat("pt-BR").format(new Date(`${pagamento.data}T00:00:00`))}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">{pagamento.clienteNome}</td>
              <td className="px-4 py-3 text-zinc-600">{pagamento.servicoNome}</td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-700">
                {formatBRL(pagamento.valorAgendamento)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900">
                {formatBRL(pagamento.valorPago)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-700">
                {formatBRL(pagamento.valorPendente)}
              </td>
              <td className="px-4 py-3">
                <PagamentoStatusBadge status={pagamento.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(pagamento)}
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
