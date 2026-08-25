-- Fase 0B — BeautyFlow App
-- Onboarding de staff: owner convida um PROFISSIONAIS (Sheets) a ter acesso ao App.
CREATE TABLE public.convites (
    id_convite      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa      TEXT NOT NULL,
    id_profissional TEXT,
    email           VARCHAR(150) NOT NULL,
    perfil          VARCHAR(30) NOT NULL DEFAULT 'profissional',
    status          VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aceito','expirado','revogado')),
    token           UUID NOT NULL DEFAULT gen_random_uuid(),
    expira_em       TIMESTAMP NOT NULL,
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);
