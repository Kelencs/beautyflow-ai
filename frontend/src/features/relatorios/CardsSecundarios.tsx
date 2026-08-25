import type { RelatorioResumo } from "./types";
import { formatPercent } from "./format";

interface CardsSecundariosProps {
  resumo: RelatorioResumo;
}

/**
 * Segunda área, mais discreta visualmente (seção 18 do pedido — texto/números menores,
 * sem o mesmo destaque dos cards principais): Confirmados / Concluídos / Cancelados /
 * Clientes novos. Taxas de confirmação/cancelamento aparecem como texto auxiliar, nunca
 * só pela cor.
 */
export function CardsSecundarios({ resumo }: CardsSecundariosProps) {
  const cards = [
    { label: "Confirmados", value: resumo.atendimentosConfirmados, taxa: resumo.taxaConfirmacao },
    { label: "Concluídos", value: resumo.atendimentosConcluidos, taxa: null },
    { label: "Cancelados", value: resumo.atendimentosCancelados, taxa: resumo.taxaCancelamento },
    { label: "Clientes novos", value: resumo.clientesNovos, taxa: null },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
          <dt className="text-xs text-zinc-500">{card.label}</dt>
          <dd className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-zinc-800">{card.value}</span>
            {card.taxa !== null && <span className="text-xs text-zinc-500">({formatPercent(card.taxa)})</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
