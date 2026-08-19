# CT015 — WF015 — COM - Follow-up

**Objetivo:** Validar follow-up por inatividade, marketing, agendamento futuro, idempotência e correlação multi-item.

## Rastreabilidade

- **Workflow:** WF015
- **RF/RNF:** RF019 (parcialmente relacionado)
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado em rodada posterior ao relatório de 14/08

## Pré-condições

- EMPRESAS/CLIENTES/AGENDAMENTOS/FOLLOWUPS disponíveis.
- WF012 e WF017 disponíveis.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Tentativa 1 | Cliente ativo/marketing SIM, 30–33 dias sem atendimento. | Produz follow-up tentativa 1. | ☐ |
| 2 | Tentativa 2 | Cliente elegível, 45–48 dias. | Produz tentativa 2. | ☐ |
| 3 | Agendamento futuro | Cliente possui futuro não cancelado. | Bloqueia follow-up. | ☐ |
| 4 | Já enviado | Follow-up do mesmo ciclo/tentativa enviado. | Não duplica. | ☐ |
| 5 | Erro busca | Forçar falha Sheets. | Retorna `ERRO_FOLLOWUP` sem envio. | ☐ |
| 6 | Falha global de registro | Forçar erro sem pairedItem com múltiplos candidatos. | Faz fan-out dos erros preservando cada cliente. | ☐ |
| 7 | Regressão multi-run | Executar repetidamente com dois itens. | Não mistura candidatos entre runs. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
