# **UC004 – Cancelar Atendimento**

---

# Objetivo

Permitir que a cliente cancele um atendimento previamente agendado por meio do WhatsApp, atualizando automaticamente a agenda, os registros do sistema e liberando o horário para novos agendamentos, conforme as regras de negócio.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- WhatsApp Cloud API
- n8n
- AI Agent
- Google Calendar
- Google Sheets
- Nail Designer (quando houver necessidade de atendimento manual)

---

# Pré-condições

- A cliente deve possuir um agendamento ativo.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O Google Calendar deve estar sincronizado.
- O Google Sheets deve estar acessível.
- O AI Agent deve estar operacional.
- As regras de cancelamento devem estar configuradas.

---

# Fluxo Principal

1. A cliente envia uma mensagem solicitando o cancelamento do atendimento.

2. A WhatsApp Cloud API encaminha a mensagem para o Webhook do n8n.

3. O Workflow de Recebimento processa a mensagem.

4. O AI Agent identifica a intenção **Cancelar Atendimento**.

5. O sistema localiza o agendamento ativo da cliente.

6. O sistema apresenta os dados do agendamento.

7. O sistema solicita a confirmação do cancelamento.

8. A cliente confirma o cancelamento.

9. O sistema valida as regras de cancelamento.

10. O sistema cancela o evento no Google Calendar.

11. O sistema atualiza o registro do atendimento no Google Sheets.

12. O sistema cancela os lembretes automáticos.

13. O sistema libera o horário na agenda.

14. O sistema envia a confirmação do cancelamento.

15. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente desiste do cancelamento

Após visualizar o agendamento, a cliente responde:

> "Vou manter meu horário."

O sistema encerra o fluxo sem realizar alterações.

---

## FA002 – Cliente deseja reagendar

A IA identifica a intenção de reagendamento e direciona automaticamente para o **UC003 – Reagendar Atendimento**.

---

## FA003 – Cliente não confirma o cancelamento

Caso a cliente não confirme a operação, o sistema encerra o atendimento mantendo o agendamento.

---

## FA004 – Cliente interrompe a conversa

Caso a cliente deixe de responder, o fluxo é encerrado automaticamente após o tempo configurado.

---

# Exceções

## EX001 – Cliente não possui agendamento

O sistema informa:

> "Não encontrei nenhum agendamento ativo em seu nome."

---

## EX002 – Cancelamento fora do prazo permitido

O sistema informa:

> "Este atendimento não pode mais ser cancelado automaticamente. Entre em contato com a profissional."

---

## EX003 – Google Calendar indisponível

O sistema informa:

> "No momento não consegui acessar a agenda. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX004 – Erro ao cancelar o evento

O sistema mantém o agendamento ativo.

O erro é registrado.

A cliente é informada da falha.

---

## EX005 – Erro ao atualizar o Google Sheets

O sistema registra o erro para processamento posterior e informa que o cancelamento foi realizado com sucesso na agenda.

---

# Regras de Negócio

- RN006 – Um horário só pode possuir um atendimento.
- RN011 – O cancelamento automático somente será permitido até o prazo definido pela profissional.
- RN012 – Após o cancelamento, o horário deverá ser liberado automaticamente.
- RN013 – O motivo do cancelamento poderá ser registrado.
- RN023 – Sempre responder de forma educada.
- RN026 – Sempre consultar a agenda antes de cancelar um atendimento.
- RN040 – Nunca cancelar um atendimento sem validar sua existência na agenda.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Identificador do agendamento
- Confirmação da cliente
- Motivo do cancelamento (opcional)

---

## Processamento

- Identificação da cliente
- Localização do agendamento
- Validação das regras de cancelamento
- Cancelamento do evento
- Atualização do Google Sheets
- Cancelamento dos lembretes
- Liberação do horário

---

## Saída

- Agendamento cancelado
- Evento removido ou atualizado no Google Calendar
- Registro atualizado no Google Sheets
- Horário liberado
- Lembretes cancelados
- Mensagem de confirmação enviada

---

# User Story

**ID:** US004

**Título:** Cancelar atendimento

**Como** cliente,

**Quero** cancelar meu atendimento pelo WhatsApp,

**Para que** o horário seja liberado e eu não precise entrar em contato diretamente com a profissional.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar a cliente no Google Sheets. |
| WF003 | AI Agent | Interpretar a intenção da mensagem e identificar o cancelamento. |
| WF004 | Buscar Agendamento | Localizar o agendamento ativo no Google Calendar. |
| WF005 | Validar Regras de Cancelamento | Verificar prazo, políticas e necessidade de confirmação. |
| WF006 | Cancelar Agendamento | Remover ou atualizar o evento no Google Calendar. |
| WF007 | Atualizar Registro | Registrar o cancelamento no Google Sheets. |
| WF008 | Cancelar Lembretes | Cancelar os lembretes automáticos do atendimento. |
| WF009 | Liberar Horário | Disponibilizar novamente o horário para novos agendamentos. |
| WF010 | Enviar Confirmação | Enviar a confirmação do cancelamento pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de cancelamento

**Dado que** a cliente envie uma mensagem solicitando o cancelamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de cancelamento.

---

### CA002 – Identificar a cliente

**Dado que** uma mensagem tenha sido recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar a cliente.

---

### CA003 – Localizar o agendamento

**Dado que** a cliente possua um atendimento agendado,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá localizar o evento correspondente.

---

### CA004 – Solicitar confirmação

**Dado que** o agendamento tenha sido localizado,

**Quando** o sistema apresentar os dados do atendimento,

**Então** deverá solicitar a confirmação antes de realizar o cancelamento.

---

### CA005 – Validar regras de cancelamento

**Dado que** a cliente confirme o cancelamento,

**Quando** o sistema iniciar o processo,

**Então** deverá validar as regras de cancelamento configuradas.

---

### CA006 – Cancelar evento

**Dado que** o cancelamento seja permitido,

**Quando** o processo for confirmado,

**Então** o sistema deverá cancelar ou atualizar o evento no Google Calendar.

---

### CA007 – Atualizar registro

**Dado que** o evento tenha sido cancelado,

**Quando** o processo for concluído,

**Então** o sistema deverá atualizar o Google Sheets.

---

### CA008 – Cancelar lembretes

**Dado que** o atendimento tenha sido cancelado,

**Quando** o processo for concluído,

**Então** todos os lembretes automáticos deverão ser cancelados.

---

### CA009 – Liberar horário

**Dado que** o atendimento tenha sido cancelado,

**Quando** o evento for removido da agenda,

**Então** o horário deverá ficar disponível para novos agendamentos.

---

### CA010 – Enviar confirmação

**Dado que** o cancelamento tenha sido concluído,

**Quando** o processo terminar,

**Então** a cliente deverá receber uma mensagem confirmando o cancelamento.

---

### CA011 – Tratar cancelamento fora do prazo

**Dado que** o prazo para cancelamento automático tenha expirado,

**Quando** a cliente solicitar o cancelamento,

**Então** o sistema deverá informar que a operação não pode ser realizada automaticamente.

---

### CA012 – Tratar ausência de agendamento

**Dado que** a cliente não possua agendamento ativo,

**Quando** o sistema realizar a consulta,

**Então** deverá informar que não foi encontrado nenhum atendimento.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Não cancelar atendimento sem validação

**Dado que** a cliente solicite um cancelamento,

**Quando** a IA responder,

**Então** somente deverá cancelar o atendimento após validar sua existência no Google Calendar e aplicar todas as regras de negócio.
