"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  Scissors,
  User,
  X,
} from "lucide-react";
import type { Agendamento } from "./types";
import { STATUS_CONFIRMACAO_META } from "./status";
import { StatusBadge } from "./StatusBadge";
import { cancelarAgendamentoAction } from "./actions";
import { formatLongDate, parseISODate } from "@/lib/date";
import { cn } from "@/lib/cn";

interface AppointmentDetailsProps {
  agendamento: Agendamento | null;
  onClose: () => void;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/** Limite de caracteres do motivo — mesmo valor de AGENDA_CANCELAR_MOTIVO_MAX_LENGTH no backend. */
const MOTIVO_CANCELAMENTO_MAX_LENGTH = 300;

/**
 * `cancelar` é a ÚNICA ação com mutação real nesta tela (ver PATCH /agenda/:id/cancelar,
 * APP-WF020). `editar`/`reagendar`/`concluir` permanecem MVP visual — nenhuma delas
 * persiste dado (sem backend real ainda para essas três).
 */
const ACTIONS = [
  { key: "editar", label: "Editar" },
  { key: "reagendar", label: "Reagendar" },
  { key: "cancelar", label: "Cancelar" },
  { key: "concluir", label: "Concluir atendimento" },
] as const;

export function AppointmentDetails({ agendamento, onClose }: AppointmentDetailsProps) {
  const router = useRouter();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastAgendamentoId, setLastAgendamentoId] = useState<string | null>(null);
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [enviandoCancelamento, setEnviandoCancelamento] = useState(false);
  const [erroCancelamento, setErroCancelamento] = useState<string | null>(null);

  if (agendamento && agendamento.idAgendamento !== lastAgendamentoId) {
    setLastAgendamentoId(agendamento.idAgendamento);
    setLastAction(null);
    setConfirmandoCancelamento(false);
    setMotivoCancelamento("");
    setEnviandoCancelamento(false);
    setErroCancelamento(null);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (agendamento) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [agendamento, onClose]);

  if (!agendamento) return null;

  const info = [
    { icon: User, label: "Cliente", value: agendamento.clienteNome },
    { icon: Phone, label: "Telefone", value: agendamento.clienteTelefone },
    { icon: Scissors, label: "Serviço", value: agendamento.servicoNome },
    { icon: User, label: "Profissional", value: agendamento.profissionalNome },
    { icon: Calendar, label: "Data", value: formatLongDate(parseISODate(agendamento.data)) },
    { icon: Clock, label: "Horário", value: `${agendamento.horaInicio} — ${agendamento.horaFim}` },
    { icon: DollarSign, label: "Valor", value: formatBRL(agendamento.valor) },
  ];

  // Confirmação exibida como linha própria e separada do Status (cabeçalho, acima) —
  // os dois eixos nunca devem ser fundidos num único indicador (ver StatusAgendamento x
  // StatusConfirmacao em @beautyflow/shared-types). Só listada quando o atendimento
  // ainda está AGENDADO: fora disso a confirmação não se aplica (statusConfirmacao é
  // sempre null), então a linha nem aparece — em vez de mostrar um "—" para algo que não
  // faz sentido perguntar. Dentro de AGENDADO, "—" sinaliza especificamente o caso
  // (hoje só teórico, sem persistência real ainda) de confirmação desconhecida.
  if (agendamento.status === "AGENDADO") {
    info.splice(1, 0, {
      icon: BadgeCheck,
      label: "Confirmação",
      value: agendamento.statusConfirmacao
        ? STATUS_CONFIRMACAO_META[agendamento.statusConfirmacao].label
        : "—",
    });
  }

  function handleAcaoClick(actionKey: (typeof ACTIONS)[number]["key"], label: string) {
    if (actionKey === "cancelar") {
      setErroCancelamento(null);
      setConfirmandoCancelamento(true);
      return;
    }
    // editar/reagendar/concluir continuam MVP visual — sem persistência ainda.
    setLastAction(`Ação "${label}" registrada nesta tela (MVP visual — sem persistência ainda).`);
  }

  function handleVoltarCancelamento() {
    setConfirmandoCancelamento(false);
    setMotivoCancelamento("");
    setErroCancelamento(null);
  }

  async function handleConfirmarCancelamento() {
    if (!agendamento) return;
    setEnviandoCancelamento(true);
    setErroCancelamento(null);

    const resultado = await cancelarAgendamentoAction(agendamento.idAgendamento, motivoCancelamento);

    if (!resultado.ok) {
      setEnviandoCancelamento(false);
      setErroCancelamento(resultado.mensagem ?? "Não foi possível cancelar o agendamento.");
      return;
    }

    // Sucesso: fecha o painel e recarrega a Agenda (Server Component) para refletir o
    // novo status — sem optimistic update antes da confirmação do backend.
    setEnviandoCancelamento(false);
    setConfirmandoCancelamento(false);
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fechar detalhes do agendamento"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="appointment-details-title" className="text-lg font-semibold text-zinc-900">
              Detalhes do atendimento
            </h2>
            <div className="mt-1.5">
              <StatusBadge status={agendamento.status} />
            </div>
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

        <dl className="flex flex-col gap-4 px-5 py-5">
          {info.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              <div>
                <dt className="text-xs text-zinc-500">{label}</dt>
                <dd className="text-sm font-medium text-zinc-800">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
          {confirmandoCancelamento ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-zinc-900">Cancelar este agendamento?</p>
              <div className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <p className="font-medium text-zinc-800">{agendamento.clienteNome}</p>
                <p>
                  {formatLongDate(parseISODate(agendamento.data))} · {agendamento.horaInicio}–
                  {agendamento.horaFim}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="motivo-cancelamento" className="text-xs font-medium text-zinc-600">
                  Motivo (opcional)
                </label>
                <textarea
                  id="motivo-cancelamento"
                  rows={2}
                  maxLength={MOTIVO_CANCELAMENTO_MAX_LENGTH}
                  value={motivoCancelamento}
                  onChange={(event) => setMotivoCancelamento(event.target.value)}
                  disabled={enviandoCancelamento}
                  className="resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                />
              </div>

              {erroCancelamento && (
                <p role="alert" className="text-xs font-medium text-rose-600">
                  {erroCancelamento}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleVoltarCancelamento}
                  disabled={enviandoCancelamento}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-60"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarCancelamento}
                  disabled={enviandoCancelamento}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-60"
                >
                  {enviandoCancelamento ? "Cancelando…" : "Confirmar cancelamento"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {lastAction && (
                <p role="status" className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                  {lastAction}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {ACTIONS.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => handleAcaoClick(action.key, action.label)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                      action.key === "cancelar"
                        ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                        : action.key === "concluir"
                          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
