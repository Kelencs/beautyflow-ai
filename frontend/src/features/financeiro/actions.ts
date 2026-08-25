"use server";

import type { Pagamento } from "@beautyflow/shared-types";
import { BackendRequestError, getPagamento } from "@/lib/backend/server";

export interface PagamentoDetalhadoResultado {
  sucesso: boolean;
  pagamento: Pagamento | null;
  mensagemErro: string | null;
}

/**
 * Server Action que a tela de Financeiro (Client Component) chama ao abrir o drawer de
 * um registro — GET /financeiro/:id só existe server-side (lib/backend/server.ts é
 * `server-only`); esta é a ponte, mesmo padrão de features/servicos/actions.ts.
 */
export async function buscarPagamentoDetalhado(
  idAgendamento: string,
): Promise<PagamentoDetalhadoResultado> {
  try {
    const pagamento = await getPagamento(idAgendamento);
    return { sucesso: true, pagamento, mensagemErro: null };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return { sucesso: false, pagamento: null, mensagemErro: "Registro financeiro não encontrado." };
    }
    return {
      sucesso: false,
      pagamento: null,
      mensagemErro: "Não foi possível carregar os detalhes deste registro. Tente novamente.",
    };
  }
}
