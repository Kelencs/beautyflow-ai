# US006 – Confirmar Agendamento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US006 |
| **Título** | Confirmar Agendamento |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Alta |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC006 – Confirmar Agendamento |

---

# Descrição

Como cliente,

Quero receber uma confirmação do meu agendamento pelo WhatsApp,

Para que eu tenha certeza de que meu horário foi reservado corretamente e possa consultar os detalhes do atendimento.

---

# Objetivo

Confirmar automaticamente o agendamento realizado pela cliente, enviando todas as informações do atendimento e garantindo que os dados registrados no sistema estejam consistentes.

---

# Valor de Negócio

O envio automático da confirmação reduz dúvidas, evita retrabalho, melhora a experiência da cliente e aumenta a confiabilidade do sistema de agendamentos.

---

# Regras de Negócio Relacionadas

- RN001 – Toda confirmação deverá ocorrer somente após a criação do evento no Google Calendar.
- RN002 – O Google Calendar será a fonte oficial da agenda.
- RN003 – O Google Sheets deverá estar atualizado antes do envio da confirmação.
- RN004 – A confirmação deverá conter todas as informações do atendimento.
- RN005 – Caso ocorra erro durante o cadastro do agendamento, nenhuma confirmação deverá ser enviada.
- RN006 – Cada agendamento deverá gerar apenas uma confirmação.
- RN007 – A confirmação deverá ser registrada em log.

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

- WF001 – Receber Confirmação do Agendamento
- WF002 – Validar Evento no Google Calendar
- WF003 – Validar Registro no Google Sheets
- WF004 – Montar Mensagem de Confirmação
- WF005 – Enviar Confirmação pelo WhatsApp
- WF006 – Registrar Logs

---

# Fluxo da User Story

1. O agendamento é concluído com sucesso.
2. O sistema valida a criação do evento no Google Calendar.
3. O sistema verifica se o Google Sheets foi atualizado.
4. O sistema monta a mensagem de confirmação.
5. O sistema envia a confirmação pelo WhatsApp.
6. O sistema registra o envio nos logs.
7. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Validar agendamento

**Dado que** um agendamento tenha sido realizado,

**Quando** o processo for concluído,

**Então** o sistema deverá validar que o evento existe no Google Calendar.

---

## CA002 – Validar cadastro

**Dado que** o evento exista,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá verificar se o agendamento foi registrado corretamente.

---

## CA003 – Enviar confirmação

**Dado que** todas as validações tenham sido concluídas com sucesso,

**Quando** o sistema finalizar o processamento,

**Então** deverá enviar automaticamente uma mensagem de confirmação pelo WhatsApp.

---

## CA004 – Informações da confirmação

**Dado que** a confirmação seja enviada,

**Quando** a cliente receber a mensagem,

**Então** deverão ser apresentados:

- Nome da cliente;
- Serviço agendado;
- Data;
- Horário;
- Duração prevista;
- Nome da profissional;
- Mensagem de confirmação.

---

## CA005 – Não enviar confirmação em caso de erro

**Dado que** ocorra falha no cadastro do agendamento,

**Quando** o sistema detectar a inconsistência,

**Então** nenhuma confirmação deverá ser enviada.

---

## CA006 – Evitar confirmações duplicadas

**Dado que** a confirmação já tenha sido enviada,

**Quando** o workflow for executado novamente,

**Então** o sistema não deverá enviar uma nova confirmação.

---

## CA007 – Registrar envio

**Dado que** a confirmação seja enviada,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a data, hora e status do envio.

---

## CA008 – Registrar falhas

**Dado que** ocorra erro durante o envio pelo WhatsApp,

**Quando** o sistema detectar a falha,

**Então** deverá registrar o erro e permitir nova tentativa.

---

## CA009 – Linguagem cordial

**Dado que** a mensagem seja enviada,

**Quando** a cliente receber a confirmação,

**Então** a comunicação deverá ser clara, objetiva, amigável e profissional.

---

## CA010 – Integridade dos dados

**Dado que** a confirmação seja enviada,

**Quando** a cliente consultar as informações,

**Então** todos os dados deverão ser exatamente iguais aos registrados no Google Calendar e Google Sheets.

---

# Requisitos Funcionais Relacionados

- RF001 – Validar agendamento.
- RF002 – Consultar Google Calendar.
- RF003 – Consultar Google Sheets.
- RF004 – Gerar mensagem de confirmação.
- RF005 – Enviar confirmação pelo WhatsApp.
- RF006 – Registrar logs do envio.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – A confirmação deverá ser enviada em até 10 segundos após a conclusão do agendamento.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as operações deverão ser registradas em log.
- RNF005 – O sistema deverá garantir consistência entre Google Calendar, Google Sheets e WhatsApp.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| ID do Agendamento | Sim |
| Nome da Cliente | Sim |
| Serviço | Sim |
| Data | Sim |
| Horário | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Mensagem de Confirmação | WhatsApp |
| Registro de Envio | Logs |
| Status da Confirmação | Google Sheets (opcional) |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O evento existir no Google Calendar.
- O Google Sheets estiver atualizado.
- A confirmação for enviada corretamente pelo WhatsApp.
- Não ocorrerem confirmações duplicadas.
- Todos os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story complementa a **US001 – Agendar Atendimento**, sendo executada automaticamente após a criação do agendamento.
- A confirmação deverá utilizar um modelo padronizado de mensagem para manter consistência na comunicação com as clientes.
- Em versões futuras, a confirmação poderá incluir localização do salão, instruções pré-atendimento, políticas de cancelamento e links para reagendamento ou cancelamento.
- O status da confirmação poderá ser utilizado futuramente para geração de indicadores, como taxa de entrega e taxa de leitura das mensagens enviadas pelo WhatsApp.
