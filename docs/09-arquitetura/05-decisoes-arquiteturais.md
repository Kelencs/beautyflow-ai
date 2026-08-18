# Decisões Arquiteturais

## ADR-001 — Dados híbridos
**Decisão:** dados operacionais continuam em Sheets; identidade/App vai para Supabase nesta fase.

## ADR-002 — Gemini
**Decisão:** manter Google Gemini; não introduzir OpenAI no núcleo atual.

## ADR-003 — Backend obrigatório
**Decisão:** frontend não acessa n8n diretamente.

## ADR-004 — Gateway n8n
**Decisão:** APP-WF019 será ponto de entrada do App para workflows operacionais.

## ADR-005 — Onboarding de empresa
**Decisão:** EMP-WF021 será workflow aditivo; não alterar WF001–WF018 para isso.

## ADR-006 — Uma fonte de arquitetura
**Decisão:** `docs/09-arquitetura` é fonte oficial; `docs/arquitetura` fica como compatibilidade.

## ADR-007 — QA fora de docs
**Decisão:** `tests/` é fonte executável/official de QA.
