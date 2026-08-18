# CT011 — WF011 — FIN - Cobrança

**Objetivo:** Validar cobrança automática com consolidação do último estado financeiro, janela, 24h e limite de tentativas.

## Rastreabilidade

- **Workflow:** WF011
- **RF/RNF:** GAP: requisito de cobrança não existe em RF001–RF020
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- EMPRESAS/PAGAMENTOS/COBRANCAS/CLIENTES disponíveis.
- WF012 disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Saldo pendente | Último pagamento = PARCIAL, dentro da janela, sem cobrança recente. | Uma cobrança elegível é produzida. | ☐ |
| 2 | Já quitado | Histórico PARCIAL seguido por PAGO. | Retorna `PAGAMENTO_JA_QUITADO`. | ☐ |
| 3 | Cobrança recente | Última cobrança <24h. | Retorna `COBRANCA_RECENTE`. | ☐ |
| 4 | Limite | Três tentativas existentes. | Retorna `LIMITE_COBRANCAS_ATINGIDO`. | ☐ |
| 5 | Múltiplos itens | Dois agendamentos elegíveis. | Dados não se misturam entre itens. | ☐ |
| 6 | Erro técnico | Forçar falha em busca ou registro. | Retorna `ERRO_COBRANCA` preservando correlação. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
