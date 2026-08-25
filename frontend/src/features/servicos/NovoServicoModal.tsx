"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import type { StatusServico } from "./types";
import { cn } from "@/lib/cn";

interface NovoServicoModalProps {
  open: boolean;
  onClose: () => void;
}

/** Limite de caracteres da descrição — mesma ordem de grandeza do campo Observações de Clientes. */
const LIMITE_DESCRICAO = 300;
/** Limite superior de duração: 8 horas — acima disso já não é um único atendimento razoável. */
const DURACAO_MAXIMA_MIN = 480;

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
  nome?: string;
  duracao?: string;
  valor?: string;
}

const ESTADO_INICIAL = { nome: "", descricao: "", duracao: "", valor: "", status: "ATIVO" as StatusServico };

/** MVP visual: formulário não persiste nada — só confirma a intenção na própria tela. */
export function NovoServicoModal({ open, onClose }: NovoServicoModalProps) {
  const [enviado, setEnviado] = useState(false);
  const [campos, setCampos] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState<Erros>({});

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEnviado(false);
        setCampos(ESTADO_INICIAL);
        setErros({});
        onClose();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  function handleClose() {
    setEnviado(false);
    setCampos(ESTADO_INICIAL);
    setErros({});
    onClose();
  }

  function handleValorChange(event: ChangeEvent<HTMLInputElement>) {
    setCampos((atual) => ({ ...atual, valor: maskValorBRL(event.target.value) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: Erros = {};
    const duracaoNumero = Number(campos.duracao);
    const valorNumero = valorParaNumero(campos.valor);

    if (!campos.nome.trim()) {
      novosErros.nome = "Informe o nome do serviço.";
    }
    if (!campos.duracao || duracaoNumero <= 0) {
      novosErros.duracao = "Informe uma duração maior que zero.";
    } else if (duracaoNumero > DURACAO_MAXIMA_MIN) {
      novosErros.duracao = `A duração não pode passar de ${DURACAO_MAXIMA_MIN} minutos (8h).`;
    }
    if (valorNumero <= 0) {
      novosErros.valor = "Informe um valor maior que zero.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      setEnviado(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Fechar" onClick={handleClose} className="absolute inset-0 bg-zinc-900/40" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="novo-servico-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="novo-servico-title" className="text-lg font-semibold text-zinc-900">
            Novo serviço
          </h2>
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
              Serviço preparado nesta tela — ainda sem persistência real (etapa futura).
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
              <label htmlFor="ns-nome" className="text-sm font-medium text-zinc-700">
                Nome <span aria-hidden="true">*</span>
              </label>
              <input
                id="ns-nome"
                name="ns-nome"
                type="text"
                required
                value={campos.nome}
                onChange={(event) => setCampos((atual) => ({ ...atual, nome: event.target.value }))}
                aria-invalid={erros.nome ? true : undefined}
                aria-describedby={erros.nome ? "ns-nome-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.nome
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.nome && (
                <p id="ns-nome-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.nome}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="ns-descricao" className="text-sm font-medium text-zinc-700">
                  Descrição
                </label>
                <span className="text-xs text-zinc-400">
                  {campos.descricao.length}/{LIMITE_DESCRICAO}
                </span>
              </div>
              <textarea
                id="ns-descricao"
                rows={3}
                maxLength={LIMITE_DESCRICAO}
                value={campos.descricao}
                onChange={(event) => setCampos((atual) => ({ ...atual, descricao: event.target.value }))}
                className="resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ns-duracao" className="text-sm font-medium text-zinc-700">
                  Duração (min) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="ns-duracao"
                  name="ns-duracao"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={DURACAO_MAXIMA_MIN}
                  required
                  value={campos.duracao}
                  onChange={(event) => setCampos((atual) => ({ ...atual, duracao: event.target.value }))}
                  aria-invalid={erros.duracao ? true : undefined}
                  aria-describedby={erros.duracao ? "ns-duracao-erro" : undefined}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                    erros.duracao
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ns-valor" className="text-sm font-medium text-zinc-700">
                  Valor <span aria-hidden="true">*</span>
                </label>
                <input
                  id="ns-valor"
                  name="ns-valor"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="R$ 0,00"
                  value={campos.valor}
                  onChange={handleValorChange}
                  aria-invalid={erros.valor ? true : undefined}
                  aria-describedby={erros.valor ? "ns-valor-erro" : undefined}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2",
                    erros.valor
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                  )}
                />
              </div>
            </div>
            {(erros.duracao || erros.valor) && (
              <div className="-mt-2 flex flex-col gap-1">
                {erros.duracao && (
                  <p id="ns-duracao-erro" role="alert" className="text-xs font-medium text-rose-600">
                    {erros.duracao}
                  </p>
                )}
                {erros.valor && (
                  <p id="ns-valor-erro" role="alert" className="text-xs font-medium text-rose-600">
                    {erros.valor}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ns-status" className="text-sm font-medium text-zinc-700">
                Status
              </label>
              <select
                id="ns-status"
                value={campos.status}
                onChange={(event) => setCampos((atual) => ({ ...atual, status: event.target.value as StatusServico }))}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Salvar serviço
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
