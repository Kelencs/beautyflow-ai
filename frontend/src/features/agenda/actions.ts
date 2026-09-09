"use server";

import { BackendRequestError, cancelarAgendamento } from "@/lib/backend/server";

export interface CancelarAgendamentoResultado {
  ok: boolean;
  /** Mensagem segura para exibir ao usuário — nunca requestId/status/detalhe interno. */
  mensagem?: string;
}

/**
 * Server Action chamada diretamente de um Client Component (AppointmentDetails, via
 * onClick — Next.js permite isso sem precisar de um `<form action={...}>`). Nunca expõe
 * requestId técnico, Calendar ID, Google Event ID ou stack trace ao chamador — só uma
 * mensagem genérica e segura por classe de erro, mapeada a partir do status HTTP que o
 * backend já traduziu (ver agenda.service.ts: NOT_FOUND->404, CONFLICT->409).
 */
export async function cancelarAgendamentoAction(
  idAgendamento: string,
  motivo: string,
): Promise<CancelarAgendamentoResultado> {
  try {
    await cancelarAgendamento(idAgendamento, motivo);
    return { ok: true };
  } catch (error) {
    if (error instanceof BackendRequestError) {
      if (error.status === 404) {
        return { ok: false, mensagem: "Agendamento não encontrado." };
      }
      if (error.status === 409) {
        return { ok: false, mensagem: "Este atendimento não pode ser cancelado no estado atual." };
      }
      if (error.status === 401 || error.status === 403) {
        return { ok: false, mensagem: "Sua sessão expirou. Atualize a página e tente novamente." };
      }
    }
    return {
      ok: false,
      mensagem: "Não foi possível cancelar o agendamento agora. Tente novamente em instantes.",
    };
  }
}
