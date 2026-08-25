import type { FinanceiroResumo } from "./types";
import { formatBRL } from "./format";

interface FinanceiroResumoCardsProps {
  resumo: FinanceiroResumo;
}

/**
 * Cards refletem o RESUMO do período selecionado (calculado pelo backend sobre todos os
 * registros do intervalo), não a lista já filtrada por busca/status na tela — mesmo
 * critério de ServicosSummary.tsx (agregado, não "o que está visível agora"). Nunca
 * chama nada de "lucro" ou "faturamento líquido" — não há despesas modeladas ainda.
 */
export function FinanceiroResumoCards({ resumo }: FinanceiroResumoCardsProps) {
  const cards = [
    { label: "Recebido no período", value: formatBRL(resumo.recebido) },
    { label: "Pendente", value: formatBRL(resumo.pendente) },
    { label: "Total previsto", value: formatBRL(resumo.totalPrevisto) },
    {
      // "Pagamentos" seria impreciso: a contagem inclui registros PENDENTE (valorPago = 0).
      label: "Atendimentos no período",
      value: String(resumo.totalPagamentos),
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <dt className="text-xs text-zinc-500">{card.label}</dt>
          <dd className="mt-0.5 text-lg font-semibold text-zinc-900 sm:text-xl">{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}
