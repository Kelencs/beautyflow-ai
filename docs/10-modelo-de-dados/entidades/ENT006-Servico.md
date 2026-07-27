# ENT006 — Serviço

**Código:** ENT006

**Versão:** 1.0

**Módulo:** Cadastros

**Tabela Física:** servicos

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Serviço** representa todos os serviços oferecidos pela empresa aos seus clientes.

Cada serviço possui características próprias, como:

- Nome
- Categoria
- Duração
- Valor
- Status
- Tempo de intervalo (opcional)

Os serviços serão utilizados pelos módulos de:

- Agendamento
- Agenda
- Pagamentos
- Histórico
- Relatórios
- Dashboard
- Automações do WhatsApp

Um serviço poderá ser executado por um ou vários profissionais, através da tabela de relacionamento **profissional_servico**.

---

# 2. Descrição

A tabela **servicos** armazena o catálogo completo de serviços oferecidos pela empresa.

Os profissionais não possuem especialidades cadastradas diretamente. A associação entre profissionais e serviços ocorre pela tabela **profissional_servico**, permitindo que um mesmo profissional realize diversos serviços e que um serviço seja executado por vários profissionais.

---

# 3. Tipo da Entidade

**Entidade Mestre (Master Data)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Pertence à | Categoria de Serviço | N:1 | id_categoria |
| É executado por | Profissionais | N:N | profissional_servico |
| Possui | Agendamentos | 1:N | id_servico |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC005 | Consultar Serviços e Preços |
| UC006 | Cadastrar Serviço |
| UC009 | Registrar Pagamento |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US005 — Consultar Serviços
- US006 — Cadastrar Serviço
- US009 — Registrar Pagamento

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF026 | Cadastro de Serviço |
| WF027 | Atualização de Serviço |
| WF028 | Consulta de Serviços |
| WF029 | Sincronização do Catálogo |
| WF030 | Publicação dos Serviços |
| WF031 | Auditoria de Alterações |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /servicos | Listar serviços |
| GET | /servicos/{id} | Consultar serviço |
| POST | /servicos | Cadastrar serviço |
| PUT | /servicos/{id} | Atualizar serviço |
| PATCH | /servicos/{id}/status | Ativar/Inativar serviço |
| DELETE* | /servicos/{id} | Exclusão lógica |

> *A exclusão deverá ser lógica.

---

# 9. Estrutura da Tabela

```text
servicos
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_servico | UUID | Sim | Identificador do serviço | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_categoria | UUID | Sim | Categoria do serviço | Deve existir na tabela categorias_servico | — | UUID |
| nome | VARCHAR(120) | Sim | Nome do serviço | Deve ser único dentro da empresa | — | Alongamento em Gel |
| descricao | TEXT | Não | Descrição do serviço | Campo opcional | NULL | Alongamento em gel com manutenção de até 30 dias |
| duracao_minutos | INTEGER | Sim | Tempo estimado | Deve ser maior que zero | 60 | 90 |
| intervalo_minutos | INTEGER | Não | Intervalo após atendimento | Deve ser maior ou igual a zero | 0 | 15 |
| valor | NUMERIC(10,2) | Sim | Valor do serviço | Deve ser maior que zero | — | 180.00 |
| ativo | BOOLEAN | Sim | Situação do serviço | Exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 09:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 15:00:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo serviço deve pertencer a uma empresa válida. |
| RN002 | Todo serviço deve pertencer a uma categoria válida. |
| RN003 | O valor do serviço deve ser maior que zero. |
| RN004 | A duração deve ser maior que zero. |
| RN005 | Um serviço poderá ser executado por vários profissionais. |
| RN006 | Um profissional poderá executar vários serviços através da tabela profissional_servico. |
| RN007 | Serviços inativos não poderão ser agendados. |
| RN008 | Um serviço utilizado em agendamentos não poderá ser excluído fisicamente. |
| RN009 | A exclusão deverá ser lógica utilizando o campo **ativo**. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_servicos | PRIMARY KEY(id_servico) |
| FK_servico_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_servico_categoria | FOREIGN KEY(id_categoria) REFERENCES categorias_servico(id_categoria) |
| UQ_servico_nome | UNIQUE(id_empresa, nome) |
| NN_nome | NOT NULL |
| NN_valor | NOT NULL |
| NN_duracao | NOT NULL |
| CK_valor | valor > 0 |
| CK_duracao | duracao_minutos > 0 |
| CK_intervalo | intervalo_minutos >= 0 |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_servico_empresa | Consultas por empresa |
| idx_servico_categoria | Pesquisa por categoria |
| idx_servico_nome | Pesquisa por nome |
| idx_servico_ativo | Serviços ativos |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Cadastro, edição e consulta |
| Recepcionista | Consulta |
| Profissional | Consulta |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO servicos (
    id_empresa,
    id_categoria,
    nome,
    descricao,
    duracao_minutos,
    intervalo_minutos,
    valor
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '6fd7ab25-13cf-4b62-b0af-d3b10fa95b11',
    'Alongamento em Gel',
    'Alongamento com gel UV',
    120,
    15,
    180.00
);
```

## Consulta

```sql
SELECT *
FROM servicos;
```

## Consulta por Categoria

```sql
SELECT *
FROM servicos
WHERE id_categoria = '6fd7ab25-13cf-4b62-b0af-d3b10fa95b11'
ORDER BY nome;
```

---

# 16. Segurança

- Utiliza UUID como chave primária.
- Compatível com PostgreSQL e Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão lógica utilizando o campo **ativo**.
- Todas as alterações deverão ser registradas em **logs_auditoria**.

---

# 17. Integrações

Esta entidade poderá ser utilizada por:

- API REST
- n8n
- Google Sheets (MVP)
- PostgreSQL
- Supabase
- Dashboard Power BI
- WhatsApp Business API
- Google Calendar
- Sistema de Agendamento Online

---

# 18. Observações Técnicas

- Os serviços são vinculados às categorias por meio da chave **id_categoria**.
- A disponibilidade de um serviço dependerá dos profissionais associados na tabela **profissional_servico**.
- O tempo de intervalo será considerado automaticamente pelo motor de agendamento.
- O valor poderá futuramente suportar tabelas de preços promocionais.
- O histórico de atendimentos deve preservar o valor do serviço praticado na data do atendimento.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Serviço. |

---

# 20. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |
| QA | __________________ | ☐ Pendente |

---


