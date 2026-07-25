# **UC009 – Atualizar Cadastro da Cliente**

---

# Objetivo

Permitir que a cliente atualize suas informações cadastrais por meio do WhatsApp, garantindo que os dados armazenados no sistema permaneçam corretos e atualizados para utilização nos processos de agendamento, atendimento e comunicação.

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

- A cliente deve possuir um cadastro ativo.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O AI Agent deve estar operacional.
- O Google Sheets deve estar acessível.

---

# Fluxo Principal

1. A cliente envia uma mensagem solicitando a atualização de seus dados.

2. A WhatsApp Cloud API encaminha a mensagem ao Webhook do n8n.

3. O Workflow recebe a mensagem.

4. O AI Agent identifica a intenção **Atualizar Cadastro**.

5. O sistema localiza o cadastro da cliente no Google Sheets.

6. O sistema apresenta quais informações podem ser alteradas, como:
   - Nome;
   - E-mail;
   - Data de nascimento (opcional);
   - Observações (quando permitido).

7. A cliente informa o dado que deseja alterar.

8. O sistema valida a informação recebida.

9. O sistema atualiza o cadastro no Google Sheets.

10. O sistema registra a data e hora da alteração.

11. O sistema envia uma mensagem confirmando a atualização.

12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente altera apenas o nome

O sistema atualiza somente o campo **Nome**.

---

## FA002 – Cliente altera mais de um dado

O sistema valida e atualiza todos os campos informados em uma única operação.

---

## FA003 – Cliente desiste da atualização

O sistema encerra o fluxo sem alterar os dados.

---

## FA004 – Cliente informa um dado inválido

O sistema solicita a correção da informação antes de continuar.

---

## FA005 – Cliente interrompe a conversa

O sistema encerra o fluxo mantendo os dados atuais.

---

# Exceções

## EX001 – Cliente não cadastrada

O sistema informa:

> "Não encontrei um cadastro para este número de WhatsApp."

E poderá direcionar para o **UC008 – Cadastrar Cliente**.

---

## EX002 – Google Sheets indisponível

O sistema informa:

> "No momento não foi possível atualizar seu cadastro. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX003 – Erro ao atualizar os dados

O sistema registra o erro e informa que a atualização não foi concluída.

---

# Regras de Negócio

- RN001 – O número do WhatsApp é o identificador único da cliente e não poderá ser alterado por este caso de uso.
- RN002 – Apenas clientes cadastradas poderão atualizar seus dados.
- RN003 – Toda alteração deverá registrar data e hora.
- RN004 – Os dados deverão ser validados antes da atualização.
- RN005 – O sistema deverá manter apenas um cadastro por número de WhatsApp.
- RN023 – As mensagens deverão utilizar linguagem cordial.
- RN031 – Todas as alterações deverão ser registradas para auditoria.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Campo a ser atualizado
- Novo valor informado pela cliente

---

## Processamento

- Identificação da cliente
- Localização do cadastro
- Validação do novo dado
- Atualização do Google Sheets
- Registro da data e hora da alteração

---

## Saída

- Cadastro atualizado
- Google Sheets atualizado
- Confirmação enviada à cliente

---

# User Story

**ID:** US009

**Título:** Atualizar cadastro da cliente

**Como** cliente,

**Quero** atualizar minhas informações cadastrais pelo WhatsApp,

**Para que** meus dados permaneçam corretos e atualizados.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar a cliente pelo número do WhatsApp. |
| WF003 | AI Agent | Identificar a intenção de atualização de cadastro. |
| WF004 | Consultar Cadastro | Consultar os dados da cliente no Google Sheets. |
| WF005 | Validar Dados | Validar o novo valor informado. |
| WF006 | Atualizar Cadastro | Atualizar o registro da cliente no Google Sheets. |
| WF007 | Registrar Histórico | Registrar a alteração para auditoria. |
| WF008 | Enviar Confirmação | Enviar mensagem confirmando a atualização do cadastro. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de atualização

**Dado que** a cliente envie uma mensagem solicitando a atualização de seus dados,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de atualização cadastral.

---

### CA002 – Identificar a cliente

**Dado que** uma mensagem tenha sido recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar o cadastro correspondente.

---

### CA003 – Apresentar campos disponíveis

**Dado que** a cliente tenha sido localizada,

**Quando** o fluxo iniciar,

**Então** o sistema deverá informar quais dados podem ser alterados.

---

### CA004 – Validar os dados

**Dado que** a cliente informe um novo valor,

**Quando** o sistema receber a informação,

**Então** deverá validar o conteúdo antes de realizar a atualização.

---

### CA005 – Atualizar cadastro

**Dado que** os dados sejam válidos,

**Quando** a atualização for executada,

**Então** o Google Sheets deverá ser atualizado.

---

### CA006 – Registrar data da alteração

**Dado que** o cadastro seja atualizado,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a data e hora da alteração.

---

### CA007 – Confirmar atualização

**Dado que** a atualização tenha sido concluída,

**Quando** o processo finalizar,

**Então** a cliente deverá receber uma mensagem confirmando a alteração.

---

### CA008 – Impedir atualização de cliente inexistente

**Dado que** não exista cadastro para o número informado,

**Quando** a atualização for solicitada,

**Então** o sistema deverá informar que a cliente não está cadastrada e poderá direcionar para o UC008 – Cadastrar Cliente.

---

### CA009 – Tratar erros de atualização

**Dado que** ocorra uma falha ao gravar os dados,

**Quando** o processo falhar,

**Então** o sistema deverá registrar o erro e informar a cliente.

---

### CA010 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA011 – Utilizar linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva e profissional.

---

### CA012 – Manter integridade dos dados

**Dado que** o cadastro seja atualizado,

**Quando** o processo for concluído,

**Então** os dados deverão permanecer consistentes e sincronizados no Google Sheets, sem criar registros duplicados.

