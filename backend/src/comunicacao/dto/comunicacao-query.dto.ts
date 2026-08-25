import { BadRequestException } from '@nestjs/common';
import type { StatusComunicacao, TipoComunicacao } from '@beautyflow/shared-types';
import { getHojeBrasilISO } from '../../dashboard/dashboard-date.util';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIPOS_VALIDOS: readonly TipoComunicacao[] = [
  'CONFIRMACAO',
  'LEMBRETE',
  'PESQUISA',
  'FOLLOWUP',
  'COBRANCA',
  'OUTRO',
];
const STATUS_VALIDOS: readonly StatusComunicacao[] = ['ENVIADA', 'FALHA'];

/** Mesmo critério de amplitude de Financeiro (FINANCEIRO_QUERY_MAX_RANGE_DAYS): suporta "este mês" sem forçar troca de página. */
export const COMUNICACAO_QUERY_MAX_RANGE_DAYS = 366;

export interface ComunicacaoQuery {
  dataInicio: string;
  dataFim: string;
  tipo?: TipoComunicacao;
  status?: StatusComunicacao;
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
 * Valida query params de GET /comunicacao. Mesmo critério de GET /financeiro:
 * dataInicio/dataFim são OPCIONAIS — quando ausentes, o período default é o mês corrente
 * (fuso America/Sao_Paulo). Lança BadRequestException (HTTP 400) em qualquer violação.
 */
export function parseComunicacaoQuery(
  dataInicioRaw: unknown,
  dataFimRaw: unknown,
  tipoRaw: unknown,
  statusRaw: unknown,
): ComunicacaoQuery {
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
    if (diffInDays(dataInicioRaw, dataFimRaw) > COMUNICACAO_QUERY_MAX_RANGE_DAYS) {
      throw new BadRequestException(
        `O intervalo entre "dataInicio" e "dataFim" não pode exceder ${COMUNICACAO_QUERY_MAX_RANGE_DAYS} dias.`,
      );
    }
    dataInicio = dataInicioRaw;
    dataFim = dataFimRaw;
  }

  let tipo: TipoComunicacao | undefined;
  if (typeof tipoRaw === 'string' && tipoRaw.length > 0) {
    if (!TIPOS_VALIDOS.includes(tipoRaw as TipoComunicacao)) {
      throw new BadRequestException(
        `O parâmetro "tipo" deve ser um dos valores: ${TIPOS_VALIDOS.join(', ')}.`,
      );
    }
    tipo = tipoRaw as TipoComunicacao;
  }

  let status: StatusComunicacao | undefined;
  if (typeof statusRaw === 'string' && statusRaw.length > 0) {
    if (!STATUS_VALIDOS.includes(statusRaw as StatusComunicacao)) {
      throw new BadRequestException(
        `O parâmetro "status" deve ser um dos valores: ${STATUS_VALIDOS.join(', ')}.`,
      );
    }
    status = statusRaw as StatusComunicacao;
  }

  return { dataInicio, dataFim, tipo, status };
}
