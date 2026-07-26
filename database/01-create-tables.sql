# Scripts SQL (DDL)

## BeautyFlow AI

---

# 1. Objetivo

Este documento apresenta os scripts SQL (Data Definition Language - DDL) responsáveis pela criação da estrutura física do banco de dados do **BeautyFlow AI** utilizando PostgreSQL.

Os scripts contemplam:

- Criação das tabelas
- Chaves Primárias
- Chaves Estrangeiras
- Constraints
- Índices
- Valores padrão
- Campos de auditoria

Este documento servirá como referência para implantação do banco de dados da versão SaaS.

---

# 2. Pré-requisitos

Banco de Dados:

- PostgreSQL 16+

Extensões utilizadas:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

ou

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

---

# 3. Padrões Utilizados

## Chave Primária

```sql
UUID
```

Gerada automaticamente:

```sql
gen_random_uuid()
```

---

## Datas

```sql
TIMESTAMP
```

---

## Exclusão lógica

```sql
ativo BOOLEAN DEFAULT TRUE
```

---

## Auditoria

Todas as tabelas possuirão:

```sql
criado_em TIMESTAMP

atualizado_em TIMESTAMP
```

---

# 4. Scripts SQL

---

# Tabela Empresas

```sql
CREATE TABLE empresas (

    id_empresa UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    razao_social VARCHAR(150) NOT NULL,

    nome_fantasia VARCHAR(120) NOT NULL,

    cnpj VARCHAR(18) UNIQUE,

    telefone VARCHAR(20),

    email VARCHAR(150),

    endereco TEXT,

    status VARCHAR(20) DEFAULT 'Ativa',

    ativo BOOLEAN DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
```

---

# Tabela Usuários

```sql
CREATE TABLE usuarios (

    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    nome VARCHAR(120) NOT NULL,

    email VARCHAR(150) NOT NULL,

    senha_hash TEXT NOT NULL,

    perfil VARCHAR(30) NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# Tabela Profissionais

```sql
CREATE TABLE profissionais (

    id_profissional UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    nome VARCHAR(120) NOT NULL,

    telefone VARCHAR(20),

    email VARCHAR(150),

    ativo BOOLEAN DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_profissional_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# Tabela Clientes

```sql
CREATE TABLE clientes (

    id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    nome VARCHAR(120) NOT NULL,

    telefone VARCHAR(20) NOT NULL,

    email VARCHAR(150),

    data_nascimento DATE,

    observacoes TEXT,

    ativo BOOLEAN DEFAULT TRUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cliente_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# Tabela Categorias de Serviço

```sql
CREATE TABLE categorias_servico (

    id_categoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT,

    ativo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_categoria_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# Tabela Serviços

```sql
CREATE TABLE servicos (

    id_servico UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    id_categoria UUID NOT NULL,

    nome VARCHAR(120) NOT NULL,

    descricao TEXT,

    duracao_minutos INTEGER NOT NULL,

    valor NUMERIC(10,2) NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_servico_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa),

    CONSTRAINT fk_servico_categoria

        FOREIGN KEY (id_categoria)

        REFERENCES categorias_servico(id_categoria)

);
```

---

# Tabela Agenda

```sql
CREATE TABLE agenda (

    id_agenda UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_profissional UUID NOT NULL,

    dia_semana INTEGER NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fim TIME NOT NULL,

    intervalo_minutos INTEGER DEFAULT 15,

    CONSTRAINT fk_agenda_profissional

        FOREIGN KEY (id_profissional)

        REFERENCES profissionais(id_profissional)

);
```

---

# Tabela Agendamentos

```sql
CREATE TABLE agendamentos (

    id_agendamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    id_cliente UUID NOT NULL,

    id_profissional UUID NOT NULL,

    id_servico UUID NOT NULL,

    data_atendimento DATE NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fim TIME NOT NULL,

    status VARCHAR(30) DEFAULT 'Agendado',

    observacoes TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_agendamento_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresas(id_empresa),

    CONSTRAINT fk_agendamento_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),

    CONSTRAINT fk_agendamento_profissional
        FOREIGN KEY (id_profissional)
        REFERENCES profissionais(id_profissional),

    CONSTRAINT fk_agendamento_servico
        FOREIGN KEY (id_servico)
        REFERENCES servicos(id_servico)

);
```

---

# Tabela Lista de Espera

```sql
CREATE TABLE lista_espera (

    id_lista UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    id_cliente UUID NOT NULL,

    id_servico UUID NOT NULL,

    data_desejada DATE,

    periodo VARCHAR(20),

    status VARCHAR(20) DEFAULT 'Ativa',

    CONSTRAINT fk_lista_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresas(id_empresa),

    CONSTRAINT fk_lista_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),

    CONSTRAINT fk_lista_servico
        FOREIGN KEY (id_servico)
        REFERENCES servicos(id_servico)

);
```

---

# Tabela Pagamentos

```sql
CREATE TABLE pagamentos (

    id_pagamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_agendamento UUID NOT NULL UNIQUE,

    valor NUMERIC(10,2) NOT NULL,

    forma_pagamento VARCHAR(30),

    status VARCHAR(20),

    data_pagamento TIMESTAMP,

    CONSTRAINT fk_pagamento_agendamento

        FOREIGN KEY (id_agendamento)

        REFERENCES agendamentos(id_agendamento)

);
```

---

# Tabela Avaliações

```sql
CREATE TABLE avaliacoes (

    id_avaliacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_agendamento UUID NOT NULL UNIQUE,

    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),

    comentario TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_avaliacao_agendamento

        FOREIGN KEY (id_agendamento)

        REFERENCES agendamentos(id_agendamento)

);
```

---

# Tabela Notificações

```sql
CREATE TABLE notificacoes (

    id_notificacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_agendamento UUID NOT NULL,

    tipo VARCHAR(40),

    enviado_em TIMESTAMP,

    status VARCHAR(20),

    CONSTRAINT fk_notificacao_agendamento

        FOREIGN KEY (id_agendamento)

        REFERENCES agendamentos(id_agendamento)

);
```

---

# Tabela Configurações

```sql
CREATE TABLE configuracoes (

    id_configuracao UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    horario_inicio TIME,

    horario_fim TIME,

    intervalo_padrao INTEGER,

    antecedencia_cancelamento INTEGER,

    CONSTRAINT fk_config_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# Tabela Planos

```sql
CREATE TABLE planos (

    id_plano UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome VARCHAR(50) NOT NULL,

    valor NUMERIC(10,2) NOT NULL,

    limite_profissionais INTEGER,

    limite_usuarios INTEGER

);
```

---

# Tabela Assinaturas

```sql
CREATE TABLE assinaturas (

    id_assinatura UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID NOT NULL,

    id_plano UUID NOT NULL,

    data_inicio DATE,

    data_fim DATE,

    status VARCHAR(20),

    CONSTRAINT fk_ass_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa),

    CONSTRAINT fk_ass_plano

        FOREIGN KEY (id_plano)

        REFERENCES planos(id_plano)

);
```

---

# Tabela Logs de Auditoria

```sql
CREATE TABLE logs_auditoria (

    id_log UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_empresa UUID,

    entidade VARCHAR(50),

    operacao VARCHAR(30),

    usuario VARCHAR(120),

    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    detalhes TEXT,

    CONSTRAINT fk_log_empresa

        FOREIGN KEY (id_empresa)

        REFERENCES empresas(id_empresa)

);
```

---

# 5. Índices Recomendados

```sql
CREATE INDEX idx_cliente_telefone
ON clientes(telefone);

CREATE INDEX idx_cliente_email
ON clientes(email);

CREATE INDEX idx_agendamento_data
ON agendamentos(data_atendimento);

CREATE INDEX idx_agendamento_profissional
ON agendamentos(id_profissional);

CREATE INDEX idx_agendamento_cliente
ON agendamentos(id_cliente);

CREATE INDEX idx_servico_empresa
ON servicos(id_empresa);

CREATE INDEX idx_pagamento_status
ON pagamentos(status);
```

---

# 6. Constraints Adicionais

Exemplos de regras de integridade:

```sql
CHECK (valor > 0);

CHECK (duracao_minutos > 0);

CHECK (hora_inicio < hora_fim);

CHECK (status IN (
'Agendado',
'Confirmado',
'Reagendado',
'Cancelado',
'Concluído'
));
```

---

# 7. Boas Práticas

- Utilizar UUID como chave primária.
- Criar índices para colunas frequentemente consultadas.
- Implementar Soft Delete (`ativo`).
- Atualizar o campo `atualizado_em` por meio de triggers.
- Utilizar transações para operações críticas.
- Configurar backups automáticos.
- Habilitar Row Level Security (RLS) quando utilizar Supabase.

---

# 8. Estrutura Final do Banco

```text
empresas
├── usuarios
├── profissionais
│   └── agenda
├── clientes
│   ├── agendamentos
│   │   ├── pagamentos
│   │   ├── avaliacoes
│   │   └── notificacoes
│   └── lista_espera
├── categorias_servico
│   └── servicos
├── configuracoes
├── assinaturas
│   └── planos
└── logs_auditoria
```

---

# 9. Considerações Finais

Os scripts SQL apresentados implementam a estrutura física do banco de dados do BeautyFlow AI seguindo boas práticas de modelagem relacional para PostgreSQL. A utilização de UUIDs, chaves estrangeiras, constraints e índices garante integridade, desempenho e escalabilidade, permitindo a evolução da aplicação para um ambiente SaaS com suporte a múltiplas empresas e integrações por meio do n8n e Supabase.

---

# Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| DBA | __________________ | ☐ Pendente |
| Desenvolvedor Backend | __________________ | ☐ Pendente |

---

**Fim da Seção — Scripts SQL (DDL)**
