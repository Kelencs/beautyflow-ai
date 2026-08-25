export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

/** `0.6` -> "60%". Arredonda para inteiro — precisão maior não ajuda a leitura de um card. */
export function formatPercent(taxa: number): string {
  return `${Math.round(taxa * 100)}%`;
}

export function formatDataBR(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${iso}T00:00:00`));
}
