"use client";

import { useMemo, useState } from "react";
import { buscarProfissionalDetalhado } from "./actions";
import { ProfissionalCardList } from "./ProfissionalCardList";
import { ProfissionalDetailsDrawer } from "./ProfissionalDetailsDrawer";
import { ProfissionaisEmptyState } from "./ProfissionaisEmptyState";
import { ProfissionaisHeader } from "./ProfissionaisHeader";
import { ProfissionaisSummary } from "./ProfissionaisSummary";
import { ProfissionaisTable } from "./ProfissionaisTable";
import { NovoProfissionalModal } from "./NovoProfissionalModal";
import type { FiltroProfissional, Profissional } from "./types";

interface ProfissionaisScreenProps {
  profissionais: Profissional[];
}

const DIACRITICOS_REGEX = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize("NFD").replace(DIACRITICOS_REGEX, "");
}

function aplicarFiltro(profissionais: Profissional[], filtro: FiltroProfissional): Profissional[] {
  if (filtro === "ativos") return profissionais.filter((profissional) => profissional.status === "ATIVO");
  if (filtro === "inativos") return profissionais.filter((profissional) => profissional.status === "INATIVO");
  return profissionais;
}

/**
 * Busca e filtros são client-side nesta etapa porque a equipe é pequena e mockada
 * (mesmo critério documentado em ClientesScreen/ServicosScreen). Migrar para o backend
 * se o volume real de profissionais crescer.
 */
export function ProfissionaisScreen({ profissionais }: ProfissionaisScreenProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroProfissional>("todos");
  const [novoProfissionalAberto, setNovoProfissionalAberto] = useState(false);

  const [profissionalSelecionadoId, setProfissionalSelecionadoId] = useState<string | null>(null);
  const [profissionalDetalhe, setProfissionalDetalhe] = useState<Profissional | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  const profissionaisFiltrados = useMemo(() => {
    const porFiltro = aplicarFiltro(profissionais, filtro);
    const termo = normalizar(busca);
    if (!termo) return porFiltro;

    return porFiltro.filter((profissional) => {
      const alvo = normalizar(
        `${profissional.nome} ${profissional.telefone ?? ""} ${profissional.email ?? ""} ${profissional.especialidade ?? ""}`,
      );
      return alvo.includes(termo);
    });
  }, [profissionais, filtro, busca]);

  async function handleSelectProfissional(profissional: Profissional) {
    setProfissionalSelecionadoId(profissional.idProfissional);
    setProfissionalDetalhe(null);
    setErroDetalhe(null);
    setCarregandoDetalhe(true);

    const resultado = await buscarProfissionalDetalhado(profissional.idProfissional);

    setCarregandoDetalhe(false);
    if (resultado.sucesso && resultado.profissional) {
      setProfissionalDetalhe(resultado.profissional);
    } else {
      setErroDetalhe(resultado.mensagemErro ?? "Não foi possível carregar este profissional.");
    }
  }

  function handleCloseDrawer() {
    setProfissionalSelecionadoId(null);
    setProfissionalDetalhe(null);
    setErroDetalhe(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfissionaisHeader
        busca={busca}
        onBuscaChange={setBusca}
        filtro={filtro}
        onFiltroChange={setFiltro}
        onNovoProfissional={() => setNovoProfissionalAberto(true)}
      />

      <ProfissionaisSummary profissionais={profissionais} />

      {profissionaisFiltrados.length === 0 ? (
        <ProfissionaisEmptyState
          titulo={profissionais.length === 0 ? "Nenhum profissional cadastrado ainda." : "Nenhum profissional encontrado."}
          descricao={
            profissionais.length === 0
              ? "Assim que um profissional for cadastrado, ele aparecerá aqui."
              : "Tente ajustar a busca ou os filtros aplicados."
          }
        />
      ) : (
        <>
          <ProfissionaisTable profissionais={profissionaisFiltrados} onSelect={handleSelectProfissional} />
          <ProfissionalCardList profissionais={profissionaisFiltrados} onSelect={handleSelectProfissional} />
        </>
      )}

      <ProfissionalDetailsDrawer
        profissionalId={profissionalSelecionadoId}
        carregando={carregandoDetalhe}
        profissional={profissionalDetalhe}
        erro={erroDetalhe}
        onClose={handleCloseDrawer}
      />

      <NovoProfissionalModal open={novoProfissionalAberto} onClose={() => setNovoProfissionalAberto(false)} />
    </div>
  );
}
