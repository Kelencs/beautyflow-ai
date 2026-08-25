/**
 * "30" -> "30 min", "60" -> "1h", "90" -> "1h30", "120" -> "2h", "150" -> "2h30".
 * Único helper de duração do módulo — reaproveitado pela tabela, cards, drawer e modal
 * (ver seção 29 do pedido: evitar duplicar isso em cada componente).
 */
export function formatDuracao(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const restoMin = minutos % 60;
  return restoMin === 0 ? `${horas}h` : `${horas}h${restoMin}`;
}

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}
