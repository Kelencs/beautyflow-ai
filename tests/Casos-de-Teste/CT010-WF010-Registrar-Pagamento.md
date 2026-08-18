# CT010 — WF010 — FIN - Registrar Pagamento

**Objetivo:** Validar registro transacional de pagamento, saldo e tratamento de falhas.

## Rastreabilidade

- **Workflow:** WF010
- **RF/RNF:** GAP: requisito financeiro específico não existe em RF001–RF020
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- Agendamento sintético existente.
- PAGAMENTOS disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Pagamento parcial | Registrar valor menor que saldo. | Cria nova linha e calcula `PARCIAL`/pendente. | ☐ |
| 2 | Quitação | Registrar valor que zera saldo. | Estado atual passa a `PAGO`. | ☐ |
| 3 | Valor inválido | Enviar zero, negativo ou não numérico. | Retorna `VALOR_INVALIDO` sem registro. | ☐ |
| 4 | Erro de busca/registro | Forçar falha Sheets. | Retorna erro técnico sem mascaramento. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

