# ENT014 — Log de Auditoria

**Código:** ENT014

**Versão:** 2.0

**Módulo:** Segurança

**Tabela Física:** logs_auditoria

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Log de Auditoria** registra todas as operações realizadas no sistema, garantindo rastreabilidade, conformidade, segurança e governança dos dados.

Seu objetivo é registrar eventos relacionados a:

- Inclusão de registros
- Alteração de dados
- Exclusão lógica
- Login
- Logout
- Execução de Workflows
- Chamadas de API
- Alterações de permissões
- Eventos de segurança

A entidade permite reconstruir todo o histórico operacional do sistema.

---

# 2. Descrição

A tabela **logs_auditoria** armazena todos os eventos relevantes executados pelos usuários e pelos processos automatizados.

Cada log representa uma operação realizada sobre uma entidade do sistema.

Os registros de auditoria são permanentes e não poderão ser alterados nem excluídos fisicamente.

---

# 3. Tipo da Entidade

**Entidade Transacional de Auditoria**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Executado por | Usuário | N:1 | id_usuario |

> A entidade auditada é identificada pelos campos **nome_entidade** e **id_registro**, permitindo registrar eventos de qualquer tabela do sistema sem necessidade de múltiplas tabelas de auditoria.

---

# 5. Casos de Uso Relacionados

Todos os Casos de Uso do sistema.

---

# 6. User Stories Relacionadas

Todas as User Stories do projeto.

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF076 | Registrar Auditoria |
| WF077 | Monitorar Eventos |
| WF078 | Gerar Alertas |
| WF079 | Exportar Logs |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /auditoria | Listar logs |
| GET | /auditoria/{id} | Consultar log |
| GET | /auditoria/registro/{id} | Histórico de um registro |

---

# 9. Estrutura da Tabela

```text
logs_auditoria
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_log | UUID | Sim | Identificador do log | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_usuario | UUID | Não | Usuário responsável | Deve existir na tabela usuarios quando a ação for humana | NULL | UUID |
| nome_entidade | VARCHAR(80) | Sim | Entidade afetada | Nome da tabela auditada | — | agendamentos |
| id_registro | UUID | Sim | Registro afetado | Identificador do registro alterado | — | UUID |
| operacao | VARCHAR(20) | Sim | Operação realizada | Deve existir na lista de operações | UPDATE | DELETE |
| origem | VARCHAR(30) | Sim | Origem da operação | WEB, API, MOBILE, N8N ou SISTEMA | WEB | API |
| ip_origem | VARCHAR(45) | Não | Endereço IP | IPv4 ou IPv6 | NULL | 192.168.0.15 |
| descricao | TEXT | Sim | Descrição da operação | Obrigatória | — | Alteração do horário do atendimento |
| dados_anteriores | JSONB | Não | Dados antes da alteração | Apenas para UPDATE e DELETE | NULL | JSON |
| dados_novos | JSONB | Não | Dados após alteração | Apenas para INSERT e UPDATE | NULL | JSON |
| criado_em | TIMESTAMP | Sim | Data e hora do evento | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 14:20 |

---

# 11. Operações Permitidas

| Código | Operação |
|---------|----------|
| OP001 | INSERT |
| OP002 | UPDATE |
| OP003 | DELETE |
| OP004 | LOGIN |
| OP005 | LOGOUT |
| OP006 | EXPORT |
| OP007 | IMPORT |
| OP008 | EXECUTE |
| OP009 | ACCESS_DENIED |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Toda alteração em entidades críticas deverá gerar um registro de auditoria. |
| RN002 | Os registros de auditoria nunca poderão ser alterados. |
| RN003 | Exclusão física de logs não será permitida. |
| RN004 | Alterações deverão armazenar os valores anteriores e posteriores, quando aplicável. |
| RN005 | Eventos de login e logout deverão ser registrados. |
| RN006 | Toda execução automática realizada pelo sistema ou pelo n8n poderá gerar auditoria. |
| RN007 | O campo id_usuario poderá permanecer NULL apenas quando a operação for executada automaticamente pelo sistema. |
| RN008 | O horário do log deverá utilizar o fuso horário configurado para a empresa. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_logs_auditoria | PRIMARY KEY(id_log) |
| FK_logs_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_logs_usuario | FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) |
| NN_nome_entidade | NOT NULL |
| NN_id_registro | NOT NULL |
| NN_operacao | NOT NULL |
| NN_origem | NOT NULL |
| NN_descricao | NOT NULL |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_log_empresa | Consultas por empresa |
| idx_log_usuario | Histórico do usuário |
| idx_log_entidade | Histórico da entidade |
| idx_log_registro | Histórico do registro |
| idx_log_operacao | Consultas por operação |
| idx_log_data | Consultas cronológicas |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Consulta total |
| Auditor | Consulta total |
| Gerente | Consulta limitada |
| Demais Perfis | Sem acesso |

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO logs_auditoria (
    id_empresa,
    id_usuario,
    nome_entidade,
    id_registro,
    operacao,
    origem,
    descricao
)
VALUES (
    'UUID_EMPRESA',
    'UUID_USUARIO',
    'agendamentos',
    'UUID_REGISTRO',
    'UPDATE',
    'WEB',
    'Alteração do horário do atendimento.'
);
```

## Consulta Geral

```sql
SELECT *
FROM logs_auditoria
ORDER BY criado_em DESC;
```

## Histórico de um Registro

```sql
SELECT *
FROM logs_auditoria
WHERE nome_entidade = 'agendamentos'
AND id_registro = 'UUID_REGISTRO'
ORDER BY criado_em;
```

## Histórico por Usuário

```sql
SELECT
u.nome,
l.nome_entidade,
l.operacao,
l.descricao,
l.criado_em
FROM logs_auditoria l
INNER JOIN usuarios u
ON l.id_usuario = u.id_usuario
ORDER BY l.criado_em DESC;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Registros imutáveis.
- Exclusão física proibida.
- Compatível com LGPD para rastreabilidade de operações.

---

# 18. Integrações

- PostgreSQL
- Supabase
- API REST
- n8n
- Power BI
- Sistema de Monitoramento
- Sistema de Alertas

---

# 19. Observações Técnicas

- A entidade é genérica e pode registrar eventos de qualquer tabela do sistema.
- Os campos **dados_anteriores** e **dados_novos** utilizam **JSONB**, permitindo armazenar alterações completas.
- O vínculo com o usuário é realizado através da entidade **ENT015 — Usuário**.
- Operações automáticas poderão manter **id_usuario = NULL**, identificando a origem pelo campo **origem**.
- A modelagem segue a Terceira Forma Normal (3FN).

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade |
| 2.0 | 27/07/2026 | Product Owner | Adequação ao modelo RBAC, substituindo o campo `usuario` por `id_usuario` e criando relacionamento com a entidade ENT015 — Usuário |

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

