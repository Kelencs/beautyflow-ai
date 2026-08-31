"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Cake,
  Calendar,
  CalendarCheck,
  DollarSign,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Pencil,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ClienteDetalhado } from "./types";
import { ClienteStatusBadge } from "./ClienteStatusBadge";
import { cn } from "@/lib/cn";
import { formatDateNumericBR, parseISODate } from "@/lib/date";

interface ClienteDetailsDrawerProps {
  clienteId: string | null;
  carregando: boolean;
  detalhe: ClienteDetalhado | null;
  erro: string | null;
  onClose: () => void;
}

/**
 * `null` = a fonte de dados atual ainda não sabe calcular este valor (ex.: modo n8n,
 * que hoje só lê CLIENTES) — nunca mostrar como "R$ 0,00", que afirmaria um gasto zero
 * conhecido. "—" é o traço padrão usado no resto da tela para ausência de informação.
 */
function formatBRL(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Só o "Total gasto" usa isto — leve destaque visual, sem virar um card exagerado. */
  destaque?: boolean;
  complemento?: string;
}

const ACOES = [
  { key: "editar", label: "Editar cliente", icon: Pencil },
  { key: "agendamento", label: "Novo agendamento", icon: CalendarCheck },
  { key: "mensagem", label: "Enviar mensagem", icon: MessageCircle },
] as const;

/** Mesmo padrão visual/estrutural do AppointmentDetails da Agenda (drawer lateral). */
export function ClienteDetailsDrawer({ clienteId, carregando, detalhe, erro, onClose }: ClienteDetailsDrawerProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastClienteId, setLastClienteId] = useState<string | null>(null);

  if (clienteId && clienteId !== lastClienteId) {
    setLastClienteId(clienteId);
    setLastAction(null);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (clienteId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [clienteId, onClose]);

  if (!clienteId) return null;

  const info: InfoItem[] = detalhe
    ? [
        { icon: Phone, label: "Telefone", value: detalhe.telefone },
        { icon: Mail, label: "E-mail", value: detalhe.email ?? "Não informado" },
        ...(detalhe.dataNascimento
          ? [{ icon: Cake, label: "Data de nascimento", value: formatDateNumericBR(parseISODate(detalhe.dataNascimento)) }]
          : []),
        { icon: Calendar, label: "Cliente desde", value: formatDateNumericBR(parseISODate(detalhe.clienteDesde)) },
        {
          icon: CalendarCheck,
          label: "Próximo atendimento",
          value: detalhe.proximoAtendimento ? formatDateNumericBR(parseISODate(detalhe.proximoAtendimento)) : "Nenhum agendado",
        },
        {
          icon: Calendar,
          label: "Último atendimento",
          value: detalhe.ultimoAtendimento ? formatDateNumericBR(parseISODate(detalhe.ultimoAtendimento)) : "Nenhum registrado",
        },
        {
          icon: DollarSign,
          label: "Total gasto",
          value: formatBRL(detalhe.totalGasto),
          destaque: true,
          complemento:
            detalhe.totalAtendimentos === null
              ? "Disponível após integração dos atendimentos."
              : `${detalhe.totalAtendimentos} atendimento${detalhe.totalAtendimentos === 1 ? "" : "s"}`,
        },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Fechar detalhes do cliente" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-details-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:my-4 sm:mr-4 sm:rounded-2xl lg:max-w-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 id="cliente-details-title" className="text-lg font-semibold text-zinc-900">
              {detalhe ? detalhe.nome : "Detalhes do cliente"}
            </h2>
            {detalhe && (
              <div className="mt-1.5">
                <ClienteStatusBadge status={detalhe.status} />
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
            <p className="text-sm">Carregando cliente...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-700">{erro}</p>
          </div>
        )}

        {!carregando && detalhe && (
          <>
            <dl className="flex flex-col gap-4 px-5 py-5">
              {info.map(({ icon: Icon, label, value, destaque, complemento }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-zinc-500">{label}</dt>
                    <dd className={cn("text-sm font-medium text-zinc-800", destaque && "text-base font-semibold text-zinc-900")}>
                      {value}
                      {complemento && <span className="ml-1.5 text-xs font-normal text-zinc-500">· {complemento}</span>}
                    </dd>
                  </div>
                </div>
              ))}
              {detalhe.observacoes && (
                <div className="rounded-lg bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">{detalhe.observacoes}</div>
              )}
            </dl>

            <div className="border-t border-zinc-100 px-5 py-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Histórico recente</h3>
              {detalhe.historico === null ? (
                // Diferente de "[]" (sabemos que não há atendimentos): aqui a fonte de
                // dados atual (modo n8n, só CLIENTES) ainda não consegue fornecer
                // histórico — nunca apresentar isso como "nenhum atendimento".
                <p className="mt-2 text-sm text-zinc-400">Disponível após integração dos atendimentos.</p>
              ) : detalhe.historico.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-400">Nenhum atendimento registrado ainda.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {detalhe.historico.map((item) => (
                    <li
                      key={`${item.data}-${item.servicoNome}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800">{item.servicoNome}</p>
                        <p className="text-xs text-zinc-500">{formatDateNumericBR(parseISODate(item.data))}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-zinc-600">{formatBRL(item.valor)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 px-5 py-4">
              {lastAction && (
                <p role="status" className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                  {lastAction}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {ACOES.map((acao, index) => (
                  <button
                    key={acao.key}
                    type="button"
                    onClick={() =>
                      setLastAction(`Ação "${acao.label}" registrada nesta tela (módulo Clientes — sem persistência ainda).`)
                    }
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-semibold leading-tight text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                      // Última ação ("Enviar mensagem") ocupa a linha toda em 2 colunas — evita
                      // deixar uma célula vazia ao lado (ver seção 3 do pedido de acabamento).
                      index === ACOES.length - 1 && "col-span-2 lg:col-span-1",
                    )}
                  >
                    <acao.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {acao.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
