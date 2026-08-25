"use server";

import type { ClienteDetalhado } from "@beautyflow/shared-types";
import { BackendRequestError, getCliente } from "@/lib/backend/server";

export interface ClienteDetalhadoResultado {
  sucesso: boolean;
  cliente: ClienteDetalhado | null;
  mensagemErro: string | null;
}

/**
 * Server Action que a tela de Clientes (Client Component) chama ao abrir o drawer de um
 * cliente — GET /clientes/:id só existe server-side (lib/backend/server.ts é
 * `server-only`); esta é a ponte, no mesmo padrão já usado por login/logout em
 * features/auth/actions.ts. O access_token nunca sai do servidor.
 */
export async function buscarClienteDetalhado(idCliente: string): Promise<ClienteDetalhadoResultado> {
  try {
    const cliente = await getCliente(idCliente);
    return { sucesso: true, cliente, mensagemErro: null };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return { sucesso: false, cliente: null, mensagemErro: "Cliente não encontrado." };
    }
    return {
      sucesso: false,
      cliente: null,
      mensagemErro: "Não foi possível carregar os detalhes deste cliente. Tente novamente.",
    };
  }
}
