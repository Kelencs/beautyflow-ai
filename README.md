# BeautyFlow AI

> Plataforma SaaS de Atendimento Inteligente para Profissionais da Beleza

---

# Visão Geral

O **BeautyFlow AI** é uma plataforma SaaS desenvolvida para automatizar o atendimento de profissionais da área da beleza utilizando Inteligência Artificial, WhatsApp, n8n, Google Calendar e banco de dados.

O objetivo do projeto é reduzir o tempo gasto com atendimento manual, automatizar agendamentos e melhorar a experiência das clientes.

O sistema foi projetado para atender:

* Nail Designers
* Manicures
* Pedicures
* Lash Designers
* Designers de Sobrancelhas
* Esteticistas
* Cabeleireiros
* Barbearias
* Clínicas de Estética
* Salões de Beleza

---

# Objetivos

* Automatizar o atendimento via WhatsApp
* Agendar horários automaticamente
* Consultar disponibilidade em tempo real
* Confirmar atendimentos
* Enviar lembretes automáticos
* Reagendar atendimentos
* Cancelar agendamentos
* Cadastrar clientes automaticamente
* Registrar pagamentos
* Gerar histórico completo
* Disponibilizar uma plataforma SaaS escalável

---

# Principais Funcionalidades

## Atendimento Inteligente

* Atendimento 24 horas
* IA para interpretação de mensagens
* Identificação automática da intenção da cliente
* Atendimento humanizado
* Contexto da conversa

---

## Agenda

* Consulta de disponibilidade
* Agendamento automático
* Reagendamento
* Cancelamento
* Integração com Google Calendar

---

## Cadastro

* Cadastro automático de clientes
* Atualização cadastral
* Histórico completo
* Lista de espera

---

## Comunicação

* Confirmação de agendamento
* Lembretes automáticos
* Pesquisa de satisfação
* Follow-up

---

## Financeiro

* Registro de pagamentos
* Cobranças
* Histórico financeiro

---

# Arquitetura Geral

```text
Cliente
    │
    ▼
WhatsApp Cloud API
    │
    ▼
WF001 - Receber WhatsApp
    │
    ▼
WF002 - IA Atendimento (Gemini)
    │
    ▼
WF003 - Identificar Intenção
    │
 ┌──┼──────────────────────────────────────────────┐
 ▼  ▼                  ▼             ▼             ▼
Agenda          Clientes      Financeiro    Comunicação
 │                 │               │              │
 ▼                 ▼               ▼              ▼
Google Calendar  Banco      Pagamentos      WhatsApp
```

---

# Tecnologias Utilizadas

## Automação

* n8n

## Inteligência Artificial

* Google Gemini

## Comunicação

* WhatsApp Cloud API

## Banco de Dados

* PostgreSQL

## Banco Temporário (MVP)

* Google Sheets

## Agenda

* Google Calendar

## Versionamento

* Git
* GitHub

---

# Estrutura do Projeto

```text
beautyflow-ai/

├── arquitetura/
├── assets/
├── backend/
├── database/
│   ├── 01-create-tables.sql
│   ├── 02-indexes.sql
│   ├── 03-constraints.sql
│   ├── 04-triggers.sql
│   └── 05-seed.sql
│
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
│   └── 10-modelo-de-dados/
│
├── frontend/
│
├── n8n/
│   ├── workflows/
│   ├── documentacao/
│   ├── prompts/
│   └── README.md
│
├── tests/
│
├── CLAUDE.md
└── README.md
```

---

# Workflows

## Atendimento

| Workflow | Descrição            |
| -------- | -------------------- |
| WF001    | Receber WhatsApp     |
| WF002    | IA Atendimento       |
| WF003    | Identificar Intenção |

---

## Agenda

| Workflow | Descrição                 |
| -------- | ------------------------- |
| WF004    | Consultar Disponibilidade |
| WF005    | Criar Agendamento         |
| WF006    | Reagendar                 |
| WF007    | Cancelar                  |

---

## Clientes

| Workflow | Descrição          |
| -------- | ------------------ |
| WF008    | Cadastrar Cliente  |
| WF009    | Atualizar Cadastro |

---

## Financeiro

| Workflow | Descrição           |
| -------- | ------------------- |
| WF010    | Registrar Pagamento |
| WF011    | Cobrança            |

---

## Comunicação

| Workflow | Descrição   |
| -------- | ----------- |
| WF012    | Confirmação |
| WF013    | Lembrete    |
| WF014    | Pesquisa    |
| WF015    | Follow-up   |

---

## Administração

| Workflow | Descrição |
| -------- | --------- |
| WF016    | Backup    |
| WF017    | Logs      |
| WF018    | Limpeza   |

---

# Fluxo do Atendimento

```text
Mensagem WhatsApp

        │

        ▼

Receber Mensagem

        │

        ▼

Identificar Cliente

        │

        ▼

Gemini

        │

        ▼

Identificar Intenção

        │

        ▼

Executar Workflow

        │

        ▼

Atualizar Banco

        │

        ▼

Responder Cliente
```

---

# Banco de Dados

Principais entidades:

* Empresas
* Usuários
* Profissionais
* Clientes
* Serviços
* Categorias
* Agenda
* Agendamentos
* Lista de Espera
* Pagamentos
* Avaliações
* Configurações
* Planos
* Assinaturas
* Logs de Auditoria

---

# Documentação

A documentação está organizada em:

* Visão do Produto
* Requisitos Funcionais
* Requisitos Não Funcionais
* Regras de Negócio
* Jornada da Cliente
* Casos de Uso
* User Stories
* Product Backlog
* Arquitetura
* Modelo de Dados
* Plano de Testes

---

# Ambiente de Desenvolvimento

## Pré-requisitos

* Git
* Node.js (quando aplicável)
* Docker (opcional)
* n8n
* PostgreSQL
* Conta Google
* Google Calendar API
* Google Sheets API
* Meta Developer
* WhatsApp Cloud API
* Chave da API Google Gemini

---

# Como Executar

1. Clone o repositório.

```bash
git clone https://github.com/Kelencs/beautyflow-ai.git
```

2. Acesse a pasta do projeto.

```bash
cd beautyflow-ai
```

3. Configure as credenciais necessárias.

4. Importe os workflows para o n8n.

5. Configure o Google Calendar.

6. Configure o Google Sheets.

7. Configure o WhatsApp Cloud API.

8. Configure o Gemini.

9. Execute os testes.

---

# Roadmap

## MVP

* Atendimento via WhatsApp
* Cadastro de clientes
* Agendamento
* Cancelamento
* Reagendamento
* Google Calendar
* Google Sheets

## Próxima Versão

* PostgreSQL
* Dashboard Web
* Painel Administrativo
* Multiempresa
* Multiusuário
* Financeiro Completo

## Futuro

* Aplicativo Mobile
* Pix Automático
* CRM
* Relatórios Inteligentes
* BI
* IA Preditiva

---

# Segurança

* Tokens nunca devem ser versionados.
* Credenciais devem ser armazenadas em ambiente seguro.
* Dados sensíveis não devem ser registrados em logs.
* Utilizar HTTPS em todas as integrações.
* Aplicar o princípio do menor privilégio para acessos.

---

# Contribuição

1. Crie uma branch.
2. Faça as alterações.
3. Execute os testes.
4. Atualize a documentação.
5. Abra um Pull Request.

---

# Licença

Este projeto é de propriedade de seus mantenedores.

Todos os direitos reservados.

---

# Autor

**BeautyFlow AI**

Plataforma SaaS de Atendimento Inteligente para Profissionais da Beleza.

---

# Status do Projeto

> 🚧 **Em desenvolvimento ativo**

O projeto está evoluindo continuamente, com foco na automação inteligente de atendimento, agendamentos e gestão para profissionais da beleza. Novas funcionalidades e melhorias são adicionadas de forma incremental conforme o roadmap definido.
