# Comunicação — WF012 a WF015

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/comunicacao/`.

## Visão geral

O módulo de Comunicação centraliza o envio de mensagens WhatsApp e executa automações de lembrete, pesquisa pós-atendimento e follow-up. Nos JSONs atuais, WF013–WF015 delegam o envio ao WF012 em vez de chamar diretamente a API da Meta.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF012 | Confirmação / envio WhatsApp | `COM-WF012-confirmacao.json` | Validar, enviar mensagem, registrar tentativa e logar | `true` |
| WF013 | Lembrete | `COM-WF013-lembrete.json` | Lembretes de 24h e 2h com idempotência | `false` |
| WF014 | Pesquisa | `COM-WF014-pesquisa.json` | Pesquisa pós-atendimento com prevenção de duplicidade | `false` |
| WF015 | Follow-up | `COM-WF015-follow-up.json` | Reengajamento em ciclos de inatividade | `false` |

## Arquitetura do módulo

```text
WF005 / WF006 / WF007 / WF011 / WF013 / WF014 / WF015 / fallback do WF003
                               │
                               ▼
                    WF012 — Comunicação
                               │
                   ┌───────────┼───────────┐
                   ▼           ▼           ▼
               Meta API    MENSAGENS     WF017
```

## WF012 — serviço central de WhatsApp

Integrações:

- WhatsApp Cloud API / Meta.
- Google Sheets: `MENSAGENS`.
- WF017 — Logs.

Responsabilidades atuais:

- validar dados necessários para envio;
- enviar mensagem de texto;
- registrar cada tentativa em `MENSAGENS`;
- devolver estados como `ENVIADA`, `ERRO_WHATSAPP` e `ERRO_VALIDACAO`;
- registrar o evento no WF017.

O JSON atual possui fallback `EMP001` em parte da preparação de contexto; isso é comportamento atual e não deve ser omitido da documentação.

## WF013 — Lembrete

Integrações:

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `LEMBRETES`, `CLIENTES`, `PROFISSIONAIS`, `SERVICOS`.
- WF012.
- WF017.

Regras atuais:

- trabalha com janelas de lembrete de aproximadamente 24h e 2h conforme o algoritmo implementado;
- aplica idempotência antes do envio;
- registra a tentativa em `LEMBRETES`;
- o JSON atual **não possui Schedule/Cron**; a periodicidade depende de acionamento externo.

## WF014 — Pesquisa

Integrações:

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `PESQUISAS`, `CLIENTES`, `PROFISSIONAIS`, `SERVICOS`.
- WF012.
- WF017.

Regras atuais:

- avalia atendimento concluído e janela pós-atendimento;
- evita pesquisa duplicada;
- registra o resultado em `PESQUISAS`;
- o JSON atual **não possui Schedule/Cron** e depende de acionamento externo.

## WF015 — Follow-up

Integrações:

- Google Sheets: `EMPRESAS`, `CLIENTES`, `AGENDAMENTOS`, `FOLLOWUPS`.
- WF012.
- WF017.

Regras atuais:

- `id_empresa` obrigatório;
- cliente precisa estar `ATIVO` e com `ACEITA_MARKETING=SIM`;
- último atendimento real é derivado de `AGENDAMENTOS`;
- agendamento futuro não cancelado bloqueia follow-up;
- tentativa 1: 30–33 dias;
- tentativa 2: 45–48 dias;
- máximo de 2 tentativas por ciclo de inatividade;
- idempotência considera empresa + cliente + último atendimento + tentativa;
- o JSON atual **não possui Schedule/Cron**.

## Integrações que não pertencem diretamente a este módulo

- Google Calendar não é chamado diretamente pelos JSONs WF012–WF015 atuais.
- Gemini não é chamado diretamente pelos JSONs WF012–WF015 atuais.

## Documentação individual

- [`COM-WF012.md`](../../documentacao/comunicacao/COM-WF012.md)
- [`COM-WF013.md`](../../documentacao/comunicacao/COM-WF013.md)
- [`COM-WF014.md`](../../documentacao/comunicacao/COM-WF014.md)
- [`COM-WF015.md`](../../documentacao/comunicacao/COM-WF015.md)

## Manutenção

Alterações em templates/mensagens, janelas, idempotência, abas de controle, chamada ao WF012 ou logging via WF017 devem atualizar os JSONs e a documentação correspondente.

