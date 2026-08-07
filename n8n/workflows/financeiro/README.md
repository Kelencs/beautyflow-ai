# Financeiro

## Visão Geral

Esta pasta contém os workflows responsáveis pelo gerenciamento financeiro do BeautyFlow AI.

---

# Objetivos

- Registrar pagamentos
- Controlar cobranças
- Atualizar status financeiro
- Gerar histórico

---

# Workflows

| Código | Workflow |
|---------|----------|
| FIN-WF010 | Registrar Pagamento |
| FIN-WF011 | Cobrança |

---

# Fluxo

```text
Agendamento

↓

Pagamento

↓

Registrar

↓

Atualizar Status

↓

Cobrança (quando necessário)
```

---

# Integrações

- Google Sheets
- WhatsApp Cloud API
- Gemini

---

# Regras

- Registrar todos os pagamentos.
- Atualizar status do agendamento.
- Controlar inadimplência.
- Registrar data e valor.

---

# Estrutura

```
financeiro/

├── README.md
├── FIN-WF010.json
└── FIN-WF011.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
