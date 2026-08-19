# BeautyFlow App — Backend

NestJS + TypeScript. Workspace `@beautyflow/backend`.

Arquitetura oficial: `docs/09-arquitetura/`.

## Status

**Fase 0A — fundação/scaffold.**

Implementado:
- projeto NestJS;
- estrutura mínima AppModule/AppController/AppService;
- integração com monorepo/shared-types;
- scripts de build/lint/test/dev.

Ainda não implementado:
- Supabase/Auth;
- RolesGuard;
- módulos completos de domínio;
- APP-WF019;
- EMP-WF021;
- gateway operacional para n8n.

## Desenvolvimento

```bash
npm install
npm run dev:backend
```

API local: `http://localhost:3001`

## Scripts

```bash
npm run start:dev --workspace=@beautyflow/backend
npm run build --workspace=@beautyflow/backend
npm run lint --workspace=@beautyflow/backend
npm run test --workspace=@beautyflow/backend
```

## Fronteira aprovada

```text
Frontend Next.js
      ↓
Backend NestJS
      ├── Supabase/Auth (planejado)
      ↓
APP-WF019 (planejado)
      ↓
n8n / dados operacionais
```

O frontend não deve acessar n8n diretamente.
