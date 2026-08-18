# Índices e Otimização

No Supabase planejado, índices devem priorizar:
- usuarios(id_empresa)
- email normalizado
- auditoria_app(id_empresa, criado_em)
- convites por empresa/status/token
- onboarding por identificador idempotente.

Índices das entidades operacionais completas pertencem à migração futura.
