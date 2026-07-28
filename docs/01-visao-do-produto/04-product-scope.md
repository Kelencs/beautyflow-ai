# Product Scope

**Projeto:** BeautyFlow AI

**Documento:** Escopo do Produto (Product Scope)

**Código:** PS001

**Versão:** 2.0

**Status:** Aprovado

**Responsável:** Product Owner

**Data:** 28/07/2026

---

# 1. Objetivo

## 1.1 Objetivo do Documento

Este documento define o escopo funcional e estratégico do BeautyFlow AI.

Seu objetivo é estabelecer claramente quais funcionalidades fazem parte do produto, quais estão fora do escopo da solução, quais entregas serão realizadas no MVP e quais serão disponibilizadas nas próximas versões.

Este documento serve como referência para Product Owners, Stakeholders, Arquitetos, Desenvolvedores, Analistas de Requisitos, UX Designers e equipe de Testes.

---

# 2. Visão Geral do Produto

O BeautyFlow AI é uma plataforma SaaS destinada à gestão de empresas do segmento da beleza.

O produto integra gestão operacional, financeira, automação de processos e Inteligência Artificial em uma única solução, proporcionando maior produtividade, organização e suporte à tomada de decisão.

---

# 3. Objetivos do Escopo

O escopo do produto foi definido para atender aos seguintes objetivos:

- Centralizar todas as operações do estabelecimento.
- Automatizar tarefas repetitivas.
- Melhorar a experiência dos clientes.
- Organizar agendas e atendimentos.
- Disponibilizar indicadores gerenciais.
- Oferecer uma arquitetura escalável.
- Facilitar futuras integrações.

---

# 4. Público-Alvo

## Empresas

- Salões de Beleza
- Barbearias
- Clínicas de Estética
- Nail Designers
- Lash Designers
- Clínicas de Harmonização
- Estúdios de Beleza

---

## Usuários

- Proprietários
- Administradores
- Recepcionistas
- Profissionais
- Clientes
- Gestores Financeiros

---

# 5. Escopo Funcional

O produto contempla os seguintes módulos.

---

## Módulo 1 — Empresas

Objetivo

Gerenciar os dados cadastrais das empresas.

Principais funcionalidades

- Cadastro
- Alteração
- Consulta
- Inativação
- Configurações da empresa

---

## Módulo 2 — Usuários

Objetivo

Controlar usuários e permissões.

Funcionalidades

- Cadastro
- Login
- Alteração
- Recuperação de senha
- Perfis
- Permissões

---

## Módulo 3 — Clientes

Funcionalidades

- Cadastro
- Pesquisa
- Histórico
- Observações
- Aniversário
- Fidelidade

---

## Módulo 4 — Profissionais

Funcionalidades

- Cadastro
- Especialidades
- Horários
- Agenda
- Comissão
- Status

---

## Módulo 5 — Serviços

Funcionalidades

- Cadastro
- Categorias
- Preços
- Tempo de execução
- Ativação
- Desativação

---

## Módulo 6 — Agenda

Funcionalidades

- Agenda diária
- Agenda semanal
- Agenda mensal
- Reagendamento
- Cancelamento
- Bloqueio de horários

---

## Módulo 7 — Agendamentos

Funcionalidades

- Novo agendamento
- Confirmação
- Reagendamento
- Cancelamento
- Check-in
- Check-out

---

## Módulo 8 — Financeiro

Funcionalidades

- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Caixa diário
- Receitas
- Despesas

---

## Módulo 9 — Dashboard

Funcionalidades

- KPIs
- Receita
- Agendamentos
- Clientes
- Profissionais
- Cancelamentos

---

## Módulo 10 — Relatórios

Funcionalidades

- Financeiro
- Clientes
- Profissionais
- Agenda
- Receita
- Serviços

---

## Módulo 11 — Notificações

Funcionalidades

- WhatsApp
- E-mail
- Confirmação
- Cancelamento
- Lembretes

---

## Módulo 12 — Configurações

Funcionalidades

- Horário de funcionamento
- Feriados
- Comissão
- Integrações
- Preferências

---

# 6. Escopo Técnico

O produto será composto pelos seguintes componentes.

## Backend

- APIs REST
- PostgreSQL
- Supabase
- Autenticação JWT

---

## Frontend

- React
- Next.js
- TypeScript

---

## Banco de Dados

- PostgreSQL

---

## Integrações

- WhatsApp Cloud API
- Google Calendar
- OpenAI
- n8n

---

# 7. Escopo do MVP

A primeira versão deverá conter:

- Empresas
- Usuários
- Clientes
- Profissionais
- Serviços
- Agenda
- Agendamento
- Financeiro Básico
- Dashboard Inicial

---

# 8. Funcionalidades Futuras

Estão previstas para versões posteriores.

## Inteligência Artificial

- Assistente Virtual
- Recomendações
- Insights

---

## CRM

- Pipeline
- Campanhas
- Segmentação

---

## Marketing

- Cupons
- Cashback
- Programa de Fidelidade

---

## Mobile

- Aplicativo Android
- Aplicativo iOS

---

## Business Intelligence

- Dashboards Avançados
- IA Analítica
- Previsões

---

# 9. Fora do Escopo

Não fazem parte da primeira versão:

- Marketplace
- Loja Virtual
- Emissão de Nota Fiscal
- Integração Bancária
- Controle de Estoque Avançado
- Marketplace de Serviços
- Gestão Contábil
- Folha de Pagamento

---

# 10. Premissas

- Arquitetura Multi-Tenant.
- Banco PostgreSQL.
- APIs REST.
- Deploy em Cloud.
- Desenvolvimento ágil (Scrum).
- Integração com n8n.

---

# 11. Restrições

- Dependência de APIs externas.
- Dependência de conexão com internet.
- Conformidade com a LGPD.
- Navegadores modernos.

---

# 12. Dependências

- WhatsApp Cloud API
- Google Calendar
- OpenAI
- Supabase
- n8n

---

# 13. Critérios de Aceitação do Escopo

O escopo será considerado concluído quando:

- Todos os módulos do MVP estiverem implementados.
- Todos os requisitos funcionais forem atendidos.
- Todos os testes forem aprovados.
- As integrações estiverem operacionais.
- O Product Owner aprovar as entregas.

---

# 14. Riscos

| Risco | Impacto | Mitigação |
|--------|---------|-----------|
| Mudanças de requisitos | Alto | Gestão do backlog |
| Dependência de APIs | Alto | Monitoramento e testes |
| Crescimento da base de clientes | Médio | Arquitetura escalável |
| Alterações legais | Médio | Revisões periódicas |

---

# 15. Relação com Outros Documentos

Este documento possui rastreabilidade com:

- Product Vision
- Business Goals
- Value Proposition
- Personas
- Jornada do Cliente
- Requisitos Funcionais
- Regras de Negócio
- Casos de Uso
- User Stories
- Product Backlog
- Roadmap
- Modelo de Dados
- Arquitetura
- Plano de Testes

---

# 16. Matriz de Rastreabilidade

| Documento | Relação |
|------------|---------|
| Product Vision | Define a direção estratégica |
| Business Goals | Justifica o escopo |
| Product Backlog | Contém as funcionalidades |
| User Stories | Detalham o comportamento esperado |
| Casos de Uso | Especificam os fluxos |
| Modelo de Dados | Suporta as funcionalidades |
| Plano de Testes | Valida o escopo implementado |

---

# 17. Glossário

| Termo | Definição |
|--------|-----------|
| MVP | Produto Mínimo Viável |
| SaaS | Software como Serviço |
| Multi-Tenant | Arquitetura com múltiplos clientes utilizando a mesma aplicação |
| Dashboard | Painel de indicadores |
| API | Interface de Programação de Aplicações |
| Sprint | Iteração do Scrum |

---

# 18. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação do documento |
| 2.0 | 28/07/2026 | Product Owner | Inclusão de módulos, MVP, fora do escopo, riscos e rastreabilidade |

---

# 19. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Stakeholder | __________________ | ☐ Pendente |
| Tech Lead | __________________ | ☐ Pendente |
| Sponsor | __________________ | ☐ Pendente |

---

**Fim do Documento**

**Projeto:** BeautyFlow AI

**Documento:** PS001 — Product Scope

**Versão:** 2.0
