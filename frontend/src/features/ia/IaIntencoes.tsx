import { INTENCAO_META } from "./intencao";
import type { IaIntencao } from "./types";

interface IaIntencoesProps {
  intencoes: IaIntencao[];
}

/** "Intenções reconhecidas" — exatamente os códigos reais confirmados no Switch de WF003 + OUTRO. */
export function IaIntencoes({ intencoes }: IaIntencoesProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Intenções reconhecidas</h2>
      <ul className="flex flex-col divide-y divide-zinc-100">
        {intencoes.map((intencao) => {
          const Icon = INTENCAO_META[intencao.codigo].icon;
          return (
            <li key={intencao.codigo} className="flex items-start gap-3 py-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-zinc-800">{intencao.nome}</p>
                <p className="text-xs text-zinc-500">{intencao.descricao}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
