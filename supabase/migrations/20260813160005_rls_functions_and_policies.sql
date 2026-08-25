-- Fase 0B — BeautyFlow App
-- Funções auxiliares (SECURITY DEFINER) usadas pelas políticas RLS abaixo: resolvem
-- id_empresa/perfil do usuário autenticado (auth.uid()) consultando public.usuarios,
-- conforme a arquitetura (seção "Schema Postgres/Supabase" -> "RLS").
--
-- Hardening (revisão de segurança pré-Supabase-real):
-- - SET search_path = '' (em vez de "public"): elimina o risco de search_path hijacking
--   em funções SECURITY DEFINER (uma função/tabela maliciosa criada num schema cedo no
--   search_path do chamador não pode mais ser resolvida em vez da intencional). Com
--   search_path vazio, toda referência precisa ser explicitamente qualificada — já é o
--   caso aqui (public.usuarios, auth.uid()), então nenhuma mudança de lógica é necessária.
-- - REVOKE ALL ... FROM PUBLIC + GRANT EXECUTE apenas para "authenticated": por padrão o
--   Postgres concede EXECUTE a PUBLIC (portanto também a "anon") na criação da função;
--   como nenhuma linha de public.usuarios é visível para um usuário não autenticado
--   (auth.uid() é NULL para anon, então nenhuma condição das policies abaixo pode ser
--   verdadeira), anon nunca precisa executar estas funções — o acesso é restringido
--   explicitamente à role "authenticated", que é quem as policies realmente atendem.
-- - Sem recursão de RLS: mesmo com RLS habilitado em public.usuarios (ver ALTER TABLE
--   abaixo) e estas funções consultando essa mesma tabela, não há loop. SECURITY DEFINER
--   faz o SELECT interno executar com o papel do DONO da função (quem aplica esta
--   migration — por padrão, no Supabase, a role "postgres", que é dona da tabela e/ou
--   tem BYPASSRLS) em vez do papel de quem chamou a função. Ou seja, o SELECT interno
--   ignora a RLS de usuarios (é executado pelo dono/bypass), retorna o escalar, e só
--   então a policy da consulta ORIGINAL (do usuário "authenticated" real) é avaliada com
--   esse valor — um único salto, nunca recursivo. Válido apenas enquanto quem aplica esta
--   migration for uma role com BYPASSRLS ou dona de public.usuarios (verificar ao aplicar
--   no projeto real: Table Editor -> usuarios -> Owner).
CREATE OR REPLACE FUNCTION public.current_empresa()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT id_empresa FROM public.usuarios WHERE id_usuario = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_empresa() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_empresa() TO authenticated;

CREATE OR REPLACE FUNCTION public.current_papel()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT perfil FROM public.usuarios WHERE id_usuario = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_papel() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_papel() TO authenticated;

-- RLS habilitado em usuarios/auditoria_app/convites (conforme arquitetura). O NestJS usa
-- a Secret Key (novo sistema de API Keys do Supabase) para escritas em nome de
-- requisições já autorizadas (RolesGuard, fase futura) — RLS aqui é camada de defesa
-- extra de leitura, não o mecanismo primário de autorização. Nenhuma policy de escrita é
-- criada nesta fase: INSERT/UPDATE/DELETE ficam bloqueados por padrão para as roles
-- anon/authenticated; a Secret Key sempre contorna RLS (role service_role no Postgres).
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convites ENABLE ROW LEVEL SECURITY;

-- Revisão de segurança (menor privilégio, pré-Supabase-real): a policy original permitia
-- que QUALQUER usuário autenticado (owner ou profissional) lesse todas as linhas de
-- usuarios da própria empresa — mais amplo do que o fluxo de login exige (que só precisa
-- do próprio registro: id_usuario = auth.uid()). A cláusula `id_empresa =
-- public.current_empresa()` foi removida da policy de usuarios por isso.
--   - profissional: SELECT somente do próprio registro (id_usuario = auth.uid()).
--   - owner: por ora, também somente do próprio registro. Visibilidade dos demais
--     usuários da própria empresa é funcionalidade futura, deliberadamente NÃO criada
--     aqui — quando for implementada, deve ser uma condição própria de "owner", não
--     reutilizar a checagem genérica de empresa que existia antes (que também liberava
--     profissional). auditoria_app e convites (abaixo) continuam usando
--     current_empresa(), pois esta revisão foi pedida apenas para a policy de usuarios.
--   - platform_admin: mantém SELECT irrestrito (papel administrativo cross-tenant já
--     definido na arquitetura, inalterado por esta revisão).
-- Nenhum usuário de uma empresa consegue ver usuários de outra empresa: fora do próprio
-- registro, só platform_admin (que por definição não pertence a nenhuma empresa — ver
-- chk_usuarios_empresa_obrigatoria) enxerga outras linhas.
CREATE POLICY usuarios_select_proprio_ou_admin
    ON public.usuarios
    FOR SELECT
    USING (
        id_usuario = auth.uid()
        OR public.current_papel() = 'platform_admin'
    );

CREATE POLICY auditoria_app_select_por_empresa_ou_admin
    ON public.auditoria_app
    FOR SELECT
    USING (
        id_empresa = public.current_empresa()
        OR public.current_papel() = 'platform_admin'
    );

CREATE POLICY convites_select_por_empresa_ou_admin
    ON public.convites
    FOR SELECT
    USING (
        id_empresa = public.current_empresa()
        OR public.current_papel() = 'platform_admin'
    );
