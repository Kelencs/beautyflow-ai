# ENT005 — Categoria de Serviço

**Código:** ENT005

**Versão:** 1.0

**Módulo:** Cadastros

**Tabela Física:** categorias_servico

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Categoria de Serviço** tem como objetivo organizar os serviços oferecidos pela empresa em grupos lógicos, facilitando o gerenciamento, a pesquisa, os relatórios e o processo de agendamento.

Exemplos de categorias:

- Cabelos
- Manicure
- Pedicure
- Estética Facial
- Estética Corporal
- Massagem
- Maquiagem
- Barbearia
- Depilação

Cada categoria pertence a uma única empresa e pode possuir diversos serviços associados.

---

# 2. Descrição

A tabela **categorias_servico** armazena as categorias utilizadas para classificar os serviços da empresa.

Sua utilização facilita:

- Organização do catálogo
- Pesquisa de serviços
- Relatórios
- Integrações
- Agendamento
- Dashboards

---

# 3. Tipo da Entidade

**Entidade Mestre (Master Data)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Possui | Serviços | 1:N | id_categoria |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC005 | Consultar Serviços e Preços |
| UC006 | Cadastrar Serviço |

---

# 6. User Stories Relacionadas

- US005 — Consultar Serviços
- US006 — Cadastrar Serviço

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF021 | Cadastro de Categoria |
| WF022 | Atualização de Categoria |
| WF023 | Consulta de Categorias |
| WF024 | Sincronização com Catálogo |
| WF025 | Auditoria de Alterações |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /categorias-servico | Listar categorias |
| GET | /categorias-servico/{id} | Consultar categoria |
| POST | /categorias-servico | Cadastrar categoria |
| PUT | /categorias-servico/{id} | Atualizar categoria |
| PATCH | /categorias-servico/{id}/status | Ativar/Inativar categoria |
| DELETE* | /categorias-servico/{id} | Exclusão lógica |

> *A exclusão deverá ser lógica.

---

# 9. Estrutura da Tabela

```text
categorias_servico
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_categoria | UUID | Sim | Identificador da categoria | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(100) | Sim | Nome da categoria | Deve ser único por empresa | — | Manicure |
| descricao | TEXT | Não | Descrição da categoria | Campo opcional | NULL | Serviços relacionados às unhas |
| ordem_exibicao | INTEGER | Não | Ordem de apresentação | Deve ser maior que zero | 1 | 1 |
| ativo | BOOLEAN | Sim | Situação da categoria | Utilizado para exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 09:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 14:00:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Toda categoria deve pertencer a uma empresa válida. |
| RN002 | O nome da categoria deve ser único dentro da empresa. |
| RN003 | Uma categoria pode possuir diversos serviços. |
| RN004 | Uma categoria inativa não poderá receber novos serviços. |
| RN005 | Uma categoria não poderá ser excluída caso existam serviços vinculados. |
| RN006 | A exclusão deverá ser lógica utilizando o campo **ativo**. |
| RN007 | A ordem de exibição deverá ser maior que zero. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_categorias_servico | PRIMARY KEY(id_categoria) |
| FK_categoria_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| UQ_categoria_nome_empresa | UNIQUE(id_empresa, nome) |
| NN_nome | NOT NULL |
| CK_ordem_exibicao | ordem_exibicao > 0 |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_categoria_empresa | Consultas por empresa |
| idx_categoria_nome | Pesquisa por nome |
| idx_categoria_ativo | Categorias ativas |
| idx_categoria_ordem | Ordenação da listagem |

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
INSERT INTO categorias_servico (
    id_empresa,
    nome,
    descricao,
    ordem_exibicao
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Manicure',
    'Serviços relacionados às unhas',
    1
);
```

## Consulta

```sql
SELECT *
FROM categorias_servico;
```

## Consulta por Empresa

```sql
SELECT *
FROM categorias_servico
WHERE id_empresa = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY ordem_exibicao;
```

---

# 16. Segurança

- Utiliza UUID como chave primária.
- Compatível com PostgreSQL e Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão lógica utilizando o campo **ativo**.
- Todas as alterações devem ser registradas na tabela **logs_auditoria**.

---

# 17. Integrações

Esta entidade poderá ser utilizada pelos seguintes componentes:

- API REST
- n8n
- Google Sheets (MVP)
- PostgreSQL
- Supabase
- Dashboard Power BI
- Catálogo de Serviços
- Agendamento Online

---

# 18. Observações Técnicas

- Cada empresa poderá criar suas próprias categorias.
- A ordenação das categorias será utilizada nas telas de cadastro e agendamento.
- Recomenda-se não excluir categorias com histórico de utilização.
- Os serviços herdam o contexto da empresa por meio da categoria.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Categoria de Serviço. |

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


