import { ChevronRight } from "lucide-react";
import type { Servico } from "./types";
import { ServicoStatusBadge } from "./ServicoStatusBadge";
import { formatBRL, formatDuracao } from "./format";

interface ServicoCardListProps {
  servicos: Servico[];
  onSelect: (servico: Servico) => void;
}

/** Visão tablet/notebook estreito + mobile (< lg, 1024px) — tabela desktop só em telas largas. */
export function ServicoCardList({ servicos, onSelect }: ServicoCardListProps) {
  return (
    <ul className="flex flex-col gap-2.5 lg:hidden">
      {servicos.map((servico) => (
        <li key={servico.idServico}>
          <button
            type="button"
            onClick={() => onSelect(servico)}
            aria-label={`Ver detalhes de ${servico.nome}`}
            className="flex w-full flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-zinc-900">{servico.nome}</p>
              <ServicoStatusBadge status={servico.status} className="shrink-0" />
            </div>

            {servico.descricao && <p className="line-clamp-2 text-xs text-zinc-500">{servico.descricao}</p>}

            <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5">
              <span className="text-xs font-medium text-zinc-500">{formatDuracao(servico.duracaoMinutos)}</span>
              <span className="text-sm font-semibold text-zinc-900">{formatBRL(servico.valor)}</span>
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
