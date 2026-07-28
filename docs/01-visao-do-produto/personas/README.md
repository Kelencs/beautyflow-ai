# Personas

**Projeto:** BeautyFlow AI

**Documento:** README — Personas

**Código:** PER000

**Versão:** 2.0

**Status:** Aprovado

**Responsável:** Product Owner

**Data:** 28/07/2026

---

# 1. Objetivo

## 1.1 Objetivo da Pasta

Esta pasta contém toda a documentação referente às Personas do BeautyFlow AI.

As Personas representam os principais perfis de usuários que interagem com a plataforma, seja utilizando diretamente o sistema, seja interagindo com o Agente de Inteligência Artificial.

A documentação tem como objetivo compreender as necessidades, objetivos, comportamentos e expectativas de cada tipo de usuário para orientar a evolução do produto.

---

# 2. Objetivo das Personas

As Personas auxiliam no desenvolvimento do produto por meio de:

- Compreensão do público-alvo.
- Identificação de necessidades reais.
- Definição de funcionalidades.
- Priorização do Product Backlog.
- Escrita de User Stories.
- Elaboração de Casos de Uso.
- Definição da experiência do usuário (UX).
- Apoio às decisões estratégicas do produto.

---

# 3. Metodologia

As Personas foram construídas com base em:

- Product Vision
- Business Goals
- Product Scope
- Value Proposition
- Product Discovery
- Pesquisa de mercado
- Conhecimento do segmento da beleza
- Jornada do Cliente
- Arquitetura baseada em Inteligência Artificial

Cada Persona representa um grupo específico de usuários com objetivos, responsabilidades e comportamentos semelhantes.

---

# 4. Estrutura de Cada Documento

Todos os documentos desta pasta seguem o mesmo padrão.

Cada Persona contém:

- Identificação
- Perfil
- Objetivos
- Responsabilidades
- Necessidades
- Principais dores (Pain Points)
- Motivadores
- Frustrações
- Comportamento Digital
- Jornada
- Cenários de Uso
- Funcionalidades utilizadas
- Permissões
- KPIs de Interesse
- Empathy Map
- Jobs To Be Done (JTBD)
- Relação com User Stories
- Relação com Casos de Uso
- Relação com Módulos
- Documentos Relacionados

---

# 5. Personas do BeautyFlow AI

## PER001 — Proprietário da Empresa

Representa o proprietário do salão, clínica ou barbearia.

É o principal comprador da solução e responsável pela gestão estratégica do negócio.

### Objetivos

- Aumentar faturamento.
- Automatizar processos.
- Melhorar gestão.
- Acompanhar indicadores.
- Crescer a empresa.

---

## PER002 — Cliente

Representa o consumidor final dos serviços.

É quem agenda atendimentos, conversa com o Agente de IA pelo WhatsApp e acompanha seus serviços.

### Objetivos

- Agendar rapidamente.
- Alterar horários.
- Receber lembretes.
- Ter atendimento rápido.
- Evitar ligações telefônicas.

---

## PER003 — Profissional

Representa cabeleireiros, barbeiros, manicures, esteticistas e demais profissionais.

É responsável pela execução dos serviços e acompanhamento de sua agenda.

### Objetivos

- Consultar agenda.
- Visualizar clientes.
- Organizar atendimentos.
- Acompanhar produtividade.

---

## PER004 — Agente de IA

Representa o Assistente Inteligente do BeautyFlow AI.

Embora não seja uma pessoa, é documentado como uma Persona por representar um ator ativo na solução.

O Agente executa atividades automaticamente.

### Responsabilidades

- Conversar com clientes.
- Criar agendamentos.
- Confirmar horários.
- Cancelar atendimentos.
- Responder perguntas.
- Integrar sistemas através do n8n.

---

## PER005 — Administrador da Plataforma

Representa o usuário responsável pela administração técnica da plataforma.

É responsável pela configuração operacional do sistema.

### Responsabilidades

- Configurar integrações.
- Gerenciar usuários.
- Configurar IA.
- Gerenciar permissões.
- Configurar notificações.
- Parametrizar o sistema.

---

# 6. Relação entre Personas e Módulos

| Módulo | Proprietário | Cliente | Profissional | Agente IA | Administrador Plataforma |
|----------|:-----------:|:-------:|:------------:|:---------:|:------------------------:|
| Empresas | ✔ | | | | ✔ |
| Usuários | ✔ | | | | ✔ |
| Clientes | ✔ | ✔ | ✔ | ✔ | ✔ |
| Profissionais | ✔ | | ✔ | | ✔ |
| Serviços | ✔ | ✔ | ✔ | ✔ | ✔ |
| Agenda | ✔ | ✔ | ✔ | ✔ | ✔ |
| Agendamentos | ✔ | ✔ | ✔ | ✔ | ✔ |
| Financeiro | ✔ | | | | ✔ |
| Dashboard | ✔ | | ✔ | | ✔ |
| Relatórios | ✔ | | ✔ | | ✔ |
| Configurações | ✔ | | | | ✔ |
| Integrações | ✔ | | | ✔ | ✔ |
| Inteligência Artificial | ✔ | ✔ | ✔ | ✔ | ✔ |

---

# 7. Fluxo de Interação das Personas

```text
                Proprietário
                     │
                     ▼
          BeautyFlow AI Platform
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 Cliente       Profissional    Administrador
      │
      ▼
 WhatsApp
      │
      ▼
 Agente de IA
      │
      ▼
 n8n
      │
      ▼
 Google Calendar
 PostgreSQL
 APIs Externas
```

---

# 8. Relacionamento entre Personas

| Persona | Interage com |
|----------|--------------|
| Proprietário | Cliente, Profissional, Administrador da Plataforma, Agente IA |
| Cliente | Agente IA, Profissional |
| Profissional | Cliente, Proprietário |
| Agente IA | Cliente, Proprietário, Plataforma |
| Administrador da Plataforma | Proprietário, Plataforma |

---

# 9. Relação com Outros Documentos

As Personas possuem rastreabilidade com:

- Product Vision
- Business Goals
- Value Proposition
- Product Scope
- Success Metrics
- Assumptions and Constraints
- Customer Journey
- Product Backlog
- User Stories
- Casos de Uso
- Requisitos Funcionais
- Regras de Negócio
- Plano de Testes
- Modelo de Dados

---

# 10. Estrutura da Pasta

```text
personas/
│
├── README.md
├── PER001-proprietario-da-empresa.md
├── PER002-cliente.md
├── PER003-profissional.md
├── PER004-agente-ia.md
├── PER005-administrador-da-plataforma.md
│
└── assets/
    ├── personas-map.png
    ├── empathy-map-proprietario.png
    ├── empathy-map-cliente.png
    ├── empathy-map-profissional.png
    ├── empathy-map-agente-ia.png
    └── empathy-map-administrador-plataforma.png
```

---

# 11. Boas Práticas

Durante a evolução do produto recomenda-se:

- Revisar as Personas a cada grande Release.
- Atualizar comportamentos sempre que houver mudanças no negócio.
- Garantir rastreabilidade entre Personas, User Stories e Casos de Uso.
- Validar continuamente as necessidades das Personas com usuários reais.
- Utilizar as Personas como base para decisões de UX e Product Discovery.

---

# 12. Critérios de Revisão

Esta documentação deverá ser revisada quando ocorrer:

- Mudança significativa no público-alvo.
- Inclusão de novos módulos.
- Inclusão de novos canais de atendimento.
- Evolução do Agente de IA.
- Mudança no modelo de negócio.
- Alteração na arquitetura da plataforma.

---

# 13. Glossário

| Termo | Definição |
|--------|-----------|
| Persona | Representação fictícia de um grupo de usuários com características semelhantes. |
| JTBD | Jobs To Be Done, abordagem que descreve o trabalho que o usuário deseja realizar. |
| Empathy Map | Ferramenta utilizada para compreender pensamentos, sentimentos e comportamentos do usuário. |
| Product Discovery | Processo de descoberta de problemas, necessidades e oportunidades do produto. |
| UX | User Experience (Experiência do Usuário). |
| Agente de IA | Assistente Inteligente responsável pela automação do atendimento e execução de processos utilizando IA e n8n. |

---

# 14. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação inicial da documentação. |
| 2.0 | 28/07/2026 | Product Owner | Reestruturação completa das Personas para arquitetura baseada em IA, substituindo a Persona Recepcionista pelas Personas Cliente, Agente de IA e Administrador da Plataforma. |

---

# 15. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| UX Designer | __________________ | ☐ Pendente |
| Stakeholder | __________________ | ☐ Pendente |

---

**Fim do Documento**

**Projeto:** BeautyFlow AI

**Documento:** PER000 — README Personas

**Versão:** 2.0
