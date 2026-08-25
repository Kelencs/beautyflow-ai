import type { RelatorioProfissional } from "./types";
import { formatBRL } from "./format";

interface DesempenhoProfissionaisProps {
  profissionais: RelatorioProfissional[];
}

/**
 * Barras horizontais simples com CSS (seção 21 do pedido). Linguagem neutra — nunca
 * "melhor profissional" nem "produtividade". Números vêm da Agenda no PERÍODO consultado
 * (nunca o totalAtendimentos histórico do módulo Profissionais — ver relatorios.service.ts).
 * Para um usuário `profissional`, esta lista tem no máximo 1 linha (a própria).
 */
export function DesempenhoProfissionais({ profissionais }: DesempenhoProfissionaisProps) {
  const maiorQuantidade = Math.max(1, ...profissionais.map((item) => item.quantidadeAtendimentos));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Atendimentos por profissional</h2>

      {profissionais.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">Nenhum dado neste período.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {profissionais.map((profissional) => (
            <li key={profissional.nome} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-medium text-zinc-800">{profissional.nome}</span>
                <span className="shrink-0 text-zinc-500">
                  {profissional.quantidadeAtendimentos} · {formatBRL(profissional.valorPrevisto)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(profissional.quantidadeAtendimentos / maiorQuantidade) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
