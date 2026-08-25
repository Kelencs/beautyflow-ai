import { ChevronRight } from "lucide-react";
import type { Profissional } from "./types";
import { ProfissionalStatusBadge } from "./ProfissionalStatusBadge";
import { formatDateNumericBR, parseISODate } from "@/lib/date";

interface ProfissionalCardListProps {
  profissionais: Profissional[];
  onSelect: (profissional: Profissional) => void;
}

/** Visão tablet/notebook estreito + mobile (< lg, 1024px) — tabela desktop só em telas largas. */
export function ProfissionalCardList({ profissionais, onSelect }: ProfissionalCardListProps) {
  return (
    <ul className="flex flex-col gap-2.5 lg:hidden">
      {profissionais.map((profissional) => (
        <li key={profissional.idProfissional}>
          <button
            type="button"
            onClick={() => onSelect(profissional)}
            aria-label={`Ver detalhes de ${profissional.nome}`}
            className="flex w-full flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{profissional.nome}</p>
                {profissional.especialidade && (
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{profissional.especialidade}</p>
                )}
              </div>
              <ProfissionalStatusBadge status={profissional.status} className="shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <p className="text-zinc-400">Telefone</p>
                <p className="mt-0.5 font-medium text-zinc-700">{profissional.telefone ?? "—"}</p>
              </div>
              <div>
                <p className="text-zinc-400">Próximo atendimento</p>
                <p className="mt-0.5 font-medium text-zinc-700">
                  {profissional.proximoAtendimento ? formatDateNumericBR(parseISODate(profissional.proximoAtendimento)) : "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Atendimentos</p>
                <p className="mt-0.5 font-medium text-zinc-700">{profissional.totalAtendimentos}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 border-t border-zinc-100 pt-2.5 text-xs font-semibold text-violet-700">
              Ver detalhes
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
