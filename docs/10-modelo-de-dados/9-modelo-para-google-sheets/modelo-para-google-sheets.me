# Modelo de Dados para Google Sheets

## BeautyFlow AI

---

# 1. Objetivo

Este documento define a estrutura do banco de dados do **BeautyFlow AI** utilizando **Google Sheets** durante a fase de MVP (Minimum Viable Product).

O objetivo é criar uma estrutura simples, de baixo custo e de fácil manutenção, permitindo validar o produto antes da migração para um banco de dados relacional (PostgreSQL/Supabase).

Cada aba da planilha representará uma entidade do sistema.

---

# 2. Objetivos da Modelagem

O modelo para Google Sheets possui os seguintes objetivos:

- Reduzir o custo inicial do projeto.
- Facilitar a implementação dos workflows no n8n.
- Centralizar os dados do sistema.
- Permitir rápida evolução do MVP.
- Facilitar a futura migração para PostgreSQL.
- Manter padronização entre todas as entidades.

---

# 3. Estrutura Geral

Cada entidade será representada por uma aba independente na planilha.

```text
BeautyFlow AI

├── Empresas
├── Usuários
├── Profissionais
├── Clientes
├── Categorias
├── Serviços
├── Agenda
├── Agendamentos
├── Lista de Espera
├── Pagamentos
├── Avaliações
├── Notificações
├── Configurações
├── Planos
├── Assinaturas
└── Auditoria
```

---

# 4. Convenções

## Primeira linha

A primeira linha conterá os nomes das colunas.

---

## Uma linha = Um registro

Cada linha representa exatamente um registro.

---

## Chave Primária

Cada aba possuirá uma coluna de identificação.

Exemplo

```text
id_cliente
```

---

## Datas

Formato

```text
AAAA-MM-DD
```

Exemplo

```text
2026-08-10
```

---

## Horários

Formato

```text
HH:MM
```

Exemplo

```text
14:30
```

---

## Data e Hora

Formato

```text
AAAA-MM-DD HH:MM
```

---

## Booleano

Utilizar

```text
TRUE

FALSE
```

---

# 5. Estrutura das Abas

---

# Aba 01 — Empresas

| Coluna |
|---------|
| id_empresa |
| razao_social |
| nome_fantasia |
| cnpj |
| telefone |
| email |
| endereco |
| status |
| criado_em |
| atualizado_em |

---

# Aba 02 — Usuários

| Coluna |
|---------|
| id_usuario |
| id_empresa |
| nome |
| email |
| perfil |
| ativo |
| criado_em |

---

# Aba 03 — Profissionais

| Coluna |
|---------|
| id_profissional |
| id_empresa |
| nome |
| telefone |
| email |
| ativo |
| criado_em |

---

# Aba 04 — Clientes

| Coluna |
|---------|
| id_cliente |
| id_empresa |
| nome |
| telefone |
| email |
| data_nascimento |
| observacoes |
| ativo |
| criado_em |

---

# Aba 05 — Categorias

| Coluna |
|---------|
| id_categoria |
| id_empresa |
| nome |
| descricao |
| ativo |

---

# Aba 06 — Serviços

| Coluna |
|---------|
| id_servico |
| id_empresa |
| id_categoria |
| nome |
| descricao |
| duracao_minutos |
| valor |
| ativo |

---

# Aba 07 — Agenda

| Coluna |
|---------|
| id_agenda |
| id_profissional |
| dia_semana |
| hora_inicio |
| hora_fim |
| intervalo_minutos |

---

# Aba 08 — Agendamentos

| Coluna |
|---------|
| id_agendamento |
| id_empresa |
| id_cliente |
| id_profissional |
| id_servico |
| data_atendimento |
| hora_inicio |
| hora_fim |
| status |
| observacoes |
| criado_em |

---

# Aba 09 — Lista de Espera

| Coluna |
|---------|
| id_lista |
| id_empresa |
| id_cliente |
| id_servico |
| data_desejada |
| periodo |
| status |

---

# Aba 10 — Pagamentos

| Coluna |
|---------|
| id_pagamento |
| id_agendamento |
| valor |
| forma_pagamento |
| status |
| data_pagamento |

---

# Aba 11 — Avaliações

| Coluna |
|---------|
| id_avaliacao |
| id_agendamento |
| nota |
| comentario |
| criado_em |

---

# Aba 12 — Notificações

| Coluna |
|---------|
| id_notificacao |
| id_agendamento |
| tipo |
| enviado_em |
| status |

---

# Aba 13 — Configurações

| Coluna |
|---------|
| id_configuracao |
| id_empresa |
| horario_inicio |
| horario_fim |
| intervalo_padrao |
| antecedencia_cancelamento |

---

# Aba 14 — Planos

| Coluna |
|---------|
| id_plano |
| nome |
| valor |
| limite_profissionais |
| limite_usuarios |

---

# Aba 15 — Assinaturas

| Coluna |
|---------|
| id_assinatura |
| id_empresa |
| id_plano |
| data_inicio |
| data_fim |
| status |

---

# Aba 16 — Auditoria

| Coluna |
|---------|
| id_log |
| id_empresa |
| entidade |
| operacao |
| usuario |
| data_hora |
| detalhes |

---

# 6. Relacionamentos no Google Sheets

Como o Google Sheets não possui chaves estrangeiras, os relacionamentos serão mantidos por meio dos campos de identificação.

Exemplos:

```text
Clientes.id_empresa

↓

Empresas.id_empresa
```

```text
Agendamentos.id_cliente

↓

Clientes.id_cliente
```

```text
Agendamentos.id_profissional

↓

Profissionais.id_profissional
```

```text
Agendamentos.id_servico

↓

Serviços.id_servico
```

A validação desses relacionamentos será realizada pelos workflows do **n8n**.

---

# 7. Validações

As seguintes validações deverão ser implementadas nos workflows:

- Verificar existência da empresa.
- Verificar existência da cliente.
- Verificar existência do profissional.
- Verificar existência do serviço.
- Evitar duplicidade de registros.
- Validar horários disponíveis.
- Validar regras de cancelamento.
- Validar lista de espera.
- Validar pagamentos.
- Validar avaliações.

---

# 8. Organização dos Workflows

Cada aba será manipulada por workflows específicos.

| Aba | Workflow |
|------|----------|
| Empresas | Cadastro de Empresa |
| Usuários | Cadastro de Usuário |
| Profissionais | Cadastro de Profissional |
| Clientes | Cadastro de Cliente |
| Serviços | Cadastro de Serviço |
| Agenda | Gestão de Agenda |
| Agendamentos | Agendar, Reagendar e Cancelar |
| Lista de Espera | Gestão de Lista de Espera |
| Pagamentos | Registrar Pagamento |
| Avaliações | Registrar Avaliação |
| Notificações | Envio de Mensagens |
| Auditoria | Registro de Eventos |

---

# 9. Boas Práticas

Para garantir a qualidade dos dados no Google Sheets, recomenda-se:

- Não alterar manualmente os IDs.
- Não excluir linhas diretamente.
- Utilizar exclusão lógica por meio do campo **status** ou **ativo**.
- Manter os nomes das colunas padronizados.
- Evitar fórmulas nas abas de dados.
- Restringir permissões de edição da planilha.
- Realizar backups periódicos.
- Automatizar todas as inclusões e alterações via n8n.

---

# 10. Limitações do Google Sheets

Embora adequado para um MVP, o Google Sheets apresenta algumas limitações:

- Não possui chaves estrangeiras.
- Não garante integridade referencial.
- Controle de concorrência limitado.
- Desempenho reduzido com grande volume de dados.
- Não suporta transações.
- Consultas complexas são limitadas.

Essas limitações justificam a futura migração para PostgreSQL/Supabase.

---

# 11. Estratégia de Migração

A estrutura foi projetada para permitir migração direta para um banco de dados relacional.

Durante a migração serão implementados:

- Tabelas relacionais.
- Chaves primárias.
- Chaves estrangeiras.
- Índices.
- Constraints.
- Triggers.
- Views.
- Procedures.

Como a nomenclatura das colunas será mantida, os workflows do n8n exigirão poucas alterações.

---

# 12. Considerações Finais

O modelo de dados para Google Sheets oferece uma solução simples, organizada e eficiente para validar o BeautyFlow AI na fase de MVP. Sua estrutura padronizada facilita o desenvolvimento dos workflows, reduz custos iniciais e prepara o projeto para uma evolução segura rumo a uma arquitetura SaaS baseada em PostgreSQL.

---

# Aprovação

| Papel | Responsável | Status |
|--------|-------------|--------|
| Product Owner | Kelen Cristina | ☐ Pendente |
| Arquiteto de Software | __________________ | ☐ Pendente |
| Desenvolvedor | __________________ | ☐ Pendente |

---

**Fim da Seção — Modelo de Dados para Google Sheets**
