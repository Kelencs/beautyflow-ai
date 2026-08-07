# Atendimento

## Visão Geral

Os workflows desta pasta representam a porta de entrada do BeautyFlow AI.

São responsáveis pelo recebimento das mensagens do WhatsApp, interpretação da intenção do cliente e encaminhamento para os módulos corretos.

---

# Objetivos

- Receber mensagens
- Validar Webhook
- Normalizar Payload
- Conversar utilizando IA
- Identificar intenção

---

# Workflows

| Código | Workflow |
|---------|----------|
| ATD-WF001 | Receber WhatsApp |
| ATD-WF002 | IA Atendimento |
| ATD-WF003 | Identificar Intenção |

---

# Fluxo

```text
WhatsApp

↓

WF001

↓

WF002

↓

Gemini

↓

WF003

↓

Agenda
Clientes
Financeiro
Comunicação
```

---

# Integrações

- WhatsApp Cloud API
- Gemini
- Google Sheets
- n8n

---

# Responsabilidades

WF001

- Receber mensagem
- Validar Meta
- Normalizar Payload

WF002

- Buscar Cliente
- Conversar com IA
- Registrar mensagem

WF003

- Descobrir intenção
- Encaminhar fluxo

---

# Estrutura

```
atendimento/

├── README.md
├── ATD-WF001.json
├── ATD-WF002.json
└── ATD-WF003.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
