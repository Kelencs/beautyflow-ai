# US001 – Agendar Atendimento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US001 |
| **Título** | Agendar Atendimento |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Alta |
| **Story Points** | 8 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC001 – Agendar Atendimento |

---

# Descrição

Como cliente,

Quero agendar um atendimento pelo WhatsApp,

Para que eu possa reservar um horário de forma rápida, prática e sem precisar entrar em contato manualmente com a profissional.

---

# Objetivo

Permitir que o agendamento seja realizado de forma totalmente automatizada, consultando a disponibilidade da agenda em tempo real e registrando o compromisso no Google Calendar e no Google Sheets.

---

# Valor de Negócio

Esta funcionalidade reduz o tempo gasto com atendimento manual, evita conflitos de agenda, melhora a experiência da cliente e aumenta a produtividade da nail designer.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas horários livres poderão ser agendados.
- RN002 – O Google Calendar será a agenda oficial do sistema.
- RN003 – Todo agendamento deverá ser registrado no Google Sheets.
- RN004 – O sistema deverá confirmar o agendamento pelo WhatsApp.
- RN005 – O horário somente será reservado após confirmação da cliente.
- RN006 – Cada cliente poderá possuir múltiplos agendamentos ativos.
- RN007 – O sistema deverá impedir conflitos de horário.
- RN008 – Todo agendamento deverá possuir data, horário, serviço e identificação da cliente.

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
- WF003 – Consultar Agenda
- WF004 – Consultar Serviços
- WF005 – Criar Evento Google Calendar
- WF006 – Registrar Agendamento
- WF007 – Enviar Confirmação
- WF008 – Registrar Logs

---

# Fluxo da User Story

1. A cliente envia uma mensagem solicitando um agendamento.

2. O sistema identifica a intenção da mensagem.

3. O sistema consulta a disponibilidade da agenda.

4. O sistema apresenta os horários disponíveis.

5. A cliente escolhe um horário.

6. O sistema valida a disponibilidade novamente.

7. O sistema cria o evento no Google Calendar.

8. O sistema registra o agendamento no Google Sheets.

9. O sistema envia uma confirmação pelo WhatsApp.

10. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Iniciar atendimento

**Dado que** a cliente envie uma mensagem solicitando um agendamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de agendamento.

---

## CA002 – Identificar cliente

**Dado que** uma mensagem seja recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar ou cadastrar a cliente.

---

## CA003 – Consultar agenda

**Dado que** a cliente deseje realizar um agendamento,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá recuperar apenas os horários disponíveis.

---

## CA004 – Exibir horários disponíveis

**Dado que** existam horários livres,

**Quando** a consulta for concluída,

**Então** o sistema deverá apresentar somente horários disponíveis.

---

## CA005 – Selecionar horário

**Dado que** a cliente escolha um horário,

**Quando** confirmar sua escolha,

**Então** o sistema deverá validar novamente a disponibilidade.

---

## CA006 – Criar evento

**Dado que** o horário esteja disponível,

**Quando** a confirmação for realizada,

**Então** o sistema deverá criar automaticamente um evento no Google Calendar.

---

## CA007 – Registrar agendamento

**Dado que** o evento tenha sido criado,

**Quando** o processo continuar,

**Então** o sistema deverá registrar o agendamento no Google Sheets.

---

## CA008 – Enviar confirmação

**Dado que** o agendamento tenha sido concluído,

**Quando** todas as etapas forem executadas,

**Então** o sistema deverá enviar uma confirmação pelo WhatsApp contendo:

- Nome da cliente;
- Serviço;
- Data;
- Horário;
- Mensagem de confirmação.

---

## CA009 – Evitar conflitos

**Dado que** outro agendamento tenha ocupado o horário escolhido,

**Quando** a validação final ocorrer,

**Então** o sistema deverá impedir o agendamento e oferecer novos horários.

---

## CA010 – Registrar auditoria

**Dado que** o processo seja executado,

**Quando** ocorrer sucesso ou erro,

**Então** o sistema deverá registrar logs para auditoria.

---

## CA011 – Tratamento de erro

**Dado que** ocorra falha na comunicação com o Google Calendar,

**Quando** o evento não puder ser criado,

**Então** o sistema deverá informar a cliente e registrar o erro.

---

## CA012 – Linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar a intenção da cliente.
- RF003 – Consultar horários disponíveis.
- RF004 – Criar agendamento.
- RF005 – Registrar agendamento.
- RF006 – Enviar confirmação.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O tempo máximo para consultar a agenda deverá ser de até 5 segundos.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá ocorrer utilizando HTTPS.
- RNF004 – Todas as operações deverão ser registradas em log.
- RNF005 – O sistema deverá suportar múltiplos atendimentos simultâneos.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Nome da Cliente | Sim |
| Serviço | Sim |
| Data | Sim |
| Horário | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Evento criado | Google Calendar |
| Agendamento | Google Sheets |
| Confirmação | WhatsApp |
| Log | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite estiverem aprovados.
- Todos os testes funcionais forem executados com sucesso.
- O Workflow n8n estiver funcionando.
- O evento for criado corretamente no Google Calendar.
- O Google Sheets estiver atualizado.
- A confirmação for enviada pelo WhatsApp.
- Os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta é uma das funcionalidades centrais do BeautyFlow AI.
- Todos os demais casos de uso relacionados ao agendamento (reagendamento, cancelamento, lembretes e lista de espera) dependem desta User Story.
- O fluxo deverá ser implementado utilizando n8n como orquestrador, Google Calendar como agenda oficial, Google Sheets como base de dados inicial e WhatsApp Cloud API como canal de comunicação com a cliente.
