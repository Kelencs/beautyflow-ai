import type { RelatorioSerieTemporal } from "./types";
import { formatDataBR } from "./format";

interface SerieTemporalChartProps {
  serie: RelatorioSerieTemporal[];
}

/**
 * Barra simples com CSS (seção 15 do pedido) — sem biblioteca de gráficos. Uma barra por
 * dia do período; container com scroll horizontal para períodos longos (ex.: "Este ano")
 * em vez de espremer as barras até ficarem ilegíveis. `role="img"` + `aria-label` dão um
 * resumo textual do conjunto; cada barra também tem `title` com o valor exato do dia
 * (seção 32 do pedido — equivalente textual, nunca só a barra visual).
 */
export function SerieTemporalChart({ serie }: SerieTemporalChartProps) {
  const totalAtendimentos = serie.reduce((soma, dia) => soma + dia.atendimentos, 0);
  const maiorValor = Math.max(1, ...serie.map((dia) => dia.atendimentos));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Atendimentos ao longo do período</h2>

      {totalAtendimentos === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">Nenhum dado neste período.</p>
      ) : (
        <div
          role="img"
          aria-label={`Atendimentos por dia entre ${formatDataBR(serie[0]?.data ?? "")} e ${formatDataBR(
            serie[serie.length - 1]?.data ?? "",
          )}, totalizando ${totalAtendimentos} atendimentos.`}
          className="flex items-end gap-1 overflow-x-auto pb-1"
        >
          {serie.map((dia) => (
            <div
              key={dia.data}
              title={`${formatDataBR(dia.data)}: ${dia.atendimentos} ${dia.atendimentos === 1 ? "atendimento" : "atendimentos"}`}
              className="flex w-3 shrink-0 flex-col items-center gap-1"
            >
              <div
                className="w-full min-h-[2px] rounded-t bg-violet-400"
                style={{ height: `${(dia.atendimentos / maiorValor) * 96 + 2}px` }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
