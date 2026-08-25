"use client";

import { Search } from "lucide-react";
import { PERIODO_COMUNICACAO_LABEL } from "./types";
import type { FiltroStatusComunicacao, FiltroTipoComunicacao, PeriodoComunicacao } from "./types";

interface ComunicacaoHeaderProps {
  periodo: PeriodoComunicacao;
  onPeriodoChange: (periodo: PeriodoComunicacao) => void;
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtroTipo: FiltroTipoComunicacao;
  onFiltroTipoChange: (filtro: FiltroTipoComunicacao) => void;
  filtroStatus: FiltroStatusComunicacao;
  onFiltroStatusChange: (filtro: FiltroStatusComunicacao) => void;
}

const PERIODOS: PeriodoComunicacao[] = ["hoje", "7dias", "mes"];

const FILTROS_TIPO: { value: FiltroTipoComunicacao; label: string }[] = [
  { value: "todos", label: "Todos os tipos" },
  { value: "CONFIRMACAO", label: "Confirmação" },
  { value: "LEMBRETE", label: "Lembrete" },
  { value: "PESQUISA", label: "Pesquisa" },
  { value: "FOLLOWUP", label: "Follow-up" },
  { value: "COBRANCA", label: "Cobrança" },
];

const FILTROS_STATUS: { value: FiltroStatusComunicacao; label: string }[] = [
  { value: "todos", label: "Todos os status" },
  { value: "ENVIADA", label: "Enviada" },
  { value: "FALHA", label: "Falha" },
];

export function ComunicacaoHeader({
  periodo,
  onPeriodoChange,
  busca,
  onBuscaChange,
  filtroTipo,
  onFiltroTipoChange,
  filtroStatus,
  onFiltroStatusChange,
}: ComunicacaoHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Comunicação</h1>
        <p className="text-sm text-zinc-500">Acompanhe mensagens e interações com seus clientes.</p>
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
              periodo === opcao ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {PERIODO_COMUNICACAO_LABEL[opcao]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(event) => onBuscaChange(event.target.value)}
            placeholder="Buscar cliente, telefone ou mensagem..."
            aria-label="Buscar por cliente, telefone ou mensagem"
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <label className="sr-only" htmlFor="filtro-tipo-comunicacao">
          Filtrar por tipo
        </label>
        <select
          id="filtro-tipo-comunicacao"
          value={filtroTipo}
          onChange={(event) => onFiltroTipoChange(event.target.value as FiltroTipoComunicacao)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-auto"
        >
          {FILTROS_TIPO.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filtro-status-comunicacao">
          Filtrar por status
        </label>
        <select
          id="filtro-status-comunicacao"
          value={filtroStatus}
          onChange={(event) => onFiltroStatusChange(event.target.value as FiltroStatusComunicacao)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-auto"
        >
          {FILTROS_STATUS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
