"use client";

import { useMemo, useState } from "react";
import { buscarServicoDetalhado } from "./actions";
import { ServicoCardList } from "./ServicoCardList";
import { ServicoDetailsDrawer } from "./ServicoDetailsDrawer";
import { ServicosEmptyState } from "./ServicosEmptyState";
import { ServicosHeader } from "./ServicosHeader";
import { ServicosSummary } from "./ServicosSummary";
import { ServicosTable } from "./ServicosTable";
import { NovoServicoModal } from "./NovoServicoModal";
import type { FiltroServico, Servico } from "./types";

interface ServicosScreenProps {
  servicos: Servico[];
}

const DIACRITICOS_REGEX = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize("NFD").replace(DIACRITICOS_REGEX, "");
}

function aplicarFiltro(servicos: Servico[], filtro: FiltroServico): Servico[] {
  if (filtro === "ativos") return servicos.filter((servico) => servico.status === "ATIVO");
  if (filtro === "inativos") return servicos.filter((servico) => servico.status === "INATIVO");
  return servicos;
}

/**
 * Busca e filtros são client-side nesta etapa porque o catálogo é pequeno e mockado
 * (mesmo critério documentado em features/clientes/ClientesScreen.tsx). Quando o volume
 * real de serviços existir, isso deve virar busca/filtro no backend.
 */
export function ServicosScreen({ servicos }: ServicosScreenProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroServico>("todos");
  const [novoServicoAberto, setNovoServicoAberto] = useState(false);

  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<string | null>(null);
  const [servicoDetalhe, setServicoDetalhe] = useState<Servico | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  const servicosFiltrados = useMemo(() => {
    const porFiltro = aplicarFiltro(servicos, filtro);
    const termo = normalizar(busca);
    if (!termo) return porFiltro;

    return porFiltro.filter((servico) => {
      const alvo = normalizar(`${servico.nome} ${servico.descricao ?? ""}`);
      return alvo.includes(termo);
    });
  }, [servicos, filtro, busca]);

  async function handleSelectServico(servico: Servico) {
    setServicoSelecionadoId(servico.idServico);
    setServicoDetalhe(null);
    setErroDetalhe(null);
    setCarregandoDetalhe(true);

    const resultado = await buscarServicoDetalhado(servico.idServico);

    setCarregandoDetalhe(false);
    if (resultado.sucesso && resultado.servico) {
      setServicoDetalhe(resultado.servico);
    } else {
      setErroDetalhe(resultado.mensagemErro ?? "Não foi possível carregar este serviço.");
    }
  }

  function handleCloseDrawer() {
    setServicoSelecionadoId(null);
    setServicoDetalhe(null);
    setErroDetalhe(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <ServicosHeader
        busca={busca}
        onBuscaChange={setBusca}
        filtro={filtro}
        onFiltroChange={setFiltro}
        onNovoServico={() => setNovoServicoAberto(true)}
      />

      <ServicosSummary servicos={servicos} />

      {servicosFiltrados.length === 0 ? (
        <ServicosEmptyState
          titulo={servicos.length === 0 ? "Nenhum serviço cadastrado ainda." : "Nenhum serviço encontrado."}
          descricao={
            servicos.length === 0
              ? "Assim que um serviço for cadastrado, ele aparecerá aqui."
              : "Tente ajustar a busca ou os filtros aplicados."
          }
        />
      ) : (
        <>
          <ServicosTable servicos={servicosFiltrados} onSelect={handleSelectServico} />
          <ServicoCardList servicos={servicosFiltrados} onSelect={handleSelectServico} />
        </>
      )}

      <ServicoDetailsDrawer
        servicoId={servicoSelecionadoId}
        carregando={carregandoDetalhe}
        servico={servicoDetalhe}
        erro={erroDetalhe}
        onClose={handleCloseDrawer}
      />

      <NovoServicoModal open={novoServicoAberto} onClose={() => setNovoServicoAberto(false)} />
    </div>
  );
}
