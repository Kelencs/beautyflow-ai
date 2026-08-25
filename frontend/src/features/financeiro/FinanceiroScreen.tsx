"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buscarPagamentoDetalhado } from "./actions";
import { FinanceiroEmptyState } from "./FinanceiroEmptyState";
import { FinanceiroHeader } from "./FinanceiroHeader";
import { FinanceiroResumoCards } from "./FinanceiroResumoCards";
import { FinanceiroTable } from "./FinanceiroTable";
import { PagamentoCardList } from "./PagamentoCardList";
import { PagamentoDetailsDrawer } from "./PagamentoDetailsDrawer";
import type { FiltroStatusPagamento, FinanceiroResumo, Pagamento, PeriodoFinanceiro } from "./types";

interface FinanceiroScreenProps {
  periodo: PeriodoFinanceiro;
  resumo: FinanceiroResumo;
  pagamentos: Pagamento[];
}

const DIACRITICOS_REGEX = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize("NFD").replace(DIACRITICOS_REGEX, "");
}

function aplicarFiltro(pagamentos: Pagamento[], filtro: FiltroStatusPagamento): Pagamento[] {
  if (filtro === "todos") return pagamentos;
  return pagamentos.filter((pagamento) => pagamento.status === filtro);
}

/**
 * Busca e filtro de status são client-side sobre a lista já buscada do backend para o
 * período selecionado (mesmo critério documentado em features/servicos/ServicosScreen.tsx)
 * — só o PERÍODO navega via URL/Server Component (mesmo padrão de features/agenda/AgendaScreen.tsx),
 * porque é o único filtro que muda o intervalo de dados buscado no backend.
 */
export function FinanceiroScreen({ periodo, resumo, pagamentos }: FinanceiroScreenProps) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatusPagamento>("todos");

  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<Pagamento | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  const pagamentosFiltrados = useMemo(() => {
    const porFiltro = aplicarFiltro(pagamentos, filtro);
    const termo = normalizar(busca);
    if (!termo) return porFiltro;

    return porFiltro.filter((pagamento) => {
      const alvo = normalizar(`${pagamento.clienteNome} ${pagamento.servicoNome} ${pagamento.profissionalNome}`);
      return alvo.includes(termo);
    });
  }, [pagamentos, filtro, busca]);

  function handlePeriodoChange(novoPeriodo: PeriodoFinanceiro) {
    router.push(`/financeiro?periodo=${novoPeriodo}`);
  }

  async function handleSelect(pagamento: Pagamento) {
    setSelecionadoId(pagamento.idAgendamento);
    setDetalhe(null);
    setErroDetalhe(null);
    setCarregandoDetalhe(true);

    const resultado = await buscarPagamentoDetalhado(pagamento.idAgendamento);

    setCarregandoDetalhe(false);
    if (resultado.sucesso && resultado.pagamento) {
      setDetalhe(resultado.pagamento);
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
      <FinanceiroHeader
        periodo={periodo}
        onPeriodoChange={handlePeriodoChange}
        busca={busca}
        onBuscaChange={setBusca}
        filtro={filtro}
        onFiltroChange={setFiltro}
      />

      <FinanceiroResumoCards resumo={resumo} />

      {pagamentosFiltrados.length === 0 ? (
        pagamentos.length === 0 ? (
          <FinanceiroEmptyState
            titulo="Nenhum registro financeiro no período."
            descricao="Escolha outro período ou aguarde novos atendimentos serem realizados."
          />
        ) : (
          <FinanceiroEmptyState
            titulo="Nenhum registro encontrado."
            descricao="Tente ajustar a busca ou o filtro de status aplicado."
          />
        )
      ) : (
        <>
          <FinanceiroTable pagamentos={pagamentosFiltrados} onSelect={handleSelect} />
          <PagamentoCardList pagamentos={pagamentosFiltrados} onSelect={handleSelect} />
        </>
      )}

      <PagamentoDetailsDrawer
        idAgendamento={selecionadoId}
        carregando={carregandoDetalhe}
        pagamento={detalhe}
        erro={erroDetalhe}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
