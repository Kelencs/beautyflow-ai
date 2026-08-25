import type { Pagamento } from '@beautyflow/shared-types';

/**
 * PAGAMENTOS é transacional no schema real (ver comentário em libs/shared-types/src/
 * financeiro.ts): mais de uma linha pode existir para o mesmo ID_AGENDAMENTO. Consolidar
 * por idAgendamento garante que NUNCA somamos duas linhas do mesmo agendamento como se
 * fossem dois atendimentos financeiros independentes.
 *
 * REGRA REAL (auditada em FIN-WF010/FIN-WF011): o registro válido é o mais recente por
 * DATA_HORA. Este `dataHoraPorPagamento` (opcional, chave = Pagamento.idPagamento) é
 * fornecido por FinanceiroService.obterDataHoraPorPagamento — um timestamp interno do
 * mock, nunca exposto no contrato público `Pagamento`. Quando ambos os registros em
 * disputa têm um timestamp conhecido, vence o mais recente.
 *
 * "Última posição do array" é usada SOMENTE como fallback quando não há timestamp
 * disponível para comparar (ex.: chamadores que não passam `dataHoraPorPagamento`, como
 * os testes unitários deste arquivo com dados sintéticos). Isso é uma limitação do MOCK
 * atual, não uma regra de produção — a ordem do array nunca é autoridade; quando o
 * contrato/fonte real tiver DATA_HORA sempre disponível, o fallback deixa de ser
 * exercitado.
 */
export function consolidarPagamentosPorAgendamento(
  pagamentos: Pagamento[],
  dataHoraPorPagamento?: ReadonlyMap<string, string>,
): Map<string, Pagamento> {
  const porAgendamento = new Map<string, Pagamento>();

  for (const pagamento of pagamentos) {
    const existente = porAgendamento.get(pagamento.idAgendamento);
    if (!existente) {
      porAgendamento.set(pagamento.idAgendamento, pagamento);
      continue;
    }

    const dataHoraExistente = existente.idPagamento
      ? dataHoraPorPagamento?.get(existente.idPagamento)
      : undefined;
    const dataHoraNovo = pagamento.idPagamento
      ? dataHoraPorPagamento?.get(pagamento.idPagamento)
      : undefined;

    if (dataHoraNovo !== undefined && dataHoraExistente !== undefined) {
      // Regra real: DATA_HORA mais recente vence (comparação ISO 8601 lexicográfica é
      // válida aqui porque todos os timestamps do mock usam o mesmo formato/offset).
      if (dataHoraNovo >= dataHoraExistente) {
        porAgendamento.set(pagamento.idAgendamento, pagamento);
      }
    } else {
      // Fallback do mock atual (ver cabeçalho): sem os dois timestamps para comparar,
      // mantém o comportamento histórico — última ocorrência no array vence.
      porAgendamento.set(pagamento.idAgendamento, pagamento);
    }
  }

  return porAgendamento;
}

/**
 * Restringe os pagamentos ao universo de atendimentos realmente considerado pelo
 * relatório (tipicamente a Agenda do mesmo período) — remove referências ÓRFÃS: registros
 * do Financeiro cujo idAgendamento não corresponde a nenhum agendamento existente nesse
 * universo. Sem este filtro, um registro financeiro sem contrapartida na Agenda infla
 * valorRecebido/valorPendente além do que valorPrevisto/totalAtendimentos (derivados só
 * da Agenda) sustentam — foi a causa raiz da divergência de R$ 120 diagnosticada em
 * Relatórios antes desta proteção existir. A integridade dos mocks foi corrigida
 * separadamente (todo idAgendamento usado por Financeiro/Comunicação agora tem
 * contrapartida em agenda.mock-data.ts) — esta função permanece como proteção
 * defensiva, não como remendo para um mock incompleto.
 *
 * Aplica a consolidação por idAgendamento primeiro (nunca soma duas linhas do mesmo
 * agendamento), depois filtra pelos ids válidos.
 */
export function filtrarPagamentosDoUniverso(
  pagamentos: Pagamento[],
  idsAgendamentoValidos: ReadonlySet<string>,
  dataHoraPorPagamento?: ReadonlyMap<string, string>,
): Pagamento[] {
  const consolidados = consolidarPagamentosPorAgendamento(pagamentos, dataHoraPorPagamento);
  return Array.from(consolidados.values()).filter((pagamento) =>
    idsAgendamentoValidos.has(pagamento.idAgendamento),
  );
}
