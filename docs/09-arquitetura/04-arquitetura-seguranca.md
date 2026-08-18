# Arquitetura de Segurança

## Atual — n8n
- credentials no n8n;
- logs sem tokens;
- escopo por `ID_EMPRESA`;
- tratamento de erro técnico;
- dados sintéticos nos testes.

## App — planejado
- Supabase Auth;
- backend NestJS como enforcement;
- `RolesGuard`;
- owner/profissional/platform_admin;
- RLS como defesa adicional;
- auditoria_app;
- frontend apenas oculta UI; não é fronteira de segurança.

## Pontos P0 antes de SaaS
- remover/neutralizar defaults de tenant inseguros;
- resolver recursos fixos por empresa;
- validar consentimento de marketing;
- rate limiting;
- política LGPD;
- rotação de segredos.
