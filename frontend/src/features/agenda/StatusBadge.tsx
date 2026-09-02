import { STATUS_AGENDAMENTO_META, STATUS_CONFIRMACAO_META } from "./status";
import type { StatusAgendamento, StatusConfirmacao } from "./types";
import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: StatusAgendamento;
  /**
   * Opcional — omitir mostra só o status de ciclo de vida (ex.: cabeçalho de
   * AppointmentDetails, que já exibe a confirmação numa linha própria e separada).
   * Passar o valor real (ou `null`) embute a confirmação no mesmo badge (ex.:
   * AppointmentCard, onde não há uma segunda linha disponível). Ignorado quando
   * `status !== "AGENDADO"` — fora do ciclo "agendado" a confirmação nunca se aplica
   * (statusConfirmacao é sempre null nesse caso, ver shared-types/agenda.ts).
   */
  statusConfirmacao?: StatusConfirmacao | null;
  className?: string;
}

/**
 * Nunca representa o status só pela cor: sempre com um rótulo de texto ao lado do
 * indicador colorido (acessibilidade — não depender exclusivamente de cor). Mesma regra
 * vale para o segundo rótulo opcional de confirmação, quando presente.
 */
export function StatusBadge({ status, statusConfirmacao, className }: StatusBadgeProps) {
  const meta = STATUS_AGENDAMENTO_META[status];

  // `statusConfirmacao === undefined` => chamador não pediu o eixo de confirmação neste
  // badge (nada extra é exibido). Uma vez pedido (valor real ou `null`), só é honrado
  // quando o atendimento ainda está AGENDADO — nos demais status a confirmação não se
  // aplica, então nunca aparece aqui (não é um "—" perdido no meio do badge).
  const mostrarConfirmacao = status === "AGENDADO" && statusConfirmacao !== undefined;
  const confirmacaoLabel = mostrarConfirmacao
    ? statusConfirmacao
      ? STATUS_CONFIRMACAO_META[statusConfirmacao].label
      : "—"
    : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} aria-hidden="true" />
      {meta.label}
      {confirmacaoLabel && (
        <span className="border-l border-current/25 pl-1.5 font-normal opacity-80">
          {confirmacaoLabel}
        </span>
      )}
    </span>
  );
}
