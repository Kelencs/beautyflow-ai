# CT009 — WF009 — CLI - Atualizar Cliente

**Objetivo:** Validar atualização parcial de cliente e tratamento correto de cliente inexistente/erro.

## Rastreabilidade

- **Workflow:** WF009
- **RF/RNF:** RF004
- **Caso de Uso:** UC009
- **User Story:** US009
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- Cliente sintético cadastrado.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Um campo | Atualizar apenas nome. | Demais dados atuais são preservados. | ☐ |
| 2 | Vários campos | Atualizar conjunto permitido. | Campos informados são persistidos. | ☐ |
| 3 | Cliente inexistente | Usar identificador não localizado. | Retorna `CLIENTE_NAO_ENCONTRADO`. | ☐ |
| 4 | Erro Sheets | Forçar falha de busca/atualização. | Retorna `ERRO_ATUALIZACAO`. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

