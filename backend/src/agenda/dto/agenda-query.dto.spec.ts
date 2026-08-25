import { BadRequestException } from '@nestjs/common';
import { AGENDA_QUERY_MAX_RANGE_DAYS, parseAgendaQuery } from './agenda-query.dto';

describe('parseAgendaQuery', () => {
  it('rejeita quando dataInicio está ausente', () => {
    expect(() => parseAgendaQuery(undefined, '2026-08-27')).toThrow(BadRequestException);
  });

  it('rejeita quando dataFim está ausente', () => {
    expect(() => parseAgendaQuery('2026-08-21', undefined)).toThrow(BadRequestException);
  });

  it('rejeita formato inválido (não YYYY-MM-DD)', () => {
    expect(() => parseAgendaQuery('21/08/2026', '2026-08-27')).toThrow(BadRequestException);
  });

  it('rejeita data com formato correto mas calendario invalido', () => {
    expect(() => parseAgendaQuery('2026-02-30', '2026-08-27')).toThrow(BadRequestException);
  });

  it('rejeita quando dataFim é anterior a dataInicio', () => {
    expect(() => parseAgendaQuery('2026-08-27', '2026-08-21')).toThrow(BadRequestException);
  });

  it(`rejeita intervalo maior que ${AGENDA_QUERY_MAX_RANGE_DAYS} dias`, () => {
    expect(() => parseAgendaQuery('2026-01-01', '2026-12-31')).toThrow(BadRequestException);
  });

  it('aceita um intervalo válido de uma semana', () => {
    expect(parseAgendaQuery('2026-08-21', '2026-08-27')).toEqual({
      dataInicio: '2026-08-21',
      dataFim: '2026-08-27',
    });
  });

  it(`aceita exatamente ${AGENDA_QUERY_MAX_RANGE_DAYS} dias de intervalo`, () => {
    expect(() => parseAgendaQuery('2026-01-01', '2026-03-02')).not.toThrow();
  });

  it('aceita dataInicio igual a dataFim (um único dia)', () => {
    expect(parseAgendaQuery('2026-08-21', '2026-08-21')).toEqual({
      dataInicio: '2026-08-21',
      dataFim: '2026-08-21',
    });
  });
});
