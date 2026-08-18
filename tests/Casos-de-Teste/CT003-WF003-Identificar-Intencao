# CT003 — WF003 — ATD - Identificar Intenção

**Objetivo:** Validar a normalização e o roteamento de intenção para o subworkflow correto.

## Rastreabilidade

- **Workflow:** WF003
- **RF/RNF:** RF008, RF009, RF011, RF012 (orquestração)
- **Caso de Uso:** UC001–UC004 (orquestração)
- **User Story:** US001–US004 (orquestração)
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- Payload de saída do WF002 disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | AGENDAR | Enviar intenção de agendamento. | Roteia para WF005. | ☐ |
| 2 | CONSULTAR_DISPONIBILIDADE | Enviar intenção de consulta. | Roteia para WF004. | ☐ |
| 3 | REAGENDAR | Enviar intenção de reagendamento. | Roteia para WF006. | ☐ |
| 4 | CANCELAR | Enviar intenção de cancelamento. | Roteia para WF007. | ☐ |
| 5 | OUTRO/fallback | Enviar intenção não mapeada. | Roteia para WF012. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

