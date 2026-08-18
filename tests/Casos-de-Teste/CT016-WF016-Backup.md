# CT016 — WF016 — ADM - Backup

**Objetivo:** Validar cópia integral da planilha no Drive e retenção de backups >30 dias.

## Rastreabilidade

- **Workflow:** WF016
- **RF/RNF:** RNF004
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- Drive de teste configurado.
- Planilha origem disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Backup | Executar rotina. | Cria cópia com nome datado e retorna `BACKUP_CONCLUIDO`. | ☐ |
| 2 | Retenção | Disponibilizar backup elegível >30 dias. | Remove somente backup compatível. | ☐ |
| 3 | Falha na listagem/limpeza | Forçar erro após a cópia. | Retorna `SUCESSO_PARCIAL` quando aplicável. | ☐ |
| 4 | Falha na cópia | Forçar erro do Drive. | Retorna `ERRO_BACKUP`. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
