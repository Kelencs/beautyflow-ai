"use server";

import type { ComunicacaoItem } from "@beautyflow/shared-types";
import { BackendRequestError, getComunicacao } from "@/lib/backend/server";

export interface ComunicacaoDetalhadaResultado {
  sucesso: boolean;
  comunicacao: ComunicacaoItem | null;
  mensagemErro: string | null;
}

/**
 * Server Action que a tela de Comunicação (Client Component) chama ao abrir o drawer de
 * um registro — GET /comunicacao/:id só existe server-side (lib/backend/server.ts é
 * `server-only`); esta é a ponte, mesmo padrão de features/financeiro/actions.ts.
 */
export async function buscarComunicacaoDetalhada(
  idComunicacao: string,
): Promise<ComunicacaoDetalhadaResultado> {
  try {
    const comunicacao = await getComunicacao(idComunicacao);
    return { sucesso: true, comunicacao, mensagemErro: null };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return { sucesso: false, comunicacao: null, mensagemErro: "Comunicação não encontrada." };
    }
    return {
      sucesso: false,
      comunicacao: null,
      mensagemErro: "Não foi possível carregar os detalhes deste registro. Tente novamente.",
    };
  }
}
