# WF012 — COM - WF012 - Confirmação

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`COM-WF012-confirmacao.json`](../../workflows/comunicacao/COM-WF012-confirmacao.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Centralizar o envio de mensagens de texto pela WhatsApp Cloud API, registrar cada tentativa em MENSAGENS e produzir log operacional.

## 2. Identificação técnica

- **Workflow:** `COM - WF012 - Confirmação`
- **ID funcional:** `WF012`
- **Arquivo JSON:** `COM-WF012-confirmacao.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; serviço central de envio de mensagens WhatsApp usado por vários workflows.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `id_cliente`, `telefone_cliente`, `nome_cliente`, `mensagem_texto`, `intencao`, `confianca`, `servico`, `data`, `hora_inicio`, `periodo`, `profissional`, `resposta_cliente`, `phone_number_id`, `origem`, `id_agendamento`, `dados`.

## 4. Fluxo real do workflow

1. `CODE - Montar Mensagem` normaliza telefone e dados; `id_empresa` usa fallback `EMP001`.
2. Valida a presença de telefone e `phone_number_id` antes de enviar.
3. A mensagem usa prioritariamente `resposta_cliente`; sem conteúdo, aplica mensagem genérica de recebimento.
4. O node HTTP envia texto para `https://graph.facebook.com/v21.0/{phone_number_id}/messages`.
5. O resultado da API é convertido em sucesso `ENVIADA` ou `ERRO_WHATSAPP`; falhas de validação retornam `ERRO_VALIDACAO`.
6. Os ramos convergem e uma linha é gravada em `MENSAGENS`, incluindo status/erro e indicador de processamento.
7. WF017 registra log e o SET final devolve status de envio e contexto.

## 5. Regras e decisões implementadas

- Telefone é normalizado para dígitos.
- Telefone e `phone_number_id` são obrigatórios para envio real.
- O envio é de mensagem de texto pela WhatsApp Cloud API v21.0.
- A tentativa é registrada em `MENSAGENS` tanto para sucesso quanto para falha.
- O JSON atual usa `EMP001` como fallback quando `id_empresa` não é informado.

## 6. Integrações e dependências

- WhatsApp Cloud API / Meta.
- Google Sheets: `MENSAGENS`.
- WF017 — Logs.

## 7. Saídas e estados

- Campos principais: `status`, `enviado`, `whatsapp_message_id`, `erro` e o contexto recebido.
- Status principais: `ENVIADA`, `ERRO_WHATSAPP`, `ERRO_VALIDACAO`.

## 8. Tratamento de erros e bloqueios

- Falha de validação impede o POST à Meta.
- Erro retornado pela API é capturado e persistido em MENSAGENS/log.

## 9. Observações do JSON atual

- WF012 concentra o HTTP de WhatsApp para WF005, WF006, WF007, WF011, WF013, WF014 e WF015, além do fallback do WF003.

## 10. Critério de manutenção desta documentação

Sempre que `COM-WF012-confirmacao.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
