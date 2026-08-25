import { ChevronRight } from "lucide-react";
import type { ComunicacaoItem } from "./types";
import { ComunicacaoStatusBadge } from "./ComunicacaoStatusBadge";
import { TipoComunicacaoBadge } from "./TipoComunicacaoBadge";
import { formatDataHoraBR, formatMensagemPreview } from "./format";

interface ComunicacaoCardListProps {
  comunicacoes: ComunicacaoItem[];
  onSelect: (comunicacao: ComunicacaoItem) => void;
}

/** Visão tablet/notebook estreito + mobile (< lg, 1024px) — tabela desktop só em telas largas. */
export function ComunicacaoCardList({ comunicacoes, onSelect }: ComunicacaoCardListProps) {
  return (
    <ul className="flex flex-col gap-2.5 lg:hidden">
      {comunicacoes.map((comunicacao) => (
        <li key={comunicacao.idComunicacao}>
          <button
            type="button"
            onClick={() => onSelect(comunicacao)}
            aria-label={`Ver detalhes da comunicação com ${comunicacao.clienteNome}`}
            className="flex w-full flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-zinc-900">{comunicacao.clienteNome}</p>
              <ComunicacaoStatusBadge status={comunicacao.status} className="shrink-0" />
            </div>

            <div className="flex items-center justify-between">
              <TipoComunicacaoBadge tipo={comunicacao.tipo} />
              <span className="text-xs text-zinc-500">{formatDataHoraBR(comunicacao.dataHora)}</span>
            </div>

            <p className="line-clamp-2 border-t border-zinc-100 pt-2.5 text-xs text-zinc-500">
              {formatMensagemPreview(comunicacao.mensagem, 120)}
            </p>

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
