"use client";

import { useState } from "react";
import { AgendaSection } from "./AgendaSection";
import { ComunicacaoSection } from "./ComunicacaoSection";
import { IntegracoesSection } from "./IntegracoesSection";
import { NegocioSection } from "./NegocioSection";
import type { ConfiguracoesEmpresa, SecaoConfiguracoes } from "./types";

interface ConfiguracoesScreenProps {
  configuracoes: ConfiguracoesEmpresa;
}

const SECOES: { value: SecaoConfiguracoes; label: string }[] = [
  { value: "negocio", label: "Negócio" },
  { value: "agenda", label: "Agenda" },
  { value: "comunicacao", label: "Comunicação" },
  { value: "integracoes", label: "Integrações" },
];

/**
 * Navegação interna simples por abas (seção 17 do pedido) — todas as 4 seções têm
 * conteúdo real (nenhuma aba vazia). Client-side só: os dados já vêm de uma única busca
 * no Server Component (page.tsx), sem necessidade de nova requisição ao trocar de aba.
 */
export function ConfiguracoesScreen({ configuracoes }: ConfiguracoesScreenProps) {
  const [secao, setSecao] = useState<SecaoConfiguracoes>("negocio");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Configurações</h1>
        <p className="text-sm text-zinc-500">Gerencie as preferências e informações do seu negócio.</p>
      </div>

      <div
        role="tablist"
        aria-label="Seções de configurações"
        className="inline-flex w-fit flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
      >
        {SECOES.map((opcao) => (
          <button
            key={opcao.value}
            type="button"
            role="tab"
            aria-selected={secao === opcao.value}
            onClick={() => setSecao(opcao.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              secao === opcao.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>

      {secao === "negocio" && <NegocioSection negocio={configuracoes.negocio} />}
      {secao === "agenda" && <AgendaSection agenda={configuracoes.agenda} />}
      {secao === "comunicacao" && <ComunicacaoSection automacoes={configuracoes.automacoesComunicacao} />}
      {secao === "integracoes" && <IntegracoesSection integracoes={configuracoes.integracoes} />}
    </div>
  );
}
