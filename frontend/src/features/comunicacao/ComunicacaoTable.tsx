import type { ComunicacaoItem } from "./types";
import { ComunicacaoStatusBadge } from "./ComunicacaoStatusBadge";
import { TipoComunicacaoBadge } from "./TipoComunicacaoBadge";
import { formatDataHoraBR, formatMensagemPreview } from "./format";

interface ComunicacaoTableProps {
  comunicacoes: ComunicacaoItem[];
  onSelect: (comunicacao: ComunicacaoItem) => void;
}

/**
 * Visão desktop largo (>= lg, 1024px) — abaixo disso os cards de ComunicacaoCardList.tsx
 * assumem. Colunas: Data/Hora, Cliente, Tipo, Mensagem (preview curto), Status, Ação —
 * telefone fica só no drawer para não alargar demais a tabela (seção 14 do pedido).
 */
export function ComunicacaoTable({ comunicacoes, onSelect }: ComunicacaoTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th scope="col" className="px-4 py-3">
              Data/Hora
            </th>
            <th scope="col" className="px-4 py-3">
              Cliente
            </th>
            <th scope="col" className="px-4 py-3">
              Tipo
            </th>
            <th scope="col" className="px-4 py-3">
              Mensagem
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
          {comunicacoes.map((comunicacao) => (
            <tr key={comunicacao.idComunicacao} className="transition hover:bg-zinc-50">
              <td className="whitespace-nowrap px-4 py-3 text-zinc-600">{formatDataHoraBR(comunicacao.dataHora)}</td>
              <td className="px-4 py-3 font-medium text-zinc-900">{comunicacao.clienteNome}</td>
              <td className="px-4 py-3">
                <TipoComunicacaoBadge tipo={comunicacao.tipo} />
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-zinc-600">
                {formatMensagemPreview(comunicacao.mensagem)}
              </td>
              <td className="px-4 py-3">
                <ComunicacaoStatusBadge status={comunicacao.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(comunicacao)}
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
