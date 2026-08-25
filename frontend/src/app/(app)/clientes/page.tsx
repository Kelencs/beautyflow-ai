import { ClientesScreen } from "@/features/clientes/ClientesScreen";
import { ClientesErrorState } from "@/features/clientes/ClientesErrorState";
import type { Cliente } from "@/features/clientes/types";
import { BackendRequestError, getClientes } from "@/lib/backend/server";
import { getHojeBrasil, toISODate } from "@/lib/date";

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
          "Sua conta não possui a permissão ou a configuração necessária para acessar os clientes. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar os clientes.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar os clientes.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function ClientesPage() {
  const hojeIso = toISODate(getHojeBrasil());

  let clientes: Cliente[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getClientes();
    clientes = resposta.data;
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro) {
    return <ClientesErrorState titulo={erro.titulo} mensagem={erro.mensagem} />;
  }

  return <ClientesScreen clientes={clientes ?? []} todayIso={hojeIso} />;
}
