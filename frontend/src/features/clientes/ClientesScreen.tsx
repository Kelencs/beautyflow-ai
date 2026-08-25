"use client";

import { useMemo, useState } from "react";
import { buscarClienteDetalhado } from "./actions";
import { ClienteCardList } from "./ClienteCardList";
import { ClienteDetailsDrawer } from "./ClienteDetailsDrawer";
import { ClientesEmptyState } from "./ClientesEmptyState";
import { ClientesHeader } from "./ClientesHeader";
import { ClientesSummary } from "./ClientesSummary";
import { ClientesTable } from "./ClientesTable";
import { NovoClienteModal } from "./NovoClienteModal";
import type { Cliente, ClienteDetalhado, FiltroCliente } from "./types";

interface ClientesScreenProps {
  clientes: Cliente[];
  todayIso: string;
}

const MINIMO_ATENDIMENTOS_RECORRENTE = 2;

const DIACRITICOS_REGEX = /[̀-ͯ]/g;

function normalizar(texto: string): string {
  return texto.trim().toLowerCase().normalize("NFD").replace(DIACRITICOS_REGEX, "");
}

function aplicarFiltro(clientes: Cliente[], filtro: FiltroCliente): Cliente[] {
  switch (filtro) {
    case "ativos":
      return clientes.filter((cliente) => cliente.status === "ATIVO");
    case "inativos":
      return clientes.filter((cliente) => cliente.status === "INATIVO");
    case "com-proximo":
      return clientes.filter((cliente) => cliente.proximoAtendimento !== null);
    case "sem-proximo":
      return clientes.filter((cliente) => cliente.proximoAtendimento === null);
    case "recorrentes":
      return clientes.filter((cliente) => cliente.totalAtendimentos >= MINIMO_ATENDIMENTOS_RECORRENTE);
    default:
      return clientes;
  }
}

/**
 * Busca e filtros são client-side nesta etapa porque o conjunto de dados é pequeno e
 * mockado (ver seção 7/23 do pedido). Quando o volume real de clientes existir, isso
 * deve virar busca/filtro no backend (paginação, índice) — não escala bem além de
 * algumas centenas de registros.
 */
export function ClientesScreen({ clientes, todayIso }: ClientesScreenProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroCliente>("todos");
  const [novoClienteAberto, setNovoClienteAberto] = useState(false);

  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(null);
  const [clienteDetalhe, setClienteDetalhe] = useState<ClienteDetalhado | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);

  const clientesFiltrados = useMemo(() => {
    const porFiltro = aplicarFiltro(clientes, filtro);
    const termo = normalizar(busca);
    if (!termo) return porFiltro;

    return porFiltro.filter((cliente) => {
      const alvo = normalizar(`${cliente.nome} ${cliente.telefone} ${cliente.email ?? ""}`);
      return alvo.includes(termo);
    });
  }, [clientes, filtro, busca]);

  async function handleSelectCliente(cliente: Cliente) {
    setClienteSelecionadoId(cliente.idCliente);
    setClienteDetalhe(null);
    setErroDetalhe(null);
    setCarregandoDetalhe(true);

    const resultado = await buscarClienteDetalhado(cliente.idCliente);

    setCarregandoDetalhe(false);
    if (resultado.sucesso && resultado.cliente) {
      setClienteDetalhe(resultado.cliente);
    } else {
      setErroDetalhe(resultado.mensagemErro ?? "Não foi possível carregar este cliente.");
    }
  }

  function handleCloseDrawer() {
    setClienteSelecionadoId(null);
    setClienteDetalhe(null);
    setErroDetalhe(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <ClientesHeader
        busca={busca}
        onBuscaChange={setBusca}
        filtro={filtro}
        onFiltroChange={setFiltro}
        onNovoCliente={() => setNovoClienteAberto(true)}
      />

      <ClientesSummary clientes={clientes} todayIso={todayIso} />

      {clientesFiltrados.length === 0 ? (
        <ClientesEmptyState
          titulo={clientes.length === 0 ? "Nenhum cliente cadastrado ainda." : "Nenhum cliente encontrado."}
          descricao={
            clientes.length === 0
              ? "Assim que um cliente for cadastrado, ele aparecerá aqui."
              : "Tente ajustar a busca ou os filtros aplicados."
          }
        />
      ) : (
        <>
          <ClientesTable clientes={clientesFiltrados} onSelect={handleSelectCliente} />
          <ClienteCardList clientes={clientesFiltrados} onSelect={handleSelectCliente} />
        </>
      )}

      <ClienteDetailsDrawer
        clienteId={clienteSelecionadoId}
        carregando={carregandoDetalhe}
        detalhe={clienteDetalhe}
        erro={erroDetalhe}
        onClose={handleCloseDrawer}
      />

      <NovoClienteModal open={novoClienteAberto} onClose={() => setNovoClienteAberto(false)} />
    </div>
  );
}
