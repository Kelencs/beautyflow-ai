import { AgendaScreen } from "@/features/agenda/AgendaScreen";
import { AgendaErrorState } from "@/features/agenda/AgendaErrorState";
import { calcularPeriodoBusca, toAgendamento } from "@/features/agenda/backend";
import type { Agendamento, VisaoAgenda } from "@/features/agenda/types";
import { BackendRequestError, getAgenda } from "@/lib/backend/server";
import { getHojeBrasil, parseISODate, toISODate } from "@/lib/date";

const VISOES_VALIDAS: VisaoAgenda[] = ["dia", "semana", "mes"];
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function primeiroValor(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parseView(raw: string | string[] | undefined): VisaoAgenda {
  const valor = primeiroValor(raw);
  return (VISOES_VALIDAS as string[]).includes(valor ?? "") ? (valor as VisaoAgenda) : "dia";
}

/** Ignora silenciosamente um "data" inválido/ausente na URL, caindo para "hoje". */
function parseData(raw: string | string[] | undefined, hojeIso: string): string {
  const valor = primeiroValor(raw);
  if (!valor || !DATA_REGEX.test(valor)) {
    return hojeIso;
  }
  return Number.isNaN(parseISODate(valor).getTime()) ? hojeIso : valor;
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
          "Sua conta não possui a permissão ou a configuração necessária para acessar a Agenda. Entre em contato com o administrador.",
      };
    }
    if (error.status === 0) {
      return {
        titulo: "Não foi possível carregar os agendamentos.",
        mensagem: "Não conseguimos conectar ao servidor. Verifique sua conexão e tente novamente.",
      };
    }
  }

  return {
    titulo: "Não foi possível carregar os agendamentos.",
    mensagem: "Ocorreu um erro inesperado. Tente novamente em instantes.",
  };
}

export default async function AgendaPage(props: PageProps<"/agenda">) {
  const searchParams = await props.searchParams;
  const hojeIso = toISODate(getHojeBrasil());

  const view = parseView(searchParams.view);
  const dataParam = parseData(searchParams.data, hojeIso);
  const referenceDate = parseISODate(dataParam);
  const { dataInicio, dataFim } = calcularPeriodoBusca(view, referenceDate);

  let agendamentos: Agendamento[] | null = null;
  let erro: { titulo: string; mensagem: string } | null = null;

  try {
    const resposta = await getAgenda(dataInicio, dataFim);
    agendamentos = resposta.data.map(toAgendamento);
  } catch (error) {
    erro = classificarErro(error);
  }

  if (erro) {
    return <AgendaErrorState titulo={erro.titulo} mensagem={erro.mensagem} />;
  }

  return (
    <AgendaScreen
      key={`${view}-${dataParam}`}
      initialView={view}
      initialDate={dataParam}
      todayIso={hojeIso}
      agendamentos={agendamentos ?? []}
    />
  );
}
