import { Globe, MessageSquareText, Sparkles } from "lucide-react";
import type { IaComportamento as IaComportamentoType } from "./types";

interface IaComportamentoProps {
  comportamento: IaComportamentoType;
}

/**
 * Somente leitura — diferente de Configurações → Negócio (que tem ENT001 como fonte
 * arquitetural clara para campos separados), o comportamento da IA hoje é um único
 * prompt monolítico em WF002, sem tom/idioma como campos internos separadamente
 * configuráveis. Editar "tom" ou "idioma" individualmente implicaria uma modularidade
 * que não existe no prompt real — por isso esta seção não tem "Editar".
 */
export function IaComportamento({ comportamento }: IaComportamentoProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Comportamento do assistente</h2>
        <p className="mt-0.5 text-xs text-zinc-500">{comportamento.descricaoGeral}</p>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <div>
            <dt className="text-xs text-zinc-500">Tom de atendimento</dt>
            <dd className="text-sm font-medium text-zinc-800">{comportamento.tom}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <div>
            <dt className="text-xs text-zinc-500">Idioma</dt>
            <dd className="text-sm font-medium text-zinc-800">{comportamento.idioma}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <div>
            <dt className="text-xs text-zinc-500">Uso de memória</dt>
            <dd className="text-sm font-medium text-zinc-800">
              {comportamento.usaMemoria ? "Considera o histórico recente do cliente" : "Não utiliza histórico"}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
