import { DashboardAtalhos } from "@/features/dashboard/DashboardAtalhos";
import { DashboardErrorState } from "@/features/dashboard/DashboardErrorState";
import { DashboardIndicadores } from "@/features/dashboard/DashboardIndicadores";
import { DashboardProximoAtendimento } from "@/features/dashboard/DashboardProximoAtendimento";
import { DashboardProximosAtendimentos } from "@/features/dashboard/DashboardProximosAtendimentos";
import { DashboardResumoCards } from "@/features/dashboard/DashboardResumoCards";
import type { DashboardResponse } from "@/features/dashboard/types";
import { BackendRequestError, getDashboard } from "@/lib/backend/server";

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
          "Sua conta não possui a permissão ou a configuração necessária para acessar o Dashboard. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar o Dashboard.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar o Dashboard.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function DashboardPage() {
  let dashboard: DashboardResponse | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    dashboard = await getDashboard();
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !dashboard) {
    const { titulo, mensagem } = erro ?? classificarErro(undefined);
    return <DashboardErrorState titulo={titulo} mensagem={mensagem} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Acompanhe o movimento do seu negócio hoje.</p>
      </div>

      <DashboardResumoCards resumo={dashboard.resumo} />
      <DashboardIndicadores resumo={dashboard.resumo} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardProximoAtendimento proximoAtendimento={dashboard.proximoAtendimento} />
        <DashboardAtalhos />
      </div>

      <DashboardProximosAtendimentos proximosAtendimentos={dashboard.proximosAtendimentos} />
    </div>
  );
}
