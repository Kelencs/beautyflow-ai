"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import type { StatusProfissional } from "./types";
import { cn } from "@/lib/cn";

interface NovoProfissionalModalProps {
  open: boolean;
  onClose: () => void;
}

/** Limite de caracteres da especialidade — campo curto (ex.: "Designer de Sobrancelhas"). */
const LIMITE_ESPECIALIDADE = 60;
/** Mínimo de dígitos para um telefone brasileiro plausível (DDD + 8 dígitos, fixo). */
const TELEFONE_MINIMO_DIGITOS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mesma lógica de máscara de features/clientes/NovoClienteModal.tsx (telefone lá é obrigatório; aqui é opcional). */
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
  nome?: string;
  telefone?: string;
  email?: string;
}

const ESTADO_INICIAL = {
  nome: "",
  especialidade: "",
  telefone: "",
  email: "",
  status: "ATIVO" as StatusProfissional,
};

/** MVP visual: formulário não persiste nada — só confirma a intenção na própria tela. */
export function NovoProfissionalModal({ open, onClose }: NovoProfissionalModalProps) {
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

    const novosErros: Erros = {};
    const telefoneDigitos = campos.telefone.replace(/\D/g, "");

    if (!campos.nome.trim()) {
      novosErros.nome = "Informe o nome do profissional.";
    }
    if (campos.telefone && telefoneDigitos.length < TELEFONE_MINIMO_DIGITOS) {
      novosErros.telefone = "Informe um telefone válido, com DDD.";
    }
    if (campos.email.trim() && !EMAIL_REGEX.test(campos.email.trim())) {
      novosErros.email = "Informe um e-mail em um formato válido.";
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
        aria-labelledby="novo-profissional-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="novo-profissional-title" className="text-lg font-semibold text-zinc-900">
            Novo profissional
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
              Profissional preparado nesta tela — ainda sem persistência real.
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
              <label htmlFor="np-nome" className="text-sm font-medium text-zinc-700">
                Nome <span aria-hidden="true">*</span>
              </label>
              <input
                id="np-nome"
                name="np-nome"
                type="text"
                required
                value={campos.nome}
                onChange={(event) => setCampos((atual) => ({ ...atual, nome: event.target.value }))}
                aria-invalid={erros.nome ? true : undefined}
                aria-describedby={erros.nome ? "np-nome-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.nome
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.nome && (
                <p id="np-nome-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.nome}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="np-especialidade" className="text-sm font-medium text-zinc-700">
                  Especialidade
                </label>
                <span className="text-xs text-zinc-400">
                  {campos.especialidade.length}/{LIMITE_ESPECIALIDADE}
                </span>
              </div>
              <input
                id="np-especialidade"
                name="np-especialidade"
                type="text"
                maxLength={LIMITE_ESPECIALIDADE}
                value={campos.especialidade}
                onChange={(event) => setCampos((atual) => ({ ...atual, especialidade: event.target.value }))}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="np-telefone" className="text-sm font-medium text-zinc-700">
                Telefone
              </label>
              <input
                id="np-telefone"
                name="np-telefone"
                type="tel"
                inputMode="numeric"
                placeholder="(34) 99999-9999"
                value={campos.telefone}
                onChange={handleTelefoneChange}
                aria-invalid={erros.telefone ? true : undefined}
                aria-describedby={erros.telefone ? "np-telefone-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2",
                  erros.telefone
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.telefone && (
                <p id="np-telefone-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.telefone}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="np-email" className="text-sm font-medium text-zinc-700">
                E-mail
              </label>
              <input
                id="np-email"
                name="np-email"
                type="email"
                autoComplete="email"
                value={campos.email}
                onChange={(event) => setCampos((atual) => ({ ...atual, email: event.target.value }))}
                aria-invalid={erros.email ? true : undefined}
                aria-describedby={erros.email ? "np-email-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.email && (
                <p id="np-email-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="np-status" className="text-sm font-medium text-zinc-700">
                Status
              </label>
              <select
                id="np-status"
                value={campos.status}
                onChange={(event) =>
                  setCampos((atual) => ({ ...atual, status: event.target.value as StatusProfissional }))
                }
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
              Salvar profissional
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
