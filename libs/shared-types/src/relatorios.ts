/**
 * Contrato de GET /relatorios (backend NestJS).
 *
 * Não é um mock próprio: todo indicador aqui é DERIVADO das mesmas respostas que
 * AgendaService/ClientesService/FinanceiroService/ComunicacaoService já produzem para
 * seus próprios módulos (ver relatorios.service.ts) — nunca uma fonte de dados paralela.
 * Isso evita divergência entre, por exemplo, "Financeiro = R$ 630 previsto" e
 * "Relatórios = R$ 900 previsto".
 *
 * Nada aqui é lucro, margem, DRE, despesa, comissão, fluxo de caixa ou imposto — só os
 * três conceitos já aprovados em Financeiro (previsto/recebido/pendente).
 */

export interface RelatorioResumo {
  /** Todos os agendamentos do período, qualquer status. */
  totalAtendimentos: number;
  atendimentosConfirmados: number;
  atendimentosConcluidos: number;
  atendimentosCancelados: number;

  /** Soma de AgendaItem.valor dos agendamentos NÃO cancelados no período (ver decisão documentada em relatorios.service.ts). */
  valorPrevisto: number;
  /** = FinanceiroResumo.recebido do mesmo período (mesma fonte do módulo Financeiro). */
  valorRecebido: number;
  /** = FinanceiroResumo.pendente do mesmo período (mesma fonte do módulo Financeiro). */
  valorPendente: number;

  /** Clientes cujo Cliente.clienteDesde cai dentro do período consultado. */
  clientesNovos: number;

  /** = ComunicacaoResumo.enviadas do mesmo período. */
  comunicacoesEnviadas: number;
  /** = ComunicacaoResumo.comFalha do mesmo período. */
  comunicacoesComFalha: number;

  /** atendimentosConfirmados / totalAtendimentos. 0 quando totalAtendimentos = 0 (nunca null/NaN). */
  taxaConfirmacao: number;
  /** atendimentosCancelados / totalAtendimentos. 0 quando totalAtendimentos = 0 (nunca null/NaN). */
  taxaCancelamento: number;
}

/**
 * Agrupado por NOME (não por id): AgendaItem, a fonte de dados, não expõe idServico no
 * seu contrato público (só servicoNome) — ver auditoria em relatorios.service.ts.
 */
export interface RelatorioServico {
  nome: string;
  /** Quantidade de agendamentos NÃO cancelados no período com este serviço. */
  quantidade: number;
  /** Soma de AgendaItem.valor dos agendamentos NÃO cancelados no período com este serviço. */
  valorPrevisto: number;
}

/**
 * Agrupado por NOME (não por id): AgendaItem não expõe idProfissional no seu contrato
 * público (só profissionalNome). Para um usuário `profissional`, esta lista tem no
 * máximo 1 entrada — a própria, porque AgendaService já filtra por idProfissional antes
 * de chegar aqui (mesmo escopo já usado na Agenda, herdado automaticamente).
 */
export interface RelatorioProfissional {
  nome: string;
  /** Quantidade de agendamentos NÃO cancelados no período com este profissional. */
  quantidadeAtendimentos: number;
  /** Soma de AgendaItem.valor dos agendamentos NÃO cancelados no período com este profissional. */
  valorPrevisto: number;
}

export interface RelatorioSerieTemporal {
  /** ISO "YYYY-MM-DD". */
  data: string;
  /** Agendamentos do dia, qualquer status (mesmo critério de totalAtendimentos). */
  atendimentos: number;
  /** Soma de AgendaItem.valor dos agendamentos NÃO cancelados do dia. */
  valorPrevisto: number;
  /**
   * Soma de Pagamento.valorPago do dia. Usa a MESMA data do eixo (Pagamento.data, que no
   * contrato do Financeiro já representa a data do AGENDAMENTO — não existe uma data de
   * pagamento separada exposta publicamente, ver financeiro.ts). Por isso não há
   * ambiguidade entre "data do atendimento" e "data do pagamento" aqui: as duas colunas
   * desta série sempre se referem ao mesmo dia de agendamento.
   */
  valorRecebido: number;
}

export interface RelatoriosResponse {
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  resumo: RelatorioResumo;
  /** Top 5 por quantidade, maior primeiro. Pode vir com menos de 5 itens (nunca preenchido artificialmente). */
  servicosMaisRealizados: RelatorioServico[];
  /** Top 5 por quantidade, maior primeiro. Pode vir com menos de 5 itens (nunca preenchido artificialmente). */
  desempenhoProfissionais: RelatorioProfissional[];
  /** Uma entrada por dia do período, em ordem cronológica — inclusive dias sem nenhum agendamento (zerados). */
  serieTemporal: RelatorioSerieTemporal[];
}
