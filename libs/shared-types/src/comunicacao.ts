/**
 * Contrato de GET /comunicacao e GET /comunicacao/:id (backend NestJS).
 *
 * Schema real confirmado nos workflows n8n (COM-WF012-confirmacao.json,
 * COM-WF013-lembrete.json, COM-WF014-pesquisa.json, COM-WF015-follow-up.json,
 * FIN-WF011-cobranca.json — auditados só como referência, não alterados):
 *
 * - MENSAGENS (log genérico de envio, escrito por COM-WF012 — que também é chamado como
 *   sub-workflow de envio por WF013/WF014/WF015/FIN-WF011): ID_MENSAGEM, ID_EMPRESA,
 *   ID_CLIENTE, ID_AGENDAMENTO, WHATSAPP_MESSAGE_ID, DATA_HORA, TELEFONE, DIRECAO,
 *   TIPO_MENSAGEM, MENSAGEM, INTENCAO, CONFIANCA, STATUS_PROCESSAMENTO, ERRO, PROCESSADO.
 *   STATUS_PROCESSAMENTO ∈ {'ENVIADA','ERRO_WHATSAPP','ERRO_VALIDACAO'}.
 * - LEMBRETES: ID_LEMBRETE, ID_EMPRESA, ID_AGENDAMENTO, ID_CLIENTE, TIPO_LEMBRETE
 *   ('LEMBRETE_24H'|'LEMBRETE_2H'), TELEFONE, STATUS, DATA_HORA, WHATSAPP_MESSAGE_ID,
 *   OBSERVACOES. STATUS ∈ {'ENVIADO','FALHA'}.
 * - PESQUISAS: ID_PESQUISA, ID_EMPRESA, ID_AGENDAMENTO, ID_CLIENTE, TELEFONE, STATUS,
 *   NOTA, COMENTARIO, DATA_HORA, WHATSAPP_MESSAGE_ID, OBSERVACOES. STATUS ∈
 *   {'ENVIADA','FALHA'}. NOTA/COMENTARIO são sempre gravados vazios por COM-WF014 (só
 *   envia a pesquisa; não há workflow auditado que processe a resposta do cliente) — por
 *   isso não fazem parte deste contrato (ver decisão na seção 24 do relatório do módulo).
 * - FOLLOWUPS: ID_FOLLOWUP, ID_EMPRESA, ID_CLIENTE, TELEFONE, ULTIMO_ATENDIMENTO,
 *   TENTATIVA, STATUS, DATA_HORA, WHATSAPP_MESSAGE_ID, OBSERVACOES. STATUS ∈
 *   {'ENVIADO','FALHA'}. Sem ID_AGENDAMENTO/vínculo de profissional no schema real — é
 *   sobre reengajamento do cliente, não um atendimento específico.
 * - COBRANCAS (FIN-WF011): ID_COBRANCA, ID_EMPRESA, ID_PAGAMENTO, ID_AGENDAMENTO,
 *   ID_CLIENTE, TELEFONE, VALOR_PENDENTE, TENTATIVA, STATUS, DATA_HORA,
 *   WHATSAPP_MESSAGE_ID, OBSERVACOES. STATUS ∈ {'ENVIADA','FALHA'}.
 *
 * Nas 5 fontes o vocabulário real de status é sempre binário (envio bem-sucedido vs.
 * falha), gravado só DEPOIS da tentativa de envio — não existe PENDENTE/ENTREGUE/LIDA em
 * nenhuma aba real (sem webhook de status da Meta integrado nos workflows auditados).
 * Por isso `StatusComunicacao` normaliza só para 'ENVIADA' | 'FALHA', mesmo a grafia
 * variando entre fontes (ENVIADO/ENVIADA conforme concordância de gênero em português).
 */

export type TipoComunicacao =
  | "CONFIRMACAO"
  | "LEMBRETE"
  | "PESQUISA"
  | "FOLLOWUP"
  | "COBRANCA"
  | "OUTRO";

/** Normalizado a partir de ENVIADA/ENVIADO/FALHA das 5 fontes reais — ver comentário acima. */
export type StatusComunicacao = "ENVIADA" | "FALHA";

export interface ComunicacaoItem {
  idComunicacao: string;
  tipo: TipoComunicacao;
  clienteNome: string;
  telefone: string;
  /** ISO 8601 — frontend formata em pt-BR. */
  dataHora: string;
  mensagem: string | null;
  status: StatusComunicacao;
  idAgendamento: string | null;
  /**
   * null quando o tipo não tem vínculo seguro com um profissional específico (hoje, só
   * FOLLOWUP — reengajamento de cliente, sem ID_AGENDAMENTO no schema real). Nos demais
   * tipos, vem do mesmo agendamento referenciado por idAgendamento.
   */
  profissionalNome: string | null;
  /** Só populado para tipo COBRANCA (COBRANCAS.VALOR_PENDENTE) — nunca recalculado aqui; Financeiro continua a fonte funcional do pagamento. */
  valorRelacionado: number | null;
}

export interface ComunicacaoResumo {
  totalPeriodo: number;
  enviadas: number;
  comFalha: number;
}

export interface ComunicacaoResponse {
  resumo: ComunicacaoResumo;
  data: ComunicacaoItem[];
}
