"use server";

import type { Profissional } from "@beautyflow/shared-types";
import { BackendRequestError, getProfissional } from "@/lib/backend/server";

export interface ProfissionalDetalhadoResultado {
  sucesso: boolean;
  profissional: Profissional | null;
  mensagemErro: string | null;
}

/**
 * Server Action que a tela de Profissionais (Client Component) chama ao abrir o drawer
 * de um profissional — GET /profissionais/:id só existe server-side (lib/backend/
 * server.ts é `server-only`); esta é a ponte, mesmo padrão de features/clientes/actions.ts
 * e features/servicos/actions.ts.
 */
export async function buscarProfissionalDetalhado(idProfissional: string): Promise<ProfissionalDetalhadoResultado> {
  try {
    const profissional = await getProfissional(idProfissional);
    return { sucesso: true, profissional, mensagemErro: null };
  } catch (error) {
    if (error instanceof BackendRequestError && error.status === 404) {
      return { sucesso: false, profissional: null, mensagemErro: "Profissional não encontrado." };
    }
    return {
      sucesso: false,
      profissional: null,
      mensagemErro: "Não foi possível carregar os detalhes deste profissional. Tente novamente.",
    };
  }
}
