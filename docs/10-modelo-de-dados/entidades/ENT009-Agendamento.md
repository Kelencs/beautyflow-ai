# ENT009 — Agendamento

**Código:** ENT009

**Versão:** 1.0

**Módulo:** Agendamentos

**Tabela Física:** agendamentos

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Agendamento** representa a reserva de um horário realizada por um cliente para um determinado serviço, executado por um profissional.

Esta é a principal entidade operacional do BeautyFlow AI, sendo responsável pelo controle completo dos atendimentos da empresa.

Ela centraliza informações utilizadas pelos módulos de:

- Agenda
- Atendimento
- Pagamentos
- Histórico
- Lista de Espera
- Avaliações
- Notificações
- Relatórios
- Dashboard

---

# 2. Descrição

A tabela **agendamentos** armazena todos os atendimentos agendados, independentemente do status.

Cada registro representa um atendimento único.

O sistema utilizará esta entidade para:

- verificar conflitos de horário;
- calcular disponibilidade;
- enviar lembretes automáticos;
- registrar pagamentos;
- gerar histórico;
- solicitar avaliações;
- alimentar dashboards.

---

# 3. Tipo da Entidade

**Entidade Transacional**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Pertence ao | Cliente | N:1 | id_cliente |
| Pertence ao | Profissional | N:1 | id_profissional |
| Pertence ao | Serviço | N:1 | id_servico |
| Gera | Pagamento | 1:0..1 | id_agendamento |
| Gera | Avaliação | 1:0..1 | id_agendamento |
| Gera | Notificações | 1:N | id_agendamento |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC009 | Registrar Pagamento |
| UC010 | Consultar Histórico de Atendimentos |
| UC011 | Gerenciar Lista de Espera |
| UC012 | Avaliar Atendimento |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US009 — Registrar Pagamento
- US010 — Consultar Histórico
- US011 — Lista de Espera
- US012 — Avaliar Atendimento

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF043 | Criar Agendamento |
| WF044 | Confirmar Agendamento |
| WF045 | Reagendar Atendimento |
| WF046 | Cancelar Atendimento |
| WF047 | Enviar Lembrete |
| WF048 | Registrar Atendimento |
| WF049 | Solicitar Avaliação |
| WF050 | Auditoria |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /agendamentos | Listar agendamentos |
| GET | /agendamentos/{id} | Consultar agendamento |
| POST | /agendamentos | Criar agendamento |
| PUT | /agendamentos/{id} | Atualizar agendamento |
| PATCH | /agendamentos/{id}/status | Alterar status |
| DELETE | /agendamentos/{id} | Cancelamento lógico |

---

# 9. Estrutura da Tabela

```text
agendamentos
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_agendamento | UUID | Sim | Identificador do agendamento | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_cliente | UUID | Sim | Cliente do atendimento | Deve existir na tabela clientes | — | UUID |
| id_profissional | UUID | Sim | Profissional responsável | Deve existir na tabela profissionais | — | UUID |
| id_servico | UUID | Sim | Serviço contratado | Deve existir na tabela servicos | — | UUID |
| data_atendimento | DATE | Sim | Data do atendimento | Não pode ser anterior à data atual (exceto migração) | — | 2026-08-10 |
| hora_inicio | TIME | Sim | Horário inicial | Deve respeitar a agenda do profissional | — | 14:00 |
| hora_fim | TIME | Sim | Horário final | Calculado automaticamente | — | 15:30 |
| valor_cobrado | NUMERIC(10,2) | Sim | Valor efetivamente cobrado | Deve ser maior que zero | — | 180.00 |
| status | VARCHAR(30) | Sim | Situação do atendimento | Ver lista de status | Agendado | Confirmado |
| observacoes | TEXT | Não | Observações | Campo livre | NULL | Cliente prefere atendimento silencioso |
| criado_em | TIMESTAMP | Sim | Data de criação | Automático | CURRENT_TIMESTAMP | 2026-07-27 10:30 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Automático | CURRENT_TIMESTAMP | 2026-07-27 15:10 |

---

# 11. Status Permitidos

| Status | Descrição |
|----------|-----------|
| Agendado | Atendimento criado |
| Confirmado | Cliente confirmou presença |
| Em Atendimento | Atendimento iniciado |
| Concluído | Atendimento finalizado |
| Cancelado | Cancelado pelo cliente ou empresa |
| Não Compareceu | Cliente não compareceu |

---

# 12. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Não poderá existir conflito de horário para o mesmo profissional. |
| RN002 | O cliente poderá possuir vários agendamentos. |
| RN003 | O profissional deverá estar habilitado para executar o serviço por meio da entidade **profissional_servico**. |
| RN004 | O horário deverá respeitar a agenda cadastrada do profissional. |
| RN005 | O valor do atendimento será copiado do serviço no momento do agendamento, preservando o histórico financeiro. |
| RN006 | Apenas atendimentos concluídos poderão gerar avaliação. |
| RN007 | Apenas atendimentos concluídos poderão gerar pagamento definitivo. |
| RN008 | Agendamentos cancelados não poderão voltar para o status Concluído. |
| RN009 | Toda alteração de status deverá ser registrada na auditoria. |
| RN010 | O cancelamento não exclui o registro do banco de dados. |

---

# 13. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_agendamentos | PRIMARY KEY(id_agendamento) |
| FK_agendamento_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_agendamento_cliente | FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente) |
| FK_agendamento_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| FK_agendamento_servico | FOREIGN KEY(id_servico) REFERENCES servicos(id_servico) |
| NN_data | NOT NULL |
| NN_hora_inicio | NOT NULL |
| NN_hora_fim | NOT NULL |
| CK_valor | valor_cobrado > 0 |

---

# 14. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_agendamento_empresa | Consultas por empresa |
| idx_agendamento_cliente | Histórico do cliente |
| idx_agendamento_profissional | Agenda do profissional |
| idx_agendamento_data | Pesquisa por data |
| idx_agendamento_status | Dashboard |

---

# 15. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Total |
| Gerente | Total |
| Recepcionista | Criar, editar, cancelar e consultar |
| Profissional | Consultar apenas seus próprios agendamentos |

---

# 16. Exemplos SQL

## Inserção

```sql
INSERT INTO agendamentos (
    id_empresa,
    id_cliente,
    id_profissional,
    id_servico,
    data_atendimento,
    hora_inicio,
    hora_fim,
    valor_cobrado,
    status
)
VALUES (
    'UUID_EMPRESA',
    'UUID_CLIENTE',
    'UUID_PROFISSIONAL',
    'UUID_SERVICO',
    '2026-08-10',
    '14:00',
    '15:30',
    180.00,
    'Agendado'
);
```

## Consulta

```sql
SELECT *
FROM agendamentos;
```

## Agenda do profissional

```sql
SELECT *
FROM agendamentos
WHERE id_profissional='UUID_PROFISSIONAL'
AND data_atendimento='2026-08-10'
ORDER BY hora_inicio;
```

---

# 17. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Todas as alterações deverão ser registradas em **logs_auditoria**.
- Não permite exclusão física.

---

# 18. Integrações

A entidade Agendamento integra-se com:

- WhatsApp Business API
- Google Calendar
- n8n
- PostgreSQL
- Supabase
- API REST
- Dashboard Power BI
- Google Sheets (MVP)

---

# 19. Observações Técnicas

- Esta é a principal entidade transacional do sistema.
- O campo **valor_cobrado** preserva o valor histórico do atendimento, mesmo que o preço do serviço seja alterado posteriormente.
- O campo **hora_fim** poderá ser calculado automaticamente utilizando a duração do serviço ou a duração personalizada definida em **profissional_servico**.
- Os lembretes automáticos serão disparados pelos workflows do n8n com base na data, horário e status do agendamento.
- O histórico de atendimentos será composto pelos agendamentos com status **Concluído**.

---

# 20. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Agendamento. |

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

**Fim da Documentação — ENT009 — Agendamento**
