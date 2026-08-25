"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, FileText, Loader2, Pencil, Tag, X } from "lucide-react";
import type { Servico } from "./types";
import { ServicoStatusBadge } from "./ServicoStatusBadge";
import { formatBRL, formatDuracao } from "./format";

interface ServicoDetailsDrawerProps {
  servicoId: string | null;
  carregando: boolean;
  servico: Servico | null;
  erro: string | null;
  onClose: () => void;
}

/** Mesmo padrão visual/estrutural do drawer de Clientes/Agenda (painel lateral). */
export function ServicoDetailsDrawer({ servicoId, carregando, servico, erro, onClose }: ServicoDetailsDrawerProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastServicoId, setLastServicoId] = useState<string | null>(null);

  if (servicoId && servicoId !== lastServicoId) {
    setLastServicoId(servicoId);
    setLastAction(null);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (servicoId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [servicoId, onClose]);

  if (!servicoId) return null;

  const valorPorHora = servico ? servico.valor / (servico.duracaoMinutos / 60) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Fechar detalhes do serviço" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="servico-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="servico-details-title" className="text-lg font-semibold text-zinc-900">
              {servico ? servico.nome : "Detalhes do serviço"}
            </h2>
            {servico && (
              <div className="mt-1.5">
                <ServicoStatusBadge status={servico.status} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {carregando && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-zinc-400">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <p className="text-sm">Carregando serviço...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-700">{erro}</p>
          </div>
        )}

        {!carregando && servico && (
          <>
            <dl className="flex flex-col gap-4 px-5 py-5">
              {servico.descricao && (
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-zinc-500">Descrição</dt>
                    <dd className="text-sm font-medium text-zinc-800">{servico.descricao}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Duração</dt>
                  <dd className="text-sm font-medium text-zinc-800">{formatDuracao(servico.duracaoMinutos)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Valor</dt>
                  <dd className="text-base font-semibold text-zinc-900">
                    {formatBRL(servico.valor)}
                    <span className="ml-1.5 text-xs font-normal text-zinc-500">
                      · {formatBRL(valorPorHora)}/hora
                    </span>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
              {lastAction && (
                <p role="status" className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                  {lastAction}
                </p>
              )}
              <button
                type="button"
                onClick={() =>
                  setLastAction('Ação "Editar serviço" registrada nesta tela (módulo Serviços — sem persistência ainda).')
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar serviço
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
