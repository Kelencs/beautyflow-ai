# Assumptions and Constraints

**Projeto:** BeautyFlow AI

**Documento:** Premissas e Restrições (Assumptions and Constraints)

**Código:** AC001

**Versão:** 2.0

**Status:** Aprovado

**Responsável:** Product Owner

**Data:** 28/07/2026

---

# 1. Objetivo

## 1.1 Objetivo do Documento

Este documento define as premissas e restrições consideradas durante o planejamento, desenvolvimento e evolução do BeautyFlow AI.

As premissas representam condições assumidas como verdadeiras para o projeto, enquanto as restrições representam limitações que influenciam diretamente o escopo, prazo, custo, tecnologia e arquitetura da solução.

Este documento serve como referência para Product Owners, Analistas de Requisitos, Arquitetos de Software, Desenvolvedores, UX Designers, Testadores e Stakeholders.

---

# 2. Conceitos

## 2.1 Premissas (Assumptions)

Premissas são condições consideradas verdadeiras durante o planejamento do projeto, mesmo que ainda não tenham sido completamente validadas.

Caso uma premissa deixe de ser verdadeira, o planejamento deverá ser revisado.

---

## 2.2 Restrições (Constraints)

Restrições são limitações impostas ao projeto.

Podem estar relacionadas a:

- Prazo
- Orçamento
- Tecnologia
- Recursos
- Infraestrutura
- Requisitos legais
- Integrações

---

# 3. Premissas do Produto

## AP001 — Plataforma SaaS

O BeautyFlow AI será desenvolvido como uma plataforma SaaS (Software as a Service).

Impacto

- Arquitetura Multi-Tenant
- Atualizações centralizadas
- Escalabilidade

---

## AP002 — Arquitetura Multi-Tenant

Todas as empresas compartilharão a mesma aplicação.

Cada empresa possuirá isolamento lógico de seus dados.

---

## AP003 — Banco de Dados PostgreSQL

O banco oficial do sistema será PostgreSQL.

Não haverá suporte para múltiplos bancos na primeira versão.

---

## AP004 — APIs REST

Toda comunicação entre Front-end e Back-end ocorrerá através de APIs REST.

---

## AP005 — Desenvolvimento Ágil

O desenvolvimento seguirá a metodologia Scrum.

As entregas ocorrerão por Sprints.

---

## AP006 — Cloud Computing

A aplicação será hospedada em ambiente Cloud.

---

## AP007 — Integrações Externas

As integrações dependerão da disponibilidade dos respectivos provedores.

Exemplos

- WhatsApp Cloud API
- Google Calendar
- OpenAI

---

## AP008 — Segurança

Todo acesso será autenticado.

Os dados serão protegidos conforme a LGPD.

---

## AP009 — Internet

O sistema depende de conexão com internet.

Não haverá funcionamento offline.

---

## AP010 — Navegadores

O sistema será compatível com os navegadores modernos.

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

---

# 4. Premissas de Negócio

## AP011

Os estabelecimentos desejam digitalizar seus processos.

---

## AP012

Os usuários possuem conhecimento básico em informática.

---

## AP013

Os profissionais utilizam smartphones diariamente.

---

## AP014

Os clientes utilizam WhatsApp como principal canal de comunicação.

---

## AP015

A empresa pretende evoluir continuamente o produto.

---

# 5. Premissas Técnicas

- Utilização do GitHub.
- Versionamento Git.
- Desenvolvimento utilizando TypeScript.
- Front-end React/Next.js.
- Banco PostgreSQL.
- APIs REST.
- JSON como padrão de comunicação.
- JWT para autenticação.
- HTTPS obrigatório.

---

# 6. Premissas de Infraestrutura

- Ambiente Cloud.
- Backup automático.
- Logs centralizados.
- Monitoramento.
- Escalabilidade horizontal.

---

# 7. Restrições do Projeto

## RC001 — Orçamento

O desenvolvimento deverá priorizar tecnologias Open Source e serviços gratuitos ou de baixo custo durante o MVP.

---

## RC002 — Prazo

O MVP deverá conter apenas funcionalidades essenciais.

---

## RC003 — Escopo

Funcionalidades secundárias serão entregues em Releases futuras.

---

## RC004 — Equipe

O projeto considera uma equipe reduzida para desenvolvimento inicial.

---

## RC005 — Dependência de APIs

As integrações externas dependem dos provedores.

Exemplos

- Meta
- Google
- OpenAI

---

## RC006 — Navegadores

O suporte será limitado aos navegadores modernos.

---

## RC007 — Mobile

A primeira versão será Web Responsiva.

Aplicativos nativos serão desenvolvidos posteriormente.

---

## RC008 — Idiomas

O sistema será disponibilizado inicialmente em Português (Brasil).

---

## RC009 — Banco de Dados

O banco oficial será PostgreSQL.

---

## RC010 — Conectividade

O sistema não funcionará sem internet.

---

# 8. Restrições Legais

O produto deverá atender:

- LGPD
- Marco Civil da Internet
- Termos das APIs utilizadas

---

# 9. Restrições Tecnológicas

- React
- Next.js
- TypeScript
- PostgreSQL
- Supabase
- n8n
- WhatsApp Cloud API

---

# 10. Restrições Arquiteturais

A arquitetura deverá seguir:

- APIs REST
- Multi-Tenant
- Stateless
- JWT
- HTTPS
- Versionamento de APIs
- Escalabilidade

---

# 11. Dependências

## Tecnológicas

- Supabase
- PostgreSQL
- OpenAI
- Meta
- Google

---

## Operacionais

- Internet
- DNS
- Hospedagem Cloud

---

## Organizacionais

- Product Owner
- Stakeholders
- Equipe Técnica

---

# 12. Riscos Relacionados

| Código | Premissa / Restrição | Risco | Mitigação |
|---------|----------------------|--------|-----------|
| R001 | APIs Externas | Indisponibilidade | Retry e monitoramento |
| R002 | Internet | Queda de conexão | Mensagens amigáveis ao usuário |
| R003 | Multi-Tenant | Vazamento de dados | Isolamento lógico e testes |
| R004 | Cloud | Indisponibilidade | Backup e redundância |
| R005 | Escopo | Crescimento descontrolado | Gestão do Product Backlog |

---

# 13. Impacto no Produto

As premissas e restrições influenciam diretamente:

- Arquitetura
- Modelo de Dados
- APIs
- Backlog
- Roadmap
- Sprint Planning
- Plano de Testes
- Segurança
- Infraestrutura

---

# 14. Relação com Outros Documentos

Este documento possui rastreabilidade com:

- Product Vision
- Business Goals
- Value Proposition
- Product Scope
- Product Backlog
- Roadmap
- Arquitetura
- Modelo de Dados
- Plano de Testes
- Requisitos Funcionais
- Requisitos Não Funcionais

---

# 15. Critérios de Revisão

Este documento deverá ser revisado quando ocorrer:

- Alteração da arquitetura.
- Inclusão de novas integrações.
- Mudança tecnológica.
- Alteração significativa do escopo.
- Mudança regulatória.
- Mudança na infraestrutura.

---

# 16. Glossário

| Termo | Definição |
|--------|-----------|
| Assumption | Premissa considerada verdadeira durante o planejamento |
| Constraint | Restrição que limita o projeto |
| Multi-Tenant | Arquitetura compartilhada entre múltiplas empresas com isolamento lógico dos dados |
| SaaS | Software como Serviço |
| JWT | JSON Web Token |
| API REST | Interface para comunicação entre sistemas |
| LGPD | Lei Geral de Proteção de Dados |

---

# 17. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação inicial do documento |
| 2.0 | 28/07/2026 | Product Owner | Inclusão de premissas de negócio, infraestrutura, riscos, dependências e rastreabilidade |

---

# 18. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Stakeholder | __________________ | ☐ Pendente |
| Tech Lead | __________________ | ☐ Pendente |
| Sponsor | __________________ | ☐ Pendente |

---

**Fim do Documento**

**Projeto:** BeautyFlow AI

**Documento:** AC001 — Assumptions and Constraints

**Versão:** 2.0
