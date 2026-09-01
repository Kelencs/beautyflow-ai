"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Calendar, CalendarDays, Loader2, Mail, Pencil, Phone, Sparkles, X } from "lucide-react";
import Link from "next/link";
import type { Profissional } from "./types";
import { ProfissionalStatusBadge } from "./ProfissionalStatusBadge";
import { formatDateNumericBR, parseISODate } from "@/lib/date";

interface ProfissionalDetailsDrawerProps {
  profissionalId: string | null;
  carregando: boolean;
  profissional: Profissional | null;
  erro: string | null;
  onClose: () => void;
}

/** Mesmo padrão visual/estrutural do drawer de Clientes/Serviços/Agenda (painel lateral). */
export function ProfissionalDetailsDrawer({
  profissionalId,
  carregando,
  profissional,
  erro,
  onClose,
}: ProfissionalDetailsDrawerProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastProfissionalId, setLastProfissionalId] = useState<string | null>(null);

  if (profissionalId && profissionalId !== lastProfissionalId) {
    setLastProfissionalId(profissionalId);
    setLastAction(null);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (profissionalId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [profissionalId, onClose]);

  if (!profissionalId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fechar detalhes do profissional"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profissional-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="profissional-details-title" className="text-lg font-semibold text-zinc-900">
              {profissional ? profissional.nome : "Detalhes do profissional"}
            </h2>
            {profissional && (
              <div className="mt-1.5">
                <ProfissionalStatusBadge status={profissional.status} />
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
            <p className="text-sm">Carregando profissional...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-700">{erro}</p>
          </div>
        )}

        {!carregando && profissional && (
          <>
            <dl className="flex flex-col gap-4 px-5 py-5">
              {profissional.especialidade && (
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-zinc-500">Especialidade</dt>
                    <dd className="text-sm font-medium text-zinc-800">{profissional.especialidade}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Telefone</dt>
                  <dd className="text-sm font-medium text-zinc-800">{profissional.telefone ?? "Não informado"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">E-mail</dt>
                  <dd className="text-sm font-medium text-zinc-800">{profissional.email ?? "Não informado"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Próximo atendimento</dt>
                  <dd className="text-sm font-medium text-zinc-800">
                    {profissional.proximoAtendimento
                      ? formatDateNumericBR(parseISODate(profissional.proximoAtendimento))
                      : "Nenhum agendado"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Total de atendimentos</dt>
                  <dd className="text-base font-semibold text-zinc-900">
                    {profissional.totalAtendimentos ?? "Não disponível"}
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
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setLastAction('Ação "Editar profissional" registrada nesta tela (módulo Profissionais — sem persistência ainda).')
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar
                </button>
                <Link
                  href="/agenda"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Ver agenda
                </Link>
              </div>
              <p className="text-xs text-zinc-400">
                &quot;Ver agenda&quot; ainda abre a Agenda geral — filtrar por este profissional é uma etapa futura.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
