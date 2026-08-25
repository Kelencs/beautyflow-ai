import { ComunicacaoErrorState } from "@/features/comunicacao/ComunicacaoErrorState";
import { ComunicacaoScreen } from "@/features/comunicacao/ComunicacaoScreen";
import { calcularPeriodoComunicacao } from "@/features/comunicacao/period";
import type { ComunicacaoItem, ComunicacaoResumo, PeriodoComunicacao } from "@/features/comunicacao/types";
import { BackendRequestError, getComunicacoes } from "@/lib/backend/server";
import { getHojeBrasil } from "@/lib/date";

const PERIODOS_VALIDOS: PeriodoComunicacao[] = ["hoje", "7dias", "mes"];

function primeiroValor(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parsePeriodo(raw: string | string[] | undefined): PeriodoComunicacao {
  const valor = primeiroValor(raw);
  return (PERIODOS_VALIDOS as string[]).includes(valor ?? "") ? (valor as PeriodoComunicacao) : "mes";
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
          "Sua conta não possui a permissão ou a configuração necessária para acessar a Comunicação. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar a Comunicação.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar a Comunicação.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function ComunicacaoPage(props: PageProps<"/comunicacao">) {
  const searchParams = await props.searchParams;
  const periodo = parsePeriodo(searchParams.periodo);
  const { dataInicio, dataFim } = calcularPeriodoComunicacao(periodo, getHojeBrasil());

  let resumo: ComunicacaoResumo | null = null;
  let comunicacoes: ComunicacaoItem[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getComunicacoes(dataInicio, dataFim);
    resumo = resposta.resumo;
    comunicacoes = resposta.data;
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !resumo || !comunicacoes) {
    const { titulo, mensagem } = erro ?? classificarErro(undefined);
    return <ComunicacaoErrorState titulo={titulo} mensagem={mensagem} />;
  }

  return <ComunicacaoScreen key={periodo} periodo={periodo} resumo={resumo} comunicacoes={comunicacoes} />;
}
