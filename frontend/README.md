# BeautyFlow App — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS. Workspace `@beautyflow/frontend` do monorepo BeautyFlow App.

Arquitetura completa: [docs/arquitetura/beautyflow-app-arquitetura.md](../docs/arquitetura/beautyflow-app-arquitetura.md).

## Desenvolvimento

Rodar a partir da raiz do monorepo (garante que `libs/shared-types` esteja linkado):

```bash
npm install
npm run dev:frontend
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev --workspace=@beautyflow/frontend
npm run build --workspace=@beautyflow/frontend
npm run lint --workspace=@beautyflow/frontend
```

## Status (Fase 0A)

Scaffold inicial apenas — sem Supabase, autenticação ou chamadas ao backend ainda. Ver `.env.example` para as variáveis previstas a partir da Fase 0B.
