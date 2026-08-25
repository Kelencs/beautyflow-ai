import { ChevronRight } from "lucide-react";
import type { Pagamento } from "./types";
import { PagamentoStatusBadge } from "./PagamentoStatusBadge";
import { formatBRL } from "./format";

interface PagamentoCardListProps {
  pagamentos: Pagamento[];
  onSelect: (pagamento: Pagamento) => void;
}

/** Visão tablet/notebook estreito + mobile (< lg, 1024px) — tabela desktop só em telas largas. */
export function PagamentoCardList({ pagamentos, onSelect }: PagamentoCardListProps) {
  return (
    <ul className="flex flex-col gap-2.5 lg:hidden">
      {pagamentos.map((pagamento) => (
        <li key={pagamento.idAgendamento}>
          <button
            type="button"
            onClick={() => onSelect(pagamento)}
            aria-label={`Ver detalhes do pagamento de ${pagamento.clienteNome}`}
            className="flex w-full flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{pagamento.clienteNome}</p>
                <p className="truncate text-xs text-zinc-500">{pagamento.servicoNome}</p>
              </div>
              <PagamentoStatusBadge status={pagamento.status} className="shrink-0" />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs">
              <span className="text-zinc-500">
                {new Intl.DateTimeFormat("pt-BR").format(new Date(`${pagamento.data}T00:00:00`))}
              </span>
              <span className="font-medium text-zinc-700">{formatBRL(pagamento.valorAgendamento)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                Pago <span className="font-semibold text-zinc-800">{formatBRL(pagamento.valorPago)}</span>
              </span>
              <span className="text-zinc-500">
                Pendente <span className="font-semibold text-zinc-800">{formatBRL(pagamento.valorPendente)}</span>
              </span>
            </div>

            <div className="flex items-center justify-end gap-1 text-xs font-semibold text-violet-700">
              Ver detalhes
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
