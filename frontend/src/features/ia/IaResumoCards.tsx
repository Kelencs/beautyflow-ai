import { Bot } from "lucide-react";
import { formatModelo } from "./format";
import type { IaResumo } from "./types";

interface IaResumoCardsProps {
  resumo: IaResumo;
}

/**
 * "PREPARADA" (nunca "conectada"/"online"): não há health-check real nesta etapa — ver
 * libs/shared-types/src/ia.ts. Cards mostram só dados justificáveis pela auditoria
 * (seção 9 do pedido) — nenhuma métrica de precisão/economia/conversão.
 */
export function IaResumoCards({ resumo }: IaResumoCardsProps) {
  const ativa = resumo.status === "PREPARADA";

  const cards = [
    { label: "Interações no total", value: String(resumo.totalInteracoes) },
    { label: "Interações hoje", value: String(resumo.interacoesHoje) },
    { label: "Clientes com memória ativa", value: String(resumo.clientesComMemoriaAtiva) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                ativa ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20" : "bg-zinc-100 text-zinc-600 ring-zinc-500/20"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${ativa ? "bg-emerald-500" : "bg-zinc-400"}`} aria-hidden="true" />
              {ativa ? "Preparada" : "Não configurada"}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Modelo de IA: <span className="font-medium text-zinc-800">{formatModelo(resumo.modelo)}</span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
            <dt className="text-xs text-zinc-500">{card.label}</dt>
            <dd className="mt-0.5 text-lg font-semibold text-zinc-900 sm:text-xl">{card.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
