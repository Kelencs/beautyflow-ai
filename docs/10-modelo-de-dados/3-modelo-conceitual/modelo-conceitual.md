# Modelo Conceitual

```text
EMPRESA
├─ PROFISSIONAIS
├─ SERVICOS
├─ CLIENTES
├─ DISPONIBILIDADES
├─ AGENDAMENTOS
│  ├─ PAGAMENTOS
│  ├─ COBRANCAS
│  ├─ LEMBRETES
│  └─ PESQUISAS
├─ FOLLOWUPS
├─ MENSAGENS
└─ LOGS
```

No App, USUARIO pertence logicamente a uma EMPRESA (exceto platform_admin) e pode se vincular a PROFISSIONAL.
