import { IaErrorState } from "@/features/ia/IaErrorState";
import { IaScreen } from "@/features/ia/IaScreen";
import type { IaConfiguracao } from "@/features/ia/types";
import { BackendRequestError, getIa } from "@/lib/backend/server";

function classificarErro(error: unknown): { titulo: string; mensagem: string; proibido?: boolean } {
  if (error instanceof BackendRequestError) {
    if (error.status === 403) {
      return {
        titulo: "Você não possui permissão para acessar as configurações da IA.",
        mensagem: "Esta área é restrita ao proprietário da empresa. Fale com o responsável pela conta se precisar de acesso.",
        proibido: true,
      };
    }
    if (error.status === 401) {
      return {
        titulo: "Não foi possível validar sua sessão.",
        mensagem: "O servidor não conseguiu confirmar seu login agora. Tente novamente em instantes.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar a IA.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar a IA.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function IaPage() {
  let configuracao: IaConfiguracao | null = null;
  let erro: { titulo: string; mensagem: string; proibido?: boolean } | null = null;

  try {
    configuracao = await getIa();
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !configuracao) {
    const { titulo, mensagem, proibido } = erro ?? classificarErro(undefined);
    return <IaErrorState titulo={titulo} mensagem={mensagem} proibido={proibido} />;
  }

  return <IaScreen configuracao={configuracao} />;
}
