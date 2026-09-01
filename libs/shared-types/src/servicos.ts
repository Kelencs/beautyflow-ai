/**
 * Contrato de GET /servicos e GET /servicos/:id (backend NestJS). Mesmo espírito de
 * agenda.ts/clientes.ts: camelCase, sem ids internos de tenant.
 *
 * Schema real da aba SERVICOS (confirmado diretamente pela planilha): ID_SERVICO,
 * ID_EMPRESA, NOME, CATEGORIA, DESCRICAO, DURACAO_MIN, TEMPO_INTERVALO_MIN, VALOR,
 * STATUS, DATA_CADASTRO, ULTIMA_ATUALIZACAO.
 *
 * `descricao` **existe** na planilha real (`DESCRICAO`) — uma premissa anterior deste
 * projeto de que a coluna não existia estava errada e foi corrigida; o valor vem
 * normalizado (trim, vazio/ausente vira `null`) via APP-WF019 quando a fonte é `n8n`.
 *
 * `CATEGORIA`, `TEMPO_INTERVALO_MIN` (intervalo/buffer entre atendimentos, usado só no
 * cálculo de disponibilidade do WF004), `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem
 * na planilha mas **não fazem parte deste contrato** — decisão de escopo (não foram
 * pedidos como dado de catálogo exibido ao usuário), não um gap a corrigir. Adicioná-los
 * ao contrato público é decisão de produto para uma fase futura, não desta tarefa.
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
