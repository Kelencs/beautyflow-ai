# CT001 — WF001 — ATD - Receber WhatsApp

**Objetivo:** Validar os endpoints do webhook WhatsApp e o encaminhamento da mensagem recebida conforme o JSON atual.

## Rastreabilidade

- **Workflow:** WF001
- **RF/RNF:** RF001
- **Caso de Uso:** —
- **User Story:** —
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- Webhook do n8n acessível no ambiente de teste.
- Configuração Meta apontando para a URL correta.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Verificação GET | Enviar requisição de verificação com `hub.challenge`. | Resposta do endpoint conforme configuração atual do WF001. | ☐ |
| 2 | Mensagem POST válida | Enviar payload Meta compatível. | Workflow extrai/normaliza o evento e encaminha o processamento previsto. | ☐ |
| 3 | Payload inesperado | Enviar payload sem mensagem útil. | Workflow não deve produzir efeitos de negócio indevidos. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
