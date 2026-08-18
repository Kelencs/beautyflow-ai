# CT014 — WF014 — COM - Pesquisa

**Objetivo:** Validar pesquisa pós-atendimento de 1h–4h, idempotência e tratamento de erro técnico.

## Rastreabilidade

- **Workflow:** WF014
- **RF/RNF:** GAP: RF específico não existe; relacionado a UC012/US012
- **Caso de Uso:** UC012
- **User Story:** US012
- **Estado de evidência consolidada em 18/08/2026:** 🟡 Parcialmente validado; manter pendência explícita até evidência final

## Pré-condições

- Empresa com WhatsApp configurado.
- Agendamento encerrado e dados relacionados disponíveis.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Elegível | Atendimento terminou entre 1h e 4h. | Envia/registra pesquisa conforme WF012. | ☐ |
| 2 | Fora da janela | Atendimento fora de 1h–4h. | Retorna `AGENDAMENTO_NAO_ELEGIVEL`. | ☐ |
| 3 | Duplicada | Pesquisa `ENVIADA` já existe. | Retorna `PESQUISA_JA_ENVIADA` e não chama WF012. | ☐ |
| 4 | Erro técnico na busca | Forçar erro em PESQUISAS. | Deve retornar `ERRO_PESQUISA`; manter pendente até evidência final se ainda não reexecutado. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
