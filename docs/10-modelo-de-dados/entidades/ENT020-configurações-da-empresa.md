# ENT020 — Configurações da Empresa

**Código:** ENT020

**Versão:** 1.0

**Módulo:** Configurações

**Tabela Física:** configuracoes_empresa

**Responsável:** Product Owner / Arquitetura

---

# 1. Objetivo

A entidade **Configurações da Empresa** armazena todos os parâmetros operacionais e administrativos de cada empresa cadastrada no sistema.

Seu objetivo é permitir que cada empresa personalize o funcionamento do BeautyFlow AI sem necessidade de alterações no código da aplicação.

As configurações são específicas para cada empresa, garantindo suporte ao modelo **Multi-Tenant**.

---

# 2. Descrição

A tabela **configuracoes_empresa** centraliza as configurações de funcionamento da empresa, incluindo:

- Horário de funcionamento;
- Duração padrão dos atendimentos;
- Intervalo entre atendimentos;
- Política de múltiplas sessões;
- Tempo de expiração de sessão;
- Configurações de notificações;
- Integrações externas;
- Configurações financeiras;
- Preferências gerais do sistema.

Cada empresa possui exatamente um registro de configuração.

---

# 3. Tipo da Entidade

**Entidade de Configuração**

---

# 4. Relacionamentos

| Relacionamento | Entidade | Cardinalidade | Chave |
|----------------|----------|---------------|--------|
| Pertence à | Empresa | 1:1 | id_empresa |

---

# 5. Casos de Uso Relacionados

| Código | Caso de Uso |
|---------|-------------|
| UC016 | Configurar Empresa |
| UC017 | Configurar Agenda |
| UC018 | Configurar Notificações |
| UC019 | Configurar Segurança |

---

# 6. User Stories Relacionadas

- US018 — Configurar Empresa
- US019 — Configurar Agenda
- US020 — Configurar Segurança

---

# 7. Workflows n8n Relacionados

| Workflow | Objetivo |
|-----------|----------|
| WF097 | Atualizar Configurações |
| WF098 | Sincronizar Google Calendar |
| WF099 | Atualizar WhatsApp |
| WF100 | Atualizar Preferências |

---

# 8. APIs Relacionadas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /configuracoes | Consultar configurações |
| PUT | /configuracoes | Atualizar configurações |

---

# 9. Estrutura da Tabela

```text
configuracoes_empresa
```

---

# 10. Dicionário de Dados

| Campo | Tipo | Obrigatório | Descrição | Regra de Negócio | Valor Padrão | Exemplo |
|--------|------|-------------|-----------|------------------|--------------|----------|
| id_configuracao | UUID | Sim | Identificador da configuração | Gerado automaticamente | gen_random_uuid() | UUID |
| id_empresa | UUID | Sim | Empresa proprietária | Deve existir em empresas | — | UUID |
| fuso_horario | VARCHAR(60) | Sim | Fuso horário | Timezone válida | America/Sao_Paulo | America/Sao_Paulo |
| idioma | VARCHAR(10) | Sim | Idioma padrão | ISO 639-1 | pt-BR | pt-BR |
| moeda | VARCHAR(10) | Sim | Moeda padrão | ISO 4217 | BRL | BRL |
| duracao_padrao_atendimento | INTEGER | Sim | Duração em minutos | Entre 5 e 480 minutos | 60 | 60 |
| intervalo_atendimentos | INTEGER | Sim | Intervalo entre atendimentos | Em minutos | 0 | 15 |
| antecedencia_cancelamento | INTEGER | Sim | Horas mínimas para cancelamento | Valor positivo | 24 | 24 |
| permite_multiplas_sessoes | BOOLEAN | Sim | Permite vários logins simultâneos | TRUE/FALSE | TRUE | FALSE |
| tempo_expiracao_sessao | INTEGER | Sim | Tempo da sessão em minutos | Entre 15 e 1440 | 480 | 480 |
| envia_notificacao_whatsapp | BOOLEAN | Sim | Envio via WhatsApp | TRUE/FALSE | TRUE | TRUE |
| envia_notificacao_email | BOOLEAN | Sim | Envio por e-mail | TRUE/FALSE | TRUE | TRUE |
| envia_notificacao_sms | BOOLEAN | Sim | Envio por SMS | TRUE/FALSE | FALSE | FALSE |
| google_calendar_ativo | BOOLEAN | Sim | Integração Google Calendar | TRUE/FALSE | FALSE | TRUE |
| whatsapp_api_ativa | BOOLEAN | Sim | Integração WhatsApp Cloud API | TRUE/FALSE | FALSE | TRUE |
| status | VARCHAR(20) | Sim | Situação da configuração | Ativo ou Inativo | Ativo | Ativo |
| criado_em | TIMESTAMP | Sim | Data de criação | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |
| atualizado_em | TIMESTAMP | Sim | Última atualização | CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 2026-07-27 |

---

# 11. Regras de Negócio

| Código | Regra |
|---------|--------|
| RN001 | Cada empresa deve possuir apenas uma configuração. |
| RN002 | O fuso horário deve utilizar um timezone válido. |
| RN003 | A duração padrão do atendimento deve ser maior que zero. |
| RN004 | O tempo de expiração da sessão deve estar entre 15 e 1440 minutos. |
| RN005 | Alterações devem ser registradas na entidade **logs_auditoria**. |
| RN006 | As integrações só poderão ser ativadas após configuração válida das credenciais. |
| RN007 | As configurações entram em vigor imediatamente após a atualização, salvo quando exigirem reinicialização de serviços. |

---

# 12. Constraints

| Constraint | Descrição |
|------------|-----------|
| PK_configuracoes_empresa | PRIMARY KEY(id_configuracao) |
| FK_config_empresa | FOREIGN KEY(id_empresa) REFERENCES empresas(id_empresa) |
| UQ_config_empresa | UNIQUE(id_empresa) |

---

# 13. Índices Recomendados

| Índice | Objetivo |
|---------|----------|
| idx_config_empresa | Consultas por empresa |
| idx_config_status | Configurações ativas |

---

# 14. Permissões de Acesso

| Perfil | Permissão |
|---------|-----------|
| Administrador | Gerenciamento completo |
| Gerente | Consulta |
| Recepcionista | Sem acesso |
| Profissional | Sem acesso |

---

# 15. Exemplos SQL

## Inserção

```sql
INSERT INTO configuracoes_empresa (
    id_empresa,
    fuso_horario,
    idioma,
    moeda,
    duracao_padrao_atendimento,
    intervalo_atendimentos,
    tempo_expiracao_sessao,
    status
)
VALUES (
    'UUID_EMPRESA',
    'America/Sao_Paulo',
    'pt-BR',
    'BRL',
    60,
    15,
    480,
    'Ativo'
);
```

## Consulta

```sql
SELECT *
FROM configuracoes_empresa
WHERE id_empresa = 'UUID_EMPRESA';
```

---

# 16. Segurança

- UUID como chave primária.
- Compatível com PostgreSQL.
- Compatível com Supabase.
- Compatível com Row Level Security (RLS).
- Multi-Tenant.
- Alterações registradas em **logs_auditoria**.

---

# 17. Integrações

- PostgreSQL
- Supabase
- Google Calendar
- WhatsApp Cloud API
- API REST
- n8n
- ENT001 — Empresa
- ENT014 — Log de Auditoria

---

# 18. Observações Técnicas

- Cada empresa possui apenas um registro de configuração.
- Os valores armazenados nesta entidade devem ser utilizados pelos módulos de agenda, notificações, autenticação e integrações.
- Recomenda-se armazenar credenciais sensíveis (tokens e chaves de API) em um cofre de segredos (Secrets Manager ou variáveis de ambiente), mantendo nesta tabela apenas indicadores e referências, e não os segredos em texto.
- A modelagem segue a Terceira Forma Normal (3FN) e está preparada para ambientes SaaS multi-tenant.

---

# 19. Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 27/07/2026 | Product Owner | Criação da entidade Configurações da Empresa. |

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
