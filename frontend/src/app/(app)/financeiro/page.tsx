import { FinanceiroErrorState } from "@/features/financeiro/FinanceiroErrorState";
import { FinanceiroScreen } from "@/features/financeiro/FinanceiroScreen";
import { calcularPeriodoFinanceiro } from "@/features/financeiro/period";
import type { FinanceiroResumo, Pagamento, PeriodoFinanceiro } from "@/features/financeiro/types";
import { BackendRequestError, getFinanceiro } from "@/lib/backend/server";
import { getHojeBrasil } from "@/lib/date";

const PERIODOS_VALIDOS: PeriodoFinanceiro[] = ["hoje", "7dias", "mes"];

function primeiroValor(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parsePeriodo(raw: string | string[] | undefined): PeriodoFinanceiro {
  const valor = primeiroValor(raw);
  return (PERIODOS_VALIDOS as string[]).includes(valor ?? "") ? (valor as PeriodoFinanceiro) : "mes";
}

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
          "Sua conta não possui a permissão ou a configuração necessária para acessar o Financeiro. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar o Financeiro.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar o Financeiro.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function FinanceiroPage(props: PageProps<"/financeiro">) {
  const searchParams = await props.searchParams;
  const periodo = parsePeriodo(searchParams.periodo);
  const { dataInicio, dataFim } = calcularPeriodoFinanceiro(periodo, getHojeBrasil());

  let resumo: FinanceiroResumo | null = null;
  let pagamentos: Pagamento[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getFinanceiro(dataInicio, dataFim);
    resumo = resposta.resumo;
    pagamentos = resposta.data;
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !resumo || !pagamentos) {
    const { titulo, mensagem } = erro ?? classificarErro(undefined);
    return <FinanceiroErrorState titulo={titulo} mensagem={mensagem} />;
  }

  return <FinanceiroScreen key={periodo} periodo={periodo} resumo={resumo} pagamentos={pagamentos} />;
}
