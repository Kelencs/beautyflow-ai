"use client";

import { Search } from "lucide-react";
import { PERIODO_LABEL } from "./types";
import type { FiltroStatusPagamento, PeriodoFinanceiro } from "./types";

interface FinanceiroHeaderProps {
  periodo: PeriodoFinanceiro;
  onPeriodoChange: (periodo: PeriodoFinanceiro) => void;
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtro: FiltroStatusPagamento;
  onFiltroChange: (filtro: FiltroStatusPagamento) => void;
}

const PERIODOS: PeriodoFinanceiro[] = ["hoje", "7dias", "mes"];

const FILTROS: { value: FiltroStatusPagamento; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "PAGO", label: "Pago" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "PARCIAL", label: "Parcial" },
];

export function FinanceiroHeader({
  periodo,
  onPeriodoChange,
  busca,
  onBuscaChange,
  filtro,
  onFiltroChange,
}: FinanceiroHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Financeiro</h1>
        <p className="text-sm text-zinc-500">Acompanhe recebimentos e valores pendentes do negócio.</p>
      </div>

      <div
        role="group"
        aria-label="Selecionar período"
        className="inline-flex w-fit items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
      >
        {PERIODOS.map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => onPeriodoChange(opcao)}
            aria-pressed={periodo === opcao}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              periodo === opcao
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {PERIODO_LABEL[opcao]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              value={busca}
              onChange={(event) => onBuscaChange(event.target.value)}
              placeholder="Buscar cliente, serviço ou profissional..."
              aria-label="Buscar por cliente, serviço ou profissional"
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <label className="sr-only" htmlFor="filtro-financeiro">
            Filtrar por status
          </label>
          <select
            id="filtro-financeiro"
            value={filtro}
            onChange={(event) => onFiltroChange(event.target.value as FiltroStatusPagamento)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-auto"
          >
            {FILTROS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
