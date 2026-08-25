"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface NovoClienteModalProps {
  open: boolean;
  onClose: () => void;
}

/** Limite de caracteres das observações — suficiente para uma nota curta, sem virar um campo de texto longo. */
const LIMITE_OBSERVACOES = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskTelefoneBR(rawValue: string): string {
  const digitos = rawValue.replace(/\D/g, "").slice(0, 11);
  if (digitos.length === 0) return "";
  const ddd = digitos.slice(0, 2);
  if (digitos.length <= 2) return `(${ddd}`;
  const resto = digitos.slice(2);
  if (resto.length <= 5) return `(${ddd}) ${resto}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

interface Erros {
  email?: string;
  dataNascimento?: string;
}

const ESTADO_INICIAL = { telefone: "", email: "", dataNascimento: "", observacoes: "" };

/** MVP visual: formulário não persiste nada — só confirma a intenção na própria tela. */
export function NovoClienteModal({ open, onClose }: NovoClienteModalProps) {
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

  function handleTelefoneChange(event: ChangeEvent<HTMLInputElement>) {
    setCampos((atual) => ({ ...atual, telefone: maskTelefoneBR(event.target.value) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hojeISO = new Date().toISOString().slice(0, 10);
    const novosErros: Erros = {};

    if (campos.email.trim() && !EMAIL_REGEX.test(campos.email.trim())) {
      novosErros.email = "Informe um e-mail em um formato válido.";
    }
    if (campos.dataNascimento && campos.dataNascimento > hojeISO) {
      novosErros.dataNascimento = "A data de nascimento não pode ser no futuro.";
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
        aria-labelledby="novo-cliente-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="novo-cliente-title" className="text-lg font-semibold text-zinc-900">
            Novo cliente
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
              Cadastro preparado nesta tela — ainda sem persistência real (etapa futura).
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
            <Campo id="nc-nome" label="Nome" type="text" required autoComplete="name" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nc-telefone" className="text-sm font-medium text-zinc-700">
                Telefone <span aria-hidden="true">*</span>
              </label>
              <input
                id="nc-telefone"
                name="nc-telefone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                placeholder="(34) 99999-9999"
                value={campos.telefone}
                onChange={handleTelefoneChange}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nc-email" className="text-sm font-medium text-zinc-700">
                E-mail
              </label>
              <input
                id="nc-email"
                name="nc-email"
                type="email"
                autoComplete="email"
                value={campos.email}
                onChange={(event) => setCampos((atual) => ({ ...atual, email: event.target.value }))}
                aria-invalid={erros.email ? true : undefined}
                aria-describedby={erros.email ? "nc-email-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.email && (
                <p id="nc-email-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nc-nascimento" className="text-sm font-medium text-zinc-700">
                Data de nascimento
              </label>
              <input
                id="nc-nascimento"
                name="nc-nascimento"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={campos.dataNascimento}
                onChange={(event) => setCampos((atual) => ({ ...atual, dataNascimento: event.target.value }))}
                aria-invalid={erros.dataNascimento ? true : undefined}
                aria-describedby={erros.dataNascimento ? "nc-nascimento-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.dataNascimento
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.dataNascimento && (
                <p id="nc-nascimento-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.dataNascimento}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="nc-observacoes" className="text-sm font-medium text-zinc-700">
                  Observações
                </label>
                <span className="text-xs text-zinc-400">
                  {campos.observacoes.length}/{LIMITE_OBSERVACOES}
                </span>
              </div>
              <textarea
                id="nc-observacoes"
                rows={3}
                maxLength={LIMITE_OBSERVACOES}
                value={campos.observacoes}
                onChange={(event) => setCampos((atual) => ({ ...atual, observacoes: event.target.value }))}
                className="resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Salvar cliente
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface CampoProps {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}

function Campo({ id, label, type, required, autoComplete }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
      />
    </div>
  );
}
