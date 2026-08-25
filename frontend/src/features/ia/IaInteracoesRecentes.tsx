import { IntencaoBadge } from "./IntencaoBadge";
import type { IaIntencao, IaInteracao } from "./types";
import { formatConfianca, formatDataHoraBR } from "./format";

interface IaInteracoesRecentesProps {
  interacoes: IaInteracao[];
  intencoes: IaIntencao[];
}

/**
 * Lista compacta de interações — observa o COMPORTAMENTO da IA (intenção identificada,
 * confiança autodeclarada), não os eventos de comunicação (isso é o módulo Comunicação).
 * `previewMensagem` já vem truncada do BACKEND (minimização de dados — a mensagem
 * completa nunca chega ao navegador); o `truncate`/`line-clamp` aqui é só para a prévia
 * caber no layout, nunca para "esconder" conteúdo que o cliente já recebeu. Sem `title`
 * (tooltip nativo removido de propósito — acabamento final): não há nada além do preview
 * para mostrar, e um tooltip poderia sugerir a existência de mais conteúdo por trás dele.
 * Sem drawer/endpoint de detalhe (seção 23 do pedido — escopo mínimo).
 */
export function IaInteracoesRecentes({ interacoes, intencoes }: IaInteracoesRecentesProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Interações recentes</h2>

      {interacoes.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">Nenhuma interação registrada ainda.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-zinc-100 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <th scope="col" className="px-3 py-2">
                    Cliente
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Data/Hora
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Intenção
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Prévia da mensagem
                  </th>
                  <th scope="col" className="px-3 py-2 text-right whitespace-nowrap">
                    Confiança da intenção
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {interacoes.map((interacao) => (
                  <tr key={interacao.idInteracao}>
                    <td className="px-3 py-2.5 font-medium text-zinc-900">{interacao.clienteNome}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-zinc-500">{formatDataHoraBR(interacao.dataHora)}</td>
                    <td className="px-3 py-2.5">
                      <IntencaoBadge codigo={interacao.intencao} intencoes={intencoes} />
                    </td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-zinc-600">
                      {interacao.previewMensagem}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-500">
                      {formatConfianca(interacao.confianca)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-2.5 lg:hidden">
            {interacoes.map((interacao) => (
              <li key={interacao.idInteracao} className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900">{interacao.clienteNome}</p>
                  <span className="shrink-0 text-xs text-zinc-400">{formatConfianca(interacao.confianca)}</span>
                </div>
                <div className="mt-1.5">
                  <IntencaoBadge codigo={interacao.intencao} intencoes={intencoes} />
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{interacao.previewMensagem}</p>
                <p className="mt-1.5 text-xs text-zinc-400">{formatDataHoraBR(interacao.dataHora)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
