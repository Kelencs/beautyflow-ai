# ATD-WF001 — Receber WhatsApp

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF001` |
| Workflow | Receber WhatsApp |
| Arquivo n8n | `ATD-WF001-receber-whatsapp.json` |
| Status | Versionado no repositório |
| Trigger | Webhook Meta/WhatsApp Cloud API — GET/POST |
| Última revisão | 19/08/2026 |

## Objetivo

Ser a porta de entrada do BeautyFlow para eventos recebidos pelo WhatsApp, normalizar mensagens utilizáveis e encaminhar o contrato interno ao WF002.

## Entradas

### GET

Recebe os parâmetros de verificação enviados pela Meta, incluindo `hub.challenge`.

**Estado atual:** o JSON responde ao challenge, porém não apresenta comparação explícita de `hub.verify_token` antes da resposta. A validação do token permanece como gap técnico conhecido.

### POST

Payload de eventos da WhatsApp Cloud API.

Dados extraídos quando disponíveis:
- telefone;
- nome;
- texto;
- tipo de mensagem;
- `phone_number_id`;
- identificador da mensagem;
- timestamp.

## Fluxo principal

1. Recebe GET ou POST.
2. No GET, responde ao challenge conforme a configuração atual.
3. No POST, extrai a primeira mensagem utilizável.
4. Normaliza dados de origem e cliente.
5. Encerra eventos sem mensagem válida.
6. Monta o contrato interno.
7. Chama `ATD-WF002 — IA Atendimento`.

```text
Meta / WhatsApp
      ↓
ATD-WF001
      ↓
ATD-WF002
```

## Multiempresa atual

O JSON atual atribui `id_empresa: 'EMP001'` ao payload normalizado.

Isso é comportamento legado/configuração atual e **não representa isolamento SaaS concluído**.

## Integrações

- WhatsApp Cloud API / Meta;
- ATD-WF002.

WF001 não chama WF017 diretamente.

## Proteções

- não adicionar regra de agenda/financeiro neste workflow;
- preservar `phone_number_id`;
- normalizar telefone;
- não enviar evento sem mensagem utilizável para IA;
- nunca registrar tokens/credenciais.

## Saída

Contrato interno contendo, conforme disponível:
`id_empresa`, `mensagem_id`, `telefone_cliente`, `nome_cliente`, `tipo_mensagem`, `mensagem_texto`, `timestamp`, `phone_number_id` e `origem`.

## Tratamento de erro

Payload inesperado deve encerrar de forma controlada.

O padrão geral de logging existe no projeto, mas **o WF001 não possui chamada direta ao WF017 no JSON atual**.

## Checklist

- [ ] GET responde ao challenge.
- [ ] Gap de verify token permanece documentado.
- [ ] POST com mensagem válida chama WF002.
- [ ] Evento sem mensagem não chama WF002.
- [ ] Telefone e `phone_number_id` são preservados.
- [ ] Tenant fixo/fallback não é apresentado como multiempresa concluído.
