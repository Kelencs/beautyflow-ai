# COM-WF012 — Confirmação / Envio WhatsApp

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF012` |
| Workflow | Confirmação / Envio WhatsApp |
| Arquivo n8n | `COM-WF012-confirmacao.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow central de comunicação chamado por outros workflows. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Centralizar o envio de mensagens de texto pelo WhatsApp Cloud API, validar os dados do destinatário, registrar a mensagem e devolver um resultado padronizado.

## Entradas principais

- `id_empresa`, `id_cliente`, telefone, nome e `phone_number_id`.
- `resposta_cliente` ou texto já preparado.
- Contexto opcional: intenção, confiança, serviço, data, horário, profissional, `id_agendamento`, origem e `dados`.

## Fluxo principal

1. Sanitiza e valida telefone.
2. Valida presença de `phone_number_id`.
3. Escolhe a mensagem pronta (`resposta_cliente`) ou fallback controlado.
4. Monta o payload da WhatsApp Cloud API.
5. Envia a mensagem pelo endpoint da Meta.
6. Captura o identificador retornado pelo WhatsApp.
7. Registra a saída na aba `MENSAGENS` com direção, conteúdo e status.
8. Retorna o status ao workflow chamador.
9. Registra eventos técnicos no WF017 quando necessário.

## Fluxo resumido

```text
COM-WF012 → WhatsApp Cloud API / Meta → Google Sheets: MENSAGENS → ADM-WF017
```

## Integrações

- WhatsApp Cloud API / Meta
- Google Sheets: `MENSAGENS`
- ADM-WF017

## Regras de negócio e proteções

- Todos os envios automatizados do BeautyFlow devem preferir este workflow em vez de implementar HTTP direto em cada fluxo.
- Telefone e `phone_number_id` são obrigatórios para envio.
- O registro em `MENSAGENS` deve indicar direção `ENVIADA` e status real do processamento.
- Não gravar credencial/token da Meta na planilha ou logs.

## Saídas esperadas

- Status de envio.
- ID da mensagem do WhatsApp quando disponível.
- Registro persistido em `MENSAGENS`.

## Tratamento de erros e logs

- Falha HTTP deve retornar falha real ao chamador.
- Telefone/`phone_number_id` ausente deve ser bloqueio de validação, sem HTTP.
- Registro de mensagem deve refletir erro quando o envio falhar.

## Dependências entre workflows

- Chamado por: agenda, cobrança, lembrete, pesquisa, follow-up e outros fluxos de comunicação.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Envio com `resposta_cliente`.
- [ ] Envio usando fallback.
- [ ] Telefone inválido.
- [ ] `phone_number_id` ausente.
- [ ] Erro 4xx/5xx da Meta.
- [ ] Conferir registro correspondente em `MENSAGENS`.

## Cuidados na manutenção

Trate este workflow como um serviço compartilhado. Mudanças no contrato devem ser compatíveis com todos os workflows que enviam WhatsApp.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

