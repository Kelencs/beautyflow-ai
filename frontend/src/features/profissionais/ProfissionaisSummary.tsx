import type { Profissional } from "./types";

interface ProfissionaisSummaryProps {
  profissionais: Profissional[];
}

/**
 * "Atendimentos da equipe" soma `totalAtendimentos` (derivado/mockado nesta etapa — ver
 * profissionais.mock-data.ts no backend) de todos os profissionais, não só ativos —
 * indicador de volume de trabalho da equipe, não uma métrica financeira.
 *
 * `totalAtendimentos` é `null` quando a fonte é o APP-WF019 (a aba PROFISSIONAIS sozinha
 * não calcula isso — ver libs/shared-types/src/profissionais.ts). Se qualquer
 * profissional da lista tiver esse valor desconhecido, a soma inteira também é
 * desconhecida — nunca somamos `null` como 0 (isso fabricaria um total parcial que pareceria
 * completo); o card mostra "—" nesse caso, igual ao resto do App para dado ausente.
 */
export function ProfissionaisSummary({ profissionais }: ProfissionaisSummaryProps) {
  const ativos = profissionais.filter((profissional) => profissional.status === "ATIVO").length;
  const inativos = profissionais.length - ativos;
  const totalConhecido = profissionais.every((profissional) => profissional.totalAtendimentos !== null);
  const atendimentosEquipe = totalConhecido
    ? profissionais.reduce((soma, profissional) => soma + (profissional.totalAtendimentos ?? 0), 0)
    : null;

  const cards = [
    { label: "Total de profissionais", value: String(profissionais.length) },
    { label: "Profissionais ativos", value: String(ativos) },
    { label: "Profissionais inativos", value: String(inativos) },
    { label: "Atendimentos da equipe", value: atendimentosEquipe === null ? "—" : String(atendimentosEquipe) },
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
