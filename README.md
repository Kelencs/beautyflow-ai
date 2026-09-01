<div align="center">

# ✦ BEAUTYFLOW AI

### Automação inteligente + SaaS + IA para o setor da beleza

**Atendimento • Agenda • Clientes • Financeiro • Comunicação • Inteligência Artificial**

<br/>

![Status](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-7C3AED?style=for-the-badge)
![SaaS](https://img.shields.io/badge/PRODUTO-SaaS-111827?style=for-the-badge)
![AI](https://img.shields.io/badge/IA-Google%20Gemini-4285F4?style=for-the-badge)
![Automation](https://img.shields.io/badge/AUTOMAÇÃO-n8n-EA4B71?style=for-the-badge)

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp%20Cloud%20API-25D366?style=flat-square&logo=whatsapp&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white)

<br/>

> **Do atendimento no WhatsApp à gestão completa do negócio.**

</div>

---

## 01 // VISÃO DO PRODUTO

O **BeautyFlow AI** é uma plataforma em desenvolvimento para automatizar e organizar a operação de profissionais e empresas do setor da beleza.

A solução combina **Inteligência Artificial, automação de processos e um aplicativo web de gestão**, conectando atendimento, agenda, clientes, profissionais, serviços, financeiro e comunicação em uma única arquitetura.

O projeto nasceu a partir de um problema comum no setor: grande parte da operação acontece manualmente pelo WhatsApp, gerando retrabalho, demora no atendimento, risco de erros, perda de oportunidades e dificuldade para escalar.

O BeautyFlow transforma essas interações em **processos estruturados, rastreáveis e automatizados**.

---

## 02 // IDENTIDADE DO PROJETO

```ts
const beautyFlow = {
  nome: "BeautyFlow AI",
  produto: [
    "SaaS",
    "Automação de Processos",
    "Inteligência Artificial",
    "Gestão para o setor da beleza"
  ],
  objetivo: [
    "Automatizar atendimento no WhatsApp",
    "Organizar agenda e disponibilidade",
    "Centralizar clientes, serviços e profissionais",
    "Apoiar processos financeiros",
    "Automatizar comunicação e follow-up",
    "Evoluir para uma plataforma SaaS de gestão"
  ],
  publicoAlvo: [
    "Nail Designers",
    "Lash Designers",
    "Designers de Sobrancelhas",
    "Esteticistas",
    "Cabeleireiros",
    "Barbearias",
    "Salões de Beleza",
    "Clínicas de Estética",
    "Profissionais Autônomos"
  ],
  pilares: [
    "Atendimento inteligente",
    "Automação de processos",
    "Gestão operacional",
    "Experiência de produto",
    "Arquitetura escalável",
    "Rastreabilidade"
  ],
  statusAtual: "Em desenvolvimento ativo com integração real parcial homologada",
  proximaEtapa: "Decisão do modelo de status da Agenda e preparação da integração real"
};
```

---

## 03 // O PROBLEMA

| Atendimento | Agenda | Financeiro | Comunicação |
|---|---|---|---|
| Respostas repetitivas | Horários manuais | Cobranças dispersas | Follow-up esquecido |
| Demora no WhatsApp | Risco de conflito | Controle fragmentado | Confirmações manuais |
| Falta de contexto | Reagendamentos | Pendências | Pesquisa não padronizada |

No dia a dia de um negócio de beleza, várias tarefas se repetem: responder perguntas, consultar horários, agendar, reagendar, cancelar, confirmar atendimentos, lembrar clientes, registrar pagamentos e fazer follow-up.

O objetivo do BeautyFlow é converter essas ações em **fluxos automáticos de negócio**.

---

## 04 // PROPOSTA DE VALOR

```mermaid
flowchart LR
    A["Mais tempo"] --> E["BeautyFlow AI"]
    B["Menos tarefas manuais"] --> E
    C["Mais organização"] --> E
    D["Atendimento mais rápido"] --> E
    E --> F["Automação"]
    E --> G["Gestão"]
    E --> H["IA"]
    E --> I["Dados"]
```

### O BeautyFlow busca entregar

- menos tarefas operacionais repetitivas;
- atendimento mais rápido;
- agenda organizada;
- comunicação padronizada;
- redução de esquecimentos;
- visão centralizada da operação;
- base para decisões orientadas por dados;
- estrutura preparada para evolução como SaaS.

---

## 05 // ARQUITETURA GERAL

O BeautyFlow possui hoje **duas grandes camadas integradas de forma progressiva**.

### Núcleo operacional

```mermaid
flowchart LR
    A["Cliente"] --> B["WhatsApp Cloud API"]
    B --> C["n8n Cloud"]
    C --> D["Google Gemini"]
    C --> E["Google Sheets"]
    C --> F["Google Calendar"]
    C --> G["Google Drive"]
```

### BeautyFlow App

```mermaid
flowchart LR
    A["Usuário"] --> B["Next.js"]
    B --> C["NestJS"]
    C --> D["Supabase"]
    C --> E["APP-WF019"]
    E --> F["Google Sheets"]
```

### Arquitetura atual de integração

```mermaid
flowchart LR
    A["BeautyFlow App<br/>Next.js"] --> B["Backend<br/>NestJS"]
    B --> C["Supabase<br/>Auth + identidade"]
    B --> D["APP-WF019<br/>Gateway read-only"]
    D --> E["Google Sheets<br/>dados operacionais"]
```

> O frontend nunca chama o n8n diretamente. O NestJS permanece como backend principal e fronteira de autenticação, autorização, resolução de tenant, regras de negócio e orquestração. O APP-WF019 atua como **gateway/adaptador de integração** com as fontes operacionais.

---

## 06 // FLUXO PRINCIPAL DO WHATSAPP

```mermaid
flowchart TD
    A["Cliente envia mensagem"] --> B["WF001<br/>Receber WhatsApp"]
    B --> C["WF002<br/>IA Atendimento"]
    C --> D["Cliente existe?"]
    D -->|"Não"| E["WF008<br/>Cadastrar Cliente"]
    D -->|"Sim"| F["WF003<br/>Identificar Intenção"]
    E --> F
    F --> G{"Intenção"}
    G -->|"Consultar horário"| H["WF004<br/>Consultar Disponibilidade"]
    G -->|"Agendar"| I["WF005<br/>Criar Agendamento"]
    G -->|"Reagendar"| J["WF006<br/>Reagendar"]
    G -->|"Cancelar"| K["WF007<br/>Cancelar"]
    G -->|"Outro"| L["WF012<br/>Comunicação"]
    H --> M["Resposta ao cliente"]
    I --> M
    J --> M
    K --> M
    L --> M
```

---

## 07 // MAPA DOS WORKFLOWS

| Domínio | Workflows | Responsabilidade |
|---|---|---|
| 💬 Atendimento | WF001–WF003 | Recepção, IA e intenção |
| 📅 Agenda | WF004–WF007 | Disponibilidade, agendamento, reagendamento e cancelamento |
| 👤 Clientes | WF008–WF009 | Cadastro e atualização |
| 💳 Financeiro | WF010–WF011 | Pagamentos e cobranças |
| 📣 Comunicação | WF012–WF015 | Mensagens, lembretes, pesquisa e follow-up |
| ⚙️ Administração | WF016–WF018 | Backup, logs e limpeza |
| 🧩 App | WF019 | Gateway read-only entre NestJS e dados operacionais |

---

## 08 // VISÃO DOS WORKFLOWS

```text
ATENDIMENTO
├── WF001 — Receber WhatsApp
├── WF002 — IA Atendimento
└── WF003 — Identificar Intenção

AGENDA
├── WF004 — Consultar Disponibilidade
├── WF005 — Criar Agendamento
├── WF006 — Reagendar
└── WF007 — Cancelar

CLIENTES
├── WF008 — Cadastrar Cliente
└── WF009 — Atualizar Cliente

FINANCEIRO
├── WF010 — Registrar Pagamento
└── WF011 — Cobrança

COMUNICAÇÃO
├── WF012 — Confirmação / Comunicação
├── WF013 — Lembrete
├── WF014 — Pesquisa de Satisfação
└── WF015 — Follow-up

ADMINISTRAÇÃO
├── WF016 — Backup
├── WF017 — Logs
└── WF018 — Limpeza

APP
└── WF019 — Gateway App
```

---

## 09 // BEAUTYFLOW APP

O BeautyFlow evoluiu de uma arquitetura focada apenas em automações para uma aplicação web completa.

### Módulos do App

```mermaid
flowchart TD
    A["BeautyFlow App"]
    A --> B["Dashboard"]
    A --> C["Agenda"]
    A --> D["Clientes"]
    A --> E["Serviços"]
    A --> F["Profissionais"]
    A --> G["Financeiro"]
    A --> H["Comunicação"]
    A --> I["Relatórios"]
    A --> J["IA"]
    A --> K["Configurações"]
```

### Operações reais homologadas no APP-WF019

| Operação | Situação |
|---|---|
| `clientes.listar` | ✅ Homologada |
| `servicos.listar` | ✅ Homologada |
| `profissionais.listar` | ✅ Homologada |
| `empresa.obter` | ✅ Homologada |
| `disponibilidades.listar` | ✅ Homologada |

### Telas com dados reais

| Tela | Fonte | Situação |
|---|---|---|
| `/clientes` | APP-WF019 → CLIENTES | ✅ Homologada |
| `/servicos` | APP-WF019 → SERVICOS | ✅ Homologada |
| `/profissionais` | APP-WF019 → PROFISSIONAIS | ✅ Homologada |
| `/configuracoes` | APP-WF019 → EMPRESAS + DISPONIBILIDADES + ProfissionaisService | ✅ Homologada |
| `/agenda` | Mock | ⏳ Decisão de domínio pendente |
| `/financeiro` | Mock | ⏳ Integração real pendente |
| `/comunicacao` | Mock | ⏳ Integração real pendente |
| `/ia` | Mock/parcial | ⏳ Integração real pendente |

### Backend NestJS

```text
Auth
Agenda
Clientes
Serviços
Profissionais
Dashboard
Financeiro
Comunicação
Relatórios
Configurações
IA
N8nGateway
```

---

## 10 // STACK TECNOLÓGICA

### Desenvolvimento

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Dados e autenticação

![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![Google Calendar](https://img.shields.io/badge/Google_Calendar-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

### IA e automação

![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![APIs](https://img.shields.io/badge/APIs-111827?style=for-the-badge)

### Engenharia

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 11 // MODELO DE DADOS OPERACIONAL

```text
EMPRESAS
PROFISSIONAIS
CLIENTES
SERVICOS
AGENDAMENTOS
PAGAMENTOS
COBRANCAS
MENSAGENS
IA_MEMORIA
DISPONIBILIDADES
AVALIACOES / PESQUISAS
FOLLOWUPS
LEMBRETES
LOGS
DOMINIOS
```

### Princípio multiempresa

```mermaid
flowchart TD
    A["EMPRESA"]
    A --> B["PROFISSIONAIS"]
    A --> C["CLIENTES"]
    A --> D["SERVIÇOS"]
    A --> E["AGENDAMENTOS"]
    A --> F["PAGAMENTOS"]
    A --> G["MENSAGENS"]
```

---

## 12 // SEGURANÇA E MULTI-TENANCY

O BeautyFlow App foi estruturado para que **segurança não dependa apenas da interface**.

### Princípios

- autenticação via Supabase;
- autorização efetiva no backend;
- resolução de empresa e usuário server-side;
- `idEmpresa` obtido do contexto autenticado, não do browser;
- isolamento multiempresa;
- restrição por perfil;
- frontend sem acesso direto ao n8n;
- gateway n8n autenticado por Header Auth server-to-server;
- chaves privadas somente no servidor;
- prevenção de acesso cross-tenant;
- variáveis sensíveis fora do versionamento.

### Fluxo de autorização e integração

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Next.js
    participant B as NestJS
    participant S as Supabase
    participant W as APP-WF019
    participant G as Google Sheets

    U->>F: Login / navegação
    F->>S: Sessão
    F->>B: Requisição autenticada
    B->>S: Valida usuário, empresa e perfil
    B->>W: Operação + tenant resolvido server-side
    W->>G: Consulta filtrada por ID_EMPRESA
    G-->>W: Dados operacionais
    W-->>B: Envelope normalizado
    B-->>F: Contrato público autorizado
```

---

## 13 // CONTRATOS COMPARTILHADOS

O projeto utiliza `libs/shared-types/` para reduzir duplicação de contratos entre frontend e backend.

```mermaid
flowchart LR
    A["shared-types"] --> B["Next.js"]
    A --> C["NestJS"]
```

---

## 14 // RASTREABILIDADE

```mermaid
flowchart LR
    A["Visão"] --> B["RF / RNF"]
    B --> C["Regras de Negócio"]
    C --> D["Casos de Uso"]
    D --> E["User Stories"]
    E --> F["Backlog"]
    F --> G["Workflow / App"]
    G --> H["Casos de Teste"]
    H --> I["Evidências"]
```

### Artefatos trabalhados

- requisitos funcionais;
- requisitos não funcionais;
- regras de negócio;
- casos de uso;
- user stories;
- critérios de aceite;
- arquitetura;
- casos de teste;
- evidências;
- matriz de rastreabilidade;
- documentação dos workflows.

---

## 15 // TESTES E QUALIDADE

O checkpoint read-only atual foi fechado com **424 testes backend em 20 suítes, 100% verdes**, além de lint backend/frontend e builds de `shared-types`, backend e frontend concluídos com sucesso.

```text
WF001 ↔ CT001
WF002 ↔ CT002
WF003 ↔ CT003
...
WF018 ↔ CT018

APP-WF019
├── testes de contrato
├── simulação do workflow
├── hardening de upstream
└── homologação E2E das 5 operações atuais
```

> Um arquivo JSON versionado não significa automaticamente que o workflow está validado. A classificação de pronto considera implementação, testes, evidências, regras de negócio, tratamento de erro, regressão e documentação.

---

## 16 // STATUS ATUAL

| Área | Status |
|---|---|
| WF001–WF018 | ✅ Versionados |
| Documentação n8n | ✅ Estruturada |
| Requisitos / regras / testes | ✅ Documentados |
| Frontend Next.js | ✅ Estruturado |
| Backend NestJS | ✅ Estruturado |
| Supabase Auth | ✅ Implementado |
| APP-WF019 | ✅ Implementado — 5 operações read-only homologadas |
| Clientes | ✅ Dados reais homologados |
| Serviços | ✅ Dados reais homologados |
| Profissionais | ✅ Dados reais homologados |
| Configurações | ✅ Dados reais homologados |
| Dashboard | 🟡 Estruturado; depende parcialmente dos módulos integrados |
| Relatórios | 🟡 Estruturado; depende parcialmente dos módulos integrados |
| Agenda | 🟡 Estruturada em mock; integração real bloqueada por decisão de status |
| Financeiro | 🟡 Estruturado em mock; integração real pendente |
| Comunicação | 🟡 Estruturada em mock; integração real pendente |
| IA | 🟡 Estruturada; persistência/memória real ainda incompleta |
| Hardening para produção | 🟡 Pendente |
| Escala SaaS | 🟡 Evolução futura |

---

## 17 // BLOQUEIOS E DÍVIDAS CONHECIDAS

- **Agenda:** a fonte real de `AGENDAMENTOS.STATUS` usa `AGENDADO`/`CANCELADO`, enquanto o contrato atual do App usa `PENDENTE`/`CONFIRMADO`/`CONCLUIDO`/`CANCELADO`; a decisão de domínio precisa ser tomada antes de `agendamentos.listar`.
- **Google Calendar legado:** workflows antigos ainda possuem configuração fixa associada ao ambiente original e exigem revisão antes da escala multiempresa.
- **Financeiro:** integração read-only exige composição de `AGENDAMENTOS` + `PAGAMENTOS` e não foi implementada no APP-WF019 atual.
- **Comunicação:** histórico depende de múltiplas fontes (`MENSAGENS`, `LEMBRETES`, `PESQUISA`, `FOLLOWUPS`, `COBRANCAS`) sem correlação única consolidada.
- **IA:** `IA_MEMORIA` é lida pelo fluxo conversacional, mas não há writer persistente confirmado no conjunto WF001–WF018.
- **Performance:** chamadas reais observadas de `clientes.listar` e `servicos.listar` ficaram na faixa de ~4,8–4,9 s; otimização/cache permanece dívida não bloqueante.
- **Homologação:** o JSON versionado do WF019 aponta para `BEAUTYFLOW3.1`; no n8n Cloud de homologação os 5 nodes de Sheets foram reapontados manualmente para `BEAUTYFLOW_HOMOLOGACAO`.

---

## 18 // ROADMAP

```mermaid
flowchart LR
    A["WF001-WF018"] --> B["BeautyFlow App"]
    B --> C["Supabase + Auth"]
    C --> D["APP-WF019 read-only"]
    D --> E["Clientes / Serviços / Profissionais / Configurações reais"]
    E --> F["Decisão de domínio da Agenda"]
    F --> G["Agenda real"]
    G --> H["Financeiro / Comunicação / IA"]
    H --> I["Testes E2E ampliados"]
    I --> J["Hardening"]
    J --> K["MVP Comercial"]
    K --> L["Escala SaaS"]
```

### Próximas prioridades

1. manter documentação e código sincronizados;
2. concluir a decisão de domínio do status da Agenda;
3. ajustar contratos/mocks/testes da Agenda de forma controlada;
4. implementar `agendamentos.listar` somente após essa decisão;
5. homologar a Agenda com dados reais;
6. avançar para Financeiro, Comunicação e IA;
7. ampliar observabilidade e otimização de performance;
8. preparar hardening e MVP comercial.

---

## 19 // ESTRUTURA DO REPOSITÓRIO

```text
beautyflow-ai/
│
├── backend/                  # API NestJS
├── frontend/                 # BeautyFlow App em Next.js
├── libs/
│   └── shared-types/         # Contratos compartilhados
├── n8n/
│   ├── workflows/            # WF001-WF019
│   └── documentacao/         # Documentação técnica
├── docs/                     # Requisitos, arquitetura e status
├── tests/                    # Testes e rastreabilidade
├── database/
├── scripts/
├── CLAUDE.md
└── README.md
```

---

## 20 // COMO EXECUTAR

### Pré-requisitos

```text
Node.js 20+
npm 10+
```

### Instalação

```bash
npm install
```

### Frontend + Backend

```bash
npm run dev
```

### Somente frontend

```bash
npm run dev:frontend
```

### Somente backend

```bash
npm run dev:backend
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Testes

```bash
npm run test
```

### Endereços locais padrão

```text
Frontend → http://localhost:3000
Backend  → http://localhost:3001
```

---

## 21 // DIFERENCIAIS DO CASE

O BeautyFlow demonstra uma abordagem de **produto de ponta a ponta**:

```text
PROBLEMA
   ↓
DISCOVERY
   ↓
REQUISITOS
   ↓
REGRAS DE NEGÓCIO
   ↓
USER STORIES
   ↓
ARQUITETURA
   ↓
AUTOMAÇÃO
   ↓
BACKEND
   ↓
FRONTEND
   ↓
TESTES
   ↓
EVOLUÇÃO DO PRODUTO
```

### Competências demonstradas

![Product](https://img.shields.io/badge/PRODUCT-Product%20Discovery-7C3AED?style=for-the-badge)
![Requirements](https://img.shields.io/badge/REQUIREMENTS-Análise%20de%20Requisitos-2563EB?style=for-the-badge)
![Business](https://img.shields.io/badge/BUSINESS-Regras%20de%20Negócio-0891B2?style=for-the-badge)
![Automation](https://img.shields.io/badge/AUTOMATION-n8n-EA4B71?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-LLM%20Integration-4285F4?style=for-the-badge)
![API](https://img.shields.io/badge/API-Integrações-111827?style=for-the-badge)
![QA](https://img.shields.io/badge/QUALITY-Testes%20e%20Rastreabilidade-16A34A?style=for-the-badge)

---

## 22 // EVOLUÇÃO DO PRODUTO

```mermaid
journey
    title Evolução do BeautyFlow
    section Automação
      Modelagem do negócio: 5
      WF001-WF018: 5
      Testes e documentação: 5
    section Aplicação
      Frontend Next.js: 5
      Backend NestJS: 5
      Supabase e Auth: 5
    section Integração
      APP-WF019 read-only: 5
      Clientes/Serviços/Profissionais/Configurações reais: 5
      Agenda real: 2
      Demais módulos reais: 1
      Produção SaaS: 1
```

---

## 23 // PRINCÍPIOS DO PROJETO

```text
Entender o problema
        ↓
Modelar a regra
        ↓
Automatizar o processo
        ↓
Validar o comportamento
        ↓
Medir e aprender
        ↓
Evoluir o produto
```

---

## 24 // REPOSITÓRIO

<div align="center">

### GitHub

**[github.com/Kelencs/beautyflow-ai](https://github.com/Kelencs/beautyflow-ai)**

<br/>

![Repository](https://img.shields.io/badge/REPOSITÓRIO-BeautyFlow%20AI-111827?style=for-the-badge&logo=github)
![Portfolio](https://img.shields.io/badge/CASE-DE%20PORTFÓLIO-7C3AED?style=for-the-badge)

</div>

---

## 25 // AUTORIA

<div align="center">

### Kelen Cristina

**Product Owner • Análise de Requisitos • Automação • IA • Dados**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Kelencs-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kelencs)

<br/>

> **Entender. Planejar. Automatizar. Evoluir.**

</div>

---

<div align="center">

## ✦ BEAUTYFLOW AI

**Transformando processos manuais em experiências digitais inteligentes.**

`Product` • `Requirements` • `Automation` • `AI` • `Data` • `SaaS`

<br/>

© 2026 BeautyFlow AI

</div>