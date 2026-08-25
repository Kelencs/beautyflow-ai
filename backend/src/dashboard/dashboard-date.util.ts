const TIMEZONE = 'America/Sao_Paulo';

/**
 * "Hoje" real no fuso de referência do projeto — não no fuso do processo Node, que pode
 * divergir em produção (ex.: servidor em UTC). Mesma técnica do frontend
 * (frontend/src/lib/date.ts, getHojeBrasil), reimplementada aqui porque backend e
 * frontend não compartilham código de runtime (só tipos, via @beautyflow/shared-types).
 */
export function getHojeBrasilISO(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const ano = partes.find((parte) => parte.type === 'year')?.value ?? '1970';
  const mes = partes.find((parte) => parte.type === 'month')?.value ?? '01';
  const dia = partes.find((parte) => parte.type === 'day')?.value ?? '01';

  return `${ano}-${mes}-${dia}`;
}

/** Hora atual "HH:mm" no fuso de referência do projeto — usada para saber o que já passou hoje. */
export function getHoraAgoraBrasil(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

/**
 * Desloca uma data ISO ("YYYY-MM-DD") em `dias` (aceita negativo/positivo/zero).
 * Aritmética pura de calendário: ancora os componentes ano/mês/dia em UTC só para somar
 * dias sem risco de DST (America/Sao_Paulo não observa DST desde 2019, mas isso evita
 * depender disso), sem representar um instante real nem usar offset manual — não é
 * conversão de fuso, é só "que data é essa mais N dias".
 *
 * Existe para permitir que mocks com métricas relativas a "hoje" (ex.: ia.mock-data.ts)
 * sejam gerados a partir de `getHojeBrasilISO()` em vez de string absoluta fixa, que
 * fica incoerente assim que o calendário real avança (achado P1-1 da auditoria geral).
 */
export function deslocarDiasISO(dataIso: string, dias: number): string {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  data.setUTCDate(data.getUTCDate() + dias);

  const anoDeslocado = String(data.getUTCFullYear());
  const mesDeslocado = String(data.getUTCMonth() + 1).padStart(2, '0');
  const diaDeslocado = String(data.getUTCDate()).padStart(2, '0');
  return `${anoDeslocado}-${mesDeslocado}-${diaDeslocado}`;
}
