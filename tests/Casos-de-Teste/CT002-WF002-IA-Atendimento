# CT002 — WF002 — ATD - IA Atendimento

**Objetivo:** Validar atendimento por IA, identificação/cadastro do cliente, contexto e encaminhamento para WF003.

## Rastreabilidade

- **Workflow:** WF002
- **RF/RNF:** RF002, RF003, RF005, RF006, RF007, RF020
- **Caso de Uso:** UC005, UC008
- **User Story:** US005, US008
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- WF002 importado e credenciais Gemini/Sheets configuradas.
- Dados sintéticos de cliente disponíveis.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Cliente existente | Executar com telefone cadastrado e mensagem válida. | Cliente é resolvido e contexto segue para a IA. | ☐ |
| 2 | Cliente novo | Executar com telefone não cadastrado. | Fluxo pode acionar WF008 e continuar com o cliente criado. | ☐ |
| 3 | Gemini válido | Fornecer mensagem com intenção reconhecível. | Resposta estruturada é interpretada e enviada ao WF003. | ☐ |
| 4 | Erro de IA/retorno inválido | Forçar erro ou resposta inesperada. | Fluxo retorna/trata erro sem criar efeito incorreto. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

