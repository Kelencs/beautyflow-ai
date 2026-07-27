# ENT010 — Lista de Espera

**Código:** ENT010

**Versão:** 1.0

**Módulo:** Agendamentos

**Tabela Física:** lista_espera

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Lista de Espera** permite registrar clientes interessados em um serviço quando não existem horários disponíveis na agenda.

Seu objetivo é otimizar a ocupação da agenda, permitindo preencher automaticamente horários vagos decorrentes de cancelamentos ou alterações de agendamento.

Esta funcionalidade reduz horários ociosos e melhora a experiência do cliente.

---

# 2. Descrição

A tabela **lista_espera** armazena solicitações de clientes que aguardam disponibilidade para determinado serviço.

Quando um horário compatível é liberado, o sistema poderá:

- localizar clientes compatíveis;
- enviar notificações automáticas;
- reservar temporariamente o horário;
- remover o cliente da lista após confirmação.

---

# 3. Tipo da Entidade

**Entidade Transacional**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Pertence ao | Cliente | N:1 | id_cliente |
| Refere-se ao | Serviço | N:1 | id_servico |
| Refere-se ao | Profissional | N:0..1 | id_profissional |
| Pode originar | Agendamento | 1:0..1 | id_agendamento |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC011 | Gerenciar Lista de Espera |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US011 — Lista de Espera

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF051 | Inserir Cliente na Lista de Espera |
| WF052 | Monitorar Cancelamentos |
| WF053 | Encontrar Horário Compatível |
| WF054 | Notificar Cliente |
| WF055 | Confirmar Interesse |
| WF056 | Remover Cliente da Lista |
| WF057 | Auditoria |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /lista-espera | Listar solicitações |
| GET | /lista-espera/{id} | Consultar solicitação |
| POST | /lista-espera | Inserir cliente |
| PUT | /lista-espera/{id} | Atualizar solicitação |
| PATCH | /lista-espera/{id}/status | Alterar status |
| DELETE | /lista-espera/{id} | Cancelar solicitação |

---

# 9. Estrutura da Tabela

```text
lista_espera
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_lista_espera | UUID | Sim | Identificador da solicitação | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_cliente | UUID | Sim | Cliente interessado | Deve existir na tabela clientes | — | UUID |
| id_servico | UUID | Sim | Serviço desejado | Deve existir na tabela servicos | — | UUID |
| id_profissional | UUID | Não | Profissional desejado | Opcional | NULL | UUID |
| data_preferencial | DATE | Não | Data preferida | Deve ser igual ou superior à data atual | NULL | 2026-08-15 |
| horario_preferencial | TIME | Não | Horário preferido | Opcional | NULL | 14:00 |
| prioridade | SMALLINT | Sim | Prioridade na fila | Valores entre 1 e 5 | 3 | 1 |
| status | VARCHAR(20) | Sim | Situação da solicitação | Ver tabela de status | Aguardando | Notificado |
| observacoes | TEXT | Não | Observações | Campo livre | NULL | Aceita qualquer horário pela manhã |
| criado_em | TIMESTAMP | Sim | Data da solicitação | Automático | CURRENT_TIMESTAMP | 2026-07-27 10:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Automático | CURRENT_TIMESTAMP | 2026-07-27 16:00 |

---

# 11. Status Permitidos

| Status | Descrição |
|---------|-----------|
| Aguardando | Cliente aguardando vaga |
| Notificado | Cliente recebeu oferta de horário |
| Confirmado | Cliente aceitou o horário |
| Expirado | Tempo para resposta expirou |
| Cancelado | Cliente desistiu |
| Atendido | Agendamento realizado |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | O cliente poderá possuir mais de uma solicitação para serviços diferentes. |
| RN002 | Não poderá existir duplicidade para o mesmo cliente, serviço e data preferencial. |
| RN003 | Apenas clientes ativos poderão entrar na lista de espera. |
| RN004 | A prioridade deverá variar entre 1 e 5, sendo 1 a maior prioridade. |
| RN005 | Quando surgir uma vaga compatível, o sistema deverá localizar os clientes elegíveis conforme prioridade e ordem de cadastro. |
| RN006 | O cliente terá um prazo configurável para confirmar o horário oferecido. |
| RN007 | Caso o cliente não responda dentro do prazo, a oferta será enviada ao próximo da fila. |
| RN008 | Após confirmação, deverá ser criado automaticamente um registro na entidade **Agendamentos**. |
| RN009 | Após o agendamento, o status deverá ser alterado para **Atendido**. |
| RN010 | Todas as notificações deverão ser registradas na auditoria. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_lista_espera | PRIMARY KEY(id_lista_espera) |
| FK_lista_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_lista_cliente | FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente) |
| FK_lista_servico | FOREIGN KEY(id_servico) REFERENCES servicos(id_servico) |
| FK_lista_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| NN_cliente | NOT NULL |
| NN_servico | NOT NULL |
| CK_prioridade | prioridade BETWEEN 1 AND 5 |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_lista_empresa | Consultas por empresa |
| idx_lista_cliente | Histórico do cliente |
| idx_lista_servico | Pesquisa por serviço |
| idx_lista_status | Clientes aguardando |
| idx_lista_prioridade | Ordenação da fila |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Acesso total |
| Recepcionista | Criar, editar, consultar e remover |
| Profissional | Consultar lista relacionada aos seus serviços |

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO lista_espera (
    id_empresa,
    id_cliente,
    id_servico,
    prioridade,
    status
)
VALUES (
    'UUID_EMPRESA',
    'UUID_CLIENTE',
    'UUID_SERVICO',
    3,
    'Aguardando'
);
```

## Consulta

```sql
SELECT *
FROM lista_espera;
```

## Clientes aguardando por um serviço

```sql
SELECT *
FROM lista_espera
WHERE id_servico = 'UUID_SERVICO'
AND status = 'Aguardando'
ORDER BY prioridade ASC, criado_em ASC;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Todas as alterações deverão ser registradas em **logs_auditoria**.

---

# 18. Integrações

A entidade Lista de Espera integra-se com:

- n8n
- WhatsApp Business API
- API REST
- PostgreSQL
- Supabase
- Dashboard Power BI
- Google Sheets (MVP)
- Motor de Agendamento

---

# 19. Observações Técnicas

- O preenchimento automático de vagas deverá respeitar prioridade, preferências e disponibilidade do profissional.
- O prazo para confirmação da vaga deverá ser configurável pelo administrador.
- O sistema poderá futuramente utilizar IA para sugerir horários alternativos com maior probabilidade de aceitação.
- Após a criação do agendamento, o registro permanecerá na lista para fins de auditoria, com status **Atendido**.

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Lista de Espera. |

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


