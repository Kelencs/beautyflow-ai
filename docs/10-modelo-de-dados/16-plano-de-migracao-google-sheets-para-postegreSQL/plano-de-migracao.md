# Plano de Migração Sheets → PostgreSQL

**Status:** futuro.

A estratégia atual não prevê migração operacional completa.

Quando aprovada:
1. congelar schema origem;
2. mapear colunas reais;
3. definir IDs/FKs;
4. limpar inconsistências;
5. migrar em staging;
6. executar reconciliação;
7. adaptar workflows/gateway;
8. fazer cutover controlado;
9. manter rollback.

Não iniciar migração apenas para "seguir o plano antigo".
