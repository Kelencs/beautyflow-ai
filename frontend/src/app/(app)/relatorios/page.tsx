import { RelatoriosErrorState } from "@/features/relatorios/RelatoriosErrorState";
import { RelatoriosScreen } from "@/features/relatorios/RelatoriosScreen";
import { calcularPeriodoRelatorio } from "@/features/relatorios/period";
import type { PresetRelatorio, RelatoriosResponse } from "@/features/relatorios/types";
import { BackendRequestError, getRelatorios } from "@/lib/backend/server";
import { getHojeBrasil } from "@/lib/date";

const PRESETS_VALIDOS: PresetRelatorio[] = ["hoje", "7dias", "mes", "30dias", "ano", "custom"];
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function primeiroValor(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parsePreset(raw: string | string[] | undefined): PresetRelatorio {
  const valor = primeiroValor(raw);
  return (PRESETS_VALIDOS as string[]).includes(valor ?? "") ? (valor as PresetRelatorio) : "mes";
}

/** Ignora silenciosamente um valor customizado inválido/ausente, caindo para null (period.ts então usa "mes"). */
function parseCustom(
  dataInicioRaw: string | string[] | undefined,
  dataFimRaw: string | string[] | undefined,
): { dataInicio: string; dataFim: string } | null {
  const dataInicio = primeiroValor(dataInicioRaw);
  const dataFim = primeiroValor(dataFimRaw);
  if (!dataInicio || !dataFim || !DATA_REGEX.test(dataInicio) || !DATA_REGEX.test(dataFim) || dataFim < dataInicio) {
    return null;
  }
  return { dataInicio, dataFim };
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
          "Sua conta não possui a permissão ou a configuração necessária para acessar os Relatórios. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar os Relatórios.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar os Relatórios.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function RelatoriosPage(props: PageProps<"/relatorios">) {
  const searchParams = await props.searchParams;
  const preset = parsePreset(searchParams.preset);
  const custom = parseCustom(searchParams.dataInicio, searchParams.dataFim);
  const { dataInicio, dataFim } = calcularPeriodoRelatorio(preset, getHojeBrasil(), custom);

  let relatorio: RelatoriosResponse | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    relatorio = await getRelatorios(dataInicio, dataFim);
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro || !relatorio) {
    const { titulo, mensagem } = erro ?? classificarErro(undefined);
    return <RelatoriosErrorState titulo={titulo} mensagem={mensagem} />;
  }

  return <RelatoriosScreen key={`${preset}-${dataInicio}-${dataFim}`} preset={preset} relatorio={relatorio} />;
}
