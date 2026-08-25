import type { DashboardResumo } from "./types";
import { formatBRL } from "./format";

interface DashboardResumoCardsProps {
  resumo: DashboardResumo;
}

/** Cartões principais — todos derivados da Agenda de hoje (mesma fonte/regra de AgendaService). */
export function DashboardResumoCards({ resumo }: DashboardResumoCardsProps) {
  const cards = [
    { label: "Agendamentos hoje", value: String(resumo.agendamentosHoje) },
    { label: "Confirmados", value: String(resumo.confirmadosHoje) },
    { label: "Pendentes", value: String(resumo.pendentesHoje) },
    { label: "Previsto hoje", value: formatBRL(resumo.previstoHoje) },
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
