# CT006 — WF006 — AGE - Reagendar

**Objetivo:** Validar localização, janela, nova disponibilidade e atualização de reagendamento.

## Rastreabilidade

- **Workflow:** WF006
- **RF/RNF:** RF011
- **Caso de Uso:** UC003
- **User Story:** US003
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- Agendamento sintético existente.
- EMPRESAS e Calendar configurados.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Reagendamento válido | Informar novo horário disponível dentro da janela. | Retorna `REAGENDADO` e executa atualizações previstas. | ☐ |
| 2 | Prazo bloqueado | Usar agendamento fora da janela `TEMPO_CANCELAMENTO_MIN`. | Bloqueia antes da atualização. | ☐ |
| 3 | Sem google_event_id | Executar candidato sem ID do evento. | Não atualiza Calendar e devolve bloqueio/tratamento previsto. | ☐ |
| 4 | Novo horário indisponível | Usar slot não retornado pelo WF004. | Não altera agendamento. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

