import Link from "next/link";
import { CalendarX2, ChevronRight } from "lucide-react";
import type { DashboardProximoAtendimento } from "./types";
import { StatusBadge } from "@/features/agenda/StatusBadge";

interface DashboardProximosAtendimentosProps {
  proximosAtendimentos: DashboardProximoAtendimento[];
}

/**
 * Lista compacta (o backend já limita a 5 itens — ver DashboardService) — não é um
 * calendário completo, só uma prévia com link para a Agenda de verdade.
 */
export function DashboardProximosAtendimentos({ proximosAtendimentos }: DashboardProximosAtendimentosProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">Próximos atendimentos</h2>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-violet-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          Ver agenda completa
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {proximosAtendimentos.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 py-6 text-center">
          <CalendarX2 className="h-7 w-7 text-zinc-300" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Nenhum atendimento restante para hoje.</p>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {proximosAtendimentos.map((item) => (
            <li
              key={item.idAgendamento}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-zinc-700">{item.horario}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-800">{item.clienteNome}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {item.servicoNome} · {item.profissionalNome}
                  </p>
                </div>
              </div>
              <StatusBadge status={item.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
