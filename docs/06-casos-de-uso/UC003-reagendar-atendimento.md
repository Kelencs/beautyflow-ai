# **UC003 – Reagendar Atendimento**

---

# Objetivo

Permitir que a cliente altere a data e/ou horário de um atendimento previamente agendado por meio do WhatsApp, garantindo a disponibilidade da agenda, a atualização dos registros e o envio de uma nova confirmação.

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
- Nail Designer (quando houver necessidade de intervenção manual)

---

# Pré-condições

- A cliente deve possuir um agendamento ativo.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O Google Calendar deve estar sincronizado.
- O Google Sheets deve estar acessível.
- O AI Agent deve estar operacional.
- Os horários de funcionamento devem estar configurados.

---

# Fluxo Principal

1. A cliente envia uma mensagem solicitando o reagendamento.

2. A WhatsApp Cloud API encaminha a mensagem ao Webhook do n8n.

3. O Workflow de Recebimento processa a mensagem.

4. O AI Agent identifica a intenção **Reagendar Atendimento**.

5. O sistema localiza o agendamento atual da cliente.

6. O sistema apresenta as informações do agendamento atual.

7. O sistema solicita a nova data ou horário desejado.

8. A cliente informa a nova data ou horário.

9. O sistema consulta o Google Calendar.

10. O sistema aplica as regras de negócio.

11. O sistema verifica a disponibilidade.

12. O sistema apresenta os horários disponíveis.

13. A cliente escolhe um novo horário.

14. O sistema atualiza o evento no Google Calendar.

15. O sistema atualiza o registro no Google Sheets.

16. O sistema atualiza os lembretes automáticos.

17. O sistema envia a confirmação do reagendamento.

18. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente não informa a nova data

O sistema pergunta:

> "Qual nova data você deseja?"

Após a resposta, o fluxo principal continua.

---

## FA002 – Cliente informa apenas o período

Exemplo:

> "Quinta à tarde."

O sistema consulta apenas os horários disponíveis para esse período.

---

## FA003 – Cliente deseja outro horário

O sistema realiza uma nova consulta e apresenta novas opções.

---

## FA004 – Cliente decide manter o horário atual

O sistema encerra o fluxo sem realizar alterações.

---

## FA005 – Cliente interrompe a conversa

Caso a cliente deixe de responder, o fluxo é encerrado automaticamente após o tempo configurado.

---

# Exceções

## EX001 – Cliente não possui agendamento

O sistema informa:

> "Não encontrei nenhum agendamento ativo em seu nome."

---

## EX002 – Google Calendar indisponível

O sistema informa:

> "No momento não consegui acessar a agenda. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX003 – Não existem horários disponíveis

O sistema apresenta as próximas datas disponíveis.

---

## EX004 – Erro ao atualizar o evento

O sistema mantém o agendamento atual.

O erro é registrado.

A cliente é informada da falha.

---

## EX005 – Limite de reagendamentos excedido

O sistema informa que o reagendamento não pode ser realizado automaticamente e orienta a cliente a entrar em contato com a profissional.

---

# Regras de Negócio

- RN006 – Um horário só pode possuir um atendimento.
- RN007 – Não permitir sobreposição de horários.
- RN008 – Cada serviço possui uma duração específica.
- RN009 – Deve existir intervalo entre atendimentos.
- RN010 – Sempre consultar o Google Calendar antes de confirmar.
- RN014 – O cliente poderá reagendar apenas uma vez (caso essa política seja adotada).
- RN015 – Após confirmar o reagendamento, o horário anterior deverá ser liberado automaticamente.
- RN023 – Sempre responder de forma educada.
- RN026 – Sempre consultar a agenda antes de responder.
- RN040 – Nunca confirmar um reagendamento sem validar a disponibilidade.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Identificador do agendamento
- Nova data desejada
- Novo horário desejado

---

## Processamento

- Identificação da cliente
- Localização do agendamento
- Consulta da agenda
- Aplicação das regras de negócio
- Atualização do evento
- Atualização do Google Sheets
- Atualização dos lembretes

---

## Saída

- Agendamento atualizado
- Evento atualizado no Google Calendar
- Registro atualizado no Google Sheets
- Lembretes atualizados
- Mensagem de confirmação enviada

---

# User Story

**ID:** US003

**Título:** Reagendar atendimento

**Como** cliente,

**Quero** alterar a data ou horário do meu atendimento pelo WhatsApp,

**Para que** eu possa adequar o agendamento à minha disponibilidade.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar a cliente no Google Sheets. |
| WF003 | AI Agent | Interpretar a intenção da mensagem e identificar o reagendamento. |
| WF004 | Buscar Agendamento | Localizar o agendamento atual da cliente no Google Calendar. |
| WF005 | Consultar Agenda | Consultar horários disponíveis para a nova data. |
| WF006 | Aplicar Regras de Negócio | Validar disponibilidade, horários e políticas de reagendamento. |
| WF007 | Atualizar Agendamento | Atualizar o evento existente no Google Calendar. |
| WF008 | Atualizar Registro | Atualizar os dados do agendamento no Google Sheets. |
| WF009 | Atualizar Lembretes | Reprogramar os lembretes automáticos do atendimento. |
| WF010 | Enviar Confirmação | Enviar a confirmação do reagendamento pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de reagendamento

**Dado que** a cliente envie uma mensagem solicitando um reagendamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de reagendamento.

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

### CA004 – Solicitar nova data ou horário

**Dado que** o agendamento tenha sido localizado,

**Quando** o fluxo continuar,

**Então** o sistema deverá solicitar a nova data ou horário desejado.

---

### CA005 – Consultar disponibilidade

**Dado que** a cliente informe a nova data,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá apresentar apenas horários disponíveis.

---

### CA006 – Respeitar horário de funcionamento

**Dado que** existam horários disponíveis,

**Quando** forem apresentados,

**Então** todos deverão respeitar o horário comercial configurado.

---

### CA007 – Respeitar intervalo entre atendimentos

**Dado que** exista intervalo mínimo configurado,

**Quando** os horários forem calculados,

**Então** o sistema deverá considerar esse intervalo.

---

### CA008 – Atualizar evento

**Dado que** a cliente escolha um novo horário,

**Quando** confirmar o reagendamento,

**Então** o sistema deverá atualizar o evento no Google Calendar.

---

### CA009 – Atualizar registro

**Dado que** o evento tenha sido atualizado,

**Quando** o processo for concluído,

**Então** o sistema deverá atualizar o Google Sheets.

---

### CA010 – Atualizar lembretes

**Dado que** o reagendamento tenha sido confirmado,

**Quando** o evento for atualizado,

**Então** os lembretes automáticos deverão ser reprogramados.

---

### CA011 – Enviar confirmação

**Dado que** o reagendamento tenha sido concluído,

**Quando** o processo terminar,

**Então** a cliente deverá receber uma mensagem contendo:

- Serviço;
- Nova data;
- Novo horário;
- Nome da profissional (quando aplicável).

---

### CA012 – Tratar indisponibilidade

**Dado que** não existam horários disponíveis,

**Quando** a consulta retornar vazia,

**Então** o sistema deverá informar a indisponibilidade e sugerir novas datas.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Não confirmar reagendamento sem validação

**Dado que** a cliente solicite um reagendamento,

**Quando** a IA responder,

**Então** somente deverá confirmar o reagendamento após validar a disponibilidade no Google Calendar.

