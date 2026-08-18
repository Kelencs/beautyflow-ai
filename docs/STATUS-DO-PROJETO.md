# Status do Projeto — BeautyFlow AI

**Data de referência:** 18/08/2026

## Resumo

| Área | Estado |
|---|---|
| WF001–WF018 | Versionados; documentação técnica sincronizada |
| MVP n8n | Em validação/integração por cenário |
| QA | Estrutura CT001–CT018 e evidências em `tests/` |
| Frontend | Fase 0A — scaffold Next.js |
| Backend | Fase 0A — scaffold NestJS |
| Supabase/Auth | Planejado para fase seguinte |
| APP-WF019 | Planejado, não implementado |
| EMP-WF021 | Planejado, não implementado |
| Dados operacionais | Google Sheets |
| Dados de identidade/App | Supabase planejado |
| Migração operacional completa para Postgres | Futuro, não é a estratégia da fase atual |

## Pontos que permanecem como gap

- RN014: limite de um reagendamento não está explicitamente aplicado no WF006.
- consentimento de marketing: WF015 exige autorização, mas a origem/default do consentimento no cadastro deve ser revisada.
- VIP: definição final ainda precisa de decisão de produto.
- histórico e lista de espera: backlog.
- resposta da pesquisa: backlog; WF014 atualmente envia a pesquisa.
- WF013–WF015: lógica por subworkflow; execução periódica depende de orquestração externa.
- multiempresa de produção: revisar defaults/configurações fixas nos workflows antes de escala SaaS.

## Próxima macrofase do App

1. Fase 0B — Supabase/Auth e base server-side.
2. gateway APP-WF019.
3. onboarding/EMP-WF021.
4. módulos de leitura/escrita do App.
5. UI operacional.
6. endurecimento de segurança e observabilidade.
