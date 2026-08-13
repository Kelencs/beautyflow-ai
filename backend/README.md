# BeautyFlow App — Backend

NestJS + TypeScript. Workspace `@beautyflow/backend` do monorepo BeautyFlow App — API consumida pelo frontend, que por sua vez fala com o n8n através de um gateway (fase futura, ver plano de arquitetura).

Arquitetura completa: [docs/arquitetura/beautyflow-app-arquitetura.md](../docs/arquitetura/beautyflow-app-arquitetura.md).

## Desenvolvimento

Rodar a partir da raiz do monorepo (garante que `libs/shared-types` esteja linkado):

```bash
npm install
npm run dev:backend
```

API disponível em [http://localhost:3001](http://localhost:3001) (`PORT` em `.env`, ver `.env.example`).

## Scripts

```bash
npm run start:dev --workspace=@beautyflow/backend
npm run build --workspace=@beautyflow/backend
npm run lint --workspace=@beautyflow/backend
npm run test --workspace=@beautyflow/backend
```

## Status (Fase 0A)

Scaffold inicial apenas (`AppModule`/`AppController`/`AppService` padrão do Nest CLI) — sem Supabase, autenticação, guards, ou módulos de domínio (`agenda`, `clientes`, `financeiro` etc.) ainda. Ver `.env.example` para as variáveis previstas a partir da Fase 0B.
