/**
 * Contrato de GET /clientes e GET /clientes/:id (backend NestJS). Mesmo espírito de
 * agenda.ts: nomes de campo em camelCase, sem ids internos de tenant (idEmpresa nunca
 * aparece aqui — existe só nos mocks do backend, para filtragem).
 */
export type StatusCliente = "ATIVO" | "INATIVO";

export interface Cliente {
  idCliente: string;
  nome: string;
  telefone: string;
  email: string | null;
  /** Data no formato ISO "YYYY-MM-DD". */
  dataNascimento: string | null;
  status: StatusCliente;
  /** Data no formato ISO "YYYY-MM-DD". */
  clienteDesde: string;
  /** Data no formato ISO "YYYY-MM-DD". */
  ultimoAtendimento: string | null;
  /**
   * Data no formato ISO "YYYY-MM-DD". `null` tem dois significados possíveis, que a UI
   * não precisa (nem consegue) distinguir hoje: "não há próximo atendimento agendado" OU
   * "esta fonte de dados ainda não sabe calcular isso" (ex.: fonte n8n, que hoje só lê a
   * aba CLIENTES, sem cruzar com AGENDAMENTOS — ver clientes.service.ts). Em modo mock,
   * `null` sempre significa o primeiro caso.
   */
  proximoAtendimento: string | null;
  /**
   * `null` quando a fonte de dados atual ainda não consegue calcular este valor (ex.:
   * fonte n8n, que hoje só lê a aba CLIENTES — dependeria de AGENDAMENTOS, não integrado
   * nesta fase). Nunca confundir com `0`: `0` significa "sabemos que não houve nenhum
   * atendimento"; `null` significa "não sabemos ainda". Em modo mock, sempre um número
   * real. Nunca renderizar `null` como "0" na UI.
   */
  totalAtendimentos: number | null;
  /**
   * Mesma semântica de `totalAtendimentos`: `null` = "ainda não calculável pela fonte
   * atual" (dependeria de PAGAMENTOS/Financeiro), nunca "R$ 0,00 confirmado". Em modo
   * mock, sempre um número real.
   */
  totalGasto: number | null;
  observacoes: string | null;
}

export interface ClientesResponse {
  data: Cliente[];
}

export interface ClienteHistoricoItem {
  /** Data no formato ISO "YYYY-MM-DD". */
  data: string;
  servicoNome: string;
  valor: number;
}

export interface ClienteDetalhado extends Cliente {
  /**
   * `null` quando a fonte de dados atual não consegue fornecer histórico (ex.: fonte
   * n8n, que dependeria de AGENDAMENTOS — não integrado nesta fase). Diferente de `[]`,
   * que significa "sabemos que este cliente não tem nenhum atendimento no histórico". Em
   * modo mock, sempre um array (possivelmente vazio, mas conhecido).
   */
  historico: ClienteHistoricoItem[] | null;
}
