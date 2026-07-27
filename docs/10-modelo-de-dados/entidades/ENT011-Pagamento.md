# ENT011 — Pagamento

**Código:** ENT011

**Versão:** 1.0

**Módulo:** Financeiro

**Tabela Física:** pagamentos

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Pagamento** registra todas as transações financeiras referentes aos atendimentos realizados pela empresa.

Seu objetivo é controlar:

- recebimentos;
- formas de pagamento;
- situação financeira;
- estornos;
- descontos;
- comissões;
- integração com gateways de pagamento.

Esta entidade é responsável pelo controle financeiro do BeautyFlow AI.

---

# 2. Descrição

A tabela **pagamentos** armazena os pagamentos realizados pelos clientes referentes aos agendamentos.

Cada pagamento pertence obrigatoriamente a um agendamento.

Um agendamento poderá possuir apenas um pagamento principal.

---

# 3. Tipo da Entidade

**Entidade Transacional Financeira**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Refere-se ao | Agendamento | 1:1 | id_agendamento |
| Refere-se ao | Cliente | N:1 | id_cliente |
| Refere-se ao | Profissional | N:1 | id_profissional |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC009 | Registrar Pagamento |
| UC010 | Consultar Histórico de Atendimentos |

---

# 6. User Stories Relacionadas

- US009 — Registrar Pagamento
- US010 — Consultar Histórico

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF058 | Registrar Pagamento |
| WF059 | Confirmar Recebimento |
| WF060 | Enviar Comprovante |
| WF061 | Atualizar Fluxo de Caixa |
| WF062 | Calcular Comissão |
| WF063 | Auditoria Financeira |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /pagamentos | Listar pagamentos |
| GET | /pagamentos/{id} | Consultar pagamento |
| POST | /pagamentos | Registrar pagamento |
| PUT | /pagamentos/{id} | Atualizar pagamento |
| PATCH | /pagamentos/{id}/status | Alterar status |
| POST | /pagamentos/{id}/estorno | Registrar estorno |

---

# 9. Estrutura da Tabela

```text
pagamentos
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_pagamento | UUID | Sim | Identificador do pagamento | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_agendamento | UUID | Sim | Agendamento relacionado | Deve existir na tabela agendamentos | — | UUID |
| id_cliente | UUID | Sim | Cliente pagador | Deve existir na tabela clientes | — | UUID |
| id_profissional | UUID | Sim | Profissional responsável | Deve existir na tabela profissionais | — | UUID |
| valor_bruto | NUMERIC(10,2) | Sim | Valor original do atendimento | Maior que zero | — | 180.00 |
| desconto | NUMERIC(10,2) | Não | Valor de desconto | Não pode ser negativo | 0.00 | 20.00 |
| acrescimo | NUMERIC(10,2) | Não | Valor adicional | Não pode ser negativo | 0.00 | 10.00 |
| valor_final | NUMERIC(10,2) | Sim | Valor efetivamente pago | Calculado automaticamente | — | 170.00 |
| forma_pagamento | VARCHAR(30) | Sim | Forma de pagamento | Ver lista permitida | Pix | Cartão de Crédito |
| status | VARCHAR(20) | Sim | Situação do pagamento | Ver tabela de status | Pendente | Pago |
| data_pagamento | TIMESTAMP | Não | Data da confirmação | Preenchida após pagamento | NULL | 2026-08-10 16:30 |
| observacoes | TEXT | Não | Observações | Campo livre | NULL | Pagamento em duas etapas |
| criado_em | TIMESTAMP | Sim | Data de criação | Automático | CURRENT_TIMESTAMP | 2026-07-27 09:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Automático | CURRENT_TIMESTAMP | 2026-07-27 15:00 |

---

# 11. Formas de Pagamento

| Forma |
|--------|
| Pix |
| Dinheiro |
| Cartão de Débito |
| Cartão de Crédito |
| Transferência Bancária |
| Carteira Digital |

---

# 12. Status Permitidos

| Status |
|--------|
| Pendente |
| Pago |
| Parcial |
| Estornado |
| Cancelado |

---

# 13. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo pagamento deve estar vinculado a um agendamento. |
| RN002 | O valor final será calculado por: Valor Bruto + Acréscimos − Descontos. |
| RN003 | Descontos e acréscimos não podem gerar valor final negativo. |
| RN004 | Apenas pagamentos com status **Pago** deverão compor o faturamento. |
| RN005 | O pagamento poderá ser registrado antes ou após a conclusão do atendimento, conforme configuração da empresa. |
| RN006 | Estornos deverão manter o histórico financeiro. |
| RN007 | Toda alteração deverá ser registrada na auditoria. |

---

# 14. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_pagamentos | PRIMARY KEY(id_pagamento) |
| FK_pagamento_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_pagamento_agendamento | FOREIGN KEY(id_agendamento) REFERENCES agendamentos(id_agendamento) |
| FK_pagamento_cliente | FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente) |
| FK_pagamento_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| UQ_pagamento_agendamento | UNIQUE(id_agendamento) |
| CK_valor_bruto | valor_bruto > 0 |
| CK_desconto | desconto >= 0 |
| CK_acrescimo | acrescimo >= 0 |

---

# 15. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_pagamento_empresa | Consultas por empresa |
| idx_pagamento_data | Fluxo de caixa |
| idx_pagamento_status | Financeiro |
| idx_pagamento_forma | Relatórios |
| idx_pagamento_profissional | Comissão |

---

# 16. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Acesso total |
| Recepcionista | Registrar e consultar pagamentos |
| Profissional | Consultar apenas seus próprios recebimentos |

---

# 17. Exemplos SQL

## Inserção

```sql
INSERT INTO pagamentos (
    id_empresa,
    id_agendamento,
    id_cliente,
    id_profissional,
    valor_bruto,
    desconto,
    acrescimo,
    valor_final,
    forma_pagamento,
    status
)
VALUES (
    'UUID_EMPRESA',
    'UUID_AGENDAMENTO',
    'UUID_CLIENTE',
    'UUID_PROFISSIONAL',
    180.00,
    20.00,
    0.00,
    160.00,
    'Pix',
    'Pago'
);
```

## Consulta

```sql
SELECT *
FROM pagamentos;
```

## Pagamentos realizados

```sql
SELECT *
FROM pagamentos
WHERE status='Pago'
ORDER BY data_pagamento DESC;
```

---

# 18. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Todas as alterações financeiras deverão ser registradas em **logs_auditoria**.
- Exclusão física não permitida.

---

# 19. Integrações

Esta entidade integra-se com:

- Stripe (futuro)
- Mercado Pago
- Asaas
- PagSeguro
- WhatsApp Business API
- n8n
- API REST
- PostgreSQL
- Supabase
- Google Sheets (MVP)
- Dashboard Power BI

---

# 20. Observações Técnicas

- O pagamento preserva o valor histórico do atendimento.
- O cálculo de comissão poderá utilizar o valor final pago.
- O sistema poderá suportar pagamentos parciais em versões futuras.
- Todos os lançamentos deverão permanecer disponíveis para auditoria e conciliação financeira.

---

# 21. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Pagamento. |

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


