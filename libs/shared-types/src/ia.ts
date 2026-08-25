/**
 * Contrato de GET /ia (backend NestJS).
 *
 * Auditoria (ATD-WF001-receber-whatsapp.json, ATD-WF002-ia-atendimento.json,
 * ATD-WF003-identificar-intencao.json — só leitura, nenhum workflow foi alterado):
 *
 * - WF001 recebe o webhook do WhatsApp, normaliza o payload e chama WF002 diretamente —
 *   não grava nada em planilha.
 * - WF002 é quem de fato usa IA: busca o cliente (CLIENTES), busca o contexto de
 *   conversa ativo do cliente em IA_MEMORIA (filtro ID_EMPRESA+ID_CLIENTE+STATUS='ATIVO'
 *   +TIPO='CONTEXTO_CONVERSA', só o campo VALOR é usado), monta um único prompt (sem
 *   prompt de sistema separado) e chama o modelo Gemini configurado
 *   (`models/gemini-3-flash-preview`, node "Message a model",
 *   `@n8n/n8n-nodes-langchain.googleGemini`, saída JSON forçada). O modelo devolve
 *   `intencao`, `confianca`, dados do agendamento e a resposta ao cliente. WF002 grava
 *   tudo em MENSAGENS (DIRECAO='RECEBIDA', STATUS_PROCESSAMENTO='OK' sempre — não existe
 *   nenhum branch de erro implementado hoje nesses 3 workflows) e NUNCA escreve em
 *   IA_MEMORIA (só lê).
 * - WF003 é um roteador puro (sem IA, sem Google Sheets): normaliza `intencao` para
 *   maiúsculas (default 'OUTRO' se vazio) e despacha por Switch com 4 branches reais:
 *   AGENDAR, CONSULTAR_DISPONIBILIDADE, REAGENDAR, CANCELAR — qualquer outro valor
 *   (inclusive 'OUTRO') cai no fallback do Switch.
 * - CONFIANCA é um valor real, autodeclarado pelo próprio modelo no JSON de resposta
 *   (`Number(p.confianca||0)`), nunca calibrado/validado externamente — por isso nunca é
 *   tratado aqui como "precisão da IA" nem agregado num percentual de acerto; aparece só
 *   por interação, nunca como métrica de resumo.
 * - STATUS_PROCESSAMENTO só tem um valor real hoje ('OK') — não existe 'ERRO'/'FALHA'
 *   gravado por nenhum node destes 3 workflows. `StatusProcessamentoIa` reflete isso.
 *
 * Nada aqui expõe prompt de sistema, API key, secrets ou payload técnico da Meta/Gemini.
 * `IaInteracao.previewMensagem` é uma prévia curta truncada no BACKEND (nunca a
 * mensagem completa) — minimização de dados: o navegador nunca recebe o texto integral
 * da mensagem do cliente, mesmo que a UI só precise mostrar um trecho curto.
 */

/**
 * "PREPARADA" (nunca "conectada"/"online"/"funcionando"): não existe health-check real
 * nesta etapa — nenhuma chamada ao Gemini acontece a partir deste contrato. EMP002 é
 * mockado como 'NAO_CONFIGURADA' para provar isolamento multi-tenant e por coerência com
 * uma limitação real encontrada na auditoria: WF001 hoje tem `id_empresa: 'EMP001'`
 * fixo no código (não deriva do payload do WhatsApp) — outras empresas não têm o fluxo
 * de IA operacional no sistema real hoje mesmo.
 */
export type IaStatus = 'PREPARADA' | 'NAO_CONFIGURADA';

export type IaIntencaoCodigo = 'AGENDAR' | 'CONSULTAR_DISPONIBILIDADE' | 'REAGENDAR' | 'CANCELAR' | 'OUTRO';

export interface IaIntencao {
  codigo: IaIntencaoCodigo;
  nome: string;
  descricao: string;
}

/** Único valor real observado nos 3 workflows auditados — ver comentário acima. */
export type StatusProcessamentoIa = 'PROCESSADA';

export interface IaInteracao {
  idInteracao: string;
  clienteNome: string;
  /** ISO 8601 — frontend formata em pt-BR. */
  dataHora: string;
  intencao: IaIntencaoCodigo;
  status: StatusProcessamentoIa;
  /** 0..1, autodeclarado pelo modelo (MENSAGENS.CONFIANCA real) — nunca "precisão". */
  confianca: number;
  /**
   * Prévia curta da mensagem do cliente, já truncada pelo BACKEND (minimização de
   * dados — a mensagem completa nunca sai por este endpoint, nem para ser truncada só
   * visualmente no frontend). Ver `criarPreviewMensagem` em
   * backend/src/ia/ia-mensagem.util.ts.
   */
  previewMensagem: string;
}

export interface IaResumo {
  status: IaStatus;
  /** Valor real do node Gemini de WF002 (ex.: "models/gemini-3-flash-preview"). */
  modelo: string;
  totalInteracoes: number;
  interacoesHoje: number;
  clientesComMemoriaAtiva: number;
}

/**
 * Resumo do prompt real de WF002 (nunca o texto completo) — `tom`/`idioma` descrevem o
 * comportamento observado no prompt único do workflow, não campos separadamente
 * configuráveis nele (por isso não são editáveis nesta etapa, ver relatório do módulo).
 */
export interface IaComportamento {
  descricaoGeral: string;
  tom: string;
  idioma: string;
  usaMemoria: boolean;
}

export interface IaCapacidade {
  titulo: string;
  descricao: string;
}

export interface IaMemoriaCliente {
  clienteNome: string;
}

export interface IaMemoria {
  descricao: string;
  clientes: IaMemoriaCliente[];
}

export interface IaConfiguracao {
  resumo: IaResumo;
  comportamento: IaComportamento;
  capacidades: IaCapacidade[];
  intencoes: IaIntencao[];
  memoria: IaMemoria;
  interacoesRecentes: IaInteracao[];
}
