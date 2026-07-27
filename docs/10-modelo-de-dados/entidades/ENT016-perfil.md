# ENT016 — Perfil (Role)

**Código:** ENT016

**Versão:** 2.0

**Módulo:** Segurança

**Tabela Física:** perfis

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Perfil (Role)** representa os grupos de acesso do sistema.

Seu objetivo é agrupar permissões para facilitar o controle de acesso dos usuários através do modelo **RBAC (Role-Based Access Control)**.

Cada usuário deverá possuir exatamente um perfil.

As permissões do perfil serão definidas pela entidade **ENT018 — Perfil_Permissões**.

---

# 2. Descrição

A tabela **perfis** armazena todos os perfis disponíveis para utilização dentro do sistema.

Os perfis podem ser:

- Padrões do sistema;
- Personalizados por empresa.

Cada perfil poderá ser utilizado por vários usuários.

Cada perfil poderá possuir diversas permissões.

O relacionamento entre Perfil e Permissão é realizado pela entidade associativa **perfil_permissoes**.

```text
Usuário
    │
    ▼
 Perfil
    │
    ▼
Perfil_Permissões
    ▲
    │
Permissões
```

---

# 3. Tipo da Entidade

**Entidade Mestre**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Possui | Usuários | 1:N | id_perfil |
| Possui Permissões | Perfil_Permissões | 1:N | id_perfil |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC003 | Gerenciar Usuários |
| UC013 | Gerenciar Perfis |
| UC014 | Gerenciar Permissões |

---

# 6. User Stories Relacionadas

- US015 — Gerenciar Usuários
- US016 — Gerenciar Perfis
- US017 — Gerenciar Permissões

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF084 | Criar Perfil |
| WF085 | Atualizar Perfil |
| WF086 | Sincronizar Permissões |
| WF090 | Associar Permissões ao Perfil |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /perfis | Listar perfis |
| GET | /perfis/{id} | Consultar perfil |
| POST | /perfis | Criar perfil |
| PUT | /perfis/{id} | Atualizar perfil |
| PATCH | /perfis/{id}/status | Alterar status |
| DELETE | /perfis/{id} | Exclusão lógica |

---

# 9. Estrutura da Tabela

```text
perfis
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_perfil | UUID | Sim | Identificador do perfil | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(80) | Sim | Nome do perfil | Deve ser único por empresa | — | Administrador |
| descricao | TEXT | Não | Descrição do perfil | Campo opcional | NULL | Controle total do sistema |
| sistema | BOOLEAN | Sim | Indica se o perfil é padrão do sistema | TRUE ou FALSE | FALSE | TRUE |
| status | VARCHAR(20) | Sim | Situação do perfil | Ativo ou Inativo | Ativo | Ativo |
| criado_em | TIMESTAMP | Sim | Data de criação | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Perfis Padrão

| Código | Perfil |
|---------|--------|
| PF001 | Administrador |
| PF002 | Gerente |
| PF003 | Recepcionista |
| PF004 | Profissional |

Esses perfis serão criados automaticamente durante a implantação inicial do sistema.

---

# 12. Status Permitidos

| Código | Status |
|---------|--------|
| ST001 | Ativo |
| ST002 | Inativo |

---

# 13. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo perfil pertence a uma única empresa. |
| RN002 | O nome do perfil deverá ser único dentro da empresa. |
| RN003 | Perfis marcados como **sistema = TRUE** não poderão ser excluídos. |
| RN004 | Um perfil poderá ser utilizado por diversos usuários. |
| RN005 | Todo usuário deverá possuir exatamente um perfil. |
| RN006 | As permissões do perfil serão definidas exclusivamente pela entidade **ENT018 — Perfil_Permissões**. |
| RN007 | Alterações deverão ser registradas na entidade **logs_auditoria**. |
| RN008 | Perfis inativos não poderão ser atribuídos a novos usuários. |
| RN009 | Um perfil poderá existir sem permissões temporariamente durante sua configuração. |

---

# 14. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_perfis | PRIMARY KEY(id_perfil) |
| FK_perfil_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| UQ_perfil_empresa | UNIQUE(id_empresa, nome) |
| NN_nome | NOT NULL |

---

# 15. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_perfil_empresa | Consultas por empresa |
| idx_perfil_nome | Busca por nome |
| idx_perfil_status | Perfis ativos |
| idx_perfil_sistema | Perfis padrão |

---

# 16. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Gerenciamento completo de perfis |
| Gerente | Consulta |
| Recepcionista | Sem acesso |
| Profissional | Sem acesso |

---

# 17. Exemplos SQL

## Inserção

```sql
INSERT INTO perfis (
    id_empresa,
    nome,
    descricao,
    sistema,
    status
)
VALUES (
    'UUID_EMPRESA',
    'Gerente',
    'Gerencia equipe e agenda.',
    TRUE,
    'Ativo'
);
```

## Consulta

```sql
SELECT *
FROM perfis
ORDER BY nome;
```

## Usuários por Perfil

```sql
SELECT
p.nome,
COUNT(u.id_usuario) AS total_usuarios
FROM perfis p
LEFT JOIN usuarios u
ON p.id_perfil = u.id_perfil
GROUP BY p.nome;
```

---

# 18. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Exclusão física proibida para perfis do sistema.
- Todas as alterações deverão ser registradas na auditoria.

---

# 19. Integrações

- PostgreSQL
- Supabase
- API REST
- n8n
- ENT015 — Usuário
- ENT017 — Permissão
- ENT018 — Perfil_Permissões
- Logs de Auditoria

---

# 20. Observações Técnicas

- Esta entidade implementa o conceito de **Role** do modelo RBAC.
- O relacionamento entre Perfil e Permissão é realizado exclusivamente pela entidade **ENT018 — Perfil_Permissões**.
- Os usuários não armazenam permissões diretamente.
- A autorização é calculada dinamicamente a partir do perfil e das permissões associadas.
- A modelagem segue a Terceira Forma Normal (3FN), eliminando redundâncias e permitindo evolução do sistema.

---

# 21. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Perfil |
| 2.0 | 27/07/2026 | Product Owner | Adequação completa ao modelo RBAC, integrando ENT015, ENT017 e ENT018 |

---

# 22. Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |
| QA | __________________ | ☐ Pendente |

---


