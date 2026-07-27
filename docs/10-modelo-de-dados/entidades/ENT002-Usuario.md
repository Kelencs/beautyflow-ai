# ENT002 — Usuário

**Código:** ENT002

**Versão:** 1.0

**Módulo:** Administração

**Tabela Física:** usuarios

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Usuário** representa as pessoas autorizadas a acessar o BeautyFlow AI.

Os usuários podem possuir diferentes perfis de acesso, como:

- Administrador
- Recepcionista
- Gerente
- Profissional

Cada usuário pertence obrigatoriamente a uma única empresa.

---

# 2. Descrição

A tabela **usuarios** armazena as credenciais e informações de acesso ao sistema, permitindo autenticação, autorização e rastreabilidade das operações realizadas.

Esta entidade é responsável pelo controle de acesso ao sistema.

---

# 3. Tipo da Entidade

**Entidade Transacional de Administração**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence a | Empresa | N:1 | id_empresa |
| Registra | Logs de Auditoria | 1:N | usuario |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC001 | Cadastrar Cliente |
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC006 | Cadastrar Serviço |
| UC007 | Cadastrar Profissional |
| UC008 | Configurar Agenda |
| UC009 | Registrar Pagamento |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US006 — Cadastrar Cliente
- US007 — Cadastrar Profissional
- US008 — Configurar Agenda
- US009 — Registrar Pagamento

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF001 | Cadastro de Usuário |
| WF002 | Login do Sistema |
| WF003 | Recuperação de Senha |
| WF004 | Atualização de Perfil |
| WF005 | Controle de Permissões |
| WF006 | Registro de Auditoria |

---

# 8. Estrutura da Tabela

```text
usuarios
```

---

# 9. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_usuario | UUID | Sim | Identificador único do usuário | Gerado automaticamente | gen_random_uuid() | 9df6d4d0-bf0d-4a66-a35b-7e6f58b65ef2 |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| nome | VARCHAR(120) | Sim | Nome completo | Entre 3 e 120 caracteres | — | Maria Fernanda Souza |
| email | VARCHAR(150) | Sim | E-mail de acesso | Deve ser único dentro da empresa e possuir formato válido | — | maria@studiobella.com.br |
| senha_hash | TEXT | Sim | Senha criptografada | Nunca armazenar senha em texto puro | — | \$2b\$12\$A9d... |
| perfil | VARCHAR(30) | Sim | Perfil de acesso | Valores permitidos: Administrador, Gerente, Recepcionista ou Profissional | Recepcionista | Administrador |
| ativo | BOOLEAN | Sim | Indica se o usuário está ativo | Utilizado para exclusão lógica | TRUE | TRUE |
| ultimo_login | TIMESTAMP | Não | Data e hora do último acesso | Atualizado após login bem-sucedido | NULL | 2026-07-25 09:30:00 |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 08:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-25 15:20:00 |

---

# 10. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo usuário deve pertencer a uma empresa válida. |
| RN002 | O e-mail deve ser único dentro da mesma empresa. |
| RN003 | A senha deve ser armazenada criptografada. |
| RN004 | Apenas usuários ativos podem acessar o sistema. |
| RN005 | Apenas administradores podem cadastrar novos usuários. |
| RN006 | O perfil define as permissões disponíveis no sistema. |
| RN007 | Todo login deve ser registrado na auditoria. |

---

# 11. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_usuarios | PRIMARY KEY(id_usuario) |
| FK_usuarios_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| UQ_usuario_email_empresa | UNIQUE(id_empresa, email) |
| NN_nome | NOT NULL |
| NN_email | NOT NULL |
| NN_senha_hash | NOT NULL |
| NN_perfil | NOT NULL |
| CK_perfil | Perfil deve ser Administrador, Gerente, Recepcionista ou Profissional |

---

# 12. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_usuario_email | Login |
| idx_usuario_empresa | Consultas por empresa |
| idx_usuario_perfil | Controle de permissões |
| idx_usuario_ativo | Usuários ativos |

---

# 13. Exemplos SQL

## Inserção

```sql
INSERT INTO usuarios (
    id_empresa,
    nome,
    email,
    senha_hash,
    perfil
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Maria Fernanda Souza',
    'maria@studiobella.com.br',
    '$2b$12$A9d...',
    'Administrador'
);
```

## Consulta

```sql
SELECT *
FROM usuarios;
```

## Consulta por E-mail

```sql
SELECT *
FROM usuarios
WHERE email = 'maria@studiobella.com.br';
```

---

# 14. Segurança

- Senhas armazenadas utilizando bcrypt ou Argon2.
- Autenticação baseada em JWT (quando aplicável).
- Compatível com Supabase Auth.
- Controle de acesso baseado em perfis (RBAC).
- Todas as operações devem ser registradas na auditoria.
- Exclusão lógica utilizando o campo **ativo**.

---

# 15. Observações Técnicas

- Cada usuário pertence a apenas uma empresa.
- O sistema deve impedir e-mails duplicados dentro da mesma empresa.
- O campo **ultimo_login** deve ser atualizado automaticamente após autenticação.
- Alterações de perfil devem ser registradas na auditoria.
- Compatível com PostgreSQL, Supabase e integração via n8n.

---

# 16. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Usuário. |

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


