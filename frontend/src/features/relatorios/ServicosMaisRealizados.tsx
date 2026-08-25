import type { RelatorioServico } from "./types";
import { formatBRL } from "./format";

interface ServicosMaisRealizadosProps {
  servicos: RelatorioServico[];
}

/**
 * Barras horizontais simples com CSS (seção 20 do pedido) — sem biblioteca de gráficos.
 * Vem do backend já como top 5 por quantidade; nunca preenchido artificialmente aqui.
 */
export function ServicosMaisRealizados({ servicos }: ServicosMaisRealizadosProps) {
  const maiorQuantidade = Math.max(1, ...servicos.map((servico) => servico.quantidade));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Serviços mais realizados</h2>

      {servicos.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">Nenhum dado neste período.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {servicos.map((servico) => (
            <li key={servico.nome} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-medium text-zinc-800">{servico.nome}</span>
                <span className="shrink-0 text-zinc-500">
                  {servico.quantidade} · {formatBRL(servico.valorPrevisto)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${(servico.quantidade / maiorQuantidade) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
