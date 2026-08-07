# Clientes

## Visão Geral

Esta pasta contém os workflows responsáveis pelo cadastro e atualização das informações dos clientes.

---

# Objetivos

- Criar cadastro
- Atualizar dados
- Evitar duplicidades
- Manter histórico

---

# Workflows

| Código | Workflow |
|---------|----------|
| CLI-WF008 | Cadastro Cliente |
| CLI-WF009 | Atualizar Cadastro |

---

# Fluxo

```text
Cliente

↓

Buscar Cadastro

↓

Existe?

↓

Não

↓

Criar

↓

Sim

↓

Atualizar
```

---

# Integrações

- Google Sheets
- Gemini
- WhatsApp

---

# Regras

- Nunca duplicar cliente.
- Utilizar telefone como chave principal.
- Atualizar último atendimento.
- Registrar data de criação.

---

# Estrutura

```
clientes/

├── README.md
├── CLI-WF008.json
└── CLI-WF009.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
