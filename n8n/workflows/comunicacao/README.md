# Comunicação

## Visão Geral

Os workflows desta pasta automatizam toda a comunicação com os clientes.

---

# Objetivos

- Confirmar agendamentos
- Enviar lembretes
- Solicitar avaliações
- Executar follow-up

---

# Workflows

| Código | Workflow |
|---------|----------|
| COM-WF012 | Confirmação |
| COM-WF013 | Lembrete |
| COM-WF014 | Pesquisa |
| COM-WF015 | Follow-up |

---

# Fluxo

```text
Agendamento

↓

Confirmação

↓

Lembrete

↓

Atendimento

↓

Pesquisa

↓

Follow-up
```

---

# Integrações

- WhatsApp Cloud API
- Google Calendar
- Gemini

---

# Regras

- Confirmar automaticamente.
- Enviar lembrete 24h antes.
- Solicitar avaliação após atendimento.
- Fazer follow-up quando necessário.

---

# Estrutura

```
comunicacao/

├── README.md
├── COM-WF012.json
├── COM-WF013.json
├── COM-WF014.json
└── COM-WF015.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
