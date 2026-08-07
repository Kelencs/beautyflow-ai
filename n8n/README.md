# n8n - BeautyFlow

> **Versão:** 1.0.0  
> **Projeto:** BeautyFlow  
> **Plataforma:** n8n Cloud  
> **Objetivo:** Centralizar toda a automação do sistema BeautyFlow, responsável pelo atendimento inteligente via WhatsApp, gerenciamento de clientes, agenda, financeiro, comunicação e administração.

---

# Sumário

- Visão Geral
- Arquitetura
- Estrutura da Pasta
- Organização dos Workflows
- Fluxo Geral da Automação
- Módulos
- Convenção de Nomenclatura
- Dependências
- Credenciais Utilizadas
- Variáveis Globais
- Estrutura dos Workflows
- Integrações
- Padrão de Desenvolvimento
- Boas Práticas
- Versionamento
- Processo de Alteração
- Processo de Backup
- Processo de Deploy
- Checklist antes de Publicar
- Roadmap
- Responsabilidades

---

# Visão Geral

A pasta **n8n** contém todos os workflows utilizados pelo BeautyFlow.

Todo o funcionamento do sistema depende destes workflows.

São responsáveis por:

- Receber mensagens do WhatsApp
- Interpretar intenções utilizando IA
- Consultar disponibilidade
- Criar agendamentos
- Reagendar
- Cancelar atendimentos
- Atualizar clientes
- Registrar pagamentos
- Enviar confirmações
- Enviar lembretes
- Enviar pesquisas
- Executar backups
- Registrar logs
- Executar rotinas automáticas

---

# Arquitetura

```
Cliente

      │

WhatsApp Cloud API

      │

Webhook (WF001)

      │

IA Atendimento (WF002)

      │

Identificar Intenção (WF003)

      │

──────────────┬───────────────────┬─────────────────────

Agenda       Clientes        Financeiro

──────────────┴───────────────────┴─────────────────────

Comunicação

      │

Administração

```

---

# Estrutura da Pasta

```
n8n/

├── workflows/
├── documentacao/
├── templates/
├── backups/
├── credentials/
└── README.md
```

---

# Organização dos Workflows

## Atendimento

```
ATD-WF001 - Receber WhatsApp
ATD-WF003 - Identificar Intenção
```

Responsável por:

- Receber mensagens
- Validar webhook
- Identificar cliente
- Classificar intenção
- Encaminhar para o módulo correto

---

## Agenda

```
AGE-WF004 - Consultar Disponibilidade

AGE-WF005 - Criar Agendamento

AGE-WF006 - Reagendar Atendimento

AGE-WF007 - Cancelar Atendimento
```

Responsável por:

- Consultar Google Calendar
- Validar horários
- Criar eventos
- Atualizar agenda
- Cancelar eventos

---

## Clientes

```
CLI-WF008 - Cadastrar Cliente

CLI-WF009 - Atualizar Cliente
```

Responsável por:

- Cadastro
- Atualização
- Consulta
- Histórico

---

## Financeiro

```
FIN-WF010 - Registrar Pagamento

FIN-WF011 - Cobrança
```

Responsável por:

- Registrar pagamentos
- Cobranças
- Controle financeiro

---

## Comunicação

```
COM-WF012 - Confirmação

COM-WF013 - Lembrete

COM-WF014 - Pesquisa

COM-WF015 - Follow-up
```

Responsável por:

- Mensagens automáticas
- Lembretes
- Pesquisas
- Pós atendimento

---

## Administração

```
ADM-WF016 - Backup

ADM-WF017 - Logs

ADM-WF018 - Limpeza
```

Responsável por:

- Backup
- Logs
- Limpeza
- Manutenção

---

# Fluxo Geral

```
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

Escolha da intenção

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

Fim
```

---

# Fluxo de Dependências

```
WF001
 │
 ▼
WF002
 │
 ▼
WF003

 ├──► WF004
 │
 ├──► WF005
 │
 ├──► WF006
 │
 ├──► WF007
 │
 ├──► WF008
 │
 ├──► WF009
 │
 ├──► WF010
 │
 ├──► WF011
 │
 ├──► WF012
 │
 ├──► WF013
 │
 ├──► WF014
 │
 ├──► WF015
 │
 ├──► WF016
 │
 ├──► WF017
 │
 └──► WF018
```

---

# Convenção de Nomenclatura

Todos os workflows seguem o padrão:

```
<MODULO>-WF<NUMERO>-<DESCRICAO>
```

Exemplo:

```
AGE-WF004-consultar-disponibilidade
```

---

# Prefixos

| Prefixo | Módulo |
|----------|---------|
| ATD | Atendimento |
| AGE | Agenda |
| CLI | Clientes |
| FIN | Financeiro |
| COM | Comunicação |
| ADM | Administração |

---

# Convenções

Todos os nós devem possuir nomes claros.

Exemplo:

✔ Buscar Cliente

✔ Criar Agendamento

✔ Atualizar Google Calendar

Evitar:

Node1

HTTP1

Google2

Function3

---

# Credenciais Utilizadas

## WhatsApp Cloud API

Utilizada por:

- WF001
- WF012
- WF013
- WF014
- WF015

---

## Google Calendar

Utilizada por:

- WF004
- WF005
- WF006
- WF007

---

## Google Sheets

Utilizada por:

- WF002
- WF004
- WF005
- WF006
- WF007
- WF008
- WF009
- WF010
- WF011

---

## Gemini

Utilizada por:

- WF002

---

# Variáveis Globais

Exemplo:

```
EMPRESA_ID

CALENDAR_ID

GOOGLE_SHEET_ID

TIMEZONE

HORARIO_FUNCIONAMENTO

TOKEN_META

PHONE_NUMBER_ID
```

Nunca gravar estas variáveis dentro dos workflows.

Devem permanecer nas credenciais.

---

# Estrutura de um Workflow

Todo workflow deverá possuir:

```
Trigger

↓

Validação

↓

Busca de Dados

↓

Processamento

↓

Atualização

↓

Logs

↓

Resposta
```

---

# Padrão dos Nós

Sugestão:

```
01 Receber

02 Validar

03 Buscar

04 Processar

05 Atualizar

06 Registrar Log

07 Responder
```

---

# Templates

A pasta templates possui modelos para criação de novos workflows.

Sempre utilizar estes modelos.

---

# Backups

Todo backup deve ser armazenado em:

```
backups/

AAAA-MM/
```

Exemplo

```
2026-08/

2026-09/
```

---

# Deploy

Antes do deploy:

- Validar JSON
- Validar Credenciais
- Validar Expressões
- Testar Workflow
- Atualizar Documentação

---

# Checklist antes de Publicar

## Geral

- Workflow salvo

- Sem erros

- Credenciais válidas

- Expressões válidas

- Google Calendar funcionando

- Google Sheets funcionando

- IA funcionando

- WhatsApp funcionando

- Logs funcionando

---

# Processo de Alteração

Toda alteração deve:

1. Criar branch

2. Alterar workflow

3. Atualizar documentação

4. Testar

5. Gerar backup

6. Commit

7. Pull Request

8. Merge

---

# Boas Práticas

Nunca remover workflows em produção.

Nunca alterar IDs.

Nunca alterar credenciais.

Nunca excluir Logs.

Nunca excluir Backups.

Nunca criar workflows duplicados.

Documentar todas as alterações.

Utilizar nomes padronizados.

Utilizar comentários quando necessário.

---

# Roadmap

Futuras melhorias:

- PostgreSQL

- Dashboard Administrativo

- BI

- Multiempresa

- Multi Profissional

- Integração Stripe

- Integração Mercado Pago

- Integração PIX

- Painel Web

- Aplicativo Mobile

---

# Responsabilidades

## Atendimento

Receber clientes.

---

## Agenda

Gerenciar horários.

---

## Clientes

Gerenciar cadastros.

---

## Financeiro

Controlar pagamentos.

---

## Comunicação

Enviar mensagens automáticas.

---

## Administração

Garantir estabilidade do sistema.

---

# Compatibilidade

Este projeto foi desenvolvido para:

- n8n Cloud
- Google Workspace
- WhatsApp Cloud API
- Gemini AI
- GitHub

---

# Licença

Projeto proprietário.

BeautyFlow © 2026

Todos os direitos reservados.
