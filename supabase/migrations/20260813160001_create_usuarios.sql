-- Fase 0B — BeautyFlow App
-- Ver docs/arquitetura/beautyflow-app-arquitetura.md, seção "Schema Postgres/Supabase".
-- Supabase Auth já possui auth.users (id, email, senha) — não modelado aqui.

CREATE TABLE public.usuarios (
    id_usuario      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    id_empresa      TEXT,                  -- FK lógica -> Sheets EMPRESAS.ID_EMPRESA (não é FK real, ver nota na arquitetura).
                                            -- NULL obrigatório para platform_admin, e NOT NULL obrigatório
                                            -- para owner/profissional (ver CHECK abaixo) — um admin da
                                            -- plataforma é cross-tenant por definição e nunca pertence a
                                            -- uma empresa específica.
    id_profissional TEXT,                 -- FK lógica -> Sheets PROFISSIONAIS.ID_PROFISSIONAL (NULL se owner/admin puro)
    nome            VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    perfil          VARCHAR(30) NOT NULL DEFAULT 'profissional'
                    CHECK (perfil IN ('owner','profissional','platform_admin')),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT chk_usuarios_empresa_obrigatoria
        CHECK (
            (perfil IN ('owner','profissional') AND id_empresa IS NOT NULL)
            OR (perfil = 'platform_admin' AND id_empresa IS NULL)
        )
);

CREATE INDEX idx_usuarios_empresa ON public.usuarios(id_empresa);
CREATE UNIQUE INDEX uq_usuarios_email ON public.usuarios(lower(email));
