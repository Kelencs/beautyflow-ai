# **UC006 – Confirmar Agendamento**

---

# Objetivo

Permitir que a cliente confirme sua presença em um atendimento previamente agendado por meio do WhatsApp, atualizando automaticamente o status do atendimento e registrando a confirmação no sistema.

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

---

# Pré-condições

- A cliente deve possuir um agendamento ativo.
- O atendimento deve estar dentro do período configurado para confirmação.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O Google Calendar deve estar sincronizado.
- O Google Sheets deve estar acessível.
- O AI Agent deve estar operacional.

---

# Fluxo Principal

1. O sistema envia um lembrete automático para a cliente.
2. A cliente responde confirmando sua presença.
3. A WhatsApp Cloud API encaminha a mensagem ao Webhook do n8n.
4. O Workflow de Recebimento processa a mensagem.
5. O AI Agent identifica a intenção **Confirmar Agendamento**.
6. O sistema localiza o agendamento da cliente.
7. O sistema valida se o atendimento ainda está ativo.
8. O sistema atualiza o status do atendimento para **Confirmado**.
9. O sistema atualiza o Google Calendar.
10. O sistema atualiza o Google Sheets.
11. O sistema envia uma mensagem confirmando que a presença foi registrada.
12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente responde "Sim"

O sistema interpreta a resposta como confirmação e continua o fluxo principal.

---

## FA002 – Cliente utiliza botão "Confirmar"

O sistema registra imediatamente a confirmação.

---

## FA003 – Cliente deseja reagendar

O AI Agent identifica a intenção e direciona automaticamente para o **UC003 – Reagendar Atendimento**.

---

## FA004 – Cliente deseja cancelar

O AI Agent identifica a intenção e direciona automaticamente para o **UC004 – Cancelar Atendimento**.

---

## FA005 – Cliente não responde

Após o tempo configurado, o sistema poderá enviar um novo lembrete ou marcar o atendimento como **Aguardando Confirmação**, conforme as regras definidas.

---

# Exceções

## EX001 – Agendamento não encontrado

O sistema informa:

> "Não encontrei nenhum agendamento ativo para confirmação."

---

## EX002 – Atendimento já confirmado

O sistema informa:

> "Seu atendimento já está confirmado."

---

## EX003 – Atendimento cancelado

O sistema informa:

> "Este atendimento foi cancelado anteriormente."

---

## EX004 – Google Calendar indisponível

O sistema registra o erro e informa que a confirmação foi recebida, mas ocorreu um problema na atualização da agenda.

---

## EX005 – Erro ao atualizar o Google Sheets

O sistema registra o erro para processamento posterior.

---

# Regras de Negócio

- RN006 – Um atendimento só pode ser confirmado se estiver ativo.
- RN017 – Apenas um atendimento pode ser confirmado por vez.
- RN018 – O status do atendimento deve ser atualizado para **Confirmado**.
- RN019 – O histórico da confirmação deve ser registrado.
- RN023 – Sempre responder de forma educada.
- RN026 – Sempre consultar a agenda antes de atualizar o status.
- RN042 – Uma confirmação não pode ser registrada duas vezes.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Mensagem de confirmação
- Identificador do agendamento

---

## Processamento

- Identificação da cliente
- Localização do agendamento
- Validação do status atual
- Atualização do status
- Atualização da agenda
- Atualização do histórico

---

## Saída

- Status atualizado para **Confirmado**
- Google Calendar atualizado
- Google Sheets atualizado
- Mensagem de confirmação enviada

---

# User Story

**ID:** US006

**Título:** Confirmar agendamento

**Como** cliente,

**Quero** confirmar minha presença pelo WhatsApp,

**Para que** a profissional saiba que comparecerei ao atendimento.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar a cliente. |
| WF003 | AI Agent | Identificar a intenção de confirmação. |
| WF004 | Buscar Agendamento | Localizar o atendimento no Google Calendar. |
| WF005 | Validar Status | Verificar se o atendimento pode ser confirmado. |
| WF006 | Atualizar Google Calendar | Atualizar o status do evento. |
| WF007 | Atualizar Google Sheets | Registrar a confirmação do atendimento. |
| WF008 | Registrar Histórico | Salvar a confirmação para auditoria. |
| WF009 | Enviar Confirmação | Enviar mensagem confirmando o registro da presença. |

---

# Critérios de Aceite

### CA001 – Receber confirmação

**Dado que** a cliente responda ao lembrete enviado,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de confirmação.

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

### CA004 – Validar status

**Dado que** o atendimento tenha sido localizado,

**Quando** o sistema iniciar a confirmação,

**Então** deverá verificar se o atendimento está ativo.

---

### CA005 – Atualizar status

**Dado que** o atendimento esteja ativo,

**Quando** a confirmação for realizada,

**Então** o sistema deverá alterar o status para **Confirmado**.

---

### CA006 – Atualizar Google Calendar

**Dado que** o status tenha sido alterado,

**Quando** a confirmação for concluída,

**Então** o Google Calendar deverá ser atualizado.

---

### CA007 – Atualizar Google Sheets

**Dado que** a confirmação tenha sido registrada,

**Quando** o processo for concluído,

**Então** o Google Sheets deverá ser atualizado.

---

### CA008 – Registrar histórico

**Dado que** a confirmação tenha sido realizada,

**Quando** o processo terminar,

**Então** o sistema deverá registrar o histórico da confirmação.

---

### CA009 – Enviar mensagem de confirmação

**Dado que** a confirmação tenha sido concluída,

**Quando** o processo finalizar,

**Então** a cliente deverá receber uma mensagem confirmando que sua presença foi registrada.

---

### CA010 – Tratar agendamento inexistente

**Dado que** a cliente não possua um agendamento ativo,

**Quando** a confirmação for solicitada,

**Então** o sistema deverá informar que nenhum atendimento foi encontrado.

---

### CA011 – Impedir confirmação duplicada

**Dado que** o atendimento já esteja confirmado,

**Quando** uma nova confirmação for recebida,

**Então** o sistema deverá informar que a confirmação já foi registrada.

---

### CA012 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA013 – Utilizar linguagem cordial

**Dado que** a IA responda à cliente,

**Quando** enviar qualquer mensagem,

**Então** deverá utilizar linguagem clara, cordial e profissional.

---

### CA014 – Atualizar os sistemas integrados

**Dado que** a confirmação seja concluída,

**Quando** o fluxo terminar,

**Então** Google Calendar e Google Sheets deverão permanecer sincronizados com o status atualizado do atendimento.
