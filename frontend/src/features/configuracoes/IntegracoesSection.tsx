import { Calendar, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IntegracaoStatus } from "./types";
import { cn } from "@/lib/cn";

interface IntegracoesSectionProps {
  integracoes: IntegracaoStatus[];
}

const ICONE_POR_NOME: Record<string, LucideIcon> = {
  WhatsApp: MessageCircle,
  "Agenda/Calendário": Calendar,
};

/**
 * Só integrações que o estabelecimento reconheceria operacionalmente (seção 22 do
 * pedido) — nunca Supabase/infra interna. Nenhum secret/token/phone_number_id exibido;
 * só o status conceitual já calculado pelo backend.
 *
 * "Disponível para integração" (não "Configurada"/"Conectada"): reflete só o estado do
 * mock/ambiente atual, nunca um health-check real (nenhuma chamada à Meta/WhatsApp Cloud
 * API ou ao Google Calendar acontece aqui) — evita sugerir ao usuário uma confirmação
 * operacional que ainda não existe nesta etapa.
 */
export function IntegracoesSection({ integracoes }: IntegracoesSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Integrações</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {integracoes.map((integracao) => {
          const Icon = ICONE_POR_NOME[integracao.nome] ?? Calendar;
          const ativa = integracao.status === "ATIVA";
          return (
            <div key={integracao.nome} className="flex flex-col gap-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <span className="text-sm font-semibold text-zinc-800">{integracao.nome}</span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                    ativa
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20"
                      : "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", ativa ? "bg-emerald-500" : "bg-zinc-400")} aria-hidden="true" />
                  {ativa ? "Disponível para integração" : "Não configurada"}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{integracao.descricao}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
