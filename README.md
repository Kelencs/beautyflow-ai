# BeautyFlow AI

<p align="center">
  <strong>Plataforma SaaS de atendimento inteligente e gestão para profissionais da beleza</strong>
</p>

<p align="center">
  WhatsApp + n8n + Google Gemini + Google Sheets + Google Calendar + Google Drive,
  com evolução para um BeautyFlow App em Next.js/NestJS.
</p>

---

## Status do projeto

> **Referência documental:** 19/08/2026  
> **Núcleo n8n:** WF001–WF018 versionados  
> **BeautyFlow App:** Fase 0A — fundação/scaffold  
> **Supabase/Auth:** planejado

O BeautyFlow diferencia claramente:

- **Implementado** — comportamento versionado;
- **Validado** — comportamento com evidência suficiente;
- **Parcial** — parte implementada/validada, com pendência conhecida;
- **Backlog** — requisito ainda não implementado;
- **Planejado** — arquitetura aprovada, ainda não implementada;
- **Gap** — requisito/regra válida que ainda diverge da implementação.

Status técnico oficial: `docs/STATUS-DO-PROJETO.md`.

---

# Sobre o BeautyFlow

O BeautyFlow AI automatiza tarefas operacionais de profissionais e empresas do setor de beleza, com foco em:

- atendimento pelo WhatsApp;
- agenda;
- clientes;
- financeiro;
- comunicação;
- automações administrativas.

O núcleo atual utiliza n8n como camada de automação. O projeto também possui a fundação de um aplicativo web para que proprietários e profissionais possam futuramente operar agenda, clientes, financeiro, comunicação, relatórios e configurações.

## Público-alvo

- nail designers;
- manicures e pedicures;
- lash designers;
- designers de sobrancelhas;
- esteticistas;
- cabeleireiros e barbearias;
- salões de beleza;
- clínicas de estética;
- profissionais autônomos.

---

# Arquitetura atual

## Núcleo operacional — implementado

```text
Cliente
  ↓
WhatsApp Cloud API / Meta
  ↓
n8n Cloud
  ├── Google Gemini
  ├── Google Sheets
  ├── Google Calendar
  └── Google Drive
```

A persistência operacional dos WF001–WF018 permanece em **Google Sheets** nesta fase.

## BeautyFlow App — Fase 0A

```text
frontend/
  Next.js + TypeScript + Tailwind

backend/
  NestJS + TypeScript

libs/shared-types/
  contratos/tipos compartilhados
```

A Fase 0A é uma fundação técnica. Ela ainda não representa o aplicativo operacional completo.

## Arquitetura aprovada — planejada

```text
Next.js
  ↓
NestJS
  ├── Supabase Auth/Postgres
  ↓
APP-WF019
  ↓
WFs operacionais n8n
```

Planejado:

- Supabase Auth;
- tabelas `usuarios`, `auditoria_app`, `convites`, `onboarding_empresas`;
- autorização server-side;
- APP-WF019 como gateway;
- EMP-WF021 para criação/onboarding de empresa;
- telas e módulos operacionais.

**Os dados operacionais continuam em Google Sheets nesta fase.**

Uma migração operacional completa para PostgreSQL é futura.

Arquitetura oficial: `docs/09-arquitetura/`.

---

# Fluxo principal do WhatsApp

```text
WhatsApp
  ↓
WF001 — Receber WhatsApp
  ↓
WF002 — IA Atendimento
  ├── WF008 — Cadastrar Cliente, quando necessário
  ↓
WF003 — Identificar Intenção
  ├── AGENDAR                   → WF005
  ├── CONSULTAR_DISPONIBILIDADE → WF004
  ├── REAGENDAR                 → WF006
  ├── CANCELAR                  → WF007
  └── OUTRO/fallback            → WF012
```

WF003 **não chama genericamente Clientes, Financeiro ou Administração**.

---

# Workflows n8n

| Módulo | Workflows |
|---|---|
| Atendimento | WF001–WF003 |
| Agenda | WF004–WF007 |
| Clientes | WF008–WF009 |
| Financeiro | WF010–WF011 |
| Comunicação | WF012–WF015 |
| Administração | WF016–WF018 |

Documentação técnica: `n8n/documentacao/`.

---

# Funcionalidades

## Implementadas no núcleo n8n

- recebimento de mensagens via WhatsApp;
- resolução/cadastro de cliente;
- atendimento com Google Gemini;
- identificação de intenção;
- consulta de disponibilidade;
- criação de agendamento;
- reagendamento;
- cancelamento;
- atualização cadastral;
- registro de pagamento;
- cobrança;
- envio centralizado de comunicação;
- lembretes;
- pesquisa pós-atendimento;
- follow-up/reengajamento;
- backup;
- logging;
- retenção controlada de logs.

## Parciais ou dependentes de orquestração

- FAQ/serviços/preços/duração via IA;
- execução periódica de lembretes;
- execução periódica de pesquisas;
- execução periódica de follow-ups.

WF013–WF015 são subworkflows e **não possuem Schedule/Cron interno no JSON atual**.

## Backlog / não apresentar como pronto

- consulta do próximo agendamento;
- histórico operacional no BeautyFlow App;
- lista de espera;
- captura da nota/comentário da pesquisa;
- campanhas genéricas;
- definição final de VIP.

---

# Stack tecnológica

## Atual

| Tecnologia | Finalidade |
|---|---|
| n8n Cloud | Orquestração |
| WhatsApp Cloud API / Meta | Canal de atendimento |
| Google Gemini | IA |
| Google Sheets | Dados operacionais |
| Google Calendar | Agenda |
| Google Drive | Backup |
| Git / GitHub | Versionamento |

## BeautyFlow App — fundação

| Tecnologia | Estado |
|---|---|
| Next.js | Fase 0A implementada |
| TypeScript | Implementado |
| Tailwind CSS | Implementado no scaffold |
| NestJS | Fase 0A implementada |
| shared-types | Fundação implementada |

## Planejado

| Tecnologia / componente | Uso |
|---|---|
| Supabase Auth | Autenticação |
| Supabase/Postgres | Usuários, convites, onboarding e auditoria do App |
| APP-WF019 | Gateway futuro |
| EMP-WF021 | Criação/onboarding de empresa |

---

# Dados operacionais atuais

O Google Sheets utiliza 14 abas:

```text
AGENDAMENTOS
CLIENTES
COBRANCAS
DISPONIBILIDADES
EMPRESAS
FOLLOWUPS
IA_MEMORIA
LEMBRETES
LOGS
MENSAGENS
PAGAMENTOS
PESQUISAS
PROFISSIONAIS
SERVICOS
```

Não confundir a pasta `database/` com o banco operacional atual.

Modelo oficial: `docs/10-modelo-de-dados/`.

---

# Gaps técnicos conhecidos

Os seguintes gaps permanecem deliberadamente visíveis:

- RN014 — máximo de um reagendamento ainda não está explicitamente aplicado no WF006;
- origem/default de consentimento de marketing precisa de revisão;
- critério de VIP ainda depende de decisão;
- WF014 envia pesquisa, mas não captura nota/comentário;
- WF013–WF015 dependem de orquestração periódica externa;
- alguns fluxos ainda usam `EMP001` fixo/fallback;
- workflows de agenda possuem Calendar configurado diretamente;
- hardening multiempresa é necessário antes de escala SaaS;
- WF001 responde ao challenge sem comparação explícita do verify token no JSON atual.

Um gap documentado é um débito técnico/funcional conhecido, não uma inconsistência documental.

---

# Estrutura principal

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

---

# Fontes oficiais

| Tema | Fonte |
|---|---|
| Documentação geral | `docs/README.md` |
| Status | `docs/STATUS-DO-PROJETO.md` |
| Governança | `docs/GOVERNANCA-DOCUMENTAL.md` |
| Arquitetura | `docs/09-arquitetura/` |
| Modelo de dados | `docs/10-modelo-de-dados/` |
| Workflows | `n8n/workflows/` |
| Docs n8n | `n8n/documentacao/` |
| QA | `tests/` |
| Rastreabilidade | `tests/Matriz-de-Rastreabilidade.md` |

Cadeia de rastreabilidade:

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

---

# Desenvolvimento do BeautyFlow App

A partir da raiz:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
```

Consulte:

- `frontend/README.md`
- `backend/README.md`

---

# Testes

A fonte oficial de QA é `tests/`.

Correspondência principal:

```text
WF001 ↔ CT001
WF002 ↔ CT002
...
WF018 ↔ CT018
```

A presença do JSON não significa automaticamente que um workflow está validado. O status deve vir das evidências.

---

# Segurança

Nunca versionar:

- tokens;
- API keys;
- senhas;
- credenciais OAuth;
- private keys;
- JWTs;
- Supabase Secret Key;
- dados pessoais reais desnecessários.

Credenciais n8n devem utilizar o mecanismo de Credentials da plataforma.

---

# Roadmap resumido

## Núcleo n8n

WF001–WF018 versionados, com validações e gaps acompanhados em `tests/` e `docs/`.

## BeautyFlow App

Próximas macroetapas:

1. Supabase/Auth e base server-side;
2. APP-WF019;
3. onboarding/EMP-WF021;
4. módulos de leitura/escrita;
5. UI operacional;
6. hardening de segurança, multiempresa e observabilidade.

BeautyFlow AI © 2026
