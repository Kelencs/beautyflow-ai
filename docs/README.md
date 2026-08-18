# Documentação — BeautyFlow AI

> **Versão documental:** 3.0  
> **Sincronização:** 18/08/2026  
> **Estado técnico considerado:** WF001–WF018 atuais + BeautyFlow App na Fase 0A.

## Objetivo

Esta pasta é o índice funcional, de produto, arquitetura e dados do BeautyFlow AI.

A documentação diferencia explicitamente:

- **Implementado** — existe comportamento versionado e correspondente;
- **Parcial** — parte do comportamento existe, mas falta componente/orquestração;
- **Backlog** — requisito válido sem implementação atual;
- **Planejado** — decisão arquitetural aprovada, ainda não implementada;
- **Gap** — regra/requisito válido que diverge da implementação atual.

## Fontes oficiais

| Tema | Fonte oficial |
|---|---|
| Workflows n8n | `n8n/workflows/` |
| Documentação técnica dos workflows | `n8n/documentacao/` |
| Visão e escopo | `docs/01-visao-do-produto/` |
| Requisitos funcionais | `docs/02-requisitos-funcionais/` |
| Requisitos não funcionais | `docs/03-requisitos-nao-funcionais/` |
| Regras de negócio | `docs/04-regras-de-negocio/` |
| Jornada | `docs/05-jornada-do-cliente/` |
| Casos de uso | `docs/06-casos-de-uso/` |
| User Stories | `docs/07-user-stories/` |
| Backlog e planejamento | `docs/08-product-backlog/` |
| Arquitetura | `docs/09-arquitetura/` |
| Modelo de dados | `docs/10-modelo-de-dados/` |
| QA executável/evidências | `tests/` |
| Visão executiva de Product Management | `docs/product-management/` |

## Estrutura

```text
docs/
├── 01-visao-do-produto/
├── 02-requisitos-funcionais/
├── 03-requisitos-nao-funcionais/
├── 04-regras-de-negocio/
├── 05-jornada-do-cliente/
├── 06-casos-de-uso/
├── 07-user-stories/
├── 08-product-backlog/
├── 09-arquitetura/
├── 10-modelo-de-dados/
├── 11-plano-de-teste/
├── arquitetura/              # compatibilidade; 09-arquitetura é oficial
├── product-management/
├── STATUS-DO-PROJETO.md
└── GOVERNANCA-DOCUMENTAL.md
```

## Stack por estado

### MVP n8n — atual
- n8n Cloud;
- WhatsApp Cloud API / Meta;
- Google Gemini;
- Google Sheets;
- Google Calendar;
- Google Drive;
- JavaScript/Code nodes.

### BeautyFlow App — fundação implementada
- monorepo npm workspaces;
- frontend Next.js + TypeScript + Tailwind;
- backend NestJS + TypeScript;
- `libs/shared-types`.

**Fase 0A:** scaffold/fundação. Ainda sem Supabase Auth, autenticação, módulos de domínio completos, APP-WF019 ou EMP-WF021.

### BeautyFlow App — arquitetura aprovada/planejada
- Supabase Auth + Postgres para usuários, convites, onboarding e auditoria do App;
- NestJS como única camada server-side consumida pelo frontend;
- gateway n8n futuro APP-WF019;
- criação de empresa via EMP-WF021;
- dados operacionais permanecem em Google Sheets nesta fase.

## Regra de rastreabilidade

```text
Visão
  ↓
RF / RNF
  ↓
RN
  ↓
UC
  ↓
US
  ↓
Backlog
  ↓
WF / App
  ↓
CT
  ↓
Evidência
```

Nenhum documento deve marcar uma capacidade como concluída apenas porque ela foi planejada.
