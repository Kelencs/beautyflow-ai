# ENT011 — Pagamento

**Código:** ENT011

**Versão:** 2.0

**Módulo:** Financeiro

**Tabela Física:** pagamentos

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Pagamento** registra todas as transações financeiras referentes aos atendimentos realizados.

Ela controla:

- recebimentos
- descontos
- acréscimos
- forma de pagamento
- estornos
- situação financeira
- integração com gateways de pagamento

Esta entidade é responsável pelo controle financeiro do BeautyFlow AI.

---

# 2. Descrição

A tabela **pagamentos** registra o pagamento de um atendimento.

Todo pagamento obrigatoriamente pertence a um agendamento.

Os dados do cliente, profissional e serviço são obtidos através da entidade **Agendamento**, evitando redundância e garantindo integridade referencial.

---

# 3. Tipo da Entidade

**Entidade Transacional Financeira**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Refere-se ao | Agendamento | 1:1 | id_agendamento |

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
| id_agendamento | UUID | Sim | Atendimento relacionado | Deve existir na tabela agendamentos | — | UUID |
| valor_bruto | NUMERIC(10,2) | Sim | Valor original do atendimento | Deve ser maior que zero | — | 180.00 |
| desconto | NUMERIC(10,2) | Não | Valor do desconto | Não pode ser negativo | 0.00 | 20.00 |
| acrescimo | NUMERIC(10,2) | Não | Valor adicional | Não pode ser negativo | 0.00 | 10.00 |
| valor_final | NUMERIC(10,2) | Sim | Valor pago | Calculado automaticamente | — | 170.00 |
| forma_pagamento | VARCHAR(30) | Sim | Forma de pagamento | Deve existir na lista de formas permitidas | Pix | Cartão de Crédito |
| status | VARCHAR(20) | Sim | Situação do pagamento | Deve existir na lista de status | Pendente | Pago |
| data_pagamento | TIMESTAMP | Não | Data do pagamento | Preenchida após confirmação | NULL | 2026-08-10 16:30 |
| observacoes | TEXT | Não | Observações | Campo livre | NULL | Pagamento realizado via QR Code Pix |
| criado_em | TIMESTAMP | Sim | Data de criação | Automático | CURRENT_TIMESTAMP | 2026-07-27 10:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 15:00 |

---

# 11. Formas de Pagamento

| Código | Forma |
|---------|-------|
| FP001 | Pix |
| FP002 | Dinheiro |
| FP003 | Cartão de Débito |
| FP004 | Cartão de Crédito |
| FP005 | Transferência Bancária |
| FP006 | Carteira Digital |

---

# 12. Status Permitidos

| Código | Status |
|---------|--------|
| ST001 | Pendente |
| ST002 | Pago |
| ST003 | Parcial |
| ST004 | Estornado |
| ST005 | Cancelado |

---

# 13. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Todo pagamento deve possuir um agendamento válido. |
| RN002 | Um agendamento poderá possuir apenas um pagamento principal. |
| RN003 | O valor final será calculado automaticamente (Valor Bruto + Acréscimos − Descontos). |
| RN004 | O valor final nunca poderá ser negativo. |
| RN005 | Apenas pagamentos com status **Pago** compõem o faturamento. |
| RN006 | Estornos não excluem o pagamento, apenas alteram seu status. |
| RN007 | Todas as alterações deverão ser registradas na auditoria. |
| RN008 | O pagamento preserva o valor histórico do atendimento, independentemente de alterações futuras no preço do serviço. |

---

# 14. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_pagamentos | PRIMARY KEY(id_pagamento) |
| FK_pagamento_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_pagamento_agendamento | FOREIGN KEY(id_agendamento) REFERENCES agendamentos(id_agendamento) |
| UQ_pagamento_agendamento | UNIQUE(id_agendamento) |
| NN_valor_bruto | NOT NULL |
| NN_valor_final | NOT NULL |
| CK_valor_bruto | valor_bruto > 0 |
| CK_desconto | desconto >= 0 |
| CK_acrescimo | acrescimo >= 0 |
| CK_valor_final | valor_final >= 0 |

---

# 15. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_pagamento_empresa | Consultas por empresa |
| idx_pagamento_agendamento | Localizar pagamento do atendimento |
| idx_pagamento_status | Fluxo financeiro |
| idx_pagamento_data | Relatórios financeiros |
| idx_pagamento_forma | Estatísticas por forma de pagamento |

---

# 16. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Total |
| Gerente | Total |
| Recepcionista | Registrar e consultar pagamentos |
| Profissional | Apenas consulta dos pagamentos de seus atendimentos (via Agendamento) |

---

# 17. Exemplos SQL

## Inserção

```sql
INSERT INTO pagamentos (
    id_empresa,
    id_agendamento,
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

## Consulta completa

```sql
SELECT
    p.*,
    c.nome AS cliente,
    pr.nome AS profissional,
    s.nome AS servico
FROM pagamentos p
INNER JOIN agendamentos a
    ON p.id_agendamento = a.id_agendamento
INNER JOIN clientes c
    ON a.id_cliente = c.id_cliente
INNER JOIN profissionais pr
    ON a.id_profissional = pr.id_profissional
INNER JOIN servicos s
    ON a.id_servico = s.id_servico;
```

---

# 18. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Exclusão física não permitida.
- Auditoria obrigatória para todas as alterações financeiras.

---

# 19. Integrações

- API REST
- n8n
- PostgreSQL
- Supabase
- Google Sheets (MVP)
- Dashboard Power BI
- WhatsApp Business API
- Stripe (futuro)
- Mercado Pago
- Asaas
- PagSeguro

---

# 20. Observações Técnicas

- A entidade segue a Terceira Forma Normal (3FN).
- Cliente, profissional e serviço são obtidos por meio da entidade **Agendamentos**.
- A modelagem elimina redundâncias e reduz o risco de inconsistências.
- O modelo suporta evolução futura para pagamentos parciais, parcelamentos e múltiplas formas de pagamento.

---

# 21. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade |
| 2.0 | 27/07/2026 | Product Owner | Normalização da modelagem (3FN), removendo os campos id_cliente e id_profissional. |

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




