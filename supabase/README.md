# Supabase — BeautyFlow App

Migrations SQL da camada nova (autenticação/usuários/auditoria do App), conforme [docs/arquitetura/beautyflow-app-arquitetura.md](../docs/arquitetura/beautyflow-app-arquitetura.md), seção "Schema Postgres/Supabase". **Nenhuma tabela aqui duplica dados operacionais (Agendamentos, Clientes, Pagamentos etc.) — esses continuam no Google Sheets, via n8n.**

## Migrations

Aplicar em ordem (dependências: `usuarios` antes de `auditoria_app`; `current_empresa()`/`current_papel()` e as políticas RLS dependem de `usuarios`/`auditoria_app`/`convites` já existirem):

1. `20260813160001_create_usuarios.sql`
2. `20260813160002_create_auditoria_app.sql`
3. `20260813160003_create_convites.sql`
4. `20260813160004_create_onboarding_empresas.sql`
5. `20260813160005_rls_functions_and_policies.sql`

## Passo manual necessário (você, no painel do Supabase)

Nenhum projeto Supabase foi criado ainda — isso não pode ser feito por mim. Para deixar a Fase 0B utilizável de fato:

1. Criar o projeto em [supabase.com](https://supabase.com) (ou usar um já existente dedicado ao BeautyFlow).
2. Em **Project Settings → API Keys**, copiar a **Project URL** e a **Secret Key** (`sb_secret_...`). Este é um projeto novo — use o novo sistema de API Keys do Supabase, **não** a chave legada `service_role` (se o painel ainda mostrar "Legacy API Keys" como aba separada, use a aba nova, não a legada).
3. Preencher `backend/.env` (copiado de `backend/.env.example`, nunca commitado) com:
   ```
   SUPABASE_URL=<Project URL>
   SUPABASE_SECRET_KEY=<Secret Key>
   ```
4. Rodar as 5 migrations acima, em ordem, no **SQL Editor** do painel do Supabase (copiar/colar o conteúdo de cada arquivo) — ou, se preferir usar a Supabase CLI localmente, `supabase link` ao projeto e `supabase db push` a partir da raiz deste repositório.
5. Confirmar no painel (**Table Editor**) que as 4 tabelas foram criadas e que **RLS** aparece habilitado em `usuarios`, `auditoria_app` e `convites` (não em `onboarding_empresas`, por design — ver comentário na migration 4). Opcionalmente, confirmar em **Database → Functions** que `current_empresa`/`current_papel` aparecem como `SECURITY DEFINER` e que o dono da função é a role usada para aplicar a migration (normalmente `postgres`) — é essa condição que evita recursão de RLS ao consultar `usuarios` de dentro delas mesmas (ver comentário na migration 5).

Sem isso, `SupabaseService` (`backend/src/database/supabase.service.ts`) continua funcionando no código (build/lint/test passam), mas `getClient()` lança erro em runtime até `SUPABASE_URL`/`SUPABASE_SECRET_KEY` estarem definidas — nenhuma chamada real ao Supabase é feita nesta fase.

**Nota**: a futura chave pública do frontend será a **Publishable Key** (`sb_publishable_...`), não implementada nesta fase.
