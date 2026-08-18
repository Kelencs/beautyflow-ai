# Atendimento — WF001 a WF003

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/atendimento/`.

## Visão geral

O módulo de Atendimento é a porta de entrada conversacional do BeautyFlow. Ele recebe eventos do WhatsApp, normaliza mensagens válidas, identifica/cadastra o cliente, consulta contexto, utiliza Gemini para interpretar a conversa e roteia a intenção para o workflow funcional correspondente.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF001 | Receber WhatsApp | `ATD-WF001-receber-whatsapp.json` | Webhooks GET/POST, resposta à Meta, normalização e chamada do WF002 | `true` |
| WF002 | IA Atendimento | `ATD-WF002-ia-atendimento.json` | Cliente, contexto, Gemini, registro da mensagem e preparação do WF003 | `true` |
| WF003 | Identificar Intenção | `ATD-WF003-identificar-intencao.json` | Normalização e roteamento da intenção | `true` |

## Fluxo real

```text
WhatsApp Cloud API
        │
        ▼
WF001
├── GET  /beautyflow-whatsapp → responde hub.challenge
└── POST /beautyflow-whatsapp → EVENT_RECEIVED
        │
        ▼
normaliza payload válido
        │
        ▼
WF002
├── busca cliente em CLIENTES
├── chama WF008 quando cadastro é necessário
├── consulta IA_MEMORIA
├── chama Gemini
├── registra interação em MENSAGENS
└── prepara contexto
        │
        ▼
WF003
├── AGENDAR                  → WF005
├── CONSULTAR_DISPONIBILIDADE→ WF004
├── REAGENDAR                → WF006
├── CANCELAR                 → WF007
└── fallback/outra intenção  → WF012
```

## Integrações diretas

### WF001
- WhatsApp Cloud API / Meta via Webhook.
- WF002 via Execute Workflow.
- Não utiliza Google Sheets diretamente.

### WF002
- Google Sheets: `CLIENTES`, `IA_MEMORIA`, `MENSAGENS`.
- Google Gemini.
- WF008 — Cadastrar Cliente.
- WF003 — Identificar Intenção.

### WF003
- WF004, WF005, WF006 e WF007.
- WF012 para resposta conversacional/fallback.
- Não chama WF017 diretamente no JSON atual.

## Regras e observações atuais

- O WF001 possui dois webhooks no caminho `beautyflow-whatsapp`: GET para challenge e POST para eventos.
- O GET atual responde ao `hub.challenge`; não há no JSON atual uma condição de comparação do `hub.verify_token` antes dessa resposta.
- O WF001 normaliza mensagens válidas e atribui atualmente `id_empresa: 'EMP001'`.
- O WF002 também possui fallback para `EMP001` em sua preparação de dados.
- O WF002 consulta `IA_MEMORIA` para compor contexto, mas a persistência de mensagens visível no fluxo é feita em `MENSAGENS`.
- O WF003 não deve ser documentado como roteador para todos os 18 workflows: suas rotas atuais são WF004, WF005, WF006, WF007 e WF012.

## Documentação individual

- [`ATD-WF001-receber-whatsapp.md`](../../documentacao/atendimento/ATD-WF001-receber-whatsapp.md)
- [`ATD-WF002-ia-atendimento.md`](../../documentacao/atendimento/ATD-WF002-ia-atendimento.md)
- [`ATD-WF003-identificar-intencao.md`](../../documentacao/atendimento/ATD-WF003-identificar-intencao.md)

## Manutenção

Sempre que qualquer JSON deste módulo mudar, revisar este README e a documentação individual correspondente. O JSON versionado é a referência do comportamento implementado.

