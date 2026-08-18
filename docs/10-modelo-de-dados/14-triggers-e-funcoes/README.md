# Triggers e Funções

Evitar mover regras de negócio atuais do n8n para triggers SQL sem decisão arquitetural.

Triggers aceitáveis na camada App:
- timestamps;
- housekeeping simples;
- funções auxiliares de RLS/auditoria, quando aprovadas.
