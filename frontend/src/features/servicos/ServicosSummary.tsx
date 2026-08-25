import type { Servico } from "./types";
import { formatBRL } from "./format";

interface ServicosSummaryProps {
  servicos: Servico[];
}

/**
 * Ticket médio = média do VALOR dos serviços ativos (não é faturamento — não considera
 * quantos atendimentos de fato aconteceram, só o preço de tabela dos serviços ativos).
 */
export function ServicosSummary({ servicos }: ServicosSummaryProps) {
  const ativos = servicos.filter((servico) => servico.status === "ATIVO");
  const inativos = servicos.length - ativos.length;
  const ticketMedio = ativos.length > 0 ? ativos.reduce((soma, servico) => soma + servico.valor, 0) / ativos.length : 0;

  const cards = [
    { label: "Total de serviços", value: String(servicos.length) },
    { label: "Serviços ativos", value: String(ativos.length) },
    { label: "Serviços inativos", value: String(inativos) },
    { label: "Ticket médio", value: formatBRL(ticketMedio) },
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
