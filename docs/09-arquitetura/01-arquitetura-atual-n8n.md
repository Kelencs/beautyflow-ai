# Arquitetura Atual — n8n

```text
Cliente
  ↓ WhatsApp Cloud API
WF001
  ↓
WF002 ← Google Gemini / Google Sheets
  ↓
WF003
  ├─ WF004 disponibilidade
  ├─ WF005 agendar
  ├─ WF006 reagendar
  ├─ WF007 cancelar
  └─ WF012 comunicação
```

Workflows auxiliares:
- WF008–WF009 clientes;
- WF010–WF011 financeiro;
- WF012–WF015 comunicação;
- WF016–WF018 administração.

## Persistência
Google Sheets é a persistência operacional atual.

Abas:
`AGENDAMENTOS`, `CLIENTES`, `COBRANCAS`, `DISPONIBILIDADES`, `EMPRESAS`, `FOLLOWUPS`, `IA_MEMORIA`, `LEMBRETES`, `LOGS`, `MENSAGENS`, `PAGAMENTOS`, `PESQUISAS`, `PROFISSIONAIS`, `SERVICOS`.

## Limites atuais
- alguns workflows ainda refletem configuração do ambiente inicial;
- multiempresa deve ser endurecido antes de escala;
- WF013–WF015 são subworkflows;
- entrada pública principal continua sendo o fluxo WhatsApp.
