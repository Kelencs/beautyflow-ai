import { BadRequestException } from '@nestjs/common';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Limite máximo (em dias) do intervalo consultável de uma vez em GET /agenda. A visão
 * mensal do frontend usa uma grade de até 42 dias (6 semanas — ver
 * frontend/src/lib/date.ts, getMonthGrid); 60 dias dá folga para navegar entre meses
 * adjacentes numa mesma consulta sem permitir varrer anos inteiros de uma vez (decisão
 * deliberada, não apenas um número redondo — evita consultas caras/abusivas quando a
 * origem real dos dados deixar de ser mock).
 *
 * Sem uso de class-validator/class-transformer aqui: as regras são poucas e simples o
 * suficiente para não justificar mais duas dependências (mesmo critério já aplicado no
 * frontend — preferir soluções nativas quando a necessidade é pequena).
 */
export const AGENDA_QUERY_MAX_RANGE_DAYS = 60;

export interface AgendaQuery {
  dataInicio: string;
  dataFim: string;
}

function isValidIsoDate(value: string): boolean {
  if (!DATE_FORMAT_REGEX.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function diffInDays(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00Z`).getTime();
  const end = new Date(`${endIso}T00:00:00Z`).getTime();
  return Math.round((end - start) / 86_400_000);
}

/** Valida query params de GET /agenda. Lança BadRequestException (HTTP 400) em qualquer violação. */
export function parseAgendaQuery(dataInicioRaw: unknown, dataFimRaw: unknown): AgendaQuery {
  if (typeof dataInicioRaw !== 'string' || dataInicioRaw.length === 0) {
    throw new BadRequestException('O parâmetro "dataInicio" é obrigatório.');
  }
  if (typeof dataFimRaw !== 'string' || dataFimRaw.length === 0) {
    throw new BadRequestException('O parâmetro "dataFim" é obrigatório.');
  }
  if (!isValidIsoDate(dataInicioRaw)) {
    throw new BadRequestException('O parâmetro "dataInicio" deve estar no formato YYYY-MM-DD.');
  }
  if (!isValidIsoDate(dataFimRaw)) {
    throw new BadRequestException('O parâmetro "dataFim" deve estar no formato YYYY-MM-DD.');
  }
  if (dataFimRaw < dataInicioRaw) {
    throw new BadRequestException('"dataFim" deve ser maior ou igual a "dataInicio".');
  }
  if (diffInDays(dataInicioRaw, dataFimRaw) > AGENDA_QUERY_MAX_RANGE_DAYS) {
    throw new BadRequestException(
      `O intervalo entre "dataInicio" e "dataFim" não pode exceder ${AGENDA_QUERY_MAX_RANGE_DAYS} dias.`,
    );
  }

  return { dataInicio: dataInicioRaw, dataFim: dataFimRaw };
}
