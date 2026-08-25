import { BadRequestException } from '@nestjs/common';
import type { StatusPagamento } from '@beautyflow/shared-types';
import { getHojeBrasilISO } from '../../dashboard/dashboard-date.util';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const STATUS_VALIDOS: readonly StatusPagamento[] = ['PAGO', 'PENDENTE', 'PARCIAL'];

/**
 * Intervalo bem mais largo que o de GET /agenda (AGENDA_QUERY_MAX_RANGE_DAYS = 60): o
 * Financeiro precisa suportar períodos como "este mês" sem forçar troca de página a cada
 * poucas semanas, mas ainda assim limitado — evita consultas de anos inteiros de uma vez
 * quando a origem real dos dados deixar de ser mock.
 */
export const FINANCEIRO_QUERY_MAX_RANGE_DAYS = 366;

export interface FinanceiroQuery {
  dataInicio: string;
  dataFim: string;
  status?: StatusPagamento;
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

function primeiroDiaDoMes(hojeIso: string): string {
  return `${hojeIso.slice(0, 7)}-01`;
}

function ultimoDiaDoMes(hojeIso: string): string {
  const [ano, mes] = hojeIso.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return `${hojeIso.slice(0, 7)}-${String(ultimoDia).padStart(2, '0')}`;
}

/**
 * Valida query params de GET /financeiro. Diferente de GET /agenda (dataInicio/dataFim
 * obrigatórios): aqui os dois são OPCIONAIS — quando ausentes, o período default é o mês
 * corrente (fuso America/Sao_Paulo), a "primeira implementação simples" pedida para o
 * módulo. Lança BadRequestException (HTTP 400) em qualquer violação.
 */
export function parseFinanceiroQuery(
  dataInicioRaw: unknown,
  dataFimRaw: unknown,
  statusRaw: unknown,
): FinanceiroQuery {
  const temInicio = typeof dataInicioRaw === 'string' && dataInicioRaw.length > 0;
  const temFim = typeof dataFimRaw === 'string' && dataFimRaw.length > 0;

  let dataInicio: string;
  let dataFim: string;

  if (!temInicio && !temFim) {
    const hoje = getHojeBrasilISO();
    dataInicio = primeiroDiaDoMes(hoje);
    dataFim = ultimoDiaDoMes(hoje);
  } else {
    if (!temInicio) {
      throw new BadRequestException(
        'O parâmetro "dataInicio" é obrigatório quando "dataFim" é informado.',
      );
    }
    if (!temFim) {
      throw new BadRequestException(
        'O parâmetro "dataFim" é obrigatório quando "dataInicio" é informado.',
      );
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
    if (diffInDays(dataInicioRaw, dataFimRaw) > FINANCEIRO_QUERY_MAX_RANGE_DAYS) {
      throw new BadRequestException(
        `O intervalo entre "dataInicio" e "dataFim" não pode exceder ${FINANCEIRO_QUERY_MAX_RANGE_DAYS} dias.`,
      );
    }
    dataInicio = dataInicioRaw;
    dataFim = dataFimRaw;
  }

  let status: StatusPagamento | undefined;
  if (typeof statusRaw === 'string' && statusRaw.length > 0) {
    if (!STATUS_VALIDOS.includes(statusRaw as StatusPagamento)) {
      throw new BadRequestException(
        `O parâmetro "status" deve ser um dos valores: ${STATUS_VALIDOS.join(', ')}.`,
      );
    }
    status = statusRaw as StatusPagamento;
  }

  return { dataInicio, dataFim, status };
}
