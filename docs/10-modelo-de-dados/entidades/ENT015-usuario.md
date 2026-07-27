# ENT015 — Usuário

**Código:** ENT015

**Versão:** 2.0

**Módulo:** Segurança

**Tabela Física:** usuarios

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Usuário** representa todas as pessoas autorizadas a acessar o BeautyFlow AI.

Seu objetivo é controlar:

- autenticação;
- autorização;
- rastreabilidade;
- identificação do usuário;
- vínculo com empresa;
- vínculo com perfil de acesso;
- vínculo opcional com profissional.

A autorização do usuário será determinada pelas permissões atribuídas ao seu perfil (RBAC).

---

# 2. Descrição

A tabela **usuarios** armazena as credenciais de acesso ao sistema.

Cada usuário pertence obrigatoriamente a uma empresa.

Cada usuário deverá possuir exatamente um perfil.

Opcionalmente poderá estar vinculado a um profissional.

As permissões não são armazenadas diretamente no usuário.

O acesso será determinado através do relacionamento:

```text
Usuário
    │
Perfil
    │
Perfil_Permissões
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
| Possui | Perfil | N:1 | id_perfil |
| Vincula-se ao | Profissional | 0..1:1 | id_profissional |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC001 | Login |
| UC002 | Alterar Senha |
| UC013 | Gerenciar Usuários |

---

# 6. User Stories Relacionadas

- US013 — Login
- US014 — Alterar Senha
- US015 — Gerenciar Usuários

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF080 | Criar Usuário |
| WF081 | Atualizar Usuário |
| WF082 | Recuperar Senha |
| WF083 | Registrar Login |
| WF084 | Bloquear Usuário |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /usuarios | Listar usuários |
| GET | /usuarios/{id} | Consultar usuário |
| POST | /usuarios | Criar usuário |
| PUT | /usuarios/{id} | Atualizar usuário |
| PATCH | /usuarios/{id}/status | Alterar status |
| DELETE | /usuarios/{id} | Exclusão lógica |

---

# 9. Estrutura da Tabela

```text
usuarios
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_usuario | UUID | Sim | Identificador do usuário | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_perfil | UUID | Sim | Perfil de acesso | Deve existir na tabela perfis | — | UUID |
| id_profissional | UUID | Não | Profissional vinculado | Opcional | NULL | UUID |
| nome | VARCHAR(150) | Sim | Nome completo | Obrigatório | — | Maria Silva |
| email | VARCHAR(150) | Sim | E-mail de acesso | Deve ser único por empresa | — | maria@email.com |
| senha_hash | VARCHAR(255) | Sim | Senha criptografada | Utilizar Argon2 ou BCrypt | — | Hash BCrypt |
| status | VARCHAR(20) | Sim | Situação do usuário | Ativo, Bloqueado ou Inativo | Ativo | Ativo |
| ultimo_login | TIMESTAMP | Não | Último login realizado | Atualizado automaticamente | NULL | 2026-07-27 09:00 |
| criado_em | TIMESTAMP | Sim | Data de criação | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Status Permitidos

| Código | Status |
|---------|--------|
| ST001 | Ativo |
| ST002 | Bloqueado |
| ST003 | Inativo |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo usuário pertence a uma única empresa. |
| RN002 | Todo usuário deverá possuir um perfil válido. |
| RN003 | O e-mail deverá ser único dentro da empresa. |
| RN004 | A senha deverá ser armazenada utilizando algoritmo criptográfico seguro (Argon2 ou BCrypt). |
| RN005 | Um profissional poderá estar vinculado a apenas um usuário. |
| RN006 | Usuários inativos ou bloqueados não poderão autenticar-se. |
| RN007 | Todas as autenticações deverão gerar registro na entidade logs_auditoria. |
| RN008 | Todas as permissões do usuário serão obtidas através do Perfil (ENT016) e da associação Perfil_Permissões (ENT018). |
| RN009 | Exclusão física de usuários não será permitida. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_usuarios | PRIMARY KEY(id_usuario) |
| FK_usuario_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_usuario_perfil | FOREIGN KEY(id_perfil) REFERENCES perfis(id_perfil) |
| FK_usuario_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| UQ_usuario_email | UNIQUE(id_empresa, email) |
| UQ_usuario_profissional | UNIQUE(id_profissional) |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_usuario_empresa | Consultas por empresa |
| idx_usuario_email | Login |
| idx_usuario_perfil | Consultas por perfil |
| idx_usuario_status | Usuários ativos |
| idx_usuario_profissional | Vinculação profissional |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Gerenciamento completo |
| Gerente | Conforme permissões atribuídas |
| Recepcionista | Conforme permissões atribuídas |
| Profissional | Conforme permissões atribuídas |

> As permissões efetivas serão determinadas pelas entidades **ENT016**, **ENT017** e **ENT018**.

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO usuarios (
    id_empresa,
    id_perfil,
    nome,
    email,
    senha_hash,
    status
)
VALUES (
    'UUID_EMPRESA',
    'UUID_PERFIL',
    'Maria Silva',
    'maria@email.com',
    '$2b$12$HASH...',
    'Ativo'
);
```

## Consulta

```sql
SELECT
u.nome,
u.email,
p.nome AS perfil
FROM usuarios u
INNER JOIN perfis p
ON u.id_perfil = p.id_perfil;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Supabase Auth.
- Compatível com JWT.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Senhas armazenadas exclusivamente em formato hash.
- Exclusão física não permitida.

---

# 18. Integrações

- Supabase Auth
- JWT
- OAuth 2.0
- API REST
- PostgreSQL
- Supabase
- n8n
- Logs de Auditoria

---

# 19. Observações Técnicas

- Esta entidade implementa a identidade do usuário no sistema.
- A autenticação poderá ser delegada ao Supabase Auth.
- A autorização será baseada no modelo RBAC composto pelas entidades:
  - ENT015 — Usuário
  - ENT016 — Perfil
  - ENT017 — Permissão
  - ENT018 — Perfil_Permissões
- Não existe armazenamento direto de permissões ou perfil em formato textual na tabela `usuarios`.
- A modelagem segue a Terceira Forma Normal (3FN), eliminando redundâncias e facilitando a evolução do sistema.

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Usuário |
| 2.0 | 27/07/2026 | Product Owner | Adequação ao modelo RBAC, substituindo o campo `perfil` por `id_perfil` e integrando às entidades ENT016, ENT017 e ENT018 |

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

**Fim da Documentação — ENT015 — Usuário**
