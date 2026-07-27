# ENT001 — Empresa

**Código:** ENT001

**Versão:** 1.0

**Módulo:** Cadastro

**Tabela Física:** empresas

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Empresa** representa o estabelecimento que utiliza o BeautyFlow AI.

Pode ser:

- Salão de Beleza
- Barbearia
- Clínica de Estética
- Nail Designer
- Lash Designer
- Estúdio de Beleza
- Profissional Autônomo

Esta entidade é responsável pelo isolamento dos dados (Multi-Tenant), garantindo que todas as informações cadastradas no sistema pertençam a uma empresa específica.

---

# 2. Descrição

A tabela **empresas** armazena os dados cadastrais da empresa, sendo considerada a entidade raiz do sistema.

Praticamente todas as demais entidades possuem relacionamento direto ou indireto com ela.

---

# 3. Tipo da Entidade

**Entidade Mestre (Master Data)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Possui | Usuários | 1:N | id_empresa |
| Possui | Profissionais | 1:N | id_empresa |
| Possui | Clientes | 1:N | id_empresa |
| Possui | Categorias de Serviço | 1:N | id_empresa |
| Possui | Serviços | 1:N | id_empresa |
| Possui | Configurações | 1:1 | id_empresa |
| Possui | Agenda | 1:N | id_empresa *(opcional conforme modelagem)* |
| Possui | Agendamentos | 1:N | id_empresa |
| Possui | Lista de Espera | 1:N | id_empresa |
| Possui | Assinaturas | 1:N | id_empresa |
| Possui | Logs de Auditoria | 1:N | id_empresa |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC001 | Cadastrar Cliente |
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC005 | Consultar Serviços |
| UC006 | Cadastrar Serviço |
| UC007 | Cadastrar Profissional |
| UC008 | Configurar Agenda |
| UC009 | Registrar Pagamento |
| UC010 | Consultar Histórico |
| UC011 | Gerenciar Lista de Espera |
| UC012 | Avaliar Atendimento |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US002 — Confirmar Agendamento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US005 — Consultar Serviços
- US006 — Cadastrar Cliente
- US007 — Cadastrar Profissional
- US008 — Configurar Agenda
- US009 — Registrar Pagamento
- US010 — Consultar Histórico
- US011 — Gerenciar Lista de Espera
- US012 — Avaliar Atendimento

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF001 | Cadastro da Empresa |
| WF002 | Validação da Assinatura |
| WF003 | Configuração Inicial |
| WF004 | Criação do Administrador |
| WF005 | Auditoria de Alterações |
| WF006 | Backup de Dados |

---

# 8. Estrutura da Tabela

```text
empresas
```

---

# 9. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_empresa | UUID | Sim | Identificador único da empresa | Deve ser gerado automaticamente e nunca alterado | gen_random_uuid() | 550e8400-e29b-41d4-a716-446655440000 |
| razao_social | VARCHAR(150) | Sim | Razão social | Entre 3 e 150 caracteres | — | Studio Bella LTDA |
| nome_fantasia | VARCHAR(100) | Sim | Nome comercial | Obrigatório | — | Studio Bella |
| cnpj | VARCHAR(18) | Não | Cadastro Nacional da Pessoa Jurídica | Deve ser único quando informado | NULL | 12.345.678/0001-90 |
| telefone | VARCHAR(20) | Sim | Telefone principal | Deve possuir DDD | — | +55 34 99999-9999 |
| email | VARCHAR(150) | Sim | E-mail principal | Deve possuir formato válido | — | contato@studiobella.com.br |
| endereco | TEXT | Não | Endereço completo | Campo livre | NULL | Rua A, 100 - Uberlândia/MG |
| status | VARCHAR(20) | Sim | Situação da empresa | Valores permitidos: Ativa, Inativa, Suspensa | Ativa | Ativa |
| ativo | BOOLEAN | Sim | Exclusão lógica | TRUE/FALSE | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 10:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 15:30:00 |

---

# 10. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Toda empresa deve possuir pelo menos um usuário administrador. |
| RN002 | O CNPJ deve ser único quando informado. |
| RN003 | Apenas empresas com status **Ativa** podem utilizar o sistema. |
| RN004 | Todas as entidades de negócio devem possuir um **id_empresa** válido. |
| RN005 | Empresas não podem ser excluídas fisicamente; apenas desativadas. |
| RN006 | A criação da empresa gera automaticamente as configurações iniciais do sistema. |
| RN007 | Toda empresa deve possuir uma assinatura ativa para utilizar funcionalidades premium. |

---

# 11. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_empresas | PRIMARY KEY(id_empresa) |
| UQ_empresas_cnpj | UNIQUE(cnpj) |
| NN_razao_social | NOT NULL |
| NN_nome_fantasia | NOT NULL |
| NN_telefone | NOT NULL |
| NN_email | NOT NULL |
| CK_status | Valores permitidos: Ativa, Inativa e Suspensa |

---

# 12. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_empresa_nome | Pesquisa por nome fantasia |
| idx_empresa_cnpj | Pesquisa por CNPJ |
| idx_empresa_status | Empresas ativas |
| idx_empresa_email | Pesquisa por e-mail |

---

# 13. Exemplos SQL

## Inserção

```sql
INSERT INTO empresas (
    razao_social,
    nome_fantasia,
    telefone,
    email
)
VALUES (
    'Studio Bella LTDA',
    'Studio Bella',
    '+55 34 99999-9999',
    'contato@studiobella.com.br'
);
```

## Consulta

```sql
SELECT *
FROM empresas;
```

## Consulta por CNPJ

```sql
SELECT *
FROM empresas
WHERE cnpj = '12.345.678/0001-90';
```

---

# 14. Segurança

- Utiliza UUID como chave primária.
- Compatível com Row Level Security (RLS).
- Suporta Multi-Tenant.
- Exclusão lógica utilizando o campo **ativo**.
- Todas as alterações devem ser registradas na tabela **logs_auditoria**.

---

# 15. Observações Técnicas

- Entidade raiz da aplicação.
- Todas as tabelas de negócio possuem relacionamento com **Empresa**.
- A integridade referencial deve ser garantida por chaves estrangeiras.
- O campo **id_empresa** será utilizado pelos workflows do n8n para isolamento de dados entre clientes.
- Compatível com PostgreSQL, Supabase e integração via APIs REST.

---

# 16. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Empresa. |

---

# 17. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |
| QA | __________________ | ☐ Pendente |

---


