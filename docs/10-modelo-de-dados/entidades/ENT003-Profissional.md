# ENT003 — Profissional

**Código:** ENT003

**Versão:** 2.0

**Módulo:** Cadastros

**Tabela Física:** profissionais

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade Profissional representa os colaboradores responsáveis pela execução dos serviços disponibilizados pela empresa.

Os profissionais possuem agenda própria, recebem agendamentos e realizam atendimentos aos clientes.

A definição dos serviços executados por cada profissional é realizada através da entidade de associação **ENT017 – Profissional Serviço**.

---

# 2. Descrição

A tabela profissionais armazena os dados cadastrais dos profissionais da empresa.

Ela é utilizada pelos módulos:

- Agenda
- Agendamento
- Histórico
- Lista de Espera
- Relatórios
- Comissões

---

# 3. Tipo da Entidade

Master Data

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|---------------|-----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Possui | Agenda | 1:N | id_profissional |
| Possui | Agendamentos | 1:N | id_profissional |
| Executa | Serviços | N:N | profissional_servico |
| Atende | Clientes | N:N | através de agendamentos |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC007 | Cadastrar Profissional |
| UC008 | Configurar Agenda |
| UC010 | Consultar Histórico |

---

# 6. User Stories Relacionadas

- US001
- US003
- US004
- US007
- US008
- US010

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF007 | Cadastro de Profissional |
| WF008 | Atualização de Cadastro |
| WF009 | Consulta de Disponibilidade |
| WF010 | Sincronização de Agenda |
| WF011 | Notificações |
| WF012 | Auditoria |

---

# 8. APIs Relacionadas

| Método | Endpoint |
|---------|----------|
| GET | /profissionais |
| GET | /profissionais/{id} |
| POST | /profissionais |
| PUT | /profissionais/{id} |
| PATCH | /profissionais/{id}/status |
| DELETE | /profissionais/{id} |

---

# 9. Estrutura da Tabela

```text
profissionais
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Default | Exemplo |
|--------|------|-------------|-----------|------------------|----------|----------|
| id_profissional | UUID | Sim | Identificador do profissional | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(120) | Sim | Nome completo | Entre 3 e 120 caracteres | — | Ana Paula Silva |
| telefone | VARCHAR(20) | Sim | Telefone principal | Deve possuir DDD | — | +55 34 99999-9999 |
| email | VARCHAR(150) | Não | E-mail | Deve ser válido | NULL | ana@email.com |
| percentual_comissao | NUMERIC(5,2) | Não | Comissão do profissional | Entre 0 e 100 | 0.00 | 40.00 |
| observacoes | TEXT | Não | Observações gerais | Campo livre | NULL | Especialista em unhas de gel |
| ativo | BOOLEAN | Sim | Situação do profissional | Exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Automática | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Automática | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo profissional deve pertencer a uma empresa válida. |
| RN002 | Um profissional só poderá receber agendamentos quando estiver ativo. |
| RN003 | Um profissional não poderá possuir dois atendimentos simultâneos. |
| RN004 | Os serviços executados serão definidos pela entidade Profissional Serviço. |
| RN005 | O percentual de comissão deve estar entre 0% e 100%. |
| RN006 | A agenda do profissional deverá respeitar o horário de funcionamento da empresa. |
| RN007 | A exclusão deverá ser lógica. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_profissionais | PRIMARY KEY(id_profissional) |
| FK_profissionais_empresa | FOREIGN KEY(id_empresa) |
| NN_nome | NOT NULL |
| NN_telefone | NOT NULL |
| CK_comissao | percentual_comissao BETWEEN 0 AND 100 |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_profissional_empresa | Pesquisa por empresa |
| idx_profissional_nome | Pesquisa por nome |
| idx_profissional_ativo | Profissionais ativos |
| idx_profissional_comissao | Relatórios |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Total |
| Gerente | Cadastro e edição |
| Recepcionista | Consulta |
| Profissional | Consulta própria |

---

# 15. Exemplos SQL

## Consulta

```sql
SELECT *
FROM profissionais;
```

## Pesquisa por empresa

```sql
SELECT *
FROM profissionais
WHERE id_empresa = 'UUID';
```

---

# 16. Segurança

- UUID como chave primária.
- Compatível com RLS.
- Multi-Tenant.
- Soft Delete.
- Auditoria obrigatória.

---

# 17. Integrações

- n8n
- Supabase
- PostgreSQL
- Google Calendar
- WhatsApp Business API
- Power BI

---

# 18. Observações Técnicas

- Não armazenar especialidades como texto.
- Serviços atendidos pelo profissional devem ser controlados pela ENT017.
- A agenda será gerenciada pela ENT007.
- Os atendimentos serão registrados na ENT008.

---

# 19. Histórico de Alterações

| Versão | Data | Alteração |
|---------|------|------------|
| 1.0 | 27/07/2026 | Versão inicial |
| 2.0 | 27/07/2026 | Remoção do campo especialidade e normalização do relacionamento com serviços |

---

# 20. Aprovação

| Papel | Status |
|---------|--------|
| Product Owner | ☐ |
| Arquiteto | ☐ |
| DBA | ☐ |
| Desenvolvedor | ☐ |
| QA | ☐ |

---


