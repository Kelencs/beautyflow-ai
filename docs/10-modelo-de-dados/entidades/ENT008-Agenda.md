# ENT008 — Agenda

**Código:** ENT008

**Versão:** 1.0

**Módulo:** Agenda

**Tabela Física:** agenda

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Agenda** representa a disponibilidade dos profissionais para atendimento.

Ela define:

- Dias da semana trabalhados
- Horário de início
- Horário de término
- Intervalos
- Bloqueios
- Feriados
- Horários especiais

A Agenda serve como base para o motor de agendamento do BeautyFlow AI.

---

# 2. Descrição

A tabela **agenda** armazena os horários disponíveis dos profissionais.

Cada profissional pode possuir diversos horários cadastrados.

Exemplos:

- Segunda-feira: 08:00 às 18:00
- Terça-feira: 09:00 às 19:00
- Sábado: 08:00 às 13:00

A agenda será utilizada para validar:

- disponibilidade
- conflitos
- reagendamentos
- lista de espera

---

# 3. Tipo da Entidade

**Entidade Operacional**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Pertence ao | Profissional | N:1 | id_profissional |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC003 | Reagendar Atendimento |
| UC004 | Cancelar Atendimento |
| UC008 | Configurar Agenda |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US003 — Reagendar Atendimento
- US004 — Cancelar Atendimento
- US008 — Configurar Agenda

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF037 | Cadastro de Agenda |
| WF038 | Atualização da Agenda |
| WF039 | Consulta de Disponibilidade |
| WF040 | Bloqueio Automático de Horários |
| WF041 | Sincronização Google Calendar |
| WF042 | Auditoria |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /agenda | Listar horários |
| GET | /agenda/{id} | Consultar horário |
| POST | /agenda | Criar horário |
| PUT | /agenda/{id} | Atualizar horário |
| PATCH | /agenda/{id}/status | Ativar/Inativar |
| DELETE | /agenda/{id} | Exclusão lógica |

---

# 9. Estrutura da Tabela

```text
agenda
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_agenda | UUID | Sim | Identificador da agenda | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_profissional | UUID | Sim | Profissional responsável | Deve existir na tabela profissionais | — | UUID |
| dia_semana | SMALLINT | Sim | Dia da semana | Valores de 1 a 7 (Segunda a Domingo) | — | 1 |
| hora_inicio | TIME | Sim | Horário inicial | Deve ser menor que hora_fim | — | 08:00 |
| hora_fim | TIME | Sim | Horário final | Deve ser maior que hora_inicio | — | 18:00 |
| intervalo_inicio | TIME | Não | Início do intervalo | Opcional | NULL | 12:00 |
| intervalo_fim | TIME | Não | Fim do intervalo | Deve ser maior que intervalo_inicio | NULL | 13:00 |
| observacoes | TEXT | Não | Observações | Campo livre | NULL | Não atende após 17h nas sextas |
| ativo | BOOLEAN | Sim | Situação da agenda | Exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Automático | CURRENT_TIMESTAMP | 2026-07-27 09:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Automático | CURRENT_TIMESTAMP | 2026-07-27 15:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | A agenda deve pertencer a um profissional ativo. |
| RN002 | O horário inicial deve ser menor que o horário final. |
| RN003 | Não pode existir sobreposição de horários para o mesmo profissional. |
| RN004 | O intervalo deve estar dentro do horário de expediente. |
| RN005 | Apenas agendas ativas podem receber agendamentos. |
| RN006 | Horários bloqueados não poderão receber novos agendamentos. |
| RN007 | A agenda poderá possuir horários especiais em feriados e exceções. |
| RN008 | A exclusão deverá ser lógica utilizando o campo **ativo**. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_agenda | PRIMARY KEY(id_agenda) |
| FK_agenda_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_agenda_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| NN_dia_semana | NOT NULL |
| NN_hora_inicio | NOT NULL |
| NN_hora_fim | NOT NULL |
| CK_dia_semana | dia_semana BETWEEN 1 AND 7 |
| CK_horario | hora_inicio < hora_fim |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_agenda_profissional | Consultar agenda do profissional |
| idx_agenda_empresa | Consultar agendas da empresa |
| idx_agenda_dia | Pesquisa por dia da semana |
| idx_agenda_ativo | Agendas ativas |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Cadastro, edição e consulta |
| Recepcionista | Consulta |
| Profissional | Consultar e editar sua própria agenda |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO agenda (
    id_empresa,
    id_profissional,
    dia_semana,
    hora_inicio,
    hora_fim
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '2f71c1be-efc1-4dc5-a5ef-0d2c25b59f5e',
    1,
    '08:00',
    '18:00'
);
```

## Consulta

```sql
SELECT *
FROM agenda;
```

## Agenda de um profissional

```sql
SELECT *
FROM agenda
WHERE id_profissional='2f71c1be-efc1-4dc5-a5ef-0d2c25b59f5e'
ORDER BY dia_semana,hora_inicio;
```

---

# 16. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão lógica.
- Todas as alterações deverão ser registradas em **logs_auditoria**.

---

# 17. Integrações

A entidade Agenda integra-se com:

- Google Calendar
- API REST
- n8n
- PostgreSQL
- Supabase
- Dashboard Power BI
- Motor de Agendamento
- WhatsApp Business API (consulta de disponibilidade)

---

# 18. Observações Técnicas

- A Agenda representa apenas a disponibilidade do profissional.
- Os horários reservados são armazenados na entidade **Agendamento**.
- Um profissional poderá possuir horários diferentes para cada dia da semana.
- O sistema poderá suportar horários especiais, férias, licenças e bloqueios temporários em futuras versões.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Agenda. |

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


