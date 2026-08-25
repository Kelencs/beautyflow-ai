import type { ComunicacaoResumo } from "./types";

interface ComunicacaoResumoCardsProps {
  resumo: ComunicacaoResumo;
}

/**
 * Cards refletem o RESUMO do período selecionado (calculado pelo backend sobre todos os
 * registros do intervalo), não a lista já filtrada por busca/tipo/status na tela — mesmo
 * critério de FinanceiroResumoCards.tsx. Só 3 cards, não 4: não existe um estado
 * PENDENTE real nas fontes auditadas (ver comentário em comunicacao.ts), então criar um
 * card "Pendentes" seria uma métrica artificial (vedado pela seção 12 do pedido).
 */
export function ComunicacaoResumoCards({ resumo }: ComunicacaoResumoCardsProps) {
  const cards = [
    { label: "Total no período", value: String(resumo.totalPeriodo) },
    { label: "Enviadas", value: String(resumo.enviadas) },
    { label: "Com falha", value: String(resumo.comFalha) },
  ];

  return (
    <dl className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <dt className="text-xs text-zinc-500">{card.label}</dt>
          <dd className="mt-0.5 text-lg font-semibold text-zinc-900 sm:text-xl">{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}
