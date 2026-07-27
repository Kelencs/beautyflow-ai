# ENT003 — Profissional

**Código:** ENT003

**Versão:** 1.0

**Módulo:** Cadastros

**Tabela Física:** profissionais

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Profissional** representa os colaboradores responsáveis pela execução dos serviços oferecidos pela empresa.

Um profissional pode realizar um ou mais serviços, possuir agenda própria, receber agendamentos e atender diversos clientes.

Exemplos:

- Cabeleireiro(a)
- Barbeiro(a)
- Manicure
- Nail Designer
- Lash Designer
- Esteticista
- Maquiador(a)
- Massoterapeuta

---

# 2. Descrição

A tabela **profissionais** armazena as informações cadastrais dos profissionais que trabalham na empresa.

Ela é utilizada pelos módulos de:

- Agenda
- Agendamentos
- Lista de Espera
- Histórico
- Pagamentos
- Relatórios

---

# 3. Tipo da Entidade

**Entidade Mestre (Master Data)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Possui | Agenda | 1:N | id_profissional |
| Possui | Agendamentos | 1:N | id_profissional |
| Executa | Serviços | N:N* | tabela_profissional_servico |
| Atende | Clientes | N:N* | através dos agendamentos |

> *O relacionamento N:N entre profissionais e serviços poderá ser implementado futuramente por meio da tabela `profissional_servico`.

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC006 | Cadastrar Serviço |
| UC007 | Cadastrar Profissional |
| UC008 | Configurar Agenda |
| UC010 | Consultar Histórico de Atendimentos |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US007 — Cadastrar Profissional
- US008 — Configurar Agenda
- US010 — Consultar Histórico

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF007 | Cadastro de Profissional |
| WF008 | Atualização de Cadastro |
| WF009 | Consulta de Disponibilidade |
| WF010 | Sincronização da Agenda |
| WF011 | Notificação de Agendamentos |
| WF012 | Auditoria de Alterações |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /profissionais | Listar profissionais |
| GET | /profissionais/{id} | Consultar profissional |
| POST | /profissionais | Cadastrar profissional |
| PUT | /profissionais/{id} | Atualizar profissional |
| PATCH | /profissionais/{id}/status | Ativar/Inativar profissional |
| DELETE* | /profissionais/{id} | Exclusão lógica |

> *A exclusão deverá ser lógica.

---

# 9. Estrutura da Tabela

```text
profissionais
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_profissional | UUID | Sim | Identificador do profissional | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(120) | Sim | Nome completo | Entre 3 e 120 caracteres | — | Ana Paula Silva |
| telefone | VARCHAR(20) | Sim | Telefone | Deve possuir DDD | — | +55 34 99999-9999 |
| email | VARCHAR(150) | Não | E-mail | Deve possuir formato válido quando informado | NULL | ana@studio.com.br |
| especialidade | VARCHAR(100) | Sim | Especialidade principal | Deve existir no catálogo de especialidades (quando implementado) | — | Nail Designer |
| percentual_comissao | NUMERIC(5,2) | Não | Comissão (%) | Valor entre 0 e 100 | 0.00 | 45.00 |
| ativo | BOOLEAN | Sim | Situação do profissional | Utilizado para exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 09:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 16:00:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo profissional deve pertencer a uma empresa válida. |
| RN002 | Um profissional somente poderá receber agendamentos se estiver ativo. |
| RN003 | Um profissional não poderá possuir dois atendimentos no mesmo horário. |
| RN004 | A agenda deverá respeitar o horário de funcionamento da empresa. |
| RN005 | O percentual de comissão deve estar entre 0% e 100%. |
| RN006 | Um profissional poderá executar diversos serviços. |
| RN007 | A exclusão deverá ser lógica utilizando o campo **ativo**. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_profissionais | PRIMARY KEY(id_profissional) |
| FK_profissionais_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| NN_nome | NOT NULL |
| NN_telefone | NOT NULL |
| NN_especialidade | NOT NULL |
| CK_comissao | percentual_comissao BETWEEN 0 AND 100 |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_profissional_empresa | Consultas por empresa |
| idx_profissional_nome | Pesquisa por nome |
| idx_profissional_especialidade | Pesquisa por especialidade |
| idx_profissional_ativo | Profissionais ativos |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Cadastrar, editar e consultar |
| Recepcionista | Consultar e agendar |
| Profissional | Consultar apenas seus próprios dados e agenda |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO profissionais (
    id_empresa,
    nome,
    telefone,
    email,
    especialidade,
    percentual_comissao
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Ana Paula Silva',
    '+55 34 99999-9999',
    'ana@studio.com.br',
    'Nail Designer',
    45.00
);
```

## Consulta

```sql
SELECT *
FROM profissionais;
```

## Consulta por Empresa

```sql
SELECT *
FROM profissionais
WHERE id_empresa = '550e8400-e29b-41d4-a716-446655440000';
```

---

# 16. Segurança

- Utiliza UUID como chave primária.
- Compatível com Row Level Security (RLS).
- Suporta Multi-Tenant.
- Exclusão lógica por meio do campo **ativo**.
- Alterações cadastrais devem ser registradas na tabela **logs_auditoria**.

---

# 17. Observações Técnicas

- Um profissional poderá possuir diversos horários disponíveis.
- A disponibilidade será controlada pela entidade **Agenda**.
- Os atendimentos serão registrados na entidade **Agendamentos**.
- Futuramente será criada a tabela **profissional_servico** para representar o relacionamento N:N entre profissionais e serviços.
- Compatível com PostgreSQL, Supabase e integração via n8n.

---

# 18. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Profissional. |

---

# 19. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |
| QA | __________________ | ☐ Pendente |

---


