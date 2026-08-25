import Link from "next/link";
import { CalendarX2, Clock } from "lucide-react";
import type { DashboardProximoAtendimento as ProximoAtendimentoType } from "./types";
import { StatusBadge } from "@/features/agenda/StatusBadge";

interface DashboardProximoAtendimentoProps {
  proximoAtendimento: ProximoAtendimentoType | null;
}

/** Área de destaque — não é erro nem vazio "quebrado" quando não há nada hoje, só um estado neutro. */
export function DashboardProximoAtendimento({ proximoAtendimento }: DashboardProximoAtendimentoProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Próximo atendimento</h2>

      {!proximoAtendimento ? (
        <div className="mt-3 flex flex-col items-center gap-2 py-6 text-center">
          <CalendarX2 className="h-7 w-7 text-zinc-300" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Nenhum atendimento restante para hoje.</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold tabular-nums text-zinc-900">{proximoAtendimento.horario}</p>
              <p className="text-sm font-medium text-zinc-800">{proximoAtendimento.clienteNome}</p>
              <p className="text-sm text-zinc-500">
                {proximoAtendimento.servicoNome} · {proximoAtendimento.profissionalNome}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            <StatusBadge status={proximoAtendimento.status} />
            <Link
              href="/agenda"
              className="text-sm font-semibold text-violet-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Ver na agenda
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
