"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { ConfiguracoesNegocio } from "./types";
import { cn } from "@/lib/cn";

interface NegocioSectionProps {
  negocio: ConfiguracoesNegocio;
}

interface Erros {
  nomeFantasia?: string;
  email?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "Dados do negócio" — únicos campos genuinamente editáveis desta tela (seção 18/19 do
 * pedido). `nomeFantasia`/`telefone`/`email` ainda não têm um schema real gravável (ver
 * comentário em libs/shared-types/src/configuracoes.ts) — por isso a edição é só local,
 * nunca persistida. "Salvar" mostra feedback de MVP, nunca finge gravação real.
 */
export function NegocioSection({ negocio }: NegocioSectionProps) {
  const [editando, setEditando] = useState(false);
  const [campos, setCampos] = useState(negocio);
  const [erros, setErros] = useState<Erros>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const alterado =
    campos.nomeFantasia !== negocio.nomeFantasia ||
    campos.telefone !== negocio.telefone ||
    campos.email !== negocio.email;

  function handleEditar() {
    setEditando(true);
    setFeedback(null);
  }

  function handleCancelar() {
    setCampos(negocio);
    setErros({});
    setEditando(false);
    setFeedback(null);
  }

  function handleSalvar() {
    const novosErros: Erros = {};
    if (!campos.nomeFantasia.trim()) {
      novosErros.nomeFantasia = "Informe o nome do estabelecimento.";
    }
    if (campos.email && !EMAIL_REGEX.test(campos.email)) {
      novosErros.email = "Informe um e-mail válido.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setFeedback("As alterações estão preparadas nesta tela, mas a persistência será habilitada em uma etapa futura.");
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Dados do negócio</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Informações do seu negócio.</p>
        </div>
        {!editando && (
          <button
            type="button"
            onClick={handleEditar}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>
        )}
      </div>

      {feedback && (
        <p role="status" className="rounded-md bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
          {feedback}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cfg-nome" className="text-sm font-medium text-zinc-700">
            Nome do estabelecimento {editando && <span aria-hidden="true">*</span>}
          </label>
          {editando ? (
            <>
              <input
                id="cfg-nome"
                type="text"
                value={campos.nomeFantasia}
                onChange={(event) => setCampos((atual) => ({ ...atual, nomeFantasia: event.target.value }))}
                aria-invalid={erros.nomeFantasia ? true : undefined}
                aria-describedby={erros.nomeFantasia ? "cfg-nome-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition focus:ring-2",
                  erros.nomeFantasia
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.nomeFantasia && (
                <p id="cfg-nome-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.nomeFantasia}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-800">{negocio.nomeFantasia}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cfg-telefone" className="text-sm font-medium text-zinc-700">
            Telefone
          </label>
          {editando ? (
            <input
              id="cfg-telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={campos.telefone ?? ""}
              onChange={(event) =>
                setCampos((atual) => ({ ...atual, telefone: event.target.value || null }))
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          ) : (
            <p className="text-sm text-zinc-800">{negocio.telefone ?? "—"}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="cfg-email" className="text-sm font-medium text-zinc-700">
            E-mail
          </label>
          {editando ? (
            <>
              <input
                id="cfg-email"
                type="email"
                placeholder="contato@seusalao.com.br"
                value={campos.email ?? ""}
                onChange={(event) => setCampos((atual) => ({ ...atual, email: event.target.value || null }))}
                aria-invalid={erros.email ? true : undefined}
                aria-describedby={erros.email ? "cfg-email-erro" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2",
                  erros.email
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-300 focus:border-violet-500 focus:ring-violet-500/20",
                )}
              />
              {erros.email && (
                <p id="cfg-email-erro" role="alert" className="text-xs font-medium text-rose-600">
                  {erros.email}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-800">{negocio.email ?? "—"}</p>
          )}
        </div>
      </div>

      {editando && (
        <div className="flex items-center gap-2 border-t border-zinc-100 pt-4">
          <button
            type="button"
            onClick={handleSalvar}
            disabled={!alterado}
            className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar alterações
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Cancelar
          </button>
        </div>
      )}
    </section>
  );
}
