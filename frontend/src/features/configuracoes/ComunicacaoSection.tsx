import { TipoComunicacaoBadge } from "@/features/comunicacao/TipoComunicacaoBadge";
import type { AutomacaoComunicacao } from "./types";

interface ComunicacaoSectionProps {
  automacoes: AutomacaoComunicacao[];
}

/**
 * Somente leitura (seção 10 do pedido): não existe hoje nenhuma flag de ativação por
 * empresa em EMPRESAS para estas automações — mostrar toggles funcionais seria inventar
 * uma configuração sem fonte. As automações já rodam via COM-WF012/013/014/015/
 * FIN-WF011; "Disponível" aqui significa "a automação existe no sistema", não "ativada
 * para esta empresa".
 */
export function ComunicacaoSection({ automacoes }: ComunicacaoSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Automações de comunicação</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Envios automáticos já disponíveis no sistema. Ativar/desativar cada tipo por empresa é uma
          configuração futura.
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-zinc-100">
        {automacoes.map((automacao) => (
          <li key={automacao.tipo} className="flex items-center justify-between gap-3 py-2.5">
            <TipoComunicacaoBadge tipo={automacao.tipo} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
              Disponível na automação
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
