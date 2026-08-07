# Agenda

## Visão Geral

Esta pasta contém todos os workflows relacionados ao gerenciamento da agenda da empresa.

São responsáveis por consultar horários, criar agendamentos, reagendar e cancelar atendimentos.

---

# Objetivos

- Consultar disponibilidade
- Criar agendamentos
- Reagendar horários
- Cancelar atendimentos
- Sincronizar Google Calendar

---

# Workflows

| Código | Workflow |
|---------|----------|
| AGE-WF004 | Consultar Disponibilidade |
| AGE-WF005 | Criar Agendamento |
| AGE-WF006 | Reagendar Atendimento |
| AGE-WF007 | Cancelar Atendimento |

---

# Fluxo

```text
Cliente

↓

Consulta Horários

↓

Google Calendar

↓

Disponível?

↓

Sim → Agendar

↓

Não → Sugerir Horários
```

---

# Integrações

- Google Calendar
- Google Sheets
- Gemini
- WhatsApp Cloud API

---

# Regras

- Nunca criar horários duplicados.
- Sempre validar disponibilidade.
- Atualizar Google Calendar.
- Atualizar planilha AGENDAMENTOS.

---

# Estrutura

```
agenda/

├── README.md
├── AGE-WF004.json
├── AGE-WF005.json
├── AGE-WF006.json
└── AGE-WF007.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
