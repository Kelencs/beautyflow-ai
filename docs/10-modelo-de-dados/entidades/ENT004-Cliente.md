# ENT004 — Cliente

**Código:** ENT004

**Versão:** 1.0

**Módulo:** Cadastros

**Tabela Física:** clientes

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Cliente** representa as pessoas que contratam os serviços da empresa cadastrada no BeautyFlow AI.

Ela centraliza todas as informações necessárias para o relacionamento com o cliente, permitindo o gerenciamento do histórico de atendimentos, agendamentos, pagamentos, lista de espera e avaliações.

Esta é uma das principais entidades do sistema, pois praticamente todos os processos de negócio estão relacionados ao cliente.

---

# 2. Descrição

A tabela **clientes** armazena os dados cadastrais dos clientes da empresa.

Ela é utilizada pelos módulos de:

- Agendamentos
- Agenda
- Lista de Espera
- Histórico de Atendimentos
- Pagamentos
- Avaliações
- Relatórios
- CRM
- Automações do WhatsApp

---

# 3. Tipo da Entidade

**Entidade Mestre (Master Data)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Possui | Agendamentos | 1:N | id_cliente |
| Possui | Lista de Espera | 1:N | id_cliente |
| Possui | Avaliações | 1:N* | através dos agendamentos |
| Realiza | Pagamentos | 1:N* | através dos agendamentos |
| Possui | Histórico de Atendimentos | 1:N | através dos agendamentos |

> *As avaliações e pagamentos estão vinculados ao agendamento, que por sua vez pertence ao cliente.

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC001 | Cadastrar Cliente |
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC005 | Consultar Serviços e Preços |
| UC009 | Registrar Pagamento |
| UC010 | Consultar Histórico de Atendimentos |
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
- US009 — Registrar Pagamento
- US010 — Consultar Histórico
- US011 — Lista de Espera
- US012 — Avaliar Atendimento

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF013 | Cadastro de Cliente |
| WF014 | Atualização de Cadastro |
| WF015 | Consulta de Cliente |
| WF016 | Confirmação de Agendamento via WhatsApp |
| WF017 | Lembrete Automático |
| WF018 | Solicitação de Avaliação |
| WF019 | Recuperação de Clientes Inativos |
| WF020 | Auditoria de Alterações |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /clientes | Listar clientes |
| GET | /clientes/{id} | Consultar cliente |
| POST | /clientes | Cadastrar cliente |
| PUT | /clientes/{id} | Atualizar cliente |
| PATCH | /clientes/{id}/status | Ativar/Inativar cliente |
| DELETE* | /clientes/{id} | Exclusão lógica |

> *A exclusão deverá ser lógica.

---

# 9. Estrutura da Tabela

```text
clientes
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_cliente | UUID | Sim | Identificador do cliente | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(120) | Sim | Nome completo | Entre 3 e 120 caracteres | — | Maria Oliveira |
| telefone | VARCHAR(20) | Sim | Telefone principal | Obrigatório, com DDD e único por empresa | — | +55 34 99999-9999 |
| email | VARCHAR(150) | Não | E-mail | Deve possuir formato válido quando informado | NULL | maria@email.com |
| data_nascimento | DATE | Não | Data de nascimento | Utilizada para campanhas de aniversário | NULL | 1992-05-10 |
| genero | VARCHAR(20) | Não | Gênero | Opcional | NULL | Feminino |
| observacoes | TEXT | Não | Observações sobre o cliente | Campo livre | NULL | Cliente alérgica a determinados produtos |
| aceita_whatsapp | BOOLEAN | Sim | Permite envio de mensagens | Utilizado pelas automações | TRUE | TRUE |
| ativo | BOOLEAN | Sim | Situação do cadastro | Exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 10:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-26 14:30:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo cliente deve pertencer a uma empresa válida. |
| RN002 | O telefone deve ser único dentro da empresa. |
| RN003 | O cliente deve estar ativo para realizar novos agendamentos. |
| RN004 | O histórico de atendimentos nunca poderá ser apagado. |
| RN005 | Um cliente pode possuir diversos agendamentos. |
| RN006 | Um cliente pode participar da lista de espera. |
| RN007 | O cliente poderá avaliar apenas atendimentos concluídos. |
| RN008 | As automações do WhatsApp somente serão executadas quando o cliente autorizar o recebimento de mensagens. |
| RN009 | A exclusão deverá ser lógica utilizando o campo **ativo**. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_clientes | PRIMARY KEY(id_cliente) |
| FK_clientes_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| UQ_cliente_telefone | UNIQUE(id_empresa, telefone) |
| NN_nome | NOT NULL |
| NN_telefone | NOT NULL |
| CK_aceita_whatsapp | Valor TRUE ou FALSE |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_cliente_nome | Pesquisa por nome |
| idx_cliente_telefone | Pesquisa por telefone |
| idx_cliente_email | Pesquisa por e-mail |
| idx_cliente_empresa | Consultas por empresa |
| idx_cliente_ativo | Clientes ativos |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Cadastro, edição e consulta |
| Recepcionista | Cadastro, edição e consulta |
| Profissional | Consulta dos próprios clientes atendidos |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO clientes (
    id_empresa,
    nome,
    telefone,
    email
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Maria Oliveira',
    '+55 34 99999-9999',
    'maria@email.com'
);
```

## Consulta

```sql
SELECT *
FROM clientes;
```

## Pesquisa por telefone

```sql
SELECT *
FROM clientes
WHERE telefone = '+55 34 99999-9999';
```

---

# 16. Segurança

- Utiliza UUID como chave primária.
- Compatível com PostgreSQL e Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão lógica utilizando o campo **ativo**.
- Os dados devem ser isolados por empresa (Multi-Tenant).
- Todas as alterações devem ser registradas na tabela **logs_auditoria**.

---

# 17. Observações Técnicas

- Um cliente pode possuir diversos agendamentos.
- O histórico do cliente é formado pelos agendamentos concluídos.
- O telefone será utilizado como principal identificador para integrações com WhatsApp.
- Os workflows do n8n utilizarão esta entidade para envio de confirmações, lembretes, pesquisas de satisfação e campanhas automáticas.
- Esta entidade será integrada ao CRM da plataforma.

---

# 18. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Cliente. |

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

**Fim da Documentação — ENT004 — Cliente**
