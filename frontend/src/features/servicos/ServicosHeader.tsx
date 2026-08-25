"use client";

import { Plus, Search } from "lucide-react";
import type { FiltroServico } from "./types";

interface ServicosHeaderProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtro: FiltroServico;
  onFiltroChange: (filtro: FiltroServico) => void;
  onNovoServico: () => void;
}

const FILTROS: { value: FiltroServico; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ativos", label: "Ativos" },
  { value: "inativos", label: "Inativos" },
];

export function ServicosHeader({ busca, onBuscaChange, filtro, onFiltroChange, onNovoServico }: ServicosHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Serviços</h1>
        <p className="text-sm text-zinc-500">Gerencie os serviços oferecidos e seus valores.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              value={busca}
              onChange={(event) => onBuscaChange(event.target.value)}
              placeholder="Buscar serviço..."
              aria-label="Buscar serviço"
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <label className="sr-only" htmlFor="filtro-servicos">
            Filtrar serviços
          </label>
          <select
            id="filtro-servicos"
            value={filtro}
            onChange={(event) => onFiltroChange(event.target.value as FiltroServico)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-auto"
          >
            {FILTROS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onNovoServico}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo serviço
        </button>
      </div>
    </div>
  );
}
