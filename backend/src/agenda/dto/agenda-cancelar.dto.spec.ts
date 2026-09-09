import { BadRequestException } from '@nestjs/common';
import {
  AGENDA_CANCELAR_MOTIVO_MAX_LENGTH,
  AGENDA_CANCELAR_MOTIVO_PADRAO,
  parseAgendaCancelarBody,
} from './agenda-cancelar.dto';

describe('parseAgendaCancelarBody', () => {
  it('motivo ausente (undefined) -> usa o texto padrão', () => {
    expect(parseAgendaCancelarBody(undefined)).toEqual({ motivo: AGENDA_CANCELAR_MOTIVO_PADRAO });
  });

  it('motivo null -> usa o texto padrão', () => {
    expect(parseAgendaCancelarBody(null)).toEqual({ motivo: AGENDA_CANCELAR_MOTIVO_PADRAO });
  });

  it('rejeita tipo diferente de string (nunca aceita silenciosamente número/objeto)', () => {
    expect(() => parseAgendaCancelarBody(123)).toThrow(BadRequestException);
    expect(() => parseAgendaCancelarBody({ motivo: 'x' })).toThrow(BadRequestException);
    expect(() => parseAgendaCancelarBody(['x'])).toThrow(BadRequestException);
  });

  it('faz trim de espaços nas bordas', () => {
    expect(parseAgendaCancelarBody('  Cliente remarcou  ')).toEqual({ motivo: 'Cliente remarcou' });
  });

  it('remove < e > (nunca grava HTML, mesmo malformado)', () => {
    expect(parseAgendaCancelarBody('<script>alert(1)</script>')).toEqual({
      motivo: 'scriptalert(1)/script',
    });
  });

  it('corta em AGENDA_CANCELAR_MOTIVO_MAX_LENGTH caracteres', () => {
    const textoGigante = 'a'.repeat(AGENDA_CANCELAR_MOTIVO_MAX_LENGTH + 50);
    const resultado = parseAgendaCancelarBody(textoGigante);
    expect(resultado.motivo).toHaveLength(AGENDA_CANCELAR_MOTIVO_MAX_LENGTH);
  });

  it('string vazia ou só espaços -> usa o texto padrão (nunca grava motivo vazio)', () => {
    expect(parseAgendaCancelarBody('')).toEqual({ motivo: AGENDA_CANCELAR_MOTIVO_PADRAO });
    expect(parseAgendaCancelarBody('   ')).toEqual({ motivo: AGENDA_CANCELAR_MOTIVO_PADRAO });
  });

  it('string que só contém < e > (vira vazia após sanitizar) -> usa o texto padrão', () => {
    expect(parseAgendaCancelarBody('<<>>')).toEqual({ motivo: AGENDA_CANCELAR_MOTIVO_PADRAO });
  });

  it('preserva um motivo válido normal, sem alteração além do trim', () => {
    expect(parseAgendaCancelarBody('Cliente pediu para remarcar depois')).toEqual({
      motivo: 'Cliente pediu para remarcar depois',
    });
  });
});
