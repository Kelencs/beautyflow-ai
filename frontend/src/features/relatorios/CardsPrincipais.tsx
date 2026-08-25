import type { RelatorioResumo } from "./types";
import { formatBRL } from "./format";

interface CardsPrincipaisProps {
  resumo: RelatorioResumo;
}

/**
 * Primeira linha, em destaque (seção 18 do pedido): Atendimentos / Valor previsto /
 * Recebido / Pendente. Nunca chamado de "lucro" ou "faturamento líquido" — só os três
 * conceitos já aprovados em Financeiro (previsto/recebido/pendente).
 */
export function CardsPrincipais({ resumo }: CardsPrincipaisProps) {
  const cards = [
    { label: "Atendimentos", value: String(resumo.totalAtendimentos) },
    { label: "Valor previsto", value: formatBRL(resumo.valorPrevisto) },
    { label: "Recebido", value: formatBRL(resumo.valorRecebido) },
    { label: "Pendente", value: formatBRL(resumo.valorPendente) },
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
