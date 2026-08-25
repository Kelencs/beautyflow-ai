import { CheckCircle2 } from "lucide-react";
import type { IaCapacidade } from "./types";

interface IaCapacidadesProps {
  capacidades: IaCapacidade[];
}

/** "O que a IA faz" — baseado exclusivamente no comportamento real observado em WF002/WF003. */
export function IaCapacidades({ capacidades }: IaCapacidadesProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-900">O que a IA faz</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {capacidades.map((capacidade) => (
          <li key={capacidade.titulo} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-zinc-800">{capacidade.titulo}</p>
              <p className="text-xs text-zinc-500">{capacidade.descricao}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
