
# CT005 — WF005 — AGE - Criar Agendamento

**Objetivo:** Validar criação de agendamento somente após disponibilidade e persistência nos sistemas externos.

## Rastreabilidade

- **Workflow:** WF005
- **RF/RNF:** RF009, RF010, RF015
- **Caso de Uso:** UC001, UC006
- **User Story:** US001, US006
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- WF004 funcional.
- Calendar e AGENDAMENTOS disponíveis.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Criação | Solicitar horário presente na lista do WF004. | Cria evento, registra AGENDAMENTOS e prepara comunicação. | ☐ |
| 2 | Horário indisponível | Solicitar horário fora da disponibilidade. | Não cria evento nem registro. | ☐ |
| 3 | Falha Calendar | Forçar erro na criação de evento. | Retorna erro técnico; não tratar como indisponibilidade. | ☐ |
| 4 | Falha Sheets após Calendar | Forçar erro no append. | Registrar evidência do comportamento atual e risco de efeito parcial. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
