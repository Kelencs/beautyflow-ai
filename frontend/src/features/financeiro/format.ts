import type { FormaPagamento } from "./types";

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

/** Único ponto de rótulo de forma de pagamento — usado pela tabela, cards e drawer. */
const FORMA_PAGAMENTO_LABEL: Record<FormaPagamento, string> = {
  PIX: "Pix",
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  OUTRO: "Outro",
};

export function formatFormaPagamento(forma: FormaPagamento | null): string {
  return forma ? FORMA_PAGAMENTO_LABEL[forma] : "—";
}
