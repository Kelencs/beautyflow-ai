"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import type { FormaPagamento, Pagamento } from "./types";
import { formatBRL } from "./format";
import { cn } from "@/lib/cn";

interface RegistrarPagamentoModalProps {
  open: boolean;
  pagamento: Pagamento;
  onClose: () => void;
}

/** Limite de caracteres da observação — mesma ordem de grandeza do campo Observações de Clientes. */
const LIMITE_OBSERVACAO = 300;

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: "PIX", label: "Pix" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO_CREDITO", label: "Cartão de crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de débito" },
  { value: "OUTRO", label: "Outro" },
];

function maskValorBRL(rawValue: string): string {
  const digitos = rawValue.replace(/\D/g, "");
  if (!digitos) return "";
  const numero = Number(digitos) / 100;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function valorParaNumero(valorFormatado: string): number {
  const digitos = valorFormatado.replace(/\D/g, "");
  return digitos ? Number(digitos) / 100 : 0;
}

interface Erros {
  valor?: string;
}

/**
 * MVP visual: formulário não persiste nada — não chama FIN-WF010 nem cria nenhum POST
 * (ver seção "não implementar" do pedido do módulo Financeiro). Valida contra
 * pagamento.valorPendente, não pagamento.valorAgendamento — mesma regra de overpayment
 * confirmada em FIN-WF010 (CODE - Calcular Pagamento: bloqueia se o novo total pago
 * superar o valor total do agendamento, o que equivale a não superar o saldo pendente
 * atual).
 */
export function RegistrarPagamentoModal({ open, pagamento, onClose }: RegistrarPagamentoModalProps) {
  const [enviado, setEnviado] = useState(false);
  const [valor, setValor] = useState("");
  const [forma, setForma] = useState<FormaPagamento>("PIX");
  const [observacao, setObservacao] = useState("");
  const [erros, setErros] = useState<Erros>({});

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function handleClose() {
    setEnviado(false);
    setValor("");
    setForma("PIX");
    setObservacao("");
    setErros({});
    onClose();
  }

  function handleValorChange(event: ChangeEvent<HTMLInputElement>) {
    setValor(maskValorBRL(event.target.value));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valorNumero = valorParaNumero(valor);
    const novosErros: Erros = {};

    if (valorNumero <= 0) {
      novosErros.valor = "Informe um valor maior que zero.";
    } else if (valorNumero > pagamento.valorPendente) {
      novosErros.valor = `O valor não pode passar do saldo pendente (${formatBRL(pagamento.valorPendente)}).`;
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      setEnviado(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button type="button" aria-label="Fechar" onClick={handleClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registrar-pagamento-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="registrar-pagamento-title" className="text-lg font-semibold text-zinc-900">
              Registrar pagamento
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {pagamento.clienteNome} · saldo pendente {formatBRL(pagamento.valorPendente)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {enviado ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm font-medium text-zinc-700">
              Pagamento preparado nesta tela — ainda sem persistência real (etapa futura).
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-valor" className="text-sm font-medium text-zinc-700">
                Valor pago <span aria-hidden="true">*</span>
              </label>
              <input
                id="rp-valor"
                name="rp-valor"
                type="text"
                inputMode="numeric"
                required
                placeholder="R$ 0,00"
                value={valor}
                onChange={handleValorChange}
                aria-invalid={erros.valor ? true : undefined}
                aria-describedby={erros.valor ? "rp-valor-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2",
                  erros.valor
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.valor && (
                <p id="rp-valor-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.valor}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-forma" className="text-sm font-medium text-zinc-700">
                Forma de pagamento
              </label>
              <select
                id="rp-forma"
                value={forma}
                onChange={(event) => setForma(event.target.value as FormaPagamento)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              >
                {FORMAS_PAGAMENTO.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="rp-observacao" className="text-sm font-medium text-zinc-700">
                  Observação
                </label>
                <span className="text-xs text-zinc-400">
                  {observacao.length}/{LIMITE_OBSERVACAO}
                </span>
              </div>
              <textarea
                id="rp-observacao"
                rows={2}
                maxLength={LIMITE_OBSERVACAO}
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                className="resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Registrar pagamento
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
