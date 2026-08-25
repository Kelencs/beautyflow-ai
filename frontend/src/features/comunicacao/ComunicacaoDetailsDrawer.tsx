"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Calendar, Loader2, MessageSquareText, Phone, RotateCcw, User, X } from "lucide-react";
import { ComunicacaoStatusBadge } from "./ComunicacaoStatusBadge";
import { TipoComunicacaoBadge } from "./TipoComunicacaoBadge";
import type { ComunicacaoItem } from "./types";
import { formatBRL, formatDataHoraBR } from "./format";

interface ComunicacaoDetailsDrawerProps {
  idComunicacao: string | null;
  carregando: boolean;
  comunicacao: ComunicacaoItem | null;
  erro: string | null;
  onClose: () => void;
}

/** Mesmo padrão visual/estrutural do drawer de Financeiro/Serviços (painel lateral). */
export function ComunicacaoDetailsDrawer({
  idComunicacao,
  carregando,
  comunicacao,
  erro,
  onClose,
}: ComunicacaoDetailsDrawerProps) {
  const [feedbackReenvio, setFeedbackReenvio] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  if (idComunicacao && idComunicacao !== lastId) {
    setLastId(idComunicacao);
    setFeedbackReenvio(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (idComunicacao) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [idComunicacao, onClose]);

  if (!idComunicacao) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Fechar detalhes da comunicação" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="comunicacao-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl lg:max-w-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="comunicacao-details-title" className="text-lg font-semibold text-zinc-900">
              {comunicacao ? comunicacao.clienteNome : "Detalhes da comunicação"}
            </h2>
            {comunicacao && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <TipoComunicacaoBadge tipo={comunicacao.tipo} />
                <ComunicacaoStatusBadge status={comunicacao.status} />
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
            <p className="text-sm">Carregando comunicação...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-700">{erro}</p>
          </div>
        )}

        {!carregando && comunicacao && (
          <>
            <dl className="flex flex-col gap-4 px-5 py-5">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Cliente</dt>
                  <dd className="text-sm font-medium text-zinc-800">{comunicacao.clienteNome}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Telefone</dt>
                  <dd className="text-sm font-medium text-zinc-800">{comunicacao.telefone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Data/Hora</dt>
                  <dd className="text-sm font-medium text-zinc-800">{formatDataHoraBR(comunicacao.dataHora)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Mensagem</dt>
                  <dd className="text-sm font-medium text-zinc-800">{comunicacao.mensagem ?? "—"}</dd>
                </div>
              </div>

              {comunicacao.valorRelacionado !== null && (
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3">
                  <dt className="text-xs text-zinc-500">Valor relacionado</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-zinc-900">
                    {formatBRL(comunicacao.valorRelacionado)}
                  </dd>
                  <p className="mt-1 text-xs text-zinc-400">
                    O Financeiro continua sendo a fonte de dados do pagamento — aqui é só o evento de cobrança.
                  </p>
                </div>
              )}

              {comunicacao.idAgendamento && (
                <p className="text-xs text-zinc-400">Agendamento relacionado: {comunicacao.idAgendamento}</p>
              )}
            </dl>

            {comunicacao.status === "FALHA" && (
              <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
                {feedbackReenvio && (
                  <p role="status" className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                    Reenvio será habilitado quando a integração real de comunicação estiver ativa.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setFeedbackReenvio(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reenviar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
