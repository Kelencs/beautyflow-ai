import { Scissors, UserSquare2, Users } from "lucide-react";
import type { DashboardResumo } from "./types";

interface DashboardIndicadoresProps {
  resumo: DashboardResumo;
}

/**
 * Segundo grupo, propositalmente mais discreto que os cards principais (linha compacta,
 * não outro conjunto de 4 cards grandes) — só contexto adicional, não o foco da tela.
 */
export function DashboardIndicadores({ resumo }: DashboardIndicadoresProps) {
  const indicadores = [
    { label: "Clientes ativos", value: resumo.clientesAtivos, icon: Users },
    { label: "Profissionais ativos", value: resumo.profissionaisAtivos, icon: UserSquare2 },
    { label: "Serviços ativos", value: resumo.servicosAtivos, icon: Scissors },
  ];

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
      {indicadores.map((indicador) => (
        <div key={indicador.label} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <indicador.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-zinc-900">{indicador.value}</p>
            <p className="text-xs text-zinc-500">{indicador.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
