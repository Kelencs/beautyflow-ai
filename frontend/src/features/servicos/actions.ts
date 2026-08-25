"use server";

import type { Servico } from "@beautyflow/shared-types";
import { BackendRequestError, getServico } from "@/lib/backend/server";

export interface ServicoDetalhadoResultado {
  sucesso: boolean;
  servico: Servico | null;
  mensagemErro: string | null;
}

/**
 * Server Action que a tela de Serviços (Client Component) chama ao abrir o drawer de um
 * serviço — GET /servicos/:id só existe server-side (lib/backend/server.ts é
 * `server-only`); esta é a ponte, mesmo padrão de features/clientes/actions.ts.
 */
export async function buscarServicoDetalhado(idServico: string): Promise<ServicoDetalhadoResultado> {
  try {
    const servico = await getServico(idServico);
    return { sucesso: true, servico, mensagemErro: null };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return { sucesso: false, servico: null, mensagemErro: "Serviço não encontrado." };
    }
    return {
      sucesso: false,
      servico: null,
      mensagemErro: "Não foi possível carregar os detalhes deste serviço. Tente novamente.",
    };
  }
}
