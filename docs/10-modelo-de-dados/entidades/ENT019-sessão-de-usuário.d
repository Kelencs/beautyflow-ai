# ENT019 — Sessão de Usuário

**Código:** ENT019

**Versão:** 1.0

**Módulo:** Segurança

**Tabela Física:** sessoes_usuario

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Sessão de Usuário** registra todas as sessões de autenticação realizadas no sistema.

Seu objetivo é controlar:

- Login
- Logout
- Sessões ativas
- Expiração de sessão
- Refresh Token
- Dispositivos utilizados
- Controle de múltiplos acessos
- Segurança da autenticação

Esta entidade complementa a autenticação e trabalha em conjunto com a auditoria.

---

# 2. Descrição

A tabela **sessoes_usuario** armazena todas as sessões criadas após uma autenticação válida.

Cada sessão pertence a um único usuário.

Um usuário poderá possuir várias sessões simultaneamente, dependendo da política de segurança definida pela empresa.

A exclusão física das sessões expiradas poderá ser realizada por rotina automática.

---

# 3. Tipo da Entidade

**Entidade Transacional**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence ao | Usuário | N:1 | id_usuario |
| Pertence à | Empresa | N:1 | id_empresa |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC001 | Login |
| UC002 | Logout |
| UC015 | Gerenciar Sessões |

---

# 6. User Stories Relacionadas

- US013 — Login
- US014 — Logout
- US018 — Encerrar Sessão

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF093 | Registrar Login |
| WF094 | Encerrar Sessão |
| WF095 | Expirar Sessões |
| WF096 | Notificar Login Suspeito |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | /login | Autenticar usuário |
| POST | /logout | Encerrar sessão |
| GET | /sessoes | Listar sessões |
| DELETE | /sessoes/{id} | Encerrar sessão específica |

---

# 9. Estrutura da Tabela

```text
sessoes_usuario
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_sessao | UUID | Sim | Identificador da sessão | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir em empresas | — | UUID |
| id_usuario | UUID | Sim | Usuário autenticado | Deve existir em usuarios | — | UUID |
| access_token | TEXT | Sim | Token de acesso | Gerado pelo sistema | — | JWT |
| refresh_token | TEXT | Não | Token de renovação | Opcional conforme política | NULL | JWT |
| dispositivo | VARCHAR(100) | Não | Nome do dispositivo | Informação enviada pelo cliente | NULL | Chrome Windows |
| sistema_operacional | VARCHAR(80) | Não | Sistema operacional | Opcional | NULL | Android 16 |
| navegador | VARCHAR(80) | Não | Navegador utilizado | Opcional | NULL | Chrome |
| ip_origem | VARCHAR(45) | Sim | Endereço IP | IPv4 ou IPv6 | — | 192.168.0.10 |
| user_agent | TEXT | Não | User-Agent completo | Opcional | NULL | Mozilla/5.0... |
| data_login | TIMESTAMP | Sim | Data do login | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 09:00 |
| data_expiracao | TIMESTAMP | Sim | Expiração da sessão | Calculada conforme política | — | 2026-07-27 17:00 |
| data_logout | TIMESTAMP | Não | Data do logout | Preenchida ao encerrar sessão | NULL | 2026-07-27 12:15 |
| status | VARCHAR(20) | Sim | Situação da sessão | Ativa, Expirada ou Encerrada | Ativa | Ativa |
| criado_em | TIMESTAMP | Sim | Data de criação | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Status Permitidos

| Código | Status |
|---------|--------|
| ST001 | Ativa |
| ST002 | Encerrada |
| ST003 | Expirada |
| ST004 | Revogada |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Toda autenticação válida deverá criar uma sessão. |
| RN002 | Toda sessão pertence a um único usuário. |
| RN003 | Um usuário poderá possuir várias sessões simultâneas conforme configuração da empresa. |
| RN004 | O logout deverá registrar a data de encerramento da sessão. |
| RN005 | Sessões expiradas não poderão ser reutilizadas. |
| RN006 | Toda criação e encerramento de sessão deverá gerar registro na entidade logs_auditoria. |
| RN007 | Tokens revogados não poderão ser aceitos pela API. |
| RN008 | Sessões expiradas poderão ser removidas por rotina automática. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_sessoes_usuario | PRIMARY KEY(id_sessao) |
| FK_sessao_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_sessao_usuario | FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_sessao_usuario | Consultas por usuário |
| idx_sessao_empresa | Consultas por empresa |
| idx_sessao_status | Sessões ativas |
| idx_sessao_login | Histórico de logins |
| idx_sessao_expiracao | Rotinas de limpeza |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Consultar e encerrar sessões |
| Gerente | Consultar sessões da empresa |
| Usuário | Consultar e encerrar apenas suas próprias sessões |
| Auditor | Apenas consulta |

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO sessoes_usuario (
    id_empresa,
    id_usuario,
    access_token,
    refresh_token,
    ip_origem,
    data_expiracao,
    status
)
VALUES (
    'UUID_EMPRESA',
    'UUID_USUARIO',
    'JWT_ACCESS',
    'JWT_REFRESH',
    '192.168.0.10',
    NOW() + INTERVAL '8 hours',
    'Ativa'
);
```

## Sessões Ativas

```sql
SELECT *
FROM sessoes_usuario
WHERE status = 'Ativa';
```

## Sessões de um Usuário

```sql
SELECT *
FROM sessoes_usuario
WHERE id_usuario = 'UUID_USUARIO'
ORDER BY data_login DESC;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com JWT.
- Compatível com OAuth 2.0.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Tokens devem ser armazenados de forma segura (preferencialmente criptografados ou utilizando hashes quando aplicável).

---

# 18. Integrações

- Supabase Auth
- PostgreSQL
- API REST
- JWT
- OAuth 2.0
- n8n
- ENT014 — Log de Auditoria
- ENT015 — Usuário

---

# 19. Observações Técnicas

- Esta entidade controla apenas o ciclo de vida das sessões de autenticação.
- A autenticação poderá ser delegada ao Supabase Auth ou outro provedor de identidade.
- Recomenda-se configurar tempo de expiração conforme a política de segurança da empresa.
- Em ambientes de alta segurança, é recomendável implementar rotação de refresh tokens e revogação imediata em caso de suspeita de comprometimento.
- A modelagem segue a Terceira Forma Normal (3FN) e suporta múltiplas sessões por usuário.

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Sessão de Usuário |

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
