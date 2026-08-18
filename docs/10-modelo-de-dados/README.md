# Modelo de Dados

## Estratégia atual

### Camada operacional — atual
Google Sheets com 14 abas:
- AGENDAMENTOS
- CLIENTES
- COBRANCAS
- DISPONIBILIDADES
- EMPRESAS
- FOLLOWUPS
- IA_MEMORIA
- LEMBRETES
- LOGS
- MENSAGENS
- PAGAMENTOS
- PESQUISAS
- PROFISSIONAIS
- SERVICOS

### Camada do App — planejada
Supabase/Postgres:
- `usuarios`
- `auditoria_app`
- `convites`
- `onboarding_empresas`
- `auth.users` gerenciado pelo Supabase

### Futuro
A modelagem relacional completa das entidades operacionais permanece **aspiracional** e não deve ser confundida com o banco usado pelos WF001–WF018.

## Regra
Não inventar coluna física do Sheets. Quando a coluna real não for confirmada por workflow/planilha, documentar como "a validar".
