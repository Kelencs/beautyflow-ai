# ENT018 — Perfil_Permissões

**Código:** ENT018

**Versão:** 1.0

**Módulo:** Segurança

**Tabela Física:** perfil_permissoes

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Perfil_Permissões** realiza a associação entre os perfis de acesso e as permissões do sistema.

Seu objetivo é implementar o relacionamento muitos-para-muitos (N:N) entre as entidades **Perfis** e **Permissões**, permitindo que cada perfil possua um conjunto específico de permissões.

Esta entidade completa a implementação do modelo **RBAC (Role-Based Access Control)**.

---

# 2. Descrição

A tabela **perfil_permissoes** registra quais permissões pertencem a cada perfil.

Cada registro representa uma única associação entre um perfil e uma permissão.

A combinação entre perfil e permissão deverá ser única.

---

# 3. Tipo da Entidade

**Entidade Associativa (Relacionamento N:N)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence ao | Perfil | N:1 | id_perfil |
| Refere-se à | Permissão | N:1 | id_permissao |

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
| WF090 | Associar Permissões ao Perfil |
| WF091 | Remover Permissão do Perfil |
| WF092 | Sincronizar Controle de Acesso |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /perfil-permissoes | Listar associações |
| GET | /perfil-permissoes/{id} | Consultar associação |
| POST | /perfil-permissoes | Criar associação |
| DELETE | /perfil-permissoes/{id} | Remover associação |

---

# 9. Estrutura da Tabela

```text
perfil_permissoes
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_perfil_permissao | UUID | Sim | Identificador da associação | Gerado automaticamente | gen_random_uuid() | UUID |
| id_perfil | UUID | Sim | Perfil relacionado | Deve existir na tabela perfis | — | UUID |
| id_permissao | UUID | Sim | Permissão relacionada | Deve existir na tabela permissoes | — | UUID |
| criado_em | TIMESTAMP | Sim | Data da associação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 10:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 10:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo perfil poderá possuir várias permissões. |
| RN002 | Toda permissão poderá ser utilizada por vários perfis. |
| RN003 | Não poderá existir associação duplicada entre perfil e permissão. |
| RN004 | Apenas administradores poderão alterar as permissões dos perfis. |
| RN005 | Toda alteração deverá ser registrada na entidade logs_auditoria. |
| RN006 | Ao excluir um perfil, suas associações deverão ser removidas automaticamente (ON DELETE CASCADE). |
| RN007 | Não será permitido associar perfis ou permissões inativos. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_perfil_permissoes | PRIMARY KEY(id_perfil_permissao) |
| FK_pp_perfil | FOREIGN KEY(id_perfil) REFERENCES perfis(id_perfil) ON DELETE CASCADE |
| FK_pp_permissao | FOREIGN KEY(id_permissao) REFERENCES permissoes(id_permissao) ON DELETE CASCADE |
| UQ_perfil_permissao | UNIQUE(id_perfil, id_permissao) |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_pp_perfil | Consultas por perfil |
| idx_pp_permissao | Consultas por permissão |
| idx_pp_data | Auditoria |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Criar, editar e excluir associações |
| Gerente | Apenas consulta |
| Recepcionista | Sem acesso |
| Profissional | Sem acesso |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO perfil_permissoes (
    id_perfil,
    id_permissao
)
VALUES (
    'UUID_PERFIL',
    'UUID_PERMISSAO'
);
```

## Consulta

```sql
SELECT
    pf.nome AS perfil,
    pm.codigo,
    pm.nome
FROM perfil_permissoes pp
INNER JOIN perfis pf
    ON pp.id_perfil = pf.id_perfil
INNER JOIN permissoes pm
    ON pp.id_permissao = pm.id_permissao
ORDER BY pf.nome, pm.nome;
```

## Permissões de um Perfil

```sql
SELECT
    pm.*
FROM permissoes pm
INNER JOIN perfil_permissoes pp
    ON pm.id_permissao = pp.id_permissao
WHERE pp.id_perfil = 'UUID_PERFIL';
```

---

# 16. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Exclusão física permitida apenas para a associação, preservando os registros de Perfil e Permissão.
- Todas as alterações deverão ser registradas em **logs_auditoria**.

---

# 17. Integrações

- API REST
- PostgreSQL
- Supabase
- n8n
- Sistema de Autorização (RBAC)
- Logs de Auditoria

---

# 18. Observações Técnicas

- Esta entidade implementa o relacionamento muitos-para-muitos entre **Perfis** e **Permissões**.
- A autorização dos usuários será determinada pelas permissões vinculadas ao perfil atribuído ao usuário.
- Recomenda-se carregar as permissões do usuário no momento da autenticação para otimizar a validação de acesso durante a sessão.
- A combinação (`id_perfil`, `id_permissao`) deve ser única para evitar duplicidade.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Perfil_Permissões. |

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

**Fim da Documentação — ENT018 — Perfil_Permissões**
