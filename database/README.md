# Database — Material Legado / Modelo Aspiracional

> **Atenção:** esta pasta **não representa o banco operacional atual do BeautyFlow** e seus arquivos não devem ser executados automaticamente como migrations.

## Estado atual

WF001–WF018 utilizam **Google Sheets** como persistência operacional.

Fonte oficial: `docs/10-modelo-de-dados/`.

## BeautyFlow App — planejado

Supabase/Postgres está aprovado inicialmente para dados próprios da camada App:

- `auth.users`;
- `usuarios`;
- `auditoria_app`;
- `convites`;
- `onboarding_empresas`.

Isso não significa migração imediata das 14 abas operacionais do Sheets.

## Arquivos desta pasta

São materiais históricos/aspiracionais e podem conter:
- documentação misturada com SQL;
- estruturas ainda não reconciliadas;
- arquivos incompletos;
- constraints incompatíveis com decisões posteriores.

`01-create-tables.sql` deve ser tratado como rascunho/documento histórico, não como migration executável.

Exemplo conhecido: `PAGAMENTOS` no modelo atual é histórico transacional. Uma constraint que permita somente um pagamento por agendamento não representa o comportamento atual.

## Futuras migrations

Quando a fase Supabase começar:

1. criar migrations reais e executáveis;
2. separar SQL de Markdown;
3. validar RLS;
4. validar isolamento por `ID_EMPRESA`;
5. reconciliar tipos/chaves com `shared-types`;
6. atualizar `docs/10-modelo-de-dados/`.

**Não executar os arquivos legados desta pasta em produção sem revisão técnica explícita.**
