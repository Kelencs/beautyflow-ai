# Políticas de Segurança / RLS

Planejado para Supabase:
- owner/profissional restritos à própria empresa;
- platform_admin cross-tenant;
- service role somente no backend;
- RLS como defesa adicional, não substituto do RolesGuard;
- nenhuma secret key no frontend.
