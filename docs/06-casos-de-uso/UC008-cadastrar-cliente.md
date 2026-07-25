# **UC008 – Cadastrar Cliente**

---

# Objetivo

Permitir que o sistema cadastre automaticamente uma nova cliente quando ela iniciar um atendimento pelo WhatsApp ou quando seus dados ainda não existirem na base de clientes, garantindo que as informações sejam armazenadas para utilização nos demais processos do sistema.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- WhatsApp Cloud API
- n8n
- AI Agent
- Google Sheets (Cadastro de Clientes)

---

# Pré-condições

- A WhatsApp Cloud API deve estar configurada.
- O Webhook do n8n deve estar ativo.
- O AI Agent deve estar operacional.
- O Google Sheets deve estar configurado para armazenar os clientes.
- A cliente deve iniciar uma conversa pelo WhatsApp.

---

# Fluxo Principal

1. A cliente envia uma mensagem pelo WhatsApp.

2. A WhatsApp Cloud API encaminha a mensagem para o Webhook do n8n.

3. O Workflow recebe a mensagem.

4. O sistema identifica o número do WhatsApp.

5. O sistema consulta o Google Sheets.

6. O sistema verifica se já existe cadastro.

7. Caso não exista, o sistema solicita o nome da cliente.

8. A cliente informa seu nome.

9. O sistema cria o cadastro.

10. O sistema grava:

- Nome
- Número do WhatsApp
- Data do cadastro
- Status da cliente

11. O sistema confirma o cadastro.

12. O fluxo retorna ao atendimento iniciado.

---

# Fluxos Alternativos

## FA001 – Cliente já cadastrada

O sistema identifica o cadastro existente e continua o atendimento normalmente.

---

## FA002 – Cliente não informa o nome

O sistema solicita novamente o nome.

---

## FA003 – Cliente deseja alterar o nome informado

O sistema atualiza o cadastro antes de finalizar.

---

## FA004 – Cadastro iniciado durante um agendamento

Após concluir o cadastro, o sistema retorna automaticamente ao UC001.

---

## FA005 – Cliente interrompe a conversa

O cadastro permanece pendente até que a conversa seja retomada.

---

# Exceções

## EX001 – Google Sheets indisponível

O sistema informa que não foi possível realizar o cadastro.

O erro é registrado.

---

## EX002 – Erro ao gravar dados

O sistema registra o erro.

O cadastro não é concluído.

---

## EX003 – Número inválido

O sistema encerra o processo.

---

# Regras de Negócio

- RN001 – O número do WhatsApp será o identificador único da cliente.
- RN002 – Não permitir cadastros duplicados.
- RN003 – O cadastro deverá ser criado automaticamente.
- RN004 – O nome poderá ser alterado posteriormente.
- RN005 – Todo cadastro deverá possuir data e hora.
- RN006 – O status inicial deverá ser "Ativa".
- RN023 – Utilizar linguagem cordial durante o cadastro.
- RN031 – Todo cadastro deverá ser registrado para auditoria.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Nome da cliente

---

## Processamento

- Consulta do cadastro
- Validação de duplicidade
- Criação do registro
- Registro da data do cadastro

---

## Saída

- Cliente cadastrada
- Google Sheets atualizado
- Confirmação enviada

---

# User Story

**ID:** US008

**Título:** Cadastro automático de cliente

**Como** cliente,

**Quero** que meus dados sejam cadastrados automaticamente,

**Para que** eu não precise informar as mesmas informações toda vez que entrar em contato.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens da WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Verificar se a cliente já está cadastrada. |
| WF003 | Consultar Google Sheets | Consultar cadastro existente. |
| WF004 | Solicitar Nome | Solicitar o nome caso necessário. |
| WF005 | Criar Cadastro | Inserir novo registro no Google Sheets. |
| WF006 | Atualizar Cadastro | Atualizar dados quando necessário. |
| WF007 | Registrar Log | Registrar o cadastro para auditoria. |
| WF008 | Enviar Confirmação | Confirmar o cadastro pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Identificar cliente

**Dado que** uma mensagem seja recebida,

**Quando** o sistema identificar o número do WhatsApp,

**Então** deverá verificar se a cliente já está cadastrada.

---

### CA002 – Evitar duplicidade

**Dado que** o número já exista,

**Quando** a consulta for realizada,

**Então** nenhum novo cadastro deverá ser criado.

---

### CA003 – Solicitar nome

**Dado que** a cliente não esteja cadastrada,

**Quando** o sistema iniciar o cadastro,

**Então** deverá solicitar seu nome.

---

### CA004 – Criar cadastro

**Dado que** a cliente informe seu nome,

**Quando** o sistema validar os dados,

**Então** deverá criar automaticamente o cadastro.

---

### CA005 – Registrar data

**Dado que** o cadastro seja criado,

**Quando** o processo for concluído,

**Então** deverá registrar a data e hora do cadastro.

---

### CA006 – Atualizar Google Sheets

**Dado que** o cadastro seja criado,

**Quando** o processo terminar,

**Então** o Google Sheets deverá ser atualizado.

---

### CA007 – Enviar confirmação

**Dado que** o cadastro tenha sido concluído,

**Quando** o processo finalizar,

**Então** a cliente deverá receber uma mensagem confirmando seu cadastro.

---

### CA008 – Retornar ao fluxo anterior

**Dado que** o cadastro tenha sido realizado durante outro atendimento,

**Quando** o cadastro terminar,

**Então** o sistema deverá retornar automaticamente ao fluxo que estava em execução.

---

### CA009 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA010 – Utilizar linguagem cordial

**Dado que** o sistema interaja com a cliente,

**Quando** enviar mensagens,

**Então** deverá utilizar linguagem clara, amigável e profissional.

---

### CA011 – Não concluir cadastro incompleto

**Dado que** o nome da cliente não seja informado,

**Quando** o fluxo terminar,

**Então** o cadastro não deverá ser concluído.

---

### CA012 – Manter unicidade do cadastro

**Dado que** o número do WhatsApp seja utilizado como identificador,

**Quando** houver nova tentativa de cadastro,

**Então** o sistema deverá manter apenas um registro para cada número de telefone.
