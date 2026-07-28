# Matriz de Rastreabilidade

**Projeto:** BeautyFlow AI

**Documento:** Matriz de Rastreabilidade de Requisitos (RTM)

**Código:** TEST002

**Versão:** 1.0

**Data:** 28/07/2026

**Autor:** Product Owner

**Status:** Em elaboração

---

# Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação inicial |

---

# Sumário

1. Objetivo
2. Escopo
3. Referências
4. Estratégia de Rastreabilidade
5. Matriz de Rastreabilidade
6. Cobertura por Requisitos
7. Cobertura por Casos de Uso
8. Cobertura por User Stories
9. Cobertura por Workflows
10. Cobertura por Casos de Teste
11. Critérios de Cobertura
12. Indicadores
13. Atualização da Matriz
14. Aprovação

---

# 1. Objetivo

A Matriz de Rastreabilidade tem como objetivo garantir que todos os requisitos do BeautyFlow AI sejam implementados, testados e aprovados.

Ela permite identificar rapidamente:

- quais requisitos foram implementados;
- quais Casos de Uso atendem cada requisito;
- quais User Stories originaram a implementação;
- quais Workflows executam o processo;
- quais Casos de Teste validam cada funcionalidade.

---

# 2. Escopo

Esta matriz contempla:

- Requisitos Funcionais
- Requisitos Não Funcionais
- Casos de Uso
- User Stories
- Workflows n8n
- Casos de Teste
- Critérios de Aceitação

---

# 3. Referências

Este documento está relacionado aos seguintes artefatos:

- Documento de Visão
- Requisitos
- Casos de Uso
- Personas
- User Stories
- Regras de Negócio
- Arquitetura
- Banco de Dados
- Workflows n8n
- Plano de Testes
- Estratégia de Testes

---

# 4. Estratégia de Rastreabilidade

Todo requisito deverá possuir obrigatoriamente:

- pelo menos um Caso de Uso;
- pelo menos uma User Story;
- pelo menos um Workflow;
- pelo menos um Caso de Teste.

Nenhum requisito poderá seguir para produção sem rastreabilidade completa.

---

# 5. Matriz de Rastreabilidade

| Requisito | Caso de Uso | User Story | Workflow | Caso de Teste | Status |
|------------|-------------|------------|----------|---------------|--------|
| REQ001 | UC001 | US001 | WF001 | CT001 | ☐ |
| REQ002 | UC002 | US002 | WF002 | CT002 | ☐ |
| REQ003 | UC003 | US003 | WF003 | CT003 | ☐ |
| REQ004 | UC004 | US004 | WF004 | CT004 | ☐ |
| REQ005 | UC005 | US005 | WF005 | CT005 | ☐ |
| REQ006 | UC006 | US006 | WF006 | CT006 | ☐ |
| REQ007 | UC007 | US007 | WF007 | CT007 | ☐ |
| REQ008 | UC008 | US008 | WF008 | CT008 | ☐ |
| REQ009 | UC009 | US009 | WF009 | CT009 | ☐ |
| REQ010 | UC010 | US010 | WF010 | CT010 | ☐ |

---

# 6. Cobertura por Requisitos

## Requisitos Funcionais

| Código | Descrição | Coberto |
|----------|-----------|:-------:|
| REQ001 | Receber mensagens do WhatsApp | ☐ |
| REQ002 | Identificar cliente | ☐ |
| REQ003 | Consultar agenda | ☐ |
| REQ004 | Agendar atendimento | ☐ |
| REQ005 | Reagendar atendimento | ☐ |
| REQ006 | Cancelar atendimento | ☐ |
| REQ007 | Enviar lembretes | ☐ |
| REQ008 | Consultar histórico | ☐ |
| REQ009 | Configurar IA | ☐ |
| REQ010 | Gerenciar usuários | ☐ |

---

## Requisitos Não Funcionais

| Código | Descrição | Coberto |
|----------|-----------|:-------:|
| RNF001 | Segurança | ☐ |
| RNF002 | Performance | ☐ |
| RNF003 | Disponibilidade | ☐ |
| RNF004 | Escalabilidade | ☐ |
| RNF005 | Auditoria | ☐ |

---

# 7. Cobertura por Casos de Uso

| Caso de Uso | Descrição | Testado |
|--------------|-----------|:-------:|
| UC001 | Agendar Atendimento | ☐ |
| UC002 | Consultar Agenda | ☐ |
| UC003 | Reagendar Atendimento | ☐ |
| UC004 | Cancelar Atendimento | ☐ |
| UC005 | Enviar Lembretes | ☐ |
| UC006 | Identificar Cliente | ☐ |
| UC007 | Gerenciar Usuários | ☐ |
| UC008 | Configurar IA | ☐ |
| UC009 | Monitorar Plataforma | ☐ |
| UC010 | Gerenciar Permissões | ☐ |

---

# 8. Cobertura por User Stories

| User Story | Descrição | Validada |
|-------------|-----------|:--------:|
| US001 | Agendar Atendimento | ☐ |
| US002 | Consultar Agenda | ☐ |
| US003 | Reagendar Atendimento | ☐ |
| US004 | Cancelar Atendimento | ☐ |
| US005 | Receber Lembretes | ☐ |
| US006 | Identificar Cliente | ☐ |
| US007 | Configurar IA | ☐ |
| US008 | Gerenciar Agenda | ☐ |
| US009 | Dashboard | ☐ |
| US010 | Administração | ☐ |

---

# 9. Cobertura por Workflows

| Workflow | Nome | Testado |
|-----------|------|:-------:|
| WF001 | Webhook WhatsApp | ☐ |
| WF002 | Identificar Cliente | ☐ |
| WF003 | IA - Classificação | ☐ |
| WF004 | Consultar Agenda | ☐ |
| WF005 | Agendar Atendimento | ☐ |
| WF006 | Reagendar Atendimento | ☐ |
| WF007 | Cancelar Atendimento | ☐ |
| WF008 | Enviar Lembretes | ☐ |
| WF009 | Logs | ☐ |
| WF010 | Monitoramento | ☐ |

---

# 10. Cobertura por Casos de Teste

| Caso de Teste | Objetivo | Executado |
|----------------|----------|:---------:|
| CT001 | Webhook | ☐ |
| CT002 | Receber Mensagem | ☐ |
| CT003 | Identificar Cliente | ☐ |
| CT004 | Agendar Atendimento | ☐ |
| CT005 | Reagendar Atendimento | ☐ |
| CT006 | Cancelar Atendimento | ☐ |
| CT007 | Lembretes | ☐ |
| CT008 | IA | ☐ |
| CT009 | Google Calendar | ☐ |
| CT010 | Integração n8n | ☐ |

---

# 11. Critérios de Cobertura

Um requisito será considerado totalmente coberto quando possuir:

- Caso de Uso aprovado;
- User Story implementada;
- Workflow desenvolvido;
- Caso de Teste aprovado;
- Evidências registradas.

---

# 12. Indicadores

Serão acompanhados os seguintes indicadores:

| Indicador | Objetivo |
|------------|----------|
| Cobertura de Requisitos | 100% |
| Cobertura de Casos de Uso | 100% |
| Cobertura de User Stories | 100% |
| Cobertura de Workflows | 100% |
| Cobertura de Casos de Teste | 100% |
| Casos de Teste Aprovados | ≥ 95% |
| Defeitos Críticos | 0 |

---

# 13. Atualização da Matriz

A matriz deverá ser atualizada sempre que ocorrer uma das seguintes situações:

- inclusão de novo requisito;
- alteração de requisito existente;
- criação de novo Caso de Uso;
- criação de nova User Story;
- criação de novo Workflow;
- criação de novo Caso de Teste;
- aprovação de testes;
- correção de defeitos.

Toda atualização deverá ser registrada no histórico de alterações do documento.

---

# 14. Aprovação

| Papel | Responsável | Assinatura |
|--------|-------------|------------|
| Product Owner | __________________ | __________________ |
| QA | __________________ | __________________ |
| Desenvolvedor | __________________ | __________________ |
| Stakeholder | __________________ | __________________ |

---

# Anexo A — Legenda

| Sigla | Descrição |
|--------|-----------|
| REQ | Requisito Funcional |
| RNF | Requisito Não Funcional |
| UC | Caso de Uso |
| US | User Story |
| WF | Workflow n8n |
| CT | Caso de Teste |
| RTM | Requirements Traceability Matrix |

---

# Anexo B — Fluxo de Rastreabilidade

```text
Requisito
      │
      ▼
Caso de Uso
      │
      ▼
User Story
      │
      ▼
Workflow n8n
      │
      ▼
Caso de Teste
      │
      ▼
Evidência
      │
      ▼
Aprovação
```

---

**Fim do Documento**
