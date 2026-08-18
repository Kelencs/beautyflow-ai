# CT018 — WF018 — ADM - Limpeza

**Objetivo:** Validar retenção exclusiva de LOGS >90 dias com exclusão segura por row_number.

## Rastreabilidade

- **Workflow:** WF018
- **RF/RNF:** RNF009 (parcial); GAP: retenção de 90 dias não está formalizada em RNF
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- LOGS com dados sintéticos antigos/novos.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Logs antigos | Criar registros >90 dias com row_number válido. | Exclui somente os elegíveis. | ☐ |
| 2 | Logs recentes | Criar registros <=90 dias. | Preserva registros. | ☐ |
| 3 | Row inválido | Fornecer item sem row_number numérico. | Não exclui o item. | ☐ |
| 4 | Ordem | Ter múltiplos rows antigos. | Exclusão usa ordem decrescente para evitar deslocamento. | ☐ |
| 5 | Erro parcial | Forçar falha de exclusão. | Consolida quantidade de falhas e retorna erro apropriado. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
