/** "24/08/2026 às 14:30" — contrato usa ISO 8601 (dataHora); nunca armazenado formatado. */
export function formatDataHoraBR(iso: string): string {
  const data = new Date(iso);
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    data,
  );
  const horaFormatada = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(data);
  return `${dataFormatada} às ${horaFormatada}`;
}

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

/** Preview curto da mensagem para tabela/cards — mensagem completa só aparece no drawer. */
export function formatMensagemPreview(mensagem: string | null, limite = 60): string {
  if (!mensagem) return "—";
  return mensagem.length > limite ? `${mensagem.slice(0, limite).trimEnd()}…` : mensagem;
}
