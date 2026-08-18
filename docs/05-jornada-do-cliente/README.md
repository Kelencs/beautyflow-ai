# Jornada do Cliente — BeautyFlow AI

## Jornada atual pelo WhatsApp

```text
Cliente envia mensagem
  ↓
WF001 — recebe webhook
  ↓
WF002 — identifica cliente + IA
  ├─ cliente novo → WF008
  ↓
WF003 — identifica intenção
  ├─ disponibilidade → WF004
  ├─ agendar → WF005 → WF004
  ├─ reagendar → WF006 → WF004
  ├─ cancelar → WF007
  └─ outro → WF012
```

## Durante e após o ciclo do atendimento

```text
Agendamento criado
  ↓
WF012 — confirmação/comunicação
  ↓
WF013 — lembrete (quando invocado)
  ↓
Atendimento
  ├─ WF010 — pagamento, quando registrado
  ├─ WF011 — cobrança, se saldo pendente
  └─ WF014 — pesquisa, quando invocado e elegível
  ↓
Período de inatividade
  ↓
WF015 — follow-up, quando invocado e elegível
```

## Pontos importantes
- WF014 **envia** a pesquisa; não recebe a nota.
- WF015 é **reengajamento**, não motor genérico de campanhas.
- WF013–WF015 precisam de chamador/orquestração.
- cliente com agendamento futuro não deve receber follow-up.
- marketing depende de consentimento válido.

## Jornada futura no App

### Proprietário
Login → dashboard → agenda/clientes/financeiro/serviços/profissionais → ações via NestJS → gateway n8n.

### Profissional
Login → agenda e clientes filtrados → comunicação permitida.

### Administrador
Login → empresas/logs/backup com auditoria cross-tenant.

O frontend nunca deve chamar o n8n diretamente na arquitetura aprovada.
