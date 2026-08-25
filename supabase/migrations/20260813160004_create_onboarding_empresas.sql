-- Fase 0B — BeautyFlow App
-- Orquestra a transação de onboarding (empresa no n8n/Sheets -> Supabase Auth -> public.usuarios),
-- garantindo idempotência por e-mail em caso de retry. Ver arquitetura, seção "Ordem da transação".
CREATE TABLE public.onboarding_empresas (
    id_onboarding   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(150) NOT NULL,
    id_empresa      TEXT NOT NULL,           -- gerado pelo NestJS já na criação desta linha (passo 1) — nunca NULL
    status          VARCHAR(20) NOT NULL DEFAULT 'iniciado'
                    CHECK (status IN ('iniciado','empresa_criada','concluido')),
    criado_em       TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_onboarding_email ON public.onboarding_empresas(lower(email));

-- Sem RLS nesta tabela por design: é uma tabela de orquestração interna, escrita e lida
-- apenas pelo NestJS via service-role key (que contorna RLS de qualquer forma) — a
-- arquitetura só lista RLS para usuarios/auditoria_app/convites (ver seção "RLS").
