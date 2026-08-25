/**
 * Contrato de GET /servicos e GET /servicos/:id (backend NestJS). Mesmo espírito de
 * agenda.ts/clientes.ts: camelCase, sem ids internos de tenant.
 *
 * Schema real da aba SERVICOS (confirmado nos workflows n8n existentes — AGE-WF004/005/
 * 006/007): ID_EMPRESA, ID_SERVICO, NOME, STATUS, DURACAO_MIN, VALOR, e também
 * TEMPO_INTERVALO_MIN (intervalo/buffer entre atendimentos, usado só no cálculo de
 * disponibilidade do WF004 — não faz parte deste contrato porque não foi pedido e não é
 * um dado de catálogo exibido ao usuário). Não existe coluna de descrição na planilha
 * real hoje; `descricao` aqui é um campo do domínio já preparado para quando a aba
 * ganhar essa coluna — nos mocks do backend vem preenchido para dar contexto visual.
 */
export type StatusServico = "ATIVO" | "INATIVO";

export interface Servico {
  idServico: string;
  nome: string;
  descricao: string | null;
  duracaoMinutos: number;
  valor: number;
  status: StatusServico;
}

export interface ServicosResponse {
  data: Servico[];
}
