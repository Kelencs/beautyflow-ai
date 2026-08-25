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
  /** Data no formato ISO "YYYY-MM-DD". */
  proximoAtendimento: string | null;
  totalAtendimentos: number;
  totalGasto: number;
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
  historico: ClienteHistoricoItem[];
}
