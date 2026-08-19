# BeautyFlow App — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS. Workspace `@beautyflow/frontend`.

Arquitetura oficial: `docs/09-arquitetura/`.

## Status

**Fase 0A — fundação/scaffold.**

Implementado:
- Next.js;
- TypeScript;
- Tailwind;
- integração com o monorepo/shared-types;
- scripts de desenvolvimento/build/lint.

Ainda não implementado:
- autenticação Supabase;
- sessão;
- telas operacionais completas;
- consumo dos módulos de domínio do backend;
- chamadas ao n8n.

O frontend **não deve chamar n8n diretamente**. A arquitetura aprovada usa NestJS como camada server-side.

## Desenvolvimento

```bash
npm install
npm run dev:frontend
```

Frontend local: `http://localhost:3000`

## Scripts

```bash
npm run dev --workspace=@beautyflow/frontend
npm run build --workspace=@beautyflow/frontend
npm run lint --workspace=@beautyflow/frontend
```

Próxima fase: consultar `docs/09-arquitetura/06-status-de-implementacao.md`.
