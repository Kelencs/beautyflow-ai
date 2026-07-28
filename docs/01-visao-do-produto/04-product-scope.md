# Product Scope

**Projeto:** BeautyFlow AI

**Documento:** Product Scope

**Código:** PSC001

**Versão:** 2.0

**Status:** Aprovado

**Responsável:** Product Owner

**Data:** 28/07/2026

---

# 1. Objetivo

## 1.1 Objetivo do Documento

Este documento define o escopo funcional do BeautyFlow AI, estabelecendo os limites da solução, os módulos que compõem o produto, os usuários envolvidos, as funcionalidades contempladas na primeira versão (MVP) e as funcionalidades previstas para versões futuras.

O Product Scope garante alinhamento entre as necessidades do negócio, os objetivos estratégicos e a evolução planejada do produto.

---

# 2. Visão Geral do Produto

O BeautyFlow AI é uma plataforma SaaS destinada a empresas do segmento de beleza, como salões, clínicas de estética, barbearias e spas.

A solução utiliza Inteligência Artificial, WhatsApp e automações no n8n para automatizar o relacionamento com clientes, reduzir atividades operacionais e apoiar a gestão do negócio.

---

# 3. Público-Alvo

O produto foi desenvolvido para atender:

- Salões de Beleza
- Barbearias
- Clínicas de Estética
- Clínicas de Harmonização Facial
- Clínicas de Depilação
- Nail Designers
- Lash Designers
- Studios de Beleza
- Centros de Estética
- Empresas de Bem-estar

---

# 4. Personas

O BeautyFlow AI atende às seguintes Personas:

| Código | Persona | Papel |
|---------|----------|-------|
| PER001 | Proprietário da Empresa | Responsável pela gestão estratégica do negócio |
| PER002 | Cliente | Consumidor dos serviços e usuário do atendimento automatizado |
| PER003 | Profissional | Prestador dos serviços |
| PER004 | Agente de IA | Responsável pela automação do atendimento |
| PER005 | Administrador da Plataforma | Responsável pela configuração técnica do sistema |

---

# 5. Escopo Funcional

O escopo do produto está dividido em módulos.

## Gestão da Empresa

- Cadastro da empresa
- Configuração da empresa
- Horário de funcionamento
- Feriados
- Configurações gerais

---

## Gestão de Usuários

- Cadastro
- Perfis
- Permissões
- Controle de acesso

---

## Gestão de Clientes

- Cadastro
- Histórico
- Preferências
- Observações
- Histórico de atendimentos

---

## Gestão de Profissionais

- Cadastro
- Agenda
- Especialidades
- Horários
- Comissão

---

## Gestão de Serviços

- Cadastro
- Categoria
- Duração
- Valor
- Tempo estimado

---

## Agenda

- Agenda diária
- Agenda semanal
- Agenda mensal
- Disponibilidade
- Conflitos
- Reagendamentos

---

## Agendamentos

- Criar
- Alterar
- Cancelar
- Confirmar
- Check-in
- Check-out

---

## Financeiro

- Fluxo de caixa
- Receitas
- Despesas
- Comissões
- Indicadores financeiros

---

## Dashboard

- KPIs
- Indicadores
- Receita
- Ocupação
- Cancelamentos
- Comparecimento

---

## Relatórios

- Clientes
- Financeiro
- Agenda
- Serviços
- Profissionais

---

## Inteligência Artificial

- Atendimento automático
- FAQ
- Agendamento inteligente
- Remarcação automática
- Cancelamento automático
- Recomendação de horários
- Lembretes automáticos
- Recuperação de clientes
- Sugestão de serviços

---

## Integrações

- WhatsApp
- Google Calendar
- Google Sheets
- PostgreSQL
- OpenAI
- Evolution API (opcional)
- Meta WhatsApp Cloud API

---

# 6. Escopo do MVP

A primeira versão entregará:

- Cadastro da empresa
- Cadastro de profissionais
- Cadastro de clientes
- Cadastro de serviços
- Agenda
- Agendamento
- Atendimento via WhatsApp
- Agente de IA
- Dashboard
- Fluxo de Caixa
- Relatórios básicos

---

# 7. Fora do Escopo do MVP

Não fazem parte da primeira versão:

- Aplicativo mobile nativo
- Marketplace
- Programa de fidelidade
- Emissão de Nota Fiscal
- Integração com ERP
- CRM de Marketing
- BI Avançado
- Múltiplas unidades
- Chat interno
- Gamificação

---

# 8. Fluxo Principal do Produto

```text
Cliente
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
BeautyFlow AI
    │
 ┌──┼─────────────┐
 ▼  ▼             ▼
Agenda Financeiro Dashboard
    │
    ▼
Proprietário da Empresa
```

---

# 9. Benefícios Esperados

Para o Proprietário:

- Redução do trabalho manual
- Organização da empresa
- Aumento da produtividade
- Gestão baseada em indicadores

Para o Cliente:

- Atendimento rápido
- Agendamento 24 horas
- Lembretes automáticos

Para o Profissional:

- Agenda organizada
- Menos cancelamentos
- Melhor aproveitamento da agenda

---

# 10. Restrições

- Dependência da internet
- Dependência das APIs utilizadas
- Dependência do WhatsApp
- Necessidade de autenticação
- Limites das APIs de IA

---

# 11. Dependências

- n8n
- PostgreSQL
- WhatsApp Business
- OpenAI
- Google Calendar
- Google Sheets

---

# 12. Critérios de Aceitação do Escopo

O escopo será considerado concluído quando:

- Todas as funcionalidades do MVP estiverem implementadas.
- O Agente de IA executar corretamente os fluxos de atendimento.
- Os módulos estiverem integrados.
- Os testes forem aprovados.
- O Product Owner homologar as entregas.

---

# 13. Documentos Relacionados

- Product Vision
- Business Goals
- Value Proposition
- Success Metrics
- Assumptions and Constraints
- Personas
- User Stories
- Casos de Uso
- Product Backlog
- Roadmap
- Modelo de Dados

---

# 14. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação inicial |
| 2.0 | 28/07/2026 | Product Owner | Atualização para arquitetura baseada em IA, inclusão do Agente de IA e revisão das Personas. |

---

# 15. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Stakeholder | __________________ | ☐ Pendente |

---

**Fim do Documento**

**Projeto:** BeautyFlow AI

**Documento:** PSC001 — Product Scope

**Versão:** 2.0
