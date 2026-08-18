# Success Metrics

> Métricas são metas de produto; não representam resultados já medidos.

| Métrica | Definição | Meta inicial |
|---|---|---|
| Conversão | atendimentos de intenção de agenda que viram agendamento | estabelecer baseline |
| Taxa de falha técnica | execuções com erro técnico / total | < 2% no ambiente controlado |
| Duplicidade | efeitos duplicados indevidos | 0 em fluxos idempotentes |
| Lembretes | lembretes elegíveis processados corretamente | > 98% em ambiente estável |
| Cobranças indevidas | cobrança de item já quitado | 0 |
| Pesquisa duplicada | segunda pesquisa enviada para mesma chave de idempotência | 0 |
| Follow-up indevido | envio sem consentimento/agendamento futuro | 0 |
| Disponibilidade do App | componentes controlados pela plataforma | alvo inicial 99% após produção |
| Tempo de resposta | operações síncronas principais | medir p50/p95; alvo nominal até 5 s quando não limitado por terceiros |

## Métricas futuras do negócio
- redução de faltas;
- aumento de recorrência;
- ocupação da agenda;
- receita recuperada por cobrança;
- receita/retorno atribuído a follow-up.
