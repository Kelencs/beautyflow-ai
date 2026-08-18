# Arquitetura de Integrações

| Integração | Responsabilidade | Estado |
|---|---|---|
| WhatsApp Cloud API | canal de entrada/saída | atual |
| Google Gemini | IA do WF002 | atual |
| Google Sheets | dados operacionais | atual |
| Google Calendar | agenda | atual |
| Google Drive | backup WF016 | atual |
| Supabase | Auth/dados do App | planejado |
| APP-WF019 | gateway App→n8n | planejado |

## Princípios
- credenciais fora do Git;
- erros externos com status técnico explícito;
- retries limitados;
- idempotência em efeitos externos;
- isolamento por empresa;
- logs sem segredos.
