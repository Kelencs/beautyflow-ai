# WF001 — ATD - WF001 - Receber WhatsApp

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ATD-WF001-receber-whatsapp.json`](../../workflows/atendimento/ATD-WF001-receber-whatsapp.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Receber eventos da WhatsApp Cloud API, responder ao endpoint de challenge usado na configuração do webhook e encaminhar mensagens válidas para o atendimento com IA.

## 2. Identificação técnica

- **Workflow:** `ATD - WF001 - Receber WhatsApp`
- **ID funcional:** `WF001`
- **Arquivo JSON:** `ATD-WF001-receber-whatsapp.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** Dois Webhooks públicos no caminho `beautyflow-whatsapp`: GET para o challenge da Meta e POST para recebimento de eventos do WhatsApp.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- GET: query string recebida pela verificação da Meta; o node de resposta utiliza `hub.challenge`.
- POST: payload da WhatsApp Cloud API no formato `entry[0].changes[0].value`, incluindo `messages`, `contacts` e `metadata` quando presentes.

## 4. Fluxo real do workflow

1. `Webhook - Validar Meta` recebe GET e encaminha para `RESP - Challenge Meta`.
2. `RESP - Challenge Meta` devolve HTTP 200 em texto com `hub.challenge` ou string vazia.
3. `Webhook - Receber WhatsApp` recebe POST e responde imediatamente com `{"status":"EVENT_RECEIVED"}`.
4. `CODE - Normalizar Payload` extrai a primeira mensagem, contato e metadados do evento.
5. Quando existe mensagem, normaliza telefone, nome, tipo, texto, timestamp e `phone_number_id`; o JSON atual atribui `id_empresa = EMP001`.
6. `IF - Evento Válido` impede o encaminhamento quando o evento não contém mensagem.
7. Eventos válidos são enviados para `EXEC - WF002 - IA Atendimento`.

## 5. Regras e decisões implementadas

- Apenas a primeira mensagem do primeiro `entry/change` é tratada pela normalização atual.
- `telefone_cliente` é normalizado para dígitos.
- `nome_cliente` usa `Cliente` quando o contato não fornece nome.
- `mensagem_texto` é preenchida a partir de `text.body` quando o tipo é texto.
- Eventos sem mensagem são marcados como `evento_valido = false` e não seguem para o WF002.
- O GET atual responde ao challenge, mas o JSON exportado **não possui condição explícita que compare `hub.verify_token` ou `hub.mode`** antes da resposta.
- O identificador de empresa está fixado como `EMP001` na normalização do POST.

## 6. Integrações e dependências

- WhatsApp Cloud API / Meta (Webhook).
- WF002 — IA Atendimento.

## 7. Saídas e estados

- GET: challenge em texto com HTTP 200.
- POST: resposta de recebimento `EVENT_RECEIVED`; internamente, item normalizado enviado ao WF002 quando válido.

## 8. Tratamento de erros e bloqueios

- Payload sem mensagem é tratado como evento inválido, sem chamada ao WF002.
- O JSON não implementa um ramo explícito de HTTP 403 para token de verificação incorreto.

## 9. Observações do JSON atual

- Não há chamada direta ao WF017 neste workflow.
- Não há Google Sheets neste workflow.

## 10. Critério de manutenção desta documentação

Sempre que `ATD-WF001-receber-whatsapp.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
