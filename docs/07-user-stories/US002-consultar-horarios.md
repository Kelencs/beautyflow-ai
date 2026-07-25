# US002 – Consultar Horários Disponíveis

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US002 |
| **Título** | Consultar Horários Disponíveis |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Alta |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC002 – Consultar Horários Disponíveis |

---

# Descrição

Como cliente,

Quero consultar os horários disponíveis da agenda pelo WhatsApp,

Para que eu possa escolher a melhor data e horário para realizar meu atendimento.

---

# Objetivo

Permitir que a cliente consulte, em tempo real, os horários livres da agenda da profissional antes de realizar um agendamento.

---

# Valor de Negócio

Disponibilizar os horários livres automaticamente reduz o tempo de atendimento manual, melhora a experiência da cliente e evita conflitos de agenda.

---

# Regras de Negócio Relacionadas

- RN001 – O Google Calendar será a fonte oficial da agenda.
- RN002 – Apenas horários livres deverão ser apresentados.
- RN003 – Horários ocupados nunca deverão ser exibidos como disponíveis.
- RN004 – O sistema deverá considerar o horário comercial configurado.
- RN005 – Horários bloqueados deverão ser ignorados.
- RN006 – O sistema deverá respeitar a duração de cada serviço.
- RN007 – A disponibilidade deverá ser consultada em tempo real.

---

# Dependências

## Serviços

- WhatsApp Cloud API
- Google Calendar API
- OpenAI
- n8n

---

## Workflows

- WF001 – Receber Mensagem WhatsApp
- WF002 – Identificar Cliente
- WF003 – Identificar Intenção
- WF004 – Consultar Google Calendar
- WF005 – Calcular Horários Livres
- WF006 – Enviar Horários Disponíveis
- WF007 – Registrar Logs

---

# Fluxo da User Story

1. A cliente solicita horários disponíveis.
2. O sistema identifica a intenção da mensagem.
3. O sistema consulta o Google Calendar.
4. O sistema verifica os eventos existentes.
5. O sistema calcula os horários livres.
6. O sistema organiza os horários por data.
7. O sistema envia a lista de horários disponíveis pelo WhatsApp.
8. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Receber solicitação

**Dado que** a cliente envie uma mensagem solicitando horários,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente a consulta da agenda.

---

## CA002 – Consultar agenda

**Dado que** a solicitação seja válida,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá recuperar todos os eventos do período solicitado.

---

## CA003 – Calcular disponibilidade

**Dado que** os eventos tenham sido recuperados,

**Quando** o sistema processar a agenda,

**Então** deverá identificar somente os horários livres.

---

## CA004 – Exibir horários

**Dado que** existam horários disponíveis,

**Quando** a consulta terminar,

**Então** o sistema deverá apresentar apenas horários livres.

---

## CA005 – Não exibir horários ocupados

**Dado que** existam horários reservados,

**Quando** a disponibilidade for apresentada,

**Então** horários ocupados não deverão ser exibidos.

---

## CA006 – Considerar duração do serviço

**Dado que** o serviço tenha duração específica,

**Quando** calcular os horários disponíveis,

**Então** o sistema deverá considerar o tempo necessário para sua execução.

---

## CA007 – Agenda sem disponibilidade

**Dado que** não existam horários livres,

**Quando** a consulta for concluída,

**Então** o sistema deverá informar que não há disponibilidade e sugerir outra data.

---

## CA008 – Atualização em tempo real

**Dado que** outro agendamento seja realizado,

**Quando** uma nova consulta ocorrer,

**Então** os horários apresentados deverão refletir a situação atual da agenda.

---

## CA009 – Registrar logs

**Dado que** o processo seja executado,

**Quando** houver sucesso ou erro,

**Então** todas as operações deverão ser registradas para auditoria.

---

## CA010 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** responder à cliente,

**Então** deverá utilizar linguagem clara, objetiva e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens pelo WhatsApp.
- RF002 – Interpretar intenção da cliente.
- RF003 – Consultar Google Calendar.
- RF004 – Calcular horários disponíveis.
- RF005 – Enviar horários pelo WhatsApp.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O tempo máximo da consulta deverá ser de até 5 segundos.
- RNF002 – A disponibilidade da agenda deverá refletir dados em tempo real.
- RNF003 – Todas as comunicações deverão utilizar HTTPS.
- RNF004 – Todas as consultas deverão ser registradas em log.
- RNF005 – O sistema deverá suportar múltiplas consultas simultâneas.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Data desejada (opcional) | Não |
| Serviço (opcional) | Não |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Lista de horários disponíveis | WhatsApp |
| Registro da consulta | Logs |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow n8n estiver funcionando corretamente.
- O Google Calendar for consultado em tempo real.
- Apenas horários livres forem apresentados.
- Horários ocupados não forem exibidos.
- Todas as operações forem registradas em log.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta funcionalidade é utilizada pelo UC001 (Agendar Atendimento), UC003 (Reagendar Atendimento) e UC011 (Lista de Espera).
- O Google Calendar é a única fonte oficial para consulta de disponibilidade.
- O cálculo dos horários deverá considerar intervalos entre atendimentos, bloqueios de agenda, horários de almoço e a duração de cada serviço cadastrado.
