import type { RelatorioResumo } from "./types";
import { formatPercent } from "./format";

interface ComunicacaoResumoSectionProps {
  resumo: RelatorioResumo;
}

/**
 * Seção pequena (seção 19 do pedido): Enviadas / Com falha + taxa de sucesso de envio
 * (enviadas / total). Nunca Entregue/Lida — esses status não existem hoje (ver auditoria
 * do módulo Comunicação).
 */
export function ComunicacaoResumoSection({ resumo }: ComunicacaoResumoSectionProps) {
  const total = resumo.comunicacoesEnviadas + resumo.comunicacoesComFalha;
  const taxaSucesso = total > 0 ? resumo.comunicacoesEnviadas / total : 0;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Comunicação</h2>
      <dl className="grid grid-cols-3 gap-3">
        <div>
          <dt className="text-xs text-zinc-500">Enviadas</dt>
          <dd className="mt-0.5 text-lg font-semibold text-emerald-700">{resumo.comunicacoesEnviadas}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Com falha</dt>
          <dd className="mt-0.5 text-lg font-semibold text-rose-700">{resumo.comunicacoesComFalha}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Taxa de sucesso</dt>
          <dd className="mt-0.5 text-lg font-semibold text-zinc-900">{total > 0 ? formatPercent(taxaSucesso) : "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
