import { BadRequestException } from '@nestjs/common';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Sugestão do pedido (seção 8): até 366 dias — cobre "Este ano" (um dos presets do
 * frontend) sem permitir consultas de múltiplos anos de uma vez.
 */
export const RELATORIOS_QUERY_MAX_RANGE_DAYS = 366;

export interface RelatoriosQuery {
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

/**
 * Valida query params de GET /relatorios. Diferente de Financeiro/Comunicação:
 * dataInicio/dataFim são OBRIGATÓRIOS aqui (seção 8 do pedido), mesmo critério de GET
 * /agenda — o frontend sempre resolve um preset (Hoje/7 dias/Este mês/Últimos 30
 * dias/Este ano) ou intervalo customizado antes de chamar o backend, nunca depende de um
 * default do servidor. Lança BadRequestException (HTTP 400) em qualquer violação.
 */
export function parseRelatoriosQuery(dataInicioRaw: unknown, dataFimRaw: unknown): RelatoriosQuery {
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
  if (diffInDays(dataInicioRaw, dataFimRaw) > RELATORIOS_QUERY_MAX_RANGE_DAYS) {
    throw new BadRequestException(
      `O intervalo entre "dataInicio" e "dataFim" não pode exceder ${RELATORIOS_QUERY_MAX_RANGE_DAYS} dias.`,
    );
  }

  return { dataInicio: dataInicioRaw, dataFim: dataFimRaw };
}
