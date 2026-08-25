"use client";

import { useRouter } from "next/navigation";
import { CardsPrincipais } from "./CardsPrincipais";
import { CardsSecundarios } from "./CardsSecundarios";
import { ComunicacaoResumoSection } from "./ComunicacaoResumoSection";
import { DesempenhoProfissionais } from "./DesempenhoProfissionais";
import { RelatoriosHeader } from "./RelatoriosHeader";
import { ServicosMaisRealizados } from "./ServicosMaisRealizados";
import { SerieTemporalChart } from "./SerieTemporalChart";
import type { RelatoriosResponse } from "./types";
import type { PresetRelatorio } from "./types";

interface RelatoriosScreenProps {
  preset: PresetRelatorio;
  relatorio: RelatoriosResponse;
}

/**
 * Só o PERÍODO (preset ou intervalo customizado) navega via URL/Server Component (mesmo
 * padrão de features/financeiro/FinanceiroScreen.tsx e features/agenda/AgendaScreen.tsx)
 * — não há busca/filtro client-side nesta tela (o pedido não pediu nenhum).
 */
export function RelatoriosScreen({ preset, relatorio }: RelatoriosScreenProps) {
  const router = useRouter();

  function handlePresetChange(novoPreset: PresetRelatorio) {
    router.push(`/relatorios?preset=${novoPreset}`);
  }

  function handleCustomChange(dataInicio: string, dataFim: string) {
    router.push(`/relatorios?preset=custom&dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <RelatoriosHeader
        preset={preset}
        dataInicio={relatorio.periodo.dataInicio}
        dataFim={relatorio.periodo.dataFim}
        onPresetChange={handlePresetChange}
        onCustomChange={handleCustomChange}
      />

      {relatorio.resumo.totalAtendimentos === 0 && (
        <p className="text-sm text-zinc-500">Ainda não há dados suficientes neste período.</p>
      )}

      <CardsPrincipais resumo={relatorio.resumo} />
      <CardsSecundarios resumo={relatorio.resumo} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ServicosMaisRealizados servicos={relatorio.servicosMaisRealizados} />
        <DesempenhoProfissionais profissionais={relatorio.desempenhoProfissionais} />
      </div>

      <SerieTemporalChart serie={relatorio.serieTemporal} />

      <ComunicacaoResumoSection resumo={relatorio.resumo} />
    </div>
  );
}
