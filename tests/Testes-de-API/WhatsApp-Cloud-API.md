# Teste — WhatsApp Cloud API

## Objetivo
Validar o contrato HTTP utilizado pelo WF012 e o recebimento do webhook utilizado pelo WF001.

## Cenários
- webhook de verificação;
- payload de mensagem;
- envio de texto válido;
- telefone inválido/ausente;
- `phone_number_id` ausente;
- token inválido/expirado;
- resposta 4xx/5xx;
- persistência do resultado em MENSAGENS.

## Critério
Separar falha de credencial/Meta de falha da lógica do workflow.

