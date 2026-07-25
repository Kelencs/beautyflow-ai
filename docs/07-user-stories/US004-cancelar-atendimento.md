# US004 – Cancelar Atendimento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US004 |
| **Título** | Cancelar Atendimento |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Alta |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC004 – Cancelar Atendimento |

---

# Descrição

Como cliente,

Quero cancelar um atendimento pelo WhatsApp,

Para que eu possa liberar meu horário quando não puder comparecer ao atendimento agendado.

---

# Objetivo

Permitir que a cliente realize o cancelamento de um atendimento de forma totalmente automatizada, atualizando a agenda da profissional e liberando o horário para novos agendamentos ou para a Lista de Espera.

---

# Valor de Negócio

Automatizar o cancelamento reduz o trabalho manual da profissional, evita horários bloqueados desnecessariamente e aumenta a possibilidade de preencher vagas disponíveis através da Lista de Espera.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas atendimentos com status **Agendado** poderão ser cancelados.
- RN002 – O Google Calendar será a agenda oficial do sistema.
- RN003 – Todo cancelamento deverá atualizar o Google Sheets.
- RN004 – O sistema deverá registrar o motivo do cancelamento quando informado pela cliente.
- RN005 – O histórico de cancelamentos deverá ser mantido para auditoria.
- RN006 – O horário cancelado deverá ficar imediatamente disponível para novos agendamentos.
- RN007 – Caso exista Lista de Espera, o sistema poderá iniciar automaticamente o processo de oferta da vaga.
- RN008 – Após o cancelamento, a cliente deverá receber uma confirmação.

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
- WF005 – Confirmar Cancelamento
- WF006 – Remover Evento Google Calendar
- WF007 – Atualizar Google Sheets
- WF008 – Acionar Lista de Espera
- WF009 – Registrar Histórico
- WF010 – Enviar Confirmação

---

# Fluxo da User Story

1. A cliente envia uma mensagem solicitando o cancelamento.
2. O sistema identifica a intenção da mensagem.
3. O sistema localiza o agendamento ativo.
4. O sistema apresenta os dados do atendimento.
5. O sistema solicita a confirmação do cancelamento.
6. A cliente confirma a operação.
7. O sistema remove o evento do Google Calendar.
8. O sistema atualiza o Google Sheets.
9. O sistema registra o histórico do cancelamento.
10. O sistema verifica se existe Lista de Espera para aquele horário.
11. Caso exista, inicia automaticamente o UC011 – Lista de Espera.
12. O sistema envia uma confirmação pelo WhatsApp.
13. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Receber solicitação

**Dado que** a cliente envie uma solicitação de cancelamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de cancelamento.

---

## CA002 – Localizar agendamento

**Dado que** exista um agendamento ativo,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá localizar o atendimento correspondente.

---

## CA003 – Solicitar confirmação

**Dado que** o atendimento tenha sido localizado,

**Quando** o cancelamento for solicitado,

**Então** o sistema deverá solicitar uma confirmação antes de cancelar.

---

## CA004 – Cancelar atendimento

**Dado que** a cliente confirme o cancelamento,

**Quando** o sistema processar a solicitação,

**Então** deverá remover o evento do Google Calendar.

---

## CA005 – Atualizar Google Sheets

**Dado que** o evento tenha sido removido,

**Quando** o cancelamento for concluído,

**Então** o Google Sheets deverá ser atualizado com o status **Cancelado**.

---

## CA006 – Liberar horário

**Dado que** o cancelamento tenha sido concluído,

**Quando** a agenda for atualizada,

**Então** o horário deverá ficar disponível para novos agendamentos.

---

## CA007 – Acionar Lista de Espera

**Dado que** exista uma Lista de Espera ativa para aquele serviço ou horário,

**Quando** o cancelamento for concluído,

**Então** o sistema deverá iniciar automaticamente o fluxo do UC011 – Lista de Espera.

---

## CA008 – Registrar histórico

**Dado que** o cancelamento seja concluído,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a data, hora e demais informações do cancelamento para auditoria.

---

## CA009 – Registrar motivo

**Dado que** a cliente informe o motivo do cancelamento,

**Quando** o sistema receber essa informação,

**Então** deverá armazená-la no histórico do atendimento.

---

## CA010 – Enviar confirmação

**Dado que** o cancelamento tenha sido realizado,

**Quando** o processo for concluído,

**Então** o sistema deverá enviar uma mensagem de confirmação contendo:

- Nome da cliente;
- Serviço cancelado;
- Data;
- Horário;
- Mensagem confirmando o cancelamento.

---

## CA011 – Cancelamento interrompido

**Dado que** a cliente desista do cancelamento,

**Quando** responder negativamente à confirmação,

**Então** o sistema deverá manter o agendamento original sem alterações.

---

## CA012 – Tratar falhas

**Dado que** ocorra erro durante a remoção do evento ou atualização do cadastro,

**Quando** o sistema identificar a falha,

**Então** deverá informar a cliente, registrar o erro e manter a consistência dos dados.

---

## CA013 – Linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar intenção de cancelamento.
- RF003 – Localizar agendamento.
- RF004 – Solicitar confirmação do cancelamento.
- RF005 – Remover evento do Google Calendar.
- RF006 – Atualizar Google Sheets.
- RF007 – Registrar histórico.
- RF008 – Acionar Lista de Espera.
- RF009 – Enviar confirmação do cancelamento.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O cancelamento deverá ser concluído em até 5 segundos.
- RNF002 – O sistema deverá garantir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as operações deverão ser registradas em log.
- RNF005 – O sistema deverá manter consistência entre Google Calendar e Google Sheets.
- RNF006 – O histórico de cancelamentos deverá permanecer disponível para auditoria.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Identificação do Agendamento | Sim |
| Confirmação do Cancelamento | Sim |
| Motivo do Cancelamento | Não |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Evento removido | Google Calendar |
| Agendamento atualizado | Google Sheets |
| Histórico do cancelamento | Sistema |
| Confirmação | WhatsApp |
| Acionamento da Lista de Espera | n8n (quando aplicável) |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O evento for removido do Google Calendar.
- O Google Sheets for atualizado com status **Cancelado**.
- O horário voltar a ficar disponível.
- A Lista de Espera for acionada automaticamente quando aplicável.
- O histórico do cancelamento for registrado.
- A confirmação for enviada pelo WhatsApp.
- Os logs forem gravados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story complementa a **US001 – Agendar Atendimento** e a **US003 – Reagendar Atendimento**.
- O cancelamento deverá preservar o histórico do atendimento para auditoria e geração de relatórios.
- Caso exista uma cliente na **Lista de Espera (UC011)** compatível com o horário liberado, o sistema deverá iniciar automaticamente o fluxo de oferta da vaga.
- O Google Calendar deverá ser considerado a fonte oficial da disponibilidade da agenda, mantendo sincronização com o Google Sheets.
