# ENT007 — Profissional Serviço

**Código:** ENT007

**Versão:** 1.0

**Módulo:** Cadastros

**Tabela Física:** profissional_servico

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Profissional Serviço** implementa o relacionamento muitos-para-muitos (N:N) entre os profissionais e os serviços oferecidos pela empresa.

Ela define quais profissionais estão habilitados para executar cada serviço e permite configurar informações específicas para essa combinação, como:

- Comissão
- Duração personalizada
- Valor personalizado
- Status

Esta entidade é essencial para o motor de agendamento do BeautyFlow AI.

---

# 2. Descrição

A tabela **profissional_servico** permite que:

- Um profissional execute diversos serviços.
- Um serviço seja executado por diversos profissionais.
- Cada relacionamento possua configurações próprias.

---

# 3. Tipo da Entidade

**Entidade Associativa (Relacionamento N:N)**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | N:1 | id_empresa |
| Relaciona | Profissional | N:1 | id_profissional |
| Relaciona | Serviço | N:1 | id_servico |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC002 | Agendar Atendimento |
| UC006 | Cadastrar Serviço |
| UC007 | Cadastrar Profissional |
| UC008 | Configurar Agenda |

---

# 6. User Stories Relacionadas

- US001 — Agendar Atendimento
- US006 — Cadastrar Serviço
- US007 — Cadastrar Profissional
- US008 — Configurar Agenda

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF032 | Vincular Profissional ao Serviço |
| WF033 | Atualizar Comissão |
| WF034 | Atualizar Tempo do Serviço |
| WF035 | Atualizar Valor Personalizado |
| WF036 | Auditoria de Alterações |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /profissional-servico | Listar vínculos |
| POST | /profissional-servico | Criar vínculo |
| PUT | /profissional-servico/{id} | Atualizar vínculo |
| DELETE | /profissional-servico/{id} | Inativar vínculo |

---

# 9. Estrutura da Tabela

```text
profissional_servico
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_profissional_servico | UUID | Sim | Identificador do relacionamento | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir na tabela empresas | — | UUID |
| id_profissional | UUID | Sim | Profissional | Deve existir na tabela profissionais | — | UUID |
| id_servico | UUID | Sim | Serviço | Deve existir na tabela servicos | — | UUID |
| duracao_minutos | INTEGER | Não | Duração específica | Deve ser maior que zero | NULL | 90 |
| valor_personalizado | NUMERIC(10,2) | Não | Valor específico para o profissional | Deve ser maior que zero | NULL | 180.00 |
| percentual_comissao | NUMERIC(5,2) | Não | Comissão do profissional | Entre 0 e 100 | NULL | 45.00 |
| ativo | BOOLEAN | Sim | Situação do vínculo | Exclusão lógica | TRUE | TRUE |
| criado_em | TIMESTAMP | Sim | Data de criação | Gerado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 09:00:00 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | Atualizado automaticamente | CURRENT_TIMESTAMP | 2026-07-27 15:00:00 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | O profissional deve pertencer à mesma empresa do serviço. |
| RN002 | Não pode existir mais de um vínculo entre o mesmo profissional e o mesmo serviço. |
| RN003 | Apenas vínculos ativos poderão ser utilizados nos agendamentos. |
| RN004 | A comissão deve estar entre 0% e 100%. |
| RN005 | O valor personalizado, quando informado, substitui o valor padrão do serviço. |
| RN006 | A duração personalizada, quando informada, substitui a duração padrão do serviço. |
| RN007 | A exclusão deverá ser lógica utilizando o campo **ativo**. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_profissional_servico | PRIMARY KEY(id_profissional_servico) |
| FK_ps_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| FK_ps_profissional | FOREIGN KEY(id_profissional) REFERENCES profissionais(id_profissional) |
| FK_ps_servico | FOREIGN KEY(id_servico) REFERENCES servicos(id_servico) |
| UQ_profissional_servico | UNIQUE(id_profissional, id_servico) |
| CK_comissao | percentual_comissao BETWEEN 0 AND 100 |
| CK_valor | valor_personalizado > 0 |
| CK_duracao | duracao_minutos > 0 |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_ps_profissional | Consultas por profissional |
| idx_ps_servico | Consultas por serviço |
| idx_ps_empresa | Consultas por empresa |
| idx_ps_ativo | Vínculos ativos |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Acesso total |
| Gerente | Cadastro, edição e consulta |
| Recepcionista | Consulta |
| Profissional | Consulta dos próprios vínculos |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO profissional_servico (
    id_empresa,
    id_profissional,
    id_servico,
    percentual_comissao
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'e0f7c8c3-5b5a-41b8-baf0-2f5c5f7d2d10',
    '9b8c8a71-c3d1-4f45-9f2d-4ef56b8c1b25',
    45.00
);
```

## Consulta

```sql
SELECT *
FROM profissional_servico;
```

---

# 16. Segurança

- Utiliza UUID como chave primária.
- Compatível com PostgreSQL e Supabase.
- Compatível com Row Level Security (RLS).
- Exclusão lógica utilizando o campo **ativo**.
- Todas as alterações devem ser registradas em **logs_auditoria**.

---

# 17. Integrações

- API REST
- n8n
- PostgreSQL
- Supabase
- Google Sheets (MVP)
- Dashboard Power BI
- Motor de Agendamento

---

# 18. Observações Técnicas

- Esta entidade implementa o relacionamento N:N entre profissionais e serviços.
- Permite configurar duração, valor e comissão específicos para cada profissional.
- O motor de agendamento utilizará apenas vínculos ativos para calcular disponibilidade.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da documentação da entidade Profissional Serviço. |

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


