"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buscarComunicacaoDetalhada } from "./actions";
import { ComunicacaoCardList } from "./ComunicacaoCardList";
import { ComunicacaoDetailsDrawer } from "./ComunicacaoDetailsDrawer";
import { ComunicacaoEmptyState } from "./ComunicacaoEmptyState";
import { ComunicacaoHeader } from "./ComunicacaoHeader";
import { ComunicacaoResumoCards } from "./ComunicacaoResumoCards";
import { ComunicacaoTable } from "./ComunicacaoTable";
import type {
  ComunicacaoItem,
  ComunicacaoResumo,
  FiltroStatusComunicacao,
  FiltroTipoComunicacao,
  PeriodoComunicacao,
} from "./types";

interface ComunicacaoScreenProps {
  periodo: PeriodoComunicacao;
  resumo: ComunicacaoResumo;
  comunicacoes: ComunicacaoItem[];
}

const DIACRITICOS_REGEX = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize("NFD").replace(DIACRITICOS_REGEX, "");
}

function aplicarFiltroTipo(comunicacoes: ComunicacaoItem[], filtro: FiltroTipoComunicacao): ComunicacaoItem[] {
  if (filtro === "todos") return comunicacoes;
  return comunicacoes.filter((comunicacao) => comunicacao.tipo === filtro);
}

function aplicarFiltroStatus(comunicacoes: ComunicacaoItem[], filtro: FiltroStatusComunicacao): ComunicacaoItem[] {
  if (filtro === "todos") return comunicacoes;
  return comunicacoes.filter((comunicacao) => comunicacao.status === filtro);
}

/**
 * Busca e filtros de tipo/status são client-side sobre a lista já buscada do backend
 * para o período selecionado (mesmo critério de features/financeiro/FinanceiroScreen.tsx)
 * — só o PERÍODO navega via URL/Server Component (mesmo padrão de AgendaScreen.tsx).
 */
export function ComunicacaoScreen({ periodo, resumo, comunicacoes }: ComunicacaoScreenProps) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipoComunicacao>("todos");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusComunicacao>("todos");

  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<ComunicacaoItem | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  const comunicacoesFiltradas = useMemo(() => {
    const porTipo = aplicarFiltroTipo(comunicacoes, filtroTipo);
    const porStatus = aplicarFiltroStatus(porTipo, filtroStatus);
    const termo = normalizar(busca);
    if (!termo) return porStatus;

    return porStatus.filter((comunicacao) => {
      const alvo = normalizar(`${comunicacao.clienteNome} ${comunicacao.telefone} ${comunicacao.mensagem ?? ""}`);
      return alvo.includes(termo);
    });
  }, [comunicacoes, filtroTipo, filtroStatus, busca]);

  function handlePeriodoChange(novoPeriodo: PeriodoComunicacao) {
    router.push(`/comunicacao?periodo=${novoPeriodo}`);
  }

  async function handleSelect(comunicacao: ComunicacaoItem) {
    setSelecionadoId(comunicacao.idComunicacao);
    setDetalhe(null);
    setErroDetalhe(null);
    setCarregandoDetalhe(true);

    const resultado = await buscarComunicacaoDetalhada(comunicacao.idComunicacao);

    setCarregandoDetalhe(false);
    if (resultado.sucesso && resultado.comunicacao) {
      setDetalhe(resultado.comunicacao);
    } else {
      setErroDetalhe(resultado.mensagemErro ?? "Não foi possível carregar este registro.");
    }
  }

  function handleCloseDrawer() {
    setSelecionadoId(null);
    setDetalhe(null);
    setErroDetalhe(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <ComunicacaoHeader
        periodo={periodo}
        onPeriodoChange={handlePeriodoChange}
        busca={busca}
        onBuscaChange={setBusca}
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        filtroStatus={filtroStatus}
        onFiltroStatusChange={setFiltroStatus}
      />

      <ComunicacaoResumoCards resumo={resumo} />

      {comunicacoesFiltradas.length === 0 ? (
        comunicacoes.length === 0 ? (
          <ComunicacaoEmptyState
            titulo="Nenhuma comunicação no período."
            descricao="Escolha outro período ou aguarde novas automações serem disparadas."
          />
        ) : (
          <ComunicacaoEmptyState
            titulo="Nenhuma comunicação encontrada."
            descricao="Tente ajustar a busca ou os filtros de tipo/status aplicados."
          />
        )
      ) : (
        <>
          <ComunicacaoTable comunicacoes={comunicacoesFiltradas} onSelect={handleSelect} />
          <ComunicacaoCardList comunicacoes={comunicacoesFiltradas} onSelect={handleSelect} />
        </>
      )}

      <ComunicacaoDetailsDrawer
        idComunicacao={selecionadoId}
        carregando={carregandoDetalhe}
        comunicacao={detalhe}
        erro={erroDetalhe}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
