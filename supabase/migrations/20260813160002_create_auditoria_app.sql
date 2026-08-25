-- Fase 0B — BeautyFlow App
-- "quem no App fez o quê" — distinto da aba LOGS (que audita execuções do n8n).
-- id_empresa continua NOT NULL de propósito: toda ação tem um escopo, mesmo que esse
-- escopo seja "plataforma inteira". Para ações administrativas globais (platform_admin
-- disparando backup, listando empresas cross-tenant, etc.), grava-se o literal 'GLOBAL' —
-- exatamente a mesma convenção já validada em produção nos workflows ADM-WF016/ADM-WF018
-- (que usam id_empresa='GLOBAL' explicitamente em vez de string vazia/NULL silencioso).
-- Isso evita reintroduzir o mesmo tipo de "default silencioso" que já foi corrigido no n8n,
-- mantendo uma única convenção para "sem empresa específica" em todo o sistema (n8n e App).
CREATE TABLE public.auditoria_app (
    id_auditoria    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa      TEXT NOT NULL,          -- 'GLOBAL' para ações administrativas cross-tenant
    id_usuario      UUID NOT NULL REFERENCES public.usuarios(id_usuario),
    acao            VARCHAR(60) NOT NULL,   -- ex.: 'AGENDA_CRIAR', 'PAGAMENTO_REGISTRAR', 'ADMIN_BACKUP_DISPARAR'
    entidade        VARCHAR(50),
    id_entidade     TEXT,                   -- ID do lado das Sheets
    payload         JSONB,
    resultado       VARCHAR(20) NOT NULL,   -- 'SUCESSO' | 'ERRO'
    erro_detalhe    TEXT,
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_auditoria_empresa_data ON public.auditoria_app(id_empresa, criado_em DESC);
