import type { Profissional } from "./types";
import { ProfissionalStatusBadge } from "./ProfissionalStatusBadge";

interface ProfissionaisTableProps {
  profissionais: Profissional[];
  onSelect: (profissional: Profissional) => void;
}

/**
 * Visão desktop largo (>= lg, 1024px) — abaixo disso os cards de ProfissionalCardList.tsx
 * assumem, mesma regra já validada em Clientes/Serviços. E-mail fica só no drawer para
 * não alargar demais a tabela.
 */
export function ProfissionaisTable({ profissionais, onSelect }: ProfissionaisTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th scope="col" className="px-4 py-3">
              Profissional
            </th>
            <th scope="col" className="px-4 py-3">
              Especialidade
            </th>
            <th scope="col" className="px-4 py-3">
              Telefone
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Atendimentos
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {profissionais.map((profissional) => (
            <tr key={profissional.idProfissional} className="transition hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">{profissional.nome}</td>
              <td className="px-4 py-3 text-zinc-600">{profissional.especialidade ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-600">{profissional.telefone ?? "—"}</td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-600">
                {profissional.totalAtendimentos ?? "—"}
              </td>
              <td className="px-4 py-3">
                <ProfissionalStatusBadge status={profissional.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(profissional)}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
