# BeautyFlow AI

<p align="center"><strong>Plataforma SaaS de atendimento inteligente e gestão para profissionais da beleza</strong></p>

<p align="center">WhatsApp + n8n + Google Gemini + Google Sheets + Google Calendar + Google Drive, com evolução para um BeautyFlow App em Next.js/NestJS.</p>

---

## Status do projeto

> **Referência documental:** 19/08/2026  
> **Núcleo n8n:** WF001–WF018 versionados  
> **BeautyFlow App:** Fase 0A — fundação/scaffold  
> **Supabase/Auth:** planejado

O projeto diferencia **Implementado**, **Validado**, **Parcial**, **Backlog**, **Planejado** e **Gap**. Consulte `docs/STATUS-DO-PROJETO.md`.

## Arquitetura atual

O núcleo operacional usa:

- n8n Cloud;
- WhatsApp Cloud API / Meta;
- Google Gemini;
- Google Sheets;
- Google Calendar;
- Google Drive.

Os dados operacionais dos WF001–WF018 permanecem em **Google Sheets** nesta fase.

### BeautyFlow App — fundação

```text
frontend/          Next.js + TypeScript + Tailwind
backend/           NestJS + TypeScript
libs/shared-types/ contratos compartilhados
```

A Fase 0A é uma fundação. Ainda não é a aplicação operacional completa.

### Arquitetura aprovada — planejada

```text
Next.js
  ↓
NestJS
  ├── Supabase Auth/Postgres (planejado)
  ↓
APP-WF019 (planejado)
  ↓
WFs operacionais n8n
```

Planejado também: `EMP-WF021`, autorização no backend, usuários, convites, onboarding, auditoria e telas de domínio.

**Migração operacional completa para PostgreSQL é futura.**

Arquitetura oficial: `docs/09-arquitetura/`.

---

## Fluxo principal do WhatsApp

```text
WhatsApp
  ↓
WF001 — Receber WhatsApp
  ↓
WF002 — IA Atendimento
  ├── WF008 — cadastro quando necessário
  ↓
WF003 — Identificar Intenção
  ├── AGENDAR                   → WF005
  ├── CONSULTAR_DISPONIBILIDADE → WF004
  ├── REAGENDAR                 → WF006
  ├── CANCELAR                  → WF007
  └── OUTRO/fallback            → WF012
```

WF003 não chama genericamente Clientes, Financeiro ou Administração.

## Workflows

| Módulo | Workflows |
|---|---|
| Atendimento | WF001–WF003 |
| Agenda | WF004–WF007 |
| Clientes | WF008–WF009 |
| Financeiro | WF010–WF011 |
| Comunicação | WF012–WF015 |
| Administração | WF016–WF018 |

Documentação técnica: `n8n/documentacao/`.

## Funcionalidades atuais

Implementadas no núcleo n8n:

- atendimento e entrada WhatsApp;
- cliente/contexto/Gemini;
- roteamento de intenção;
- disponibilidade, criação, reagendamento e cancelamento;
- cadastro e atualização de cliente;
- pagamentos e cobrança;
- comunicação, lembrete, pesquisa e follow-up;
- backup, logs e retenção.

Parciais/dependentes de orquestração:

- lembretes periódicos;
- pesquisa periódica;
- follow-up periódico;
- FAQ/serviços/preços/duração via IA.

WF013–WF015 não possuem Schedule/Cron interno no JSON atual.

Backlog/não apresentar como pronto:

- próximo agendamento;
- histórico operacional no App;
- lista de espera;
- captura de nota/comentário da pesquisa;
- campanhas genéricas;
- definição final de VIP.

## Stack

### Atual

| Tecnologia | Finalidade |
|---|---|
| n8n Cloud | Automação |
| WhatsApp Cloud API | Atendimento |
| Google Gemini | IA |
| Google Sheets | Dados operacionais |
| Google Calendar | Agenda |
| Google Drive | Backup |
| Git/GitHub | Versionamento |

### App — Fase 0A

- Next.js;
- NestJS;
- TypeScript;
- Tailwind;
- `libs/shared-types`.

### Planejado

- Supabase Auth/Postgres para a camada App;
- APP-WF019;
- EMP-WF021;
- módulos/telas operacionais.

## Dados operacionais atuais

Google Sheets com 14 abas:

`AGENDAMENTOS`, `CLIENTES`, `COBRANCAS`, `DISPONIBILIDADES`, `EMPRESAS`, `FOLLOWUPS`, `IA_MEMORIA`, `LEMBRETES`, `LOGS`, `MENSAGENS`, `PAGAMENTOS`, `PESQUISAS`, `PROFISSIONAIS`, `SERVICOS`.

Modelo oficial: `docs/10-modelo-de-dados/`.

## Gaps conhecidos

- RN014 — limite de um reagendamento ainda não está explicitamente aplicado no WF006;
- origem/default do consentimento de marketing precisa de revisão;
- VIP ainda depende de decisão de produto;
- WF014 envia pesquisa, mas não captura resposta;
- WF013–WF015 dependem de orquestração externa;
- existem defaults/fallbacks `EMP001`;
- Calendar ainda possui configuração direta em workflows de agenda;
- hardening multiempresa é necessário;
- WF001 responde ao challenge sem comparação explícita do verify token no JSON atual.

## Estrutura principal

```text
beautyflow-ai/
├── backend/
├── frontend/
├── libs/shared-types/
├── n8n/
│   ├── workflows/
│   └── documentacao/
├── docs/
│   ├── 01-visao-do-produto/
│   ├── 02-requisitos-funcionais/
│   ├── 03-requisitos-nao-funcionais/
│   ├── 04-regras-de-negocio/
│   ├── 05-jornada-do-cliente/
│   ├── 06-casos-de-uso/
│   ├── 07-user-stories/
│   ├── 08-product-backlog/
│   ├── 09-arquitetura/
│   ├── 10-modelo-de-dados/
│   └── 11-plano-de-teste/
├── tests/
├── database/
├── CLAUDE.md
└── README.md
```

## Fontes oficiais

| Tema | Fonte |
|---|---|
| Documentação | `docs/README.md` |
| Status | `docs/STATUS-DO-PROJETO.md` |
| Arquitetura | `docs/09-arquitetura/` |
| Modelo de dados | `docs/10-modelo-de-dados/` |
| Workflows | `n8n/workflows/` |
| Docs n8n | `n8n/documentacao/` |
| QA | `tests/` |
| Rastreabilidade | `tests/Matriz-de-Rastreabilidade.md` |

```text
Visão → RF/RNF → RN → UC → US → Backlog → WF/App → CT → Evidência
```

## Desenvolvimento do App

A partir da raiz:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
```

## Segurança

Nunca versionar tokens, senhas, API keys, client secrets, private keys, JWTs, Supabase Secret Key ou dados pessoais reais desnecessários.

## Roadmap resumido

1. Supabase/Auth e base server-side;
2. APP-WF019;
3. onboarding/EMP-WF021;
4. módulos de leitura/escrita;
5. UI operacional;
6. hardening de segurança, multiempresa e observabilidade.

BeautyFlow AI © 2026
