# CT007 — WF007 — AGE - Cancelar Agendamento

**Objetivo:** Validar cancelamento respeitando janela e atualização de Calendar/Sheets.

## Rastreabilidade

- **Workflow:** WF007
- **RF/RNF:** RF012, RF016
- **Caso de Uso:** UC004
- **User Story:** US004
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- Agendamento sintético existente.
- EMPRESAS e Calendar configurados.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Cancelamento válido | Cancelar dentro da janela permitida. | Status `CANCELADO`, motivo/data persistidos e comunicação preparada. | ☐ |
| 2 | Fora da janela | Cancelar após limite configurado. | Bloqueia automaticamente. | ☐ |
| 3 | Agendamento não encontrado | Usar ID/cliente inexistente. | Retorna estado de não encontrado sem atualização. | ☐ |
| 4 | Erro externo | Forçar erro Calendar/Sheets. | Retorna erro técnico preservando contexto. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

