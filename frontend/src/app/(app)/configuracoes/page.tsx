import { ConfiguracoesErrorState } from "@/features/configuracoes/ConfiguracoesErrorState";
import { ConfiguracoesScreen } from "@/features/configuracoes/ConfiguracoesScreen";
import type { ConfiguracoesEmpresa } from "@/features/configuracoes/types";
import { BackendRequestError, getConfiguracoes } from "@/lib/backend/server";

function classificarErro(error: unknown): { titulo: string; mensagem: string; proibido?: boolean } {
  if (error instanceof BackendRequestError) {
    if (error.status === 403) {
      return {
        titulo: "Você não possui permissão para acessar as configurações do negócio.",
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
        titulo: "Não foi possível carregar as Configurações.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar as Configurações.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function ConfiguracoesPage() {
  let configuracoes: ConfiguracoesEmpresa | null = null;
  let erro: { titulo: string; mensagem: string; proibido?: boolean } | null = null;

  try {
    configuracoes = await getConfiguracoes();
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !configuracoes) {
    const { titulo, mensagem, proibido } = erro ?? classificarErro(undefined);
    return <ConfiguracoesErrorState titulo={titulo} mensagem={mensagem} proibido={proibido} />;
  }

  return <ConfiguracoesScreen configuracoes={configuracoes} />;
}
