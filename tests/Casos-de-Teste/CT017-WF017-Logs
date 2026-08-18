# CT017 — WF017 — ADM - Logs

**Objetivo:** Validar criação de logs e tratamento de falha sem recursão.

## Rastreabilidade

- **Workflow:** WF017
- **RF/RNF:** RNF003, RNF009
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- Aba LOGS disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Log válido | Enviar contexto completo. | Cria ID LOG, timestamp e retorna `log_registrado=true`. | ☐ |
| 2 | Campos opcionais | Omitir dados não obrigatórios. | Aplica defaults previstos. | ☐ |
| 3 | Falha Sheets | Forçar erro de gravação. | Retorna falha ao chamador sem chamar WF017 novamente. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
