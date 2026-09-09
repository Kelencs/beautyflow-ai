import { BadRequestException } from '@nestjs/common';

/**
 * Limite máximo de caracteres do motivo de cancelamento — generoso para uma frase curta
 * explicando o cancelamento, mas nunca ilimitado (nunca grava um payload arbitrariamente
 * grande na planilha).
 */
export const AGENDA_CANCELAR_MOTIVO_MAX_LENGTH = 300;

/**
 * Usado quando o cliente do App não informa `motivo`. Deliberadamente diferente do
 * default do fluxo WhatsApp legado ("Cancelado a pedido do cliente", ver
 * AGE-WF007-cancelar.json) — no App, quem cancela pode ser o próprio owner ou
 * profissional, não necessariamente a pedido do cliente, então esse texto seria
 * frequentemente falso aqui.
 */
export const AGENDA_CANCELAR_MOTIVO_PADRAO = 'Cancelado pelo usuário';

/**
 * Valida/normaliza o campo `motivo` do body de `PATCH /agenda/:id/cancelar`. Opcional —
 * ausente/null vira o texto padrão. Quando informado, precisa ser string (nunca aceita
 * silenciosamente um número/objeto): remove `<`/`>` (nunca grava HTML, mesmo que
 * incompleto/malformado), trim, corta em `AGENDA_CANCELAR_MOTIVO_MAX_LENGTH`. Uma string
 * que sobra vazia depois da normalização (ex.: só espaços, ou só `<>`) também cai no
 * texto padrão — nunca grava uma string vazia como se fosse um motivo informado.
 */
export function parseAgendaCancelarBody(motivoRaw: unknown): { motivo: string } {
  if (motivoRaw === undefined || motivoRaw === null) {
    return { motivo: AGENDA_CANCELAR_MOTIVO_PADRAO };
  }
  if (typeof motivoRaw !== 'string') {
    throw new BadRequestException('O campo "motivo" deve ser uma string.');
  }

  const normalizado = motivoRaw
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, AGENDA_CANCELAR_MOTIVO_MAX_LENGTH);

  return { motivo: normalizado || AGENDA_CANCELAR_MOTIVO_PADRAO };
}
