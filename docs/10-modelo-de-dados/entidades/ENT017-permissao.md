# ENT017 — Permissão

**Código:** ENT017

**Versão:** 1.0

**Módulo:** Segurança

**Tabela Física:** permissoes

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Permissão** representa cada ação que poderá ser executada dentro do sistema.

Ela é utilizada pelo modelo **RBAC (Role-Based Access Control)** para definir quais funcionalidades estarão disponíveis para cada perfil de usuário.

As permissões são independentes dos usuários e poderão ser reutilizadas por diversos perfis.

---

# 2. Descrição

A tabela **permissoes** armazena todas as permissões disponíveis no sistema.

Cada permissão representa uma funcionalidade específica.

Exemplos:

- Criar Cliente
- Editar Cliente
- Excluir Cliente
- Consultar Agenda
- Registrar Pagamento
- Consultar Relatórios

A associação entre perfis e permissões será realizada pela entidade **ENT018 — Perfil_Permissões**.

---

# 3. Tipo da Entidade

**Entidade Mestre**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade |
|----------------|----------|---------------|
| Associação N:N | Perfis | Realizada pela ENT018 |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC013 | Gerenciar Perfis |
| UC014 | Gerenciar Permissões |

---

# 6. User Stories Relacionadas

- US016 — Gerenciar Perfis
- US017 — Gerenciar Permissões

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF087 | Criar Permissão |
| WF088 | Atualizar Permissão |
| WF089 | Sincronizar Perfis |

---

# 8. APIs Relacionadas

| Método | Endpoint |
|---------|----------|
| GET | /permissoes |
| GET | /permissoes/{id} |
| POST | /permissoes |
| PUT | /permissoes/{id} |
| DELETE | /permissoes/{id} |

---

# 9. Estrutura da Tabela

```text
permissoes
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_permissao | UUID | Sim | Identificador da permissão | Gerado automaticamente | gen_random_uuid() | UUID |
| codigo | VARCHAR(50) | Sim | Código único | Deve ser único | — | CLIENTE_CREATE |
| modulo | VARCHAR(50) | Sim | Módulo do sistema | Obrigatório | — | Clientes |
| nome | VARCHAR(100) | Sim | Nome da permissão | Obrigatório | — | Criar Cliente |
| descricao | TEXT | Não | Descrição | Opcional | NULL | Permite cadastrar clientes |
| status | VARCHAR(20) | Sim | Situação | Ativo ou Inativo | Ativo | Ativo |
| criado_em | TIMESTAMP | Sim | Data de criação | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Módulos do Sistema

| Código | Módulo |
|---------|--------|
| MOD001 | Empresas |
| MOD002 | Clientes |
| MOD003 | Profissionais |
| MOD004 | Serviços |
| MOD005 | Agenda |
| MOD006 | Agendamentos |
| MOD007 | Financeiro |
| MOD008 | Avaliações |
| MOD009 | Notificações |
| MOD010 | Usuários |
| MOD011 | Perfis |
| MOD012 | Relatórios |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | O código da permissão deve ser único. |
| RN002 | Permissões não poderão ser excluídas fisicamente. |
| RN003 | Uma permissão poderá ser utilizada por vários perfis. |
| RN004 | Alterações deverão ser registradas na auditoria. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_permissoes | PRIMARY KEY(id_permissao) |
| UQ_codigo | UNIQUE(codigo) |
| NN_nome | NOT NULL |
| NN_modulo | NOT NULL |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_permissao_codigo | Busca rápida |
| idx_permissao_modulo | Consultas por módulo |
| idx_permissao_status | Permissões ativas |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Total |
| Gerente | Consulta |
| Demais Perfis | Sem acesso |

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO permissoes (
    codigo,
    modulo,
    nome,
    status
)
VALUES (
    'CLIENTE_CREATE',
    'Clientes',
    'Criar Cliente',
    'Ativo'
);
```

## Consulta

```sql
SELECT *
FROM permissoes;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão física não permitida.

---

# 18. Integrações

- API REST
- PostgreSQL
- Supabase
- n8n
- Logs de Auditoria

---

# 19. Observações Técnicas

- Implementa o conceito de **Permission** do modelo RBAC.
- Não possui relacionamento direto com usuários.
- O vínculo entre perfis e permissões será realizado pela entidade **ENT018 — Perfil_Permissões**, permitindo um relacionamento muitos-para-muitos.

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Permissão. |

---

# 21. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |
| QA | __________________ | ☐ Pendente |

---

**Fim da Documentação — ENT017 — Permissão**
