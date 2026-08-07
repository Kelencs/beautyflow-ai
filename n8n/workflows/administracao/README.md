# Administração

## Visão Geral

A pasta **Administracao** reúne todos os workflows responsáveis pela manutenção, monitoramento, auditoria e integridade do sistema BeautyFlow AI.

Esses fluxos não interagem diretamente com o cliente, mas garantem estabilidade, rastreabilidade e segurança da plataforma.

---

# Objetivos

- Registrar logs do sistema
- Executar backups automáticos
- Limpar dados temporários
- Monitorar falhas
- Auxiliar auditorias

---

# Workflows

| Código | Workflow | Objetivo |
|---------|----------|----------|
| ADM-WF016 | Backup | Backup automático dos dados |
| ADM-WF017 | Logs | Registro de eventos do sistema |
| ADM-WF018 | Limpeza | Remoção de dados temporários |

---

# Dependências

- Google Sheets
- n8n
- Google Drive (Backup)
- Gemini
- WhatsApp Cloud API

---

# Fluxo Geral

```text
Sistema

↓

Executa Workflow

↓

Registra Log

↓

Executa Backup

↓

Limpeza Programada
```

---

# Boas práticas

- Nunca apagar registros de LOG.
- Sempre registrar erros.
- Executar backup antes de grandes alterações.
- Validar execução periódica.

---

# Estrutura

```
administracao/

├── README.md
├── ADM-WF016-Backup.json
├── ADM-WF017-Logs.json
└── ADM-WF018-Limpeza.json
```

---

Versão: 5.0
Projeto: BeautyFlow AI
