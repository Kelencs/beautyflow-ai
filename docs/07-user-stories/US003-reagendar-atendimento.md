
# US003 – Reagendar Atendimento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US003 |
| **Título** | Reagendar Atendimento |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Alta |
| **Story Points** | 8 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC003 – Reagendar Atendimento |

---

# Descrição

Como cliente,

Quero reagendar um atendimento pelo WhatsApp,

Para que eu possa alterar a data ou horário do meu agendamento quando não puder comparecer no horário originalmente marcado.

---

# Objetivo

Permitir que a cliente altere um agendamento existente de forma totalmente automatizada, consultando a disponibilidade da agenda em tempo real e atualizando todas as informações necessárias no sistema.

---

# Valor de Negócio

Automatizar o reagendamento reduz o tempo gasto com atendimento manual, evita conflitos de agenda, melhora a experiência da cliente e mantém a agenda da profissional sempre atualizada.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas agendamentos com status **Agendado** poderão ser reagendados.
- RN002 – O novo horário deverá estar disponível no Google Calendar.
- RN003 – O Google Calendar será a agenda oficial do sistema.
- RN004 – Todo reagendamento deverá atualizar o Google Sheets.
- RN005 – O sistema deverá manter um histórico das alterações realizadas.
- RN006 – O serviço originalmente contratado deverá ser mantido, salvo solicitação da cliente.
- RN007 – O sistema deverá impedir conflitos de horários.
- RN008 – Após o reagendamento, deverá ser enviada uma nova confirmação pelo WhatsApp.

---

# Dependências

## Serviços

- WhatsApp Cloud API
- Google Calendar API
- Google Sheets API
- OpenAI
- n8n

---

## Workflows

- WF001 – Receber Mensagem WhatsApp
- WF002 – Identificar Cliente
- WF003 – Identificar Intenção
- WF004 – Localizar Agendamento
- WF005 – Consultar Disponibilidade
- WF006 – Atualizar Evento Google Calendar
- WF007 – Atualizar Google Sheets
- WF008 – Registrar Histórico
- WF009 – Enviar Confirmação

---

# Fluxo da User Story

1. A cliente envia uma mensagem solicitando o reagendamento.
2. O sistema identifica a intenção da mensagem.
3. O sistema localiza o agendamento existente.
4. O sistema consulta os horários disponíveis.
5. O sistema apresenta as opções disponíveis.
6. A cliente escolhe um novo horário.
7. O sistema valida novamente a disponibilidade.
8. O sistema atualiza o evento no Google Calendar.
9. O sistema atualiza o Google Sheets.
10. O sistema registra o histórico da alteração.
11. O sistema envia uma nova confirmação pelo WhatsApp.
12. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Receber solicitação

**Dado que** a cliente envie uma solicitação de reagendamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de reagendamento.

---

## CA002 – Localizar agendamento

**Dado que** exista um agendamento ativo para a cliente,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá localizar o atendimento correspondente.

---

## CA003 – Consultar disponibilidade

**Dado que** o agendamento tenha sido localizado,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá recuperar os horários disponíveis.

---

## CA004 – Exibir horários disponíveis

**Dado que** existam horários livres,

**Quando** a consulta for concluída,

**Então** o sistema deverá apresentar somente horários disponíveis.

---

## CA005 – Validar disponibilidade

**Dado que** a cliente escolha um novo horário,

**Quando** o sistema realizar a validação final,

**Então** deverá confirmar que o horário continua disponível.

---

## CA006 – Atualizar Google Calendar

**Dado que** o horário esteja disponível,

**Quando** a cliente confirmar o reagendamento,

**Então** o sistema deverá atualizar automaticamente o evento no Google Calendar.

---

## CA007 – Atualizar Google Sheets

**Dado que** o Google Calendar tenha sido atualizado,

**Quando** o processo continuar,

**Então** o sistema deverá atualizar os dados do agendamento no Google Sheets.

---

## CA008 – Enviar confirmação

**Dado que** o reagendamento tenha sido concluído,

**Quando** todas as atualizações forem realizadas,

**Então** o sistema deverá enviar uma confirmação contendo:

- Nome da cliente;
- Serviço;
- Nova data;
- Novo horário;
- Mensagem de confirmação.

---

## CA009 – Horário indisponível

**Dado que** o horário escolhido tenha sido ocupado durante o processo,

**Quando** a validação final ocorrer,

**Então** o sistema deverá informar a indisponibilidade e apresentar novas opções.

---

## CA010 – Cancelar reagendamento

**Dado que** a cliente desista do reagendamento,

**Quando** cancelar a operação,

**Então** o sistema deverá manter o agendamento original sem alterações.

---

## CA011 – Registrar histórico

**Dado que** o reagendamento seja concluído,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a alteração para auditoria.

---

## CA012 – Tratar falhas

**Dado que** ocorra erro durante a atualização do Google Calendar ou Google Sheets,

**Quando** o sistema identificar a falha,

**Então** deverá informar a cliente, registrar o erro e manter a integridade dos dados.

---

## CA013 – Linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar intenção de reagendamento.
- RF003 – Localizar agendamento existente.
- RF004 – Consultar disponibilidade da agenda.
- RF005 – Atualizar evento no Google Calendar.
- RF006 – Atualizar Google Sheets.
- RF007 – Enviar confirmação do reagendamento.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O tempo máximo para consultar a disponibilidade deverá ser de até 5 segundos.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as alterações deverão ser registradas em log.
- RNF005 – O sistema deverá garantir consistência entre Google Calendar e Google Sheets.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Identificação do Agendamento | Sim |
| Nova Data | Sim |
| Novo Horário | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Evento atualizado | Google Calendar |
| Agendamento atualizado | Google Sheets |
| Confirmação | WhatsApp |
| Registro da alteração | Logs |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O Google Calendar for atualizado.
- O Google Sheets for atualizado.
- O histórico do reagendamento for registrado.
- A confirmação for enviada pelo WhatsApp.
- Os logs forem gravados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story depende da implementação da **US001 – Agendar Atendimento**.
- Caso o horário solicitado não esteja disponível, o sistema deverá sugerir novas opções automaticamente.
- O reagendamento deverá preservar o serviço originalmente contratado, salvo solicitação da cliente.
- O histórico das alterações permitirá auditoria e rastreabilidade de todas as mudanças realizadas nos agendamentos.
