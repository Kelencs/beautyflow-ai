# Modelo de Dados para PostgreSQL

## BeautyFlow AI

---

# 1. Objetivo

Este documento define a estrutura física do banco de dados do **BeautyFlow AI** utilizando **PostgreSQL**, que será adotado na versão SaaS da aplicação.

O objetivo é especificar como as entidades do Modelo Lógico serão implementadas em tabelas relacionais, utilizando os recursos nativos do PostgreSQL para garantir desempenho, integridade, escalabilidade e segurança.

Este documento servirá como referência para:

- Desenvolvimento do Backend;
- Criação do banco de dados;
- Desenvolvimento das APIs;
- Implementação dos Workflows do n8n;
- Integração com Supabase;
- Evolução da plataforma SaaS.

---

# 2. Objetivos da Modelagem

O modelo físico para PostgreSQL possui os seguintes objetivos:

- Implementar um banco de dados relacional.
- Garantir integridade referencial.
- Melhorar o desempenho das consultas.
- Facilitar auditorias.
- Permitir escalabilidade.
- Suportar múltiplas empresas (Multi-Tenant).
- Garantir consistência dos dados.

---

# 3. Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| PostgreSQL 16+ | Banco de Dados Relacional |
| Supabase | Backend as a Service |
| n8n | Integrações |
| Prisma ORM (opcional) | Mapeamento objeto-relacional |
| Docker | Ambiente de desenvolvimento |

---

# 4. Convenções

## Nome das tabelas

Todas as tabelas utilizarão nomes no plural.

Exemplo

```text
clientes
servicos
agendamentos
pagamentos
```

---

## Nome das colunas

Todas utilizarão padrão snake_case.

Exemplo

```text
data_atendimento

hora_inicio

nome_cliente
```

---

## Chaves Primárias

Todas utilizarão UUID.

Exemplo

```sql
id_cliente UUID PRIMARY KEY
```

---

## Chaves Estrangeiras

Sempre utilizarão o mesmo nome da chave primária da tabela relacionada.

Exemplo

```text
id_empresa

id_cliente

id_servico
```

---

# 5. Estrutura Geral

O banco será composto pelas seguintes tabelas.

```text
empresas

usuarios

profissionais

clientes

categorias_servico

servicos

agenda

agendamentos

lista_espera

pagamentos

avaliacoes

notificacoes

configuracoes

planos

assinaturas

logs_auditoria
```

---

# 6. Relacionamentos

```text
Empresa
│
├── Usuários
├── Profissionais
├── Clientes
├── Categorias
├── Serviços
├── Configurações
├── Assinatura
└── Logs

Profissional
│
├── Agenda
└── Agendamentos

Cliente
│
├── Agendamentos
├── Lista de Espera
└── Avaliações

Categoria
└── Serviços

Serviço
└── Agendamentos

Agendamento
├── Pagamento
├── Avaliação
└── Notificações
```

---

# 7. Tipos de Dados

| Tipo PostgreSQL | Utilização |
|-----------------|------------|
| UUID | Identificadores |
| VARCHAR | Textos curtos |
| TEXT | Textos longos |
| BOOLEAN | Valores lógicos |
| DATE | Datas |
| TIME | Horários |
| TIMESTAMP | Data e hora |
| NUMERIC(10,2) | Valores monetários |
| INTEGER | Quantidades |
| JSONB | Configurações e dados flexíveis |

---

# 8. Chaves Primárias

Todas as tabelas utilizarão UUID.

Exemplo

```sql
PRIMARY KEY (id_cliente)
```

Benefícios:

- Segurança.
- Escalabilidade.
- Integrações.
- Unicidade global.

---

# 9. Chaves Estrangeiras

Serão implementadas utilizando FOREIGN KEY.

Exemplo

```sql
FOREIGN KEY (id_empresa)

REFERENCES empresas(id_empresa)
```

Relacionamentos protegidos:

- Empresa → Clientes
- Empresa → Profissionais
- Empresa → Serviços
- Cliente → Agendamentos
- Serviço → Agendamentos
- Profissional → Agenda
- Agendamento → Pagamentos
- Agendamento → Avaliações

---

# 10. Constraints

Serão utilizadas as seguintes constraints.

## PRIMARY KEY

Identificação única.

---

## FOREIGN KEY

Garantia de integridade referencial.

---

## NOT NULL

Campos obrigatórios.

Exemplo

```sql
nome

telefone

status
```

---

## UNIQUE

Evitar duplicidade.

Exemplos

```text
cnpj

email

telefone
```

---

## CHECK

Validação dos valores.

Exemplo

```sql
nota BETWEEN 1 AND 5
```

---

## DEFAULT

Valores padrão.

Exemplos

```sql
ativo = TRUE

status = 'Agendado'

criado_em = NOW()
```

---

# 11. Índices

Para melhorar a performance serão criados índices.

Campos sugeridos:

```text
telefone

email

data_atendimento

status

id_empresa

id_cliente

id_profissional

id_servico
```

---

# 12. Auditoria

Todas as operações críticas serão registradas.

Eventos:

- INSERT
- UPDATE
- DELETE (Soft Delete)
- LOGIN
- CANCELAMENTO
- REAGENDAMENTO
- PAGAMENTO

Tabela:

```text
logs_auditoria
```

---

# 13. Exclusão Lógica

Nenhum registro será removido fisicamente.

Será utilizado:

```sql
ativo BOOLEAN

DEFAULT TRUE
```

ou

```sql
status
```

Benefícios:

- Histórico completo.
- Auditoria.
- Recuperação de dados.
- Integridade.

---

# 14. Segurança

O banco deverá implementar:

- SSL.
- Controle de acesso.
- Row Level Security (RLS).
- Criptografia das senhas (bcrypt ou Argon2).
- Políticas de acesso por empresa (Multi-Tenant).
- Backups automáticos.

---

# 15. Multi-Tenant

Todas as tabelas de negócio conterão o campo:

```text
id_empresa
```

Exemplo

```text
clientes

id_empresa
```

Isso garante isolamento lógico dos dados entre empresas.

---

# 16. Compatibilidade com n8n

Os workflows utilizarão consultas SQL para:

- Inserção.
- Atualização.
- Consulta.
- Exclusão lógica.

Exemplo

```sql
SELECT *

FROM clientes

WHERE telefone = ?
```

---

# 17. Compatibilidade com Supabase

O modelo foi projetado para utilização direta no Supabase.

Serão utilizados:

- PostgreSQL.
- Authentication.
- Row Level Security.
- Storage.
- Edge Functions (quando necessário).
- Realtime (opcional).

---

# 18. Estratégia de Migração

A migração do Google Sheets para PostgreSQL ocorrerá em etapas:

1. Criação das tabelas.
2. Importação dos dados.
3. Validação da integridade.
4. Configuração das chaves estrangeiras.
5. Criação dos índices.
6. Atualização dos workflows do n8n.
7. Homologação.
8. Entrada em produção.

---

# 19. Benefícios

A adoção do PostgreSQL proporcionará:

- Alta disponibilidade.
- Integridade referencial.
- Melhor desempenho.
- Escalabilidade.
- Segurança.
- Consultas complexas.
- Controle transacional.
- Compatibilidade com Supabase.
- Facilidade de manutenção.
- Evolução para arquitetura SaaS.

---

# 20. Considerações Finais

O Modelo de Dados para PostgreSQL representa a implementação física da arquitetura de dados do BeautyFlow AI. Sua estrutura foi projetada para atender às necessidades atuais do MVP e suportar o crescimento da plataforma, permitindo múltiplas empresas, maior volume de dados e integrações robustas.

Este modelo será a base para o desenvolvimento do backend, das APIs, dos workflows do n8n e da infraestrutura SaaS, garantindo desempenho, segurança e consistência das informações.

---

# Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |

---

**Fim da Seção — Modelo de Dados para PostgreSQL**
