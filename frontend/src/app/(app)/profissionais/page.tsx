import { ProfissionaisScreen } from "@/features/profissionais/ProfissionaisScreen";
import { ProfissionaisErrorState } from "@/features/profissionais/ProfissionaisErrorState";
import type { Profissional } from "@/features/profissionais/types";
import { BackendRequestError, getProfissionais } from "@/lib/backend/server";

function classificarErro(error: unknown): { titulo: string; mensagem: string } {
  if (error instanceof BackendRequestError) {
    if (error.status === 401) {
      return {
        titulo: "Não foi possível validar sua sessão.",
        mensagem: "O servidor não conseguiu confirmar seu login agora. Tente novamente em instantes.",
      };
    }
    if (error.status === 403) {
      return {
        titulo: "Acesso não permitido.",
        mensagem:
          "Sua conta não possui a permissão ou a configuração necessária para acessar os profissionais. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar os profissionais.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar os profissionais.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function ProfissionaisPage() {
  let profissionais: Profissional[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getProfissionais();
    profissionais = resposta.data;
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro) {
    return <ProfissionaisErrorState titulo={erro.titulo} mensagem={erro.mensagem} />;
  }

  return <ProfissionaisScreen profissionais={profissionais ?? []} />;
}
