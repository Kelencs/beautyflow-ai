/**
 * Contrato de GET /financeiro e GET /financeiro/:idAgendamento (backend NestJS).
 *
 * Schema real confirmado nos workflows n8n (FIN-WF010-registrar-pagamento.json,
 * FIN-WF011-cobranca.json — auditados só como referência, não alterados):
 * - PAGAMENTOS: ID_PAGAMENTO, ID_EMPRESA, ID_AGENDAMENTO, ID_CLIENTE, VALOR_TOTAL,
 *   VALOR_PAGO, VALOR_PENDENTE, FORMA_PAGAMENTO, STATUS, DATA_HORA, TRANSACAO_ID,
 *   OBSERVACOES. STATUS só assume 'PARCIAL' ou 'PAGO' nessa aba — nunca 'PENDENTE' nem
 *   'CANCELADO' (ver decisões abaixo).
 * - COBRANCAS (tentativas automáticas de cobrança via WhatsApp, não modelada aqui —
 *   fora do escopo desta etapa): ID_COBRANCA, ID_EMPRESA, ID_PAGAMENTO, ID_AGENDAMENTO,
 *   ID_CLIENTE, TELEFONE, VALOR_PENDENTE, TENTATIVA, STATUS, DATA_HORA,
 *   WHATSAPP_MESSAGE_ID, OBSERVACOES.
 * - PAGAMENTOS é transacional (FIN-WF011, "CODE - Avaliar Cobranças Elegíveis"): cada
 *   pagamento parcial gera uma NOVA linha; linhas antigas continuam com STATUS=PARCIAL
 *   mesmo depois do agendamento ser quitado. O estado financeiro real de um agendamento
 *   é sempre o registro mais recente por ID_AGENDAMENTO, nunca cada linha somada
 *   isoladamente. Os mocks do backend (financeiro.mock-data.ts) já representam
 *   diretamente esse estado mais recente/atual por agendamento — não simulam múltiplas
 *   linhas históricas, porque o objetivo aqui é o contrato de leitura, não recriar a
 *   agregação linha a linha do WF010/WF011.
 */

/**
 * 'PENDENTE' não é um valor real de PAGAMENTOS.STATUS — representa a AUSÊNCIA de
 * qualquer registro em PAGAMENTOS para o agendamento (nenhum pagamento feito ainda).
 * 'CANCELADO' foi deliberadamente OMITIDO: não existe em PAGAMENTOS.STATUS, e o próprio
 * FIN-WF010 bloqueia registrar pagamento para um agendamento com AGENDAMENTOS.STATUS=
 * CANCELADO (evento AGENDAMENTO_CANCELADO) — um agendamento cancelado nunca chega a ter
 * registro financeiro, então não há necessidade de status "cancelado" aqui.
 */
export type StatusPagamento = "PAGO" | "PENDENTE" | "PARCIAL";

/**
 * PAGAMENTOS.FORMA_PAGAMENTO é um campo de texto livre no schema real (sem enum/
 * validação nos workflows) — este enum é uma decisão de domínio para a interface, não
 * uma restrição herdada do schema real (que aceitaria qualquer string).
 */
export type FormaPagamento = "PIX" | "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "OUTRO";

export interface Pagamento {
  idAgendamento: string;
  /** null quando status = PENDENTE (nenhuma linha em PAGAMENTOS existe ainda). */
  idPagamento: string | null;
  clienteNome: string;
  servicoNome: string;
  profissionalNome: string;
  /** Data do agendamento, formato ISO "YYYY-MM-DD". */
  data: string;
  valorAgendamento: number;
  valorPago: number;
  valorPendente: number;
  /** null quando status = PENDENTE. */
  formaPagamento: FormaPagamento | null;
  status: StatusPagamento;
}

export interface FinanceiroResumo {
  /** Soma de valorPago dos registros no período/filtro considerado. */
  recebido: number;
  /** Soma de valorPendente dos registros no período/filtro considerado. */
  pendente: number;
  /** Soma de valorAgendamento dos registros no período/filtro considerado. */
  totalPrevisto: number;
  /** Quantidade de registros no período/filtro considerado. */
  totalPagamentos: number;
}

export interface FinanceiroResponse {
  resumo: FinanceiroResumo;
  data: Pagamento[];
}
