# Arquitetura do BeautyFlow App

## Estado
**Fase 0A concluída:** monorepo + scaffolds frontend/backend/shared-types.

Ainda não implementado:
- Supabase Auth;
- guards/roles;
- módulos de domínio;
- APP-WF019;
- EMP-WF021.

## Arquitetura aprovada

```text
Browser
  ↓
Next.js
  ↓
NestJS
  ├─ Supabase Auth/Postgres (identidade/auditoria)
  ↓
APP-WF019 (futuro)
  ↓
WFs de domínio
  ↓
Google Sheets / Calendar / Meta / Drive
```

## Regra fundamental
Frontend **não chama n8n diretamente**.

## Dados
- identidade/App: Supabase planejado;
- operação: Sheets na fase atual;
- não duplicar regras críticas no frontend.
