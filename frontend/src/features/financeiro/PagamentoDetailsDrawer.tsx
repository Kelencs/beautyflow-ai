"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Calendar, CreditCard, Loader2, Scissors, User, UserSquare2, X } from "lucide-react";
import { PagamentoStatusBadge } from "./PagamentoStatusBadge";
import { RegistrarPagamentoModal } from "./RegistrarPagamentoModal";
import type { Pagamento } from "./types";
import { formatBRL, formatFormaPagamento } from "./format";

interface PagamentoDetailsDrawerProps {
  idAgendamento: string | null;
  carregando: boolean;
  pagamento: Pagamento | null;
  erro: string | null;
  onClose: () => void;
}

/** Mesmo padrão visual/estrutural do drawer de Serviços/Clientes (painel lateral). */
export function PagamentoDetailsDrawer({
  idAgendamento,
  carregando,
  pagamento,
  erro,
  onClose,
}: PagamentoDetailsDrawerProps) {
  const [registrarPagamentoAberto, setRegistrarPagamentoAberto] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  if (idAgendamento && idAgendamento !== lastId) {
    setLastId(idAgendamento);
    setRegistrarPagamentoAberto(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !registrarPagamentoAberto) onClose();
    }
    if (idAgendamento) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [idAgendamento, onClose, registrarPagamentoAberto]);

  if (!idAgendamento) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Fechar detalhes do pagamento" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pagamento-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl lg:max-w-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="pagamento-details-title" className="text-lg font-semibold text-zinc-900">
              {pagamento ? pagamento.clienteNome : "Detalhes do pagamento"}
            </h2>
            {pagamento && (
              <div className="mt-1.5">
                <PagamentoStatusBadge status={pagamento.status} />
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
            <p className="text-sm">Carregando registro financeiro...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-700">{erro}</p>
          </div>
        )}

        {!carregando && pagamento && (
          <>
            <dl className="flex flex-col gap-4 px-5 py-5">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Cliente</dt>
                  <dd className="text-sm font-medium text-zinc-800">{pagamento.clienteNome}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Scissors className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Serviço</dt>
                  <dd className="text-sm font-medium text-zinc-800">{pagamento.servicoNome}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserSquare2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Profissional</dt>
                  <dd className="text-sm font-medium text-zinc-800">{pagamento.profissionalNome}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Data</dt>
                  <dd className="text-sm font-medium text-zinc-800">
                    {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
                      new Date(`${pagamento.data}T00:00:00`),
                    )}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-zinc-500">Forma de pagamento</dt>
                  <dd className="text-sm font-medium text-zinc-800">{formatFormaPagamento(pagamento.formaPagamento)}</dd>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3">
                <div>
                  <dt className="text-xs text-zinc-500">Valor do atendimento</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-zinc-900">{formatBRL(pagamento.valorAgendamento)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Valor pago</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-emerald-700">{formatBRL(pagamento.valorPago)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Saldo pendente</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-rose-700">{formatBRL(pagamento.valorPendente)}</dd>
                </div>
              </div>

              <p className="text-xs text-zinc-400">Agendamento {pagamento.idAgendamento}</p>
            </dl>

            <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
              {pagamento.valorPendente > 0 ? (
                <button
                  type="button"
                  onClick={() => setRegistrarPagamentoAberto(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Registrar pagamento
                </button>
              ) : (
                <p className="text-center text-xs font-medium text-emerald-700">
                  Pagamento concluído — nenhum saldo pendente.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {pagamento && (
        <RegistrarPagamentoModal
          open={registrarPagamentoAberto}
          pagamento={pagamento}
          onClose={() => setRegistrarPagamentoAberto(false)}
        />
      )}
    </div>
  );
}
