import "server-only";

import type {
  AgendaResponse,
  ClienteDetalhado,
  ClientesResponse,
  ComunicacaoItem,
  ComunicacaoResponse,
  ConfiguracoesEmpresa,
  DashboardResponse,
  FinanceiroResponse,
  IaConfiguracao,
  Pagamento,
  Profissional,
  ProfissionaisResponse,
  RelatoriosResponse,
  Servico,
  ServicosResponse,
} from "@beautyflow/shared-types";
import { createClient } from "@/lib/supabase/server";
import type { UsuarioAutenticado } from "@/features/auth/types";

/**
 * Camada server-only de chamadas autenticadas ao backend NestJS. Nunca importar este
 * módulo de um Client Component — `import "server-only"` faz o build falhar se isso
 * acontecer. O access_token nunca sai daqui: não é retornado, logado, nem passado como
 * prop; só vai no header Authorization da requisição ao backend.
 *
 * id_empresa/perfil/id_profissional NUNCA são enviados ao backend — o backend resolve
 * tudo sozinho a partir do token (Supabase Auth UID -> public.usuarios), exatamente como
 * o SupabaseAuthGuard já faz.
 */

export class BackendRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BackendRequestError";
  }
}

function getBackendUrl(): string {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend não configurado: defina BACKEND_URL (ver frontend/.env.example).");
  }
  return backendUrl;
}

/**
 * access_token da sessão Supabase atual — extraído só para repassar ao backend, que faz
 * sua própria validação (`supabase.auth.getUser(token)` no SupabaseAuthGuard). Usar
 * `getSession()` aqui é apropriado porque não é usado para AUTORIZAR nada no frontend
 * (isso já foi feito por `getUsuarioAutenticado()`, que usa `getUser()`) — é só a fonte
 * do token bruto a ser encaminhado.
 */
async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function backendFetch<T>(path: string): Promise<T> {
  const backendUrl = getBackendUrl();
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new BackendRequestError("Sessão não autenticada.", 401);
  }

  let response: Response;
  try {
    response = await fetch(`${backendUrl}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch {
    throw new BackendRequestError("Não foi possível conectar ao servidor.", 0);
  }

  if (!response.ok) {
    throw new BackendRequestError(`O servidor respondeu com um erro (${response.status}).`, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new BackendRequestError("O servidor devolveu uma resposta inesperada.", response.status);
  }
}

/** GET /auth/me — usado para validar que o backend aceita o token do frontend. */
export function fetchAuthMe(): Promise<UsuarioAutenticado> {
  return backendFetch<UsuarioAutenticado>("/auth/me");
}

/**
 * GET /agenda?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD — nunca envia id_empresa; o
 * backend resolve a empresa/perfil/profissional sozinho a partir do token.
 */
export function getAgenda(dataInicio: string, dataFim: string): Promise<AgendaResponse> {
  const params = new URLSearchParams({ dataInicio, dataFim });
  return backendFetch<AgendaResponse>(`/agenda?${params.toString()}`);
}

/** GET /clientes — nunca envia id_empresa; o backend resolve a empresa sozinho a partir do token. */
export function getClientes(): Promise<ClientesResponse> {
  return backendFetch<ClientesResponse>("/clientes");
}

/** GET /clientes/:id — 404 (via BackendRequestError.status) se o cliente não pertencer à empresa do usuário. */
export function getCliente(idCliente: string): Promise<ClienteDetalhado> {
  return backendFetch<ClienteDetalhado>(`/clientes/${encodeURIComponent(idCliente)}`);
}

/** GET /servicos — nunca envia id_empresa; o backend resolve a empresa sozinho a partir do token. */
export function getServicos(): Promise<ServicosResponse> {
  return backendFetch<ServicosResponse>("/servicos");
}

/** GET /servicos/:id — 404 (via BackendRequestError.status) se o serviço não pertencer à empresa do usuário. */
export function getServico(idServico: string): Promise<Servico> {
  return backendFetch<Servico>(`/servicos/${encodeURIComponent(idServico)}`);
}

/** GET /profissionais — nunca envia id_empresa; o backend resolve a empresa sozinho a partir do token. */
export function getProfissionais(): Promise<ProfissionaisResponse> {
  return backendFetch<ProfissionaisResponse>("/profissionais");
}

/** GET /profissionais/:id — 404 (via BackendRequestError.status) se o profissional não pertencer à empresa do usuário. */
export function getProfissional(idProfissional: string): Promise<Profissional> {
  return backendFetch<Profissional>(`/profissionais/${encodeURIComponent(idProfissional)}`);
}

/** GET /dashboard — nunca envia id_empresa; o backend resolve a empresa/data de hoje sozinho. */
export function getDashboard(): Promise<DashboardResponse> {
  return backendFetch<DashboardResponse>("/dashboard");
}

/**
 * GET /financeiro?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD — nunca envia id_empresa; o
 * backend resolve a empresa/perfil/profissional sozinho a partir do token.
 */
export function getFinanceiro(dataInicio: string, dataFim: string): Promise<FinanceiroResponse> {
  const params = new URLSearchParams({ dataInicio, dataFim });
  return backendFetch<FinanceiroResponse>(`/financeiro?${params.toString()}`);
}

/** GET /financeiro/:id (idAgendamento) — 404 (via BackendRequestError.status) se o registro não pertencer ao usuário. */
export function getPagamento(idAgendamento: string): Promise<Pagamento> {
  return backendFetch<Pagamento>(`/financeiro/${encodeURIComponent(idAgendamento)}`);
}

/**
 * GET /comunicacao?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD — nunca envia id_empresa; o
 * backend resolve a empresa/perfil/profissional sozinho a partir do token.
 */
export function getComunicacoes(dataInicio: string, dataFim: string): Promise<ComunicacaoResponse> {
  const params = new URLSearchParams({ dataInicio, dataFim });
  return backendFetch<ComunicacaoResponse>(`/comunicacao?${params.toString()}`);
}

/** GET /comunicacao/:id — 404 (via BackendRequestError.status) se o registro não pertencer ao usuário. */
export function getComunicacao(idComunicacao: string): Promise<ComunicacaoItem> {
  return backendFetch<ComunicacaoItem>(`/comunicacao/${encodeURIComponent(idComunicacao)}`);
}

/**
 * GET /relatorios?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD (ambos obrigatórios) — nunca
 * envia id_empresa; o backend resolve a empresa/perfil/profissional sozinho a partir do token.
 */
export function getRelatorios(dataInicio: string, dataFim: string): Promise<RelatoriosResponse> {
  const params = new URLSearchParams({ dataInicio, dataFim });
  return backendFetch<RelatoriosResponse>(`/relatorios?${params.toString()}`);
}

/**
 * GET /configuracoes — nunca envia id_empresa; o backend resolve a empresa sozinho a
 * partir do token. Restrito a owner no backend (403 para qualquer outro perfil, via
 * BackendRequestError.status).
 */
export function getConfiguracoes(): Promise<ConfiguracoesEmpresa> {
  return backendFetch<ConfiguracoesEmpresa>("/configuracoes");
}

/**
 * GET /ia — nunca envia id_empresa; o backend resolve a empresa sozinho a partir do
 * token. Restrito a owner no backend (403 para qualquer outro perfil, via
 * BackendRequestError.status).
 */
export function getIa(): Promise<IaConfiguracao> {
  return backendFetch<IaConfiguracao>("/ia");
}
