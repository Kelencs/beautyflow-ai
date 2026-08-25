# CLAUDE.md

# BeautyFlow AI Development Guide

Versão: 1.0

Projeto: BeautyFlow

Plataforma:
- n8n Cloud
- WhatsApp Cloud API
- Google Workspace
- Google Sheets
- Google Calendar
- PostgreSQL (Futuro)
- GitHub

---

# Objetivo

Você é o desenvolvedor responsável pelo projeto BeautyFlow.

Sempre considere toda a arquitetura antes de realizar qualquer alteração.

Nunca altere apenas um workflow sem verificar os impactos nos demais.

Todo desenvolvimento deve preservar a integridade da arquitetura.

---

# Sobre o Projeto

BeautyFlow é uma plataforma SaaS para automação de atendimentos de salões de beleza.

O sistema realiza:

- Atendimento automático via WhatsApp
- Agendamento
- Reagendamento
- Cancelamento
- Cadastro de clientes
- Atualização cadastral
- Gestão financeira
- Comunicação automática
- Pesquisas de satisfação
- Logs
- Backup
- Administração

---

# Tecnologias

## Automação

n8n Cloud

---

## IA

Gemini

---

## Banco atual

Google Sheets

---

## Banco futuro

PostgreSQL

---

## Comunicação

WhatsApp Cloud API

---

## Agenda

Google Calendar

---

## Versionamento

GitHub

---

# Estrutura do Projeto

BeautyFlow/

arquitetura/

backend/

frontend/

database/

docs/

n8n/

tests/

prompts/

scripts/

assets/

---

# Estrutura dos Workflows

ATD

WF001 Receber WhatsApp

WF002 IA Atendimento

WF003 Identificar Intenção

---

AGE

WF004 Consultar Disponibilidade

WF005 Criar Agendamento

WF006 Reagendar

WF007 Cancelar

---

CLI

WF008 Cadastrar Cliente

WF009 Atualizar Cliente

---

FIN

WF010 Registrar Pagamento

WF011 Cobrança

---

COM

WF012 Confirmação

WF013 Lembrete

WF014 Pesquisa

WF015 Follow-up

---

ADM

WF016 Backup

WF017 Logs

WF018 Limpeza

---

# Ordem da Execução

Cliente

↓

WhatsApp

↓

WF001

↓

WF002

↓

WF003

↓

Selecionar módulo

↓

Agenda

↓

Clientes

↓

Financeiro

↓

Comunicação

↓

Logs

↓

Resposta

---

# Fluxo de Dependências

WF001 chama WF002

WF002 chama WF003

WF003 decide qual workflow será executado.

Nunca alterar esta arquitetura sem autorização.

---

# Regras Obrigatórias

Sempre analisar todo o projeto.

Nunca editar apenas um arquivo sem verificar dependências.

Nunca apagar arquivos.

Nunca apagar workflows.

Nunca alterar IDs.

Nunca alterar credenciais.

Nunca alterar nomes das tabelas.

Nunca alterar nomes das colunas.

Nunca alterar regras de negócio sem documentação.

Nunca remover logs.

Nunca remover backups.

Nunca modificar arquivos SQL sem verificar impactos.

---

# Padrão de Desenvolvimento

Sempre seguir:

Clean Code

SOLID

DRY

KISS

YAGNI

Sempre preferir soluções simples.

---

# Convenção de Nomes

Workflow

ATD-WF001

AGE-WF004

CLI-WF008

FIN-WF010

COM-WF012

ADM-WF016

---

Nodes

Sempre utilizar nomes descritivos.

Exemplo

Buscar Cliente

Consultar Agenda

Criar Evento

Enviar WhatsApp

Atualizar Planilha

Registrar Log

Evitar

Function

Node1

HTTP1

Edit Fields

Google

---

# Organização

Cada Workflow deve possuir:

Trigger

↓

Validação

↓

Busca

↓

Processamento

↓

Atualização

↓

Log

↓

Resposta

---

# Antes de alterar qualquer Workflow

Verificar:

Quem chama este workflow.

Quem depende dele.

Quais tabelas utiliza.

Quais APIs utiliza.

Quais credenciais utiliza.

Quais workflows serão impactados.

---

# Google Sheets

Banco atual.

Nunca alterar:

Nome das abas

Nome das colunas

Ordem das colunas

Tipos de dados

---

# Google Calendar

Nunca alterar:

Calendar ID

Timezone

Eventos existentes

---

# WhatsApp

Nunca alterar:

Webhook

Verify Token

Phone Number ID

Access Token

---

# Credenciais

Nunca criar credenciais novas sem necessidade.

Sempre reutilizar as existentes.

Nunca gravar tokens em arquivos.

Nunca gravar senhas.

Nunca gravar API Keys.

---

# Banco PostgreSQL

Quando iniciar a migração:

Nunca remover compatibilidade com Google Sheets.

Sempre manter camada de abstração.

---

# Documentação

Sempre atualizar:

Casos de Uso

User Stories

Backlog

Modelo de Dados

Testes

README

Sempre que alterar um workflow.

---

# Testes

Antes de concluir:

Validar JSON

Validar Expressões

Validar Credenciais

Validar APIs

Validar Google Calendar

Validar Google Sheets

Validar WhatsApp

Validar IA

---

# Logs

Todo Workflow deve registrar:

Data

Hora

Workflow

Cliente

Telefone

Ação

Status

Erro

Tempo de execução

---

# Tratamento de Erros

Todo Workflow deve possuir:

Try

Catch

Log

Resposta amigável

---

# Performance

Evitar loops desnecessários.

Evitar consultas repetidas.

Evitar múltiplos HTTP Requests.

Reutilizar dados.

---

# Segurança

Nunca expor:

Tokens

Senhas

Secrets

Client Secret

Private Key

Access Token

JWT

---

# Commits

Sempre utilizar:

feat:

fix:

refactor:

docs:

test:

perf:

build:

Exemplo

feat(agenda): adiciona validação de horário

fix(clientes): corrige atualização cadastral

docs(workflows): atualiza documentação

---

# Pull Requests

Sempre descrever:

Objetivo

Arquivos alterados

Impactos

Testes realizados

Checklist

---

# Antes de finalizar

Sempre responder:

Arquivos alterados.

Workflows alterados.

Riscos encontrados.

Melhorias sugeridas.

Impactos identificados.

Testes recomendados.

---

# Nunca Fazer

Nunca apagar workflows.

Nunca apagar documentação.

Nunca alterar estrutura do projeto.

Nunca modificar banco sem necessidade.

Nunca alterar integrações.

Nunca remover logs.

Nunca alterar IDs.

Nunca duplicar workflows.

Nunca quebrar compatibilidade.

---

# Sempre Fazer

Analisar arquitetura completa.

Manter documentação atualizada.

Explicar alterações.

Gerar código limpo.

Preservar compatibilidade.

Utilizar boas práticas.

Atualizar testes.

Gerar commits organizados.

---

# Objetivo Principal

O objetivo do BeautyFlow é tornar-se uma plataforma SaaS escalável.

Toda alteração deve considerar:

Escalabilidade

Performance

Segurança

Baixo acoplamento

Alta coesão

Facilidade de manutenção

Versionamento

Documentação

Qualidade de código

Experiência do usuário

Nunca comprometer estes princípios.
