"use client";

import { useState } from "react";
import { PRESET_RELATORIO_LABEL } from "./types";
import type { PresetRelatorio } from "./types";

interface RelatoriosHeaderProps {
  preset: PresetRelatorio;
  dataInicio: string;
  dataFim: string;
  onPresetChange: (preset: PresetRelatorio) => void;
  onCustomChange: (dataInicio: string, dataFim: string) => void;
}

const PRESETS: Exclude<PresetRelatorio, "custom">[] = ["hoje", "7dias", "mes", "30dias", "ano"];

/** Intervalo customizado simples (seção 17 do pedido) — dois campos de data + um botão, sem date picker complexo. */
export function RelatoriosHeader({ preset, dataInicio, dataFim, onPresetChange, onCustomChange }: RelatoriosHeaderProps) {
  const [customAberto, setCustomAberto] = useState(preset === "custom");
  const [inicioRascunho, setInicioRascunho] = useState(dataInicio);
  const [fimRascunho, setFimRascunho] = useState(dataFim);

  function handleAplicarCustom() {
    if (inicioRascunho && fimRascunho) {
      onCustomChange(inicioRascunho, fimRascunho);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Relatórios</h1>
        <p className="text-sm text-zinc-500">Analise o desempenho e acompanhe os principais indicadores do negócio.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div
          role="group"
          aria-label="Selecionar período"
          className="inline-flex w-fit flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
        >
          {PRESETS.map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => {
                setCustomAberto(false);
                onPresetChange(opcao);
              }}
              aria-pressed={preset === opcao}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                preset === opcao ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {PRESET_RELATORIO_LABEL[opcao]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomAberto((atual) => !atual)}
            aria-pressed={preset === "custom"}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              preset === "custom" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Personalizado
          </button>
        </div>

        {customAberto && (
          <div className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 bg-white p-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="relatorios-data-inicio" className="text-xs font-medium text-zinc-600">
                Data inicial
              </label>
              <input
                id="relatorios-data-inicio"
                type="date"
                value={inicioRascunho}
                onChange={(event) => setInicioRascunho(event.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="relatorios-data-fim" className="text-xs font-medium text-zinc-600">
                Data final
              </label>
              <input
                id="relatorios-data-fim"
                type="date"
                value={fimRascunho}
                onChange={(event) => setFimRascunho(event.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <button
              type="button"
              onClick={handleAplicarCustom}
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Aplicar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
