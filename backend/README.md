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

## Camada de banco (Supabase)

`src/database/supabase.service.ts` expõe um `SupabaseClient` server-side, autenticado com a Secret Key (`SUPABASE_SECRET_KEY`, novo sistema de API Keys do Supabase — não a chave legada `service_role`), com criação adiada para o primeiro uso — o módulo carrega normalmente mesmo sem um projeto Supabase real configurado. `DatabaseModule` provê/exporta o serviço e já está importado em `AppModule`.

As tabelas (`usuarios`, `auditoria_app`, `convites`, `onboarding_empresas`) e a RLS vivem em [supabase/migrations/](../supabase/migrations/) — ver [supabase/README.md](../supabase/README.md) para como aplicá-las.

## Status (Fase 0B)

Camada de acesso ao Supabase preparada (`SupabaseService` + migrations + RLS), mas **nenhum projeto Supabase real está configurado ainda** — `.env.example` documenta as variáveis, sem segredos. Ainda sem autenticação, guards (`SupabaseAuthGuard`/`RolesGuard`), fluxo de onboarding, ou módulos de domínio (`agenda`, `clientes`, `financeiro` etc.).
