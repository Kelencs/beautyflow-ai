# Dicionário de Dados

## BeautyFlow AI

---

# Objetivo

O Dicionário de Dados documenta todas as entidades do banco de dados do BeautyFlow AI.

Cada entidade possui um documento próprio contendo:

- Objetivo
- Relacionamentos
- Estrutura da tabela
- Campos
- Regras de negócio
- Constraints
- Índices
- Observações

Esta documentação serve como referência para:

- Product Owner
- Analistas
- Desenvolvedores
- QA
- DBA
- Arquitetos de Software

---

# Entidades

| Código | Entidade |
|---------|----------|
| ENT001 | Empresa |
| ENT002 | Usuário |
| ENT003 | Profissional |
| ENT004 | Cliente |
| ENT005 | Categoria de Serviço |
| ENT006 | Serviço |
| ENT007 | Agenda |
| ENT008 | Agendamento |
| ENT009 | Lista de Espera |
| ENT010 | Pagamento |
| ENT011 | Avaliação |
| ENT012 | Notificação |
| ENT013 | Configuração |
| ENT014 | Plano |
| ENT015 | Assinatura |
| ENT016 | Log de Auditoria |

---

# Convenções

## Tipos de Dados

| Tipo | Descrição |
|------|-----------|
| UUID | Identificador único |
| VARCHAR | Texto curto |
| TEXT | Texto longo |
| BOOLEAN | Verdadeiro/Falso |
| DATE | Data |
| TIME | Hora |
| TIMESTAMP | Data e Hora |
| NUMERIC | Valores monetários |

---

## Convenções de Nomenclatura

- snake_case
- nomes no plural
- id_ para chaves primárias
- Soft Delete utilizando campo **ativo**

---


