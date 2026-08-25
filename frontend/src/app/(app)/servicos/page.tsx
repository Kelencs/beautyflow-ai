import { ServicosScreen } from "@/features/servicos/ServicosScreen";
import { ServicosErrorState } from "@/features/servicos/ServicosErrorState";
import type { Servico } from "@/features/servicos/types";
import { BackendRequestError, getServicos } from "@/lib/backend/server";

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
          "Sua conta não possui a permissão ou a configuração necessária para acessar os serviços. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar os serviços.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar os serviços.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function ServicosPage() {
  let servicos: Servico[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getServicos();
    servicos = resposta.data;
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro) {
    return <ServicosErrorState titulo={erro.titulo} mensagem={erro.mensagem} />;
  }

  return <ServicosScreen servicos={servicos ?? []} />;
}
