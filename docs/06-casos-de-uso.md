# **UC001 – Agendar Atendimento**

---

# Objetivo

Permitir que a cliente realize o agendamento de um serviço por meio do WhatsApp, de forma automática, consultando a disponibilidade da agenda, aplicando as regras de negócio e registrando o atendimento nos sistemas integrados.

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

- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar configurado no n8n.
- O Google Calendar deve estar conectado.
- O Google Sheets deve estar configurado.
- O catálogo de serviços deve estar cadastrado.
- Os horários de funcionamento devem estar configurados.
- O AI Agent deve estar operacional.
- O cliente deve possuir um número válido de WhatsApp.

---

# Fluxo Principal

1. A cliente envia uma mensagem pelo WhatsApp solicitando um agendamento.

2. A WhatsApp Cloud API encaminha a mensagem para o Webhook do n8n.

3. O Workflow de Recebimento processa a mensagem.

4. O AI Agent identifica a intenção da cliente como **Agendar Atendimento**.

5. O sistema identifica se a cliente já possui cadastro.

6. Caso a cliente não exista, o sistema realiza o cadastro automaticamente.

7. O sistema solicita o serviço desejado.

8. A cliente informa o serviço.

9. O sistema consulta a duração do serviço.

10. O sistema consulta o Google Calendar.

11. O sistema aplica as regras de negócio.

12. O sistema verifica a disponibilidade da agenda.

13. Caso existam horários disponíveis, o sistema apresenta as opções.

14. A cliente escolhe um horário.

15. O sistema cria o evento no Google Calendar.

16. O sistema registra o atendimento no Google Sheets.

17. O sistema agenda os lembretes automáticos.

18. O sistema envia a confirmação do agendamento.

19. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente não informa o serviço

O sistema pergunta:

> "Qual serviço você deseja agendar?"

Após a resposta, o fluxo principal continua.

---

## FA002 – Cliente deseja consultar preços

O sistema apresenta o catálogo de serviços e seus respectivos valores.

Após a escolha do serviço, o fluxo principal continua.

---

## FA003 – Cliente deseja outra data

O sistema consulta novamente a agenda considerando a nova data.

---

## FA004 – Cliente deseja outro horário

O sistema realiza uma nova consulta e apresenta outras opções disponíveis.

---

## FA005 – Cliente interrompe o atendimento

Caso a cliente deixe de responder, o fluxo é encerrado após o tempo configurado.

---

# Exceções

## EX001 – Cliente não possui WhatsApp válido

O sistema encerra o atendimento.

---

## EX002 – Google Calendar indisponível

O sistema informa:

> "No momento não consegui acessar a agenda. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX003 – Não existem horários disponíveis

O sistema apresenta as próximas datas livres.

---

## EX004 – Serviço inexistente

O sistema informa que o serviço não foi encontrado e apresenta o catálogo disponível.

---

## EX005 – Erro ao criar o evento

O sistema não confirma o agendamento.

O erro é registrado.

A cliente é informada da falha.

---

# Regras de Negócio

- RN006 – Um horário só pode possuir um atendimento.
- RN007 – Não permitir sobreposição de horários.
- RN008 – Cada serviço possui uma duração específica.
- RN009 – Deve existir intervalo entre atendimentos.
- RN010 – Sempre consultar o Google Calendar antes de confirmar.
- RN016 – Cadastrar automaticamente novos clientes.
- RN023 – Sempre responder de forma educada.
- RN024 – Nunca inventar preços.
- RN025 – Nunca inventar horários.
- RN026 – Sempre consultar a agenda antes de responder.
- RN040 – Nunca confirmar um horário sem consultar a agenda.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Nome da cliente (quando disponível)
- Serviço desejado
- Data desejada
- Horário desejado

---

## Processamento

- Identificação da cliente
- Cadastro automático
- Consulta do catálogo de serviços
- Consulta da duração
- Consulta ao Google Calendar
- Aplicação das regras de negócio
- Criação do evento
- Registro do atendimento
- Programação dos lembretes

---

## Saída

- Agendamento confirmado
- Evento criado no Google Calendar
- Registro no Google Sheets
- Lembretes programados
- Mensagem de confirmação enviada

---

# User Story

**ID:** US001

**Título:** Agendar atendimento pelo WhatsApp

**Como** cliente,

**Quero** agendar um atendimento diretamente pelo WhatsApp,

**Para que** eu possa escolher um horário disponível sem precisar falar manualmente com a profissional.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar ou cadastrar automaticamente a cliente. |
| WF003 | AI Agent | Interpretar a intenção da mensagem e extrair informações. |
| WF004 | Consultar Serviços | Obter dados do serviço (duração, preço e intervalo). |
| WF005 | Consultar Agenda | Consultar horários disponíveis no Google Calendar. |
| WF006 | Aplicar Regras de Negócio | Validar disponibilidade, horário comercial e demais regras. |
| WF007 | Criar Agendamento | Criar o evento no Google Calendar. |
| WF008 | Registrar Atendimento | Registrar o agendamento no Google Sheets. |
| WF009 | Programar Lembretes | Configurar os lembretes automáticos do atendimento. |
| WF010 | Enviar Confirmação | Enviar a confirmação do agendamento pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de agendamento

**Dado que** a cliente envie uma mensagem solicitando um agendamento,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de agendamento.

---

### CA002 – Identificar a cliente

**Dado que** uma mensagem tenha sido recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar ou cadastrar automaticamente a cliente.

---

### CA003 – Solicitar o serviço

**Dado que** a cliente ainda não informou o serviço,

**Quando** o fluxo iniciar,

**Então** o sistema deverá solicitar o serviço desejado.

---

### CA004 – Consultar disponibilidade

**Dado que** a cliente tenha escolhido um serviço,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá apresentar apenas horários disponíveis.

---

### CA005 – Respeitar horário de funcionamento

**Dado que** existam horários disponíveis,

**Quando** forem apresentados à cliente,

**Então** todos deverão respeitar o horário de funcionamento configurado.

---

### CA006 – Respeitar intervalo entre atendimentos

**Dado que** exista um intervalo mínimo configurado,

**Quando** forem calculados os horários disponíveis,

**Então** o sistema deverá considerar esse intervalo.

---

### CA007 – Criar evento

**Dado que** a cliente escolha um horário disponível,

**Quando** confirmar o agendamento,

**Então** o sistema deverá criar um evento no Google Calendar.

---

### CA008 – Registrar atendimento

**Dado que** o evento tenha sido criado,

**Quando** o processo for concluído,

**Então** o sistema deverá registrar o atendimento no Google Sheets.

---

### CA009 – Programar lembretes

**Dado que** o atendimento tenha sido confirmado,

**Quando** o evento for criado,

**Então** os lembretes automáticos deverão ser programados.

---

### CA010 – Enviar confirmação

**Dado que** o agendamento tenha sido concluído,

**Quando** o processo terminar,

**Então** a cliente deverá receber uma mensagem contendo:

- Serviço agendado;
- Data;
- Horário;
- Nome da profissional (quando aplicável).

---

### CA011 – Tratar indisponibilidade

**Dado que** não existam horários disponíveis,

**Quando** a consulta retornar vazia,

**Então** o sistema deverá informar a indisponibilidade e sugerir novas datas.

---

### CA012 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA013 – Não confirmar horários sem validação

**Dado que** a cliente solicite um horário,

**Quando** a IA responder,

**Então** somente deverá confirmar o atendimento após validar a disponibilidade no Google Calendar.


# **UC002 – Consultar Horários Disponíveis**

---

# Objetivo

Permitir que a cliente consulte os horários disponíveis para um determinado serviço por meio do WhatsApp, considerando a disponibilidade da agenda da profissional, a duração do serviço e as regras de negócio definidas pelo sistema.

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

- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O Google Calendar deve estar sincronizado.
- O Google Sheets deve estar acessível.
- O catálogo de serviços deve estar cadastrado.
- O AI Agent deve estar operacional.
- Os horários de funcionamento da profissional devem estar configurados.

---

# Fluxo Principal

1. A cliente envia uma mensagem perguntando sobre horários disponíveis.

2. A WhatsApp Cloud API encaminha a mensagem para o Webhook do n8n.

3. O Workflow de Recebimento processa a mensagem.

4. O AI Agent identifica a intenção **Consultar Horários**.

5. O sistema verifica se a cliente informou o serviço desejado.

6. Caso o serviço não tenha sido informado, o sistema solicita essa informação.

7. A cliente informa o serviço.

8. O sistema consulta a duração do serviço.

9. O sistema consulta o Google Calendar.

10. O sistema aplica as regras de negócio.

11. O sistema identifica os horários disponíveis.

12. O sistema monta uma lista com os horários livres.

13. O sistema registra a consulta (opcional).

14. O sistema envia a lista de horários disponíveis pelo WhatsApp.

15. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente não informa o serviço

O sistema pergunta:

> "Qual serviço você deseja agendar?"

Após a resposta da cliente, o fluxo principal continua.

---

## FA002 – Cliente informa apenas a data

O sistema pergunta qual serviço deseja consultar.

Após a resposta, o fluxo principal continua.

---

## FA003 – Cliente solicita horários para outro dia

O sistema realiza uma nova consulta considerando a nova data informada.

---

## FA004 – Cliente deseja consultar outro serviço

O sistema consulta novamente a agenda utilizando a duração do novo serviço.

---

## FA005 – Cliente encerra a conversa

Caso a cliente deixe de responder, o fluxo é encerrado automaticamente após o tempo configurado.

---

# Exceções

## EX001 – Serviço inexistente

O sistema informa que o serviço não foi encontrado e apresenta a lista de serviços disponíveis.

---

## EX002 – Google Calendar indisponível

O sistema informa:

> "No momento não consegui acessar a agenda. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX003 – Não existem horários disponíveis

O sistema informa que não existem horários livres para a data solicitada e apresenta datas alternativas.

---

## EX004 – Falha na comunicação com a API

O sistema registra o erro e informa que a consulta não pôde ser realizada.

---

# Regras de Negócio

- RN006 – Um horário só pode possuir um atendimento.
- RN007 – Não permitir sobreposição de horários.
- RN008 – Cada serviço possui uma duração específica.
- RN009 – Deve existir intervalo mínimo entre atendimentos.
- RN010 – Sempre consultar o Google Calendar antes de responder.
- RN023 – Sempre responder de forma educada.
- RN024 – Nunca inventar preços.
- RN025 – Nunca inventar horários.
- RN026 – Sempre consultar a agenda antes de responder.
- RN040 – Nunca informar horários sem consultar o Google Calendar.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Serviço desejado
- Data desejada (quando informada)

---

## Processamento

- Identificação da cliente
- Identificação do serviço
- Consulta da duração do serviço
- Consulta ao Google Calendar
- Aplicação das regras de negócio
- Geração da lista de horários disponíveis

---

## Saída

- Lista de horários disponíveis
- Mensagem de indisponibilidade (quando aplicável)
- Registro da consulta (opcional)

---

# User Story

**ID:** US002

**Título:** Consultar horários disponíveis

**Como** cliente,

**Quero** consultar os horários disponíveis para um serviço pelo WhatsApp,

**Para que** eu possa escolher o melhor horário antes de realizar o agendamento.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar ou cadastrar automaticamente a cliente. |
| WF003 | AI Agent | Interpretar a intenção da mensagem e extrair informações. |
| WF004 | Consultar Serviços | Obter duração, preço e informações do serviço. |
| WF005 | Consultar Agenda | Consultar horários disponíveis no Google Calendar. |
| WF006 | Aplicar Regras de Negócio | Filtrar horários conforme horário comercial, intervalos e bloqueios da agenda. |
| WF007 | Registrar Consulta | Registrar a consulta realizada no Google Sheets (opcional). |
| WF008 | Enviar Resposta | Enviar os horários disponíveis pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de consulta

**Dado que** a cliente envie uma mensagem perguntando sobre horários,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de consulta.

---

### CA002 – Identificar a cliente

**Dado que** uma mensagem tenha sido recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar ou cadastrar automaticamente a cliente.

---

### CA003 – Solicitar o serviço

**Dado que** a cliente não informe o serviço desejado,

**Quando** o sistema iniciar a consulta,

**Então** deverá solicitar qual serviço deseja consultar.

---

### CA004 – Consultar a duração do serviço

**Dado que** o serviço tenha sido informado,

**Quando** o sistema iniciar a consulta da agenda,

**Então** deverá obter a duração cadastrada para o serviço.

---

### CA005 – Consultar disponibilidade

**Dado que** o serviço esteja definido,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá considerar apenas horários livres.

---

### CA006 – Respeitar horário de funcionamento

**Dado que** existam horários disponíveis,

**Quando** forem apresentados à cliente,

**Então** todos deverão respeitar o horário de funcionamento da profissional.

---

### CA007 – Respeitar intervalo entre atendimentos

**Dado que** exista um intervalo mínimo configurado,

**Quando** os horários forem calculados,

**Então** o sistema deverá respeitar esse intervalo.

---

### CA008 – Não apresentar horários ocupados

**Dado que** existam eventos cadastrados na agenda,

**Quando** a consulta for realizada,

**Então** horários ocupados não deverão ser apresentados.

---

### CA009 – Apresentar horários disponíveis

**Dado que** existam horários livres,

**Quando** a consulta for concluída,

**Então** o sistema deverá apresentar uma lista organizada de horários disponíveis.

---

### CA010 – Tratar indisponibilidade

**Dado que** não existam horários livres,

**Quando** a consulta retornar vazia,

**Então** o sistema deverá informar a indisponibilidade e sugerir datas alternativas.

---

### CA011 – Registrar consulta

**Dado que** a consulta tenha sido concluída,

**Quando** o processo finalizar,

**Então** o sistema poderá registrar a consulta para fins de auditoria e relatórios.

---

### CA012 – Registrar logs

**Dado que** qualquer etapa da consulta seja executada,

**Quando** ocorrer sucesso ou erro,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA013 – Utilizar linguagem cordial

**Dado que** a IA responda à cliente,

**Quando** enviar qualquer mensagem,

**Então** deverá utilizar linguagem clara, cordial e profissional.

---

### CA014 – Informar horários somente após validação

**Dado que** a cliente solicite horários disponíveis,

**Quando** a IA responder,

**Então** somente deverá informar horários após consultar o Google Calendar e aplicar todas as regras de negócio.


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

# **UC005 – Consultar Serviços e Preços**

---

# Objetivo

Permitir que a cliente consulte os serviços oferecidos pela Nail Designer, bem como seus respectivos preços, duração e descrição, diretamente pelo WhatsApp, utilizando informações cadastradas no sistema.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- WhatsApp Cloud API
- n8n
- AI Agent
- Google Sheets (Catálogo de Serviços)

---

# Pré-condições

- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O AI Agent deve estar operacional.
- O catálogo de serviços deve estar cadastrado no Google Sheets.
- Todos os serviços devem possuir preço, duração e status (ativo/inativo).

---

# Fluxo Principal

1. A cliente envia uma mensagem solicitando informações sobre os serviços ou preços.

2. A WhatsApp Cloud API encaminha a mensagem ao Webhook do n8n.

3. O Workflow de Recebimento processa a mensagem.

4. O AI Agent identifica a intenção **Consultar Serviços e Preços**.

5. O sistema consulta o catálogo de serviços no Google Sheets.

6. O sistema recupera apenas os serviços ativos.

7. O sistema organiza as informações dos serviços.

8. O sistema envia para a cliente a lista contendo:
   - Nome do serviço;
   - Descrição (quando disponível);
   - Valor;
   - Duração aproximada.

9. Caso a cliente solicite detalhes de um serviço específico, o sistema apresenta as informações completas.

10. O sistema pergunta se a cliente deseja realizar um agendamento.

11. Caso a cliente responda positivamente, o atendimento é direcionado para o **UC001 – Agendar Atendimento**.

12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente solicita apenas o preço

Exemplo:

> "Quanto custa a blindagem?"

O sistema consulta apenas o serviço informado e responde com o valor, duração e descrição.

---

## FA002 – Cliente solicita apenas a lista de serviços

Exemplo:

> "Quais serviços vocês fazem?"

O sistema apresenta todos os serviços ativos cadastrados.

---

## FA003 – Cliente solicita detalhes de um serviço

Exemplo:

> "Como funciona o banho em gel?"

O sistema apresenta a descrição completa do serviço.

---

## FA004 – Cliente deseja agendar

Após consultar os serviços, a cliente responde:

> "Quero agendar."

O sistema direciona automaticamente para o **UC001 – Agendar Atendimento**.

---

## FA005 – Cliente encerra a conversa

Caso a cliente deixe de responder, o fluxo é encerrado automaticamente após o tempo configurado.

---

# Exceções

## EX001 – Serviço não encontrado

O sistema informa:

> "Não encontrei esse serviço em nosso catálogo."

E apresenta a lista de serviços disponíveis.

---

## EX002 – Catálogo indisponível

Caso o Google Sheets esteja indisponível, o sistema informa:

> "No momento não consegui consultar nosso catálogo de serviços. Tente novamente em alguns minutos."

O erro é registrado.

---

## EX003 – Nenhum serviço cadastrado

O sistema informa que não existem serviços disponíveis no momento.

---

## EX004 – Falha na comunicação com o Google Sheets

O sistema registra o erro e informa que não foi possível consultar o catálogo.

---

# Regras de Negócio

- RN001 – Apenas serviços ativos poderão ser apresentados.
- RN002 – Todo serviço deverá possuir um preço cadastrado.
- RN003 – Todo serviço deverá possuir uma duração cadastrada.
- RN004 – Os preços apresentados devem ser exatamente os cadastrados no Google Sheets.
- RN005 – O sistema nunca deverá inventar preços ou serviços.
- RN023 – Sempre responder de forma educada.
- RN024 – Nunca informar preços sem consultar o catálogo.
- RN027 – Sempre consultar o Google Sheets antes de responder.
- RN041 – O catálogo deverá ser atualizado em tempo real a cada consulta.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Mensagem enviada pela cliente
- Nome do serviço (quando informado)

---

## Processamento

- Identificação da intenção da mensagem
- Consulta ao Google Sheets
- Filtragem de serviços ativos
- Organização das informações
- Geração da resposta

---

## Saída

- Lista de serviços
- Lista de preços
- Duração dos serviços
- Descrição dos serviços
- Direcionamento para agendamento (quando solicitado)

---

# User Story

**ID:** US005

**Título:** Consultar serviços e preços

**Como** cliente,

**Quero** consultar os serviços disponíveis e seus respectivos preços pelo WhatsApp,

**Para que** eu possa conhecer os serviços antes de decidir realizar um agendamento.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar ou cadastrar automaticamente a cliente. |
| WF003 | AI Agent | Interpretar a intenção da mensagem e identificar a consulta de serviços. |
| WF004 | Consultar Catálogo | Consultar os serviços ativos no Google Sheets. |
| WF005 | Filtrar Serviços | Filtrar apenas os serviços ativos e organizar os dados. |
| WF006 | Gerar Resposta | Formatar a lista de serviços, preços, duração e descrição. |
| WF007 | Registrar Consulta | Registrar a consulta realizada para auditoria (opcional). |
| WF008 | Direcionar para Agendamento | Caso a cliente deseje agendar, iniciar o UC001. |
| WF009 | Enviar Resposta | Enviar a resposta pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação de consulta

**Dado que** a cliente envie uma mensagem solicitando informações sobre serviços ou preços,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de consulta.

---

### CA002 – Identificar a intenção

**Dado que** a mensagem tenha sido recebida,

**Quando** o AI Agent analisar seu conteúdo,

**Então** deverá identificar a intenção **Consultar Serviços e Preços**.

---

### CA003 – Consultar catálogo

**Dado que** a intenção tenha sido identificada,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá recuperar os serviços cadastrados.

---

### CA004 – Exibir apenas serviços ativos

**Dado que** existam serviços cadastrados,

**Quando** a consulta for realizada,

**Então** somente os serviços ativos deverão ser apresentados.

---

### CA005 – Exibir preços corretos

**Dado que** um serviço seja apresentado,

**Quando** a resposta for enviada,

**Então** o preço deverá ser exatamente o cadastrado no Google Sheets.

---

### CA006 – Exibir duração do serviço

**Dado que** um serviço seja apresentado,

**Quando** a resposta for enviada,

**Então** deverá informar a duração aproximada do atendimento.

---

### CA007 – Exibir descrição do serviço

**Dado que** exista uma descrição cadastrada,

**Quando** o serviço for apresentado,

**Então** o sistema deverá incluir a descrição na resposta.

---

### CA008 – Consultar serviço específico

**Dado que** a cliente informe o nome de um serviço,

**Quando** o sistema localizar esse serviço,

**Então** deverá apresentar apenas as informações correspondentes.

---

### CA009 – Tratar serviço inexistente

**Dado que** o serviço informado não exista,

**Quando** a consulta for realizada,

**Então** o sistema deverá informar que o serviço não foi encontrado e apresentar a lista de serviços disponíveis.

---

### CA010 – Direcionar para agendamento

**Dado que** a cliente manifeste interesse em agendar,

**Quando** responder positivamente,

**Então** o sistema deverá iniciar automaticamente o fluxo do **UC001 – Agendar Atendimento**.

---

### CA011 – Registrar consultas

**Dado que** a consulta tenha sido concluída,

**Quando** o processo terminar,

**Então** o sistema poderá registrar a consulta para auditoria e geração de relatórios.

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

### CA014 – Nunca inventar informações

**Dado que** a cliente solicite informações sobre um serviço,

**Quando** o sistema responder,

**Então** deverá utilizar exclusivamente os dados cadastrados no Google Sheets, sem inventar serviços, preços, descrições ou durações.


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

# **UC007 – Enviar Lembretes Automáticos**

---

# Objetivo

Permitir que o sistema envie lembretes automáticos pelo WhatsApp antes do horário agendado, reduzindo faltas (no-show), permitindo que a cliente confirme, reagende ou cancele seu atendimento de forma automática.

---

# Atores

## Ator Principal

- Sistema BeautyFlow AI

## Atores Secundários

- Cliente
- n8n
- WhatsApp Cloud API
- AI Agent
- Google Calendar
- Google Sheets

---

# Pré-condições

- A cliente deve possuir um agendamento ativo.
- O evento deve estar registrado no Google Calendar.
- O atendimento deve estar registrado no Google Sheets.
- A WhatsApp Cloud API deve estar configurada.
- O AI Agent deve estar operacional.
- O Workflow Scheduler do n8n deve estar ativo.
- Os horários dos lembretes devem estar configurados.

---

# Fluxo Principal

1. O Workflow Scheduler do n8n executa automaticamente em intervalos configurados.

2. O sistema consulta o Google Calendar.

3. O sistema identifica os atendimentos que ocorrerão nas próximas horas.

4. O sistema consulta o Google Sheets.

5. O sistema verifica se o lembrete já foi enviado.

6. O sistema monta a mensagem personalizada contendo:

   - Nome da cliente;
   - Serviço agendado;
   - Data;
   - Horário;
   - Nome da profissional.

7. O sistema envia o lembrete utilizando a WhatsApp Cloud API.

8. A mensagem informa as opções disponíveis:

   - Confirmar
   - Reagendar
   - Cancelar

9. O sistema registra o envio do lembrete.

10. O sistema atualiza o Google Sheets.

11. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente confirma o atendimento

A cliente responde:

> Confirmar

O sistema direciona automaticamente para o **UC006 – Confirmar Agendamento**.

---

## FA002 – Cliente deseja reagendar

A cliente responde:

> Reagendar

O sistema direciona automaticamente para o **UC003 – Reagendar Atendimento**.

---

## FA003 – Cliente deseja cancelar

A cliente responde:

> Cancelar

O sistema direciona automaticamente para o **UC004 – Cancelar Atendimento**.

---

## FA004 – Cliente não responde

O sistema mantém o atendimento com o status **Aguardando Confirmação**.

---

## FA005 – Segundo lembrete

Caso configurado, o sistema envia automaticamente um novo lembrete algumas horas antes do atendimento.

---

# Exceções

## EX001 – Agendamento não encontrado

O sistema ignora o envio do lembrete.

O evento é registrado no log.

---

## EX002 – Mensagem não enviada

Caso a WhatsApp Cloud API retorne erro, o sistema:

- registra o erro;
- agenda nova tentativa de envio;
- notifica o administrador (quando configurado).

---

## EX003 – Cliente bloqueou o WhatsApp

O sistema registra a falha de entrega.

---

## EX004 – Google Calendar indisponível

O sistema registra o erro e interrompe o processamento até a próxima execução.

---

## EX005 – Google Sheets indisponível

O sistema envia o lembrete (quando possível), registra o erro e agenda sincronização posterior.

---

# Regras de Negócio

- RN018 – Todo atendimento deverá possuir lembrete automático.
- RN019 – O horário do lembrete deverá ser configurável.
- RN020 – Um lembrete não poderá ser enviado duas vezes para o mesmo horário.
- RN021 – Todo envio deverá ser registrado.
- RN022 – O sistema deverá permitir múltiplos lembretes para um mesmo atendimento.
- RN023 – As mensagens devem utilizar linguagem cordial.
- RN028 – Os lembretes deverão ser personalizados com os dados da cliente.
- RN029 – Toda resposta da cliente deverá iniciar automaticamente o fluxo correspondente.
- RN030 – O histórico de lembretes deverá permanecer registrado.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Data do atendimento
- Horário
- Serviço
- Nome da cliente
- Configuração dos lembretes

---

## Processamento

- Consulta do Google Calendar
- Consulta do Google Sheets
- Identificação dos próximos atendimentos
- Verificação de lembretes enviados
- Montagem da mensagem
- Envio pelo WhatsApp
- Registro do envio

---

## Saída

- Mensagem enviada
- Histórico atualizado
- Google Sheets atualizado
- Fluxo iniciado conforme resposta da cliente

---

# User Story

**ID:** US007

**Título:** Receber lembrete automático

**Como** cliente,

**Quero** receber um lembrete do meu atendimento pelo WhatsApp,

**Para que** eu possa confirmar, reagendar ou cancelar meu horário com facilidade.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Scheduler | Executar automaticamente a busca por atendimentos futuros. |
| WF002 | Buscar Agenda | Consultar o Google Calendar. |
| WF003 | Buscar Dados da Cliente | Consultar o Google Sheets. |
| WF004 | Validar Lembretes | Verificar se o lembrete já foi enviado. |
| WF005 | Gerar Mensagem | Montar mensagem personalizada. |
| WF006 | Enviar WhatsApp | Enviar mensagem utilizando a WhatsApp Cloud API. |
| WF007 | Registrar Histórico | Registrar o envio do lembrete. |
| WF008 | Atualizar Google Sheets | Atualizar o status do lembrete. |
| WF009 | Processar Resposta | Direcionar automaticamente para UC003, UC004 ou UC006. |

---

# Critérios de Aceite

### CA001 – Executar automaticamente

**Dado que** o horário configurado seja alcançado,

**Quando** o Scheduler do n8n for executado,

**Então** o sistema deverá iniciar automaticamente o fluxo de envio dos lembretes.

---

### CA002 – Consultar agenda

**Dado que** o fluxo tenha iniciado,

**Quando** o sistema consultar o Google Calendar,

**Então** deverá localizar todos os atendimentos elegíveis para receber lembrete.

---

### CA003 – Consultar dados da cliente

**Dado que** um atendimento tenha sido localizado,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá recuperar os dados necessários para personalizar a mensagem.

---

### CA004 – Não enviar lembrete duplicado

**Dado que** um lembrete já tenha sido enviado,

**Quando** o sistema executar novamente,

**Então** não deverá enviar um novo lembrete para o mesmo atendimento, salvo se houver uma configuração específica para múltiplos lembretes.

---

### CA005 – Personalizar mensagem

**Dado que** o lembrete será enviado,

**Quando** a mensagem for gerada,

**Então** deverá conter:

- Nome da cliente;
- Serviço;
- Data;
- Horário;
- Nome da profissional.

---

### CA006 – Enviar pelo WhatsApp

**Dado que** a mensagem esteja pronta,

**Quando** o sistema utilizar a WhatsApp Cloud API,

**Então** o lembrete deverá ser enviado para o número da cliente.

---

### CA007 – Apresentar opções de resposta

**Dado que** o lembrete tenha sido enviado,

**Quando** a cliente receber a mensagem,

**Então** ela deverá visualizar opções para:

- Confirmar;
- Reagendar;
- Cancelar.

---

### CA008 – Registrar envio

**Dado que** o envio tenha sido realizado,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a data, hora e status do envio.

---

### CA009 – Atualizar Google Sheets

**Dado que** o lembrete tenha sido enviado,

**Quando** o processo for concluído,

**Então** o Google Sheets deverá ser atualizado.

---

### CA010 – Processar resposta da cliente

**Dado que** a cliente responda ao lembrete,

**Quando** o AI Agent interpretar a mensagem,

**Então** o sistema deverá iniciar automaticamente o caso de uso correspondente:

- UC003 – Reagendar Atendimento;
- UC004 – Cancelar Atendimento;
- UC006 – Confirmar Agendamento.

---

### CA011 – Tratar falhas de envio

**Dado que** ocorra erro no envio da mensagem,

**Quando** a WhatsApp Cloud API retornar falha,

**Então** o sistema deverá registrar o erro e permitir nova tentativa conforme configuração.

---

### CA012 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA013 – Utilizar linguagem cordial

**Dado que** uma mensagem seja enviada,

**Quando** o sistema gerar o conteúdo,

**Então** deverá utilizar linguagem clara, amigável e profissional.

---

### CA014 – Sincronizar os sistemas

**Dado que** o fluxo seja concluído,

**Quando** todas as etapas forem executadas com sucesso,

**Então** Google Calendar, Google Sheets e o histórico do BeautyFlow AI deverão permanecer sincronizados.

### Observação de arquitetura: este é um dos casos de uso mais importantes do BeautyFlow AI, pois funciona como um orquestrador. A partir da resposta da cliente ao lembrete, ele aciona automaticamente outros casos de uso (UC003 – Reagendar Atendimento, UC004 – Cancelar Atendimento e UC006 – Confirmar Agendamento), tornando o sistema modular e facilitando a manutenção dos workflows no n8n.


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


# **UC010 – Consultar Histórico de Atendimentos**

---

# Objetivo

Permitir que a cliente consulte seu histórico de atendimentos realizados por meio do WhatsApp, apresentando informações como datas, serviços executados, valores pagos (quando configurado), profissional responsável e observações registradas, permitindo maior transparência e auxiliando na fidelização da cliente.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- WhatsApp Cloud API
- n8n
- AI Agent
- Google Sheets (Histórico de Atendimentos)
- Google Calendar

---

# Pré-condições

- A cliente deve possuir cadastro ativo.
- A cliente deve possuir pelo menos um atendimento registrado.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O AI Agent deve estar operacional.
- O Google Sheets deve estar acessível.
- O Google Calendar deve estar sincronizado.

---

# Fluxo Principal

1. A cliente envia uma mensagem solicitando seu histórico de atendimentos.

2. A WhatsApp Cloud API encaminha a mensagem para o Webhook do n8n.

3. O Workflow recebe a mensagem.

4. O AI Agent identifica a intenção **Consultar Histórico de Atendimentos**.

5. O sistema identifica a cliente pelo número do WhatsApp.

6. O sistema consulta o Google Sheets.

7. O sistema recupera todos os atendimentos relacionados à cliente.

8. O sistema organiza os registros em ordem cronológica (do mais recente para o mais antigo).

9. O sistema monta uma resposta contendo, para cada atendimento:

- Data;
- Horário;
- Serviço realizado;
- Profissional responsável (quando aplicável);
- Valor pago (quando permitido);
- Status do atendimento.

10. Caso a cliente solicite detalhes de um atendimento específico, o sistema apresenta todas as informações registradas.

11. O sistema envia a resposta pelo WhatsApp.

12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente solicita apenas o último atendimento

O sistema apresenta somente o atendimento mais recente.

---

## FA002 – Cliente solicita histórico de um período específico

Exemplo:

> "Mostre meus atendimentos deste ano."

O sistema filtra os registros conforme o período informado.

---

## FA003 – Cliente solicita detalhes de um atendimento

O sistema apresenta informações detalhadas, incluindo observações registradas pela profissional (quando permitido).

---

## FA004 – Cliente deseja realizar um novo agendamento

Após consultar o histórico, a cliente responde:

> "Quero agendar novamente."

O sistema inicia automaticamente o **UC001 – Agendar Atendimento**.

---

## FA005 – Cliente interrompe a conversa

O sistema encerra o fluxo sem realizar novas ações.

---

# Exceções

## EX001 – Cliente não cadastrada

O sistema informa:

> "Não encontrei um cadastro para este número."

E poderá direcionar para o **UC008 – Cadastrar Cliente**.

---

## EX002 – Nenhum atendimento encontrado

O sistema informa:

> "Você ainda não possui atendimentos registrados."

---

## EX003 – Google Sheets indisponível

O sistema informa:

> "No momento não foi possível consultar seu histórico. Tente novamente mais tarde."

O erro é registrado.

---

## EX004 – Erro durante a consulta

O sistema registra o erro e informa que a consulta não pôde ser concluída.

---

# Regras de Negócio

- RN001 – Apenas a própria cliente poderá consultar seu histórico.
- RN002 – O número do WhatsApp será utilizado como identificador da cliente.
- RN003 – Os atendimentos deverão ser apresentados do mais recente para o mais antigo.
- RN004 – Apenas atendimentos concluídos poderão aparecer no histórico, salvo configuração específica.
- RN005 – Valores financeiros somente serão exibidos quando essa funcionalidade estiver habilitada.
- RN006 – Observações internas da profissional somente poderão ser exibidas se forem classificadas como compartilháveis.
- RN023 – Utilizar linguagem cordial em todas as respostas.
- RN031 – Toda consulta deverá ser registrada para auditoria.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Solicitação da cliente
- Período informado (opcional)

---

## Processamento

- Identificação da cliente
- Consulta ao Google Sheets
- Consulta ao Google Calendar (quando necessário)
- Ordenação dos atendimentos
- Filtragem por período (quando aplicável)
- Montagem da resposta

---

## Saída

- Lista de atendimentos
- Informações detalhadas do atendimento
- Registro da consulta
- Resposta enviada pelo WhatsApp

---

# User Story

**ID:** US010

**Título:** Consultar histórico de atendimentos

**Como** cliente,

**Quero** consultar meu histórico de atendimentos pelo WhatsApp,

**Para que** eu possa acompanhar os serviços já realizados e consultar informações dos meus atendimentos anteriores.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens enviadas pela WhatsApp Cloud API. |
| WF002 | Identificar Cliente | Localizar a cliente pelo número do WhatsApp. |
| WF003 | AI Agent | Identificar a intenção "Consultar Histórico". |
| WF004 | Consultar Histórico | Buscar os atendimentos da cliente no Google Sheets. |
| WF005 | Consultar Agenda | Buscar informações complementares no Google Calendar (quando necessário). |
| WF006 | Organizar Histórico | Ordenar e filtrar os registros conforme a solicitação da cliente. |
| WF007 | Gerar Resposta | Formatar a resposta com os dados do histórico. |
| WF008 | Registrar Consulta | Registrar a consulta realizada para auditoria. |
| WF009 | Enviar Resposta | Enviar o histórico pelo WhatsApp. |

---

# Critérios de Aceite

### CA001 – Receber solicitação

**Dado que** a cliente envie uma mensagem solicitando seu histórico,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente o fluxo de consulta.

---

### CA002 – Identificar a cliente

**Dado que** uma mensagem tenha sido recebida,

**Quando** o número do WhatsApp for identificado,

**Então** o sistema deverá localizar a cliente cadastrada.

---

### CA003 – Consultar histórico

**Dado que** a cliente tenha sido identificada,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá recuperar todos os atendimentos relacionados.

---

### CA004 – Ordenar registros

**Dado que** existam atendimentos cadastrados,

**Quando** os dados forem apresentados,

**Então** deverão estar ordenados do mais recente para o mais antigo.

---

### CA005 – Filtrar por período

**Dado que** a cliente informe um período específico,

**Quando** a consulta for realizada,

**Então** o sistema deverá apresentar apenas os atendimentos correspondentes.

---

### CA006 – Exibir detalhes do atendimento

**Dado que** a cliente solicite detalhes de um atendimento,

**Quando** o sistema localizar o registro,

**Então** deverá apresentar todas as informações permitidas para compartilhamento.

---

### CA007 – Exibir histórico vazio

**Dado que** a cliente não possua atendimentos registrados,

**Quando** a consulta for realizada,

**Então** o sistema deverá informar que nenhum histórico foi encontrado.

---

### CA008 – Direcionar para novo agendamento

**Dado que** a cliente manifeste interesse em agendar novamente,

**Quando** responder positivamente,

**Então** o sistema deverá iniciar automaticamente o **UC001 – Agendar Atendimento**.

---

### CA009 – Registrar consulta

**Dado que** o histórico tenha sido consultado,

**Quando** o processo terminar,

**Então** o sistema deverá registrar a consulta para fins de auditoria.

---

### CA010 – Utilizar dados atualizados

**Dado que** existam alterações recentes no histórico,

**Quando** a consulta for realizada,

**Então** o sistema deverá utilizar os dados mais recentes armazenados no Google Sheets.

---

### CA011 – Tratar falhas de consulta

**Dado que** ocorra falha na consulta ao Google Sheets,

**Quando** o sistema não conseguir recuperar os dados,

**Então** deverá informar a cliente e registrar o erro.

---

### CA012 – Utilizar linguagem cordial

**Dado que** a IA responda à cliente,

**Quando** enviar qualquer mensagem,

**Então** deverá utilizar linguagem clara, objetiva, cordial e profissional.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Garantir privacidade das informações

**Dado que** a consulta seja realizada,

**Quando** o sistema recuperar os dados,

**Então** deverá apresentar apenas o histórico pertencente à cliente identificada pelo número do WhatsApp, sem expor informações de outras clientes.

# **UC011 – Lista de Espera**

---

# Objetivo

Permitir que a cliente seja incluída em uma lista de espera quando não houver horários disponíveis para o serviço desejado, possibilitando que seja notificada automaticamente caso ocorra uma vaga devido a cancelamentos, reagendamentos ou abertura de novos horários.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- Nail Designer
- WhatsApp Cloud API
- n8n
- AI Agent
- Google Calendar
- Google Sheets

---

# Pré-condições

- A cliente deve possuir cadastro ativo.
- Não deve haver horários disponíveis para a data ou período desejado.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O Google Calendar deve estar sincronizado.
- O Google Sheets deve estar acessível.
- O AI Agent deve estar operacional.
- A funcionalidade de Lista de Espera deve estar habilitada.

---

# Fluxo Principal

1. A cliente solicita um agendamento.

2. O sistema consulta a agenda disponível.

3. O sistema identifica que não existem horários compatíveis.

4. O sistema informa a indisponibilidade de horários.

5. O sistema oferece a opção de entrar na Lista de Espera.

6. A cliente aceita participar da Lista de Espera.

7. O sistema solicita as preferências da cliente:

- Serviço desejado;
- Período preferencial (manhã, tarde ou noite);
- Dias da semana (opcional);
- Data limite (opcional).

8. O sistema registra a solicitação no Google Sheets.

9. O sistema envia uma confirmação de inclusão na Lista de Espera.

10. O Workflow de Monitoramento permanece verificando cancelamentos e novas vagas.

11. Quando surgir uma vaga compatível, o sistema identifica a primeira cliente elegível.

12. O sistema envia automaticamente uma oferta da vaga pelo WhatsApp.

13. A cliente responde:

- Aceitar;
- Recusar.

14. Caso aceite, o sistema realiza automaticamente o agendamento.

15. Caso recuse ou não responda dentro do tempo configurado, a vaga é oferecida para a próxima cliente da lista.

16. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente não deseja entrar na Lista de Espera

O sistema encerra o atendimento normalmente.

---

## FA002 – Cliente aceita a vaga

O sistema direciona automaticamente para o **UC001 – Agendar Atendimento**, utilizando o horário disponível.

---

## FA003 – Cliente recusa a vaga

O sistema mantém a cliente na Lista de Espera ou remove seu registro, conforme configuração da profissional.

---

## FA004 – Cliente não responde

Após o tempo configurado (ex.: 30 minutos), o sistema considera a vaga recusada e a oferece para a próxima cliente.

---

## FA005 – Cliente solicita remoção da Lista de Espera

O sistema remove seu registro e envia uma confirmação.

---

# Exceções

## EX001 – Google Sheets indisponível

O sistema informa:

> "No momento não foi possível registrar sua solicitação na Lista de Espera. Tente novamente mais tarde."

O erro é registrado.

---

## EX002 – Google Calendar indisponível

O sistema interrompe temporariamente o monitoramento de vagas e registra o erro.

---

## EX003 – Erro ao criar o agendamento

Caso a vaga seja aceita, mas ocorra falha no agendamento, o sistema informa a cliente e registra o erro.

---

## EX004 – Cliente já está na Lista de Espera

O sistema informa:

> "Você já possui uma solicitação ativa na Lista de Espera."

---

# Regras de Negócio

- RN001 – Apenas clientes cadastradas poderão entrar na Lista de Espera.
- RN002 – Cada cliente poderá possuir apenas uma solicitação ativa por serviço.
- RN003 – A ordem da Lista de Espera deverá respeitar a data e hora da solicitação (FIFO).
- RN004 – Apenas vagas compatíveis com as preferências da cliente deverão ser oferecidas.
- RN005 – O tempo de resposta da oferta deverá ser configurável.
- RN006 – Caso a cliente não responda no prazo, a vaga será oferecida para a próxima cliente.
- RN007 – Toda inclusão, remoção e oferta deverá ser registrada.
- RN023 – O sistema deverá utilizar linguagem cordial.
- RN032 – A vaga somente poderá ser reservada após a confirmação da cliente.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Serviço desejado
- Preferência de período
- Preferência de dias
- Data limite (opcional)

---

## Processamento

- Verificação da disponibilidade na agenda
- Registro na Lista de Espera
- Monitoramento de vagas
- Comparação entre vaga disponível e preferências da cliente
- Envio da oferta
- Registro da resposta

---

## Saída

- Cliente incluída na Lista de Espera
- Oferta de vaga enviada
- Agendamento realizado (quando aceito)
- Atualização do Google Sheets
- Atualização do Google Calendar

---

# User Story

**ID:** US011

**Título:** Entrar na Lista de Espera

**Como** cliente,

**Quero** entrar em uma Lista de Espera quando não houver horários disponíveis,

**Para que** eu seja avisada automaticamente caso surja uma vaga compatível.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Receber Mensagem WhatsApp | Receber mensagens da WhatsApp Cloud API. |
| WF002 | Consultar Agenda | Verificar disponibilidade no Google Calendar. |
| WF003 | AI Agent | Identificar a intenção de entrar na Lista de Espera. |
| WF004 | Registrar Lista de Espera | Inserir a solicitação no Google Sheets. |
| WF005 | Scheduler de Monitoramento | Verificar periodicamente novas vagas e cancelamentos. |
| WF006 | Comparar Preferências | Comparar a vaga disponível com as preferências cadastradas. |
| WF007 | Enviar Oferta de Vaga | Enviar a proposta de horário via WhatsApp. |
| WF008 | Processar Resposta | Identificar se a cliente aceitou ou recusou a vaga. |
| WF009 | Agendar Atendimento | Criar automaticamente o evento no Google Calendar (UC001). |
| WF010 | Atualizar Lista | Atualizar o status da Lista de Espera no Google Sheets. |
| WF011 | Registrar Histórico | Registrar todas as movimentações da Lista de Espera. |

---

# Critérios de Aceite

### CA001 – Oferecer Lista de Espera

**Dado que** não existam horários disponíveis,

**Quando** a consulta à agenda for concluída,

**Então** o sistema deverá oferecer a opção de entrar na Lista de Espera.

---

### CA002 – Registrar solicitação

**Dado que** a cliente aceite participar,

**Quando** informar suas preferências,

**Então** o sistema deverá registrar a solicitação no Google Sheets.

---

### CA003 – Evitar duplicidade

**Dado que** a cliente já possua uma solicitação ativa para o mesmo serviço,

**Quando** tentar entrar novamente,

**Então** o sistema deverá impedir um novo registro.

---

### CA004 – Registrar preferências

**Dado que** a cliente informe período ou dias preferenciais,

**Quando** a solicitação for gravada,

**Então** essas preferências deverão ser armazenadas.

---

### CA005 – Monitorar vagas

**Dado que** existam clientes na Lista de Espera,

**Quando** ocorrer um cancelamento ou abertura de horário,

**Então** o sistema deverá verificar automaticamente as vagas disponíveis.

---

### CA006 – Comparar preferências

**Dado que** exista uma vaga disponível,

**Quando** o sistema analisar a Lista de Espera,

**Então** deverá selecionar apenas clientes compatíveis com aquela vaga.

---

### CA007 – Respeitar ordem da fila

**Dado que** mais de uma cliente seja elegível,

**Quando** houver uma vaga,

**Então** o sistema deverá oferecer primeiro à cliente com a solicitação mais antiga.

---

### CA008 – Enviar oferta da vaga

**Dado que** uma cliente elegível tenha sido identificada,

**Quando** o sistema localizar a vaga,

**Então** deverá enviar automaticamente a oferta pelo WhatsApp.

---

### CA009 – Criar agendamento

**Dado que** a cliente aceite a vaga,

**Quando** responder positivamente,

**Então** o sistema deverá iniciar automaticamente o **UC001 – Agendar Atendimento**.

---

### CA010 – Oferecer vaga à próxima cliente

**Dado que** a cliente recuse ou não responda dentro do prazo,

**Quando** o tempo configurado expirar,

**Então** o sistema deverá oferecer a vaga para a próxima cliente elegível.

---

### CA011 – Remover da Lista

**Dado que** a cliente solicite sair da Lista de Espera,

**Quando** o sistema receber a solicitação,

**Então** deverá remover o registro e confirmar a exclusão.

---

### CA012 – Atualizar Google Sheets

**Dado que** qualquer alteração ocorra na Lista de Espera,

**Quando** o processo for concluído,

**Então** o Google Sheets deverá ser atualizado.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Utilizar linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, amigável e profissional.

---

### CA015 – Garantir sincronização

**Dado que** uma vaga seja aceita e transformada em agendamento,

**Quando** o fluxo for concluído,

**Então** Google Calendar, Google Sheets e o histórico da Lista de Espera deverão permanecer sincronizados.



# **UC012 – Avaliar Atendimento**

---

# Objetivo

Permitir que a cliente avalie o atendimento recebido após a conclusão do serviço, por meio do WhatsApp, registrando sua satisfação, comentários e sugestões de melhoria. As avaliações poderão ser utilizadas para indicadores de qualidade, fidelização de clientes e melhoria contínua dos serviços prestados.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- Nail Designer
- WhatsApp Cloud API
- n8n
- AI Agent
- Google Sheets (Avaliações)
- Google Calendar

---

# Pré-condições

- A cliente deve possuir um atendimento concluído.
- O atendimento deve estar registrado como **Concluído**.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O AI Agent deve estar operacional.
- O Google Sheets deve estar acessível.
- O Workflow de envio de avaliações deve estar habilitado.

---

# Fluxo Principal

1. Após a conclusão do atendimento, o sistema agenda automaticamente o envio da pesquisa de satisfação.

2. No horário configurado, o n8n envia uma mensagem pelo WhatsApp.

3. A cliente recebe uma mensagem solicitando sua avaliação.

4. O sistema apresenta uma escala de avaliação de 1 a 5 estrelas.

Exemplo:

⭐ 1 - Muito Insatisfeita

⭐⭐ 2 - Insatisfeita

⭐⭐⭐ 3 - Regular

⭐⭐⭐⭐ 4 - Satisfeita

⭐⭐⭐⭐⭐ 5 - Muito Satisfeita

5. A cliente informa sua nota.

6. O sistema registra a avaliação.

7. O sistema pergunta se a cliente deseja deixar um comentário.

8. A cliente envia um comentário (opcional).

9. O sistema registra o comentário.

10. O sistema atualiza o Google Sheets.

11. O sistema agradece pela avaliação.

12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente informa apenas a nota

O sistema registra a nota e encerra o fluxo.

---

## FA002 – Cliente informa nota e comentário

O sistema registra ambas as informações.

---

## FA003 – Cliente não deseja avaliar

O sistema registra a recusa e encerra o atendimento.

---

## FA004 – Cliente envia apenas comentário

O sistema solicita que seja informada também a nota da avaliação.

---

## FA005 – Cliente altera a avaliação

Enquanto o fluxo estiver aberto, a cliente poderá alterar sua nota antes da finalização.

---

# Exceções

## EX001 – Atendimento não encontrado

O sistema informa:

> "Não encontrei um atendimento concluído para realizar esta avaliação."

---

## EX002 – Atendimento já avaliado

O sistema informa:

> "Este atendimento já foi avaliado anteriormente."

---

## EX003 – Google Sheets indisponível

O sistema registra o erro e informa que não foi possível salvar a avaliação.

---

## EX004 – Erro durante o registro

O sistema registra o erro para auditoria e informa a cliente sobre a indisponibilidade temporária.

---

# Regras de Negócio

- RN001 – Apenas atendimentos concluídos poderão ser avaliados.
- RN002 – Cada atendimento poderá receber apenas uma avaliação.
- RN003 – A nota deverá estar entre 1 e 5 estrelas.
- RN004 – O comentário será opcional.
- RN005 – A avaliação ficará vinculada ao atendimento realizado.
- RN006 – Todas as avaliações deverão possuir data e hora.
- RN007 – O histórico de avaliações não poderá ser excluído automaticamente.
- RN023 – O sistema deverá utilizar linguagem cordial.
- RN033 – Todas as avaliações deverão ser registradas para geração de indicadores.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Identificador do atendimento
- Nota da avaliação
- Comentário (opcional)

---

## Processamento

- Localização do atendimento
- Validação do status
- Validação da nota
- Registro da avaliação
- Registro do comentário
- Atualização do Google Sheets

---

## Saída

- Avaliação registrada
- Comentário registrado
- Google Sheets atualizado
- Mensagem de agradecimento enviada

---

# User Story

**ID:** US012

**Título:** Avaliar atendimento

**Como** cliente,

**Quero** avaliar o atendimento recebido,

**Para que** eu possa compartilhar minha experiência e contribuir para a melhoria dos serviços prestados.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Scheduler Pós-Atendimento | Identificar atendimentos concluídos e iniciar a pesquisa de satisfação. |
| WF002 | Buscar Atendimento | Localizar o atendimento realizado no Google Calendar ou Google Sheets. |
| WF003 | Enviar Pesquisa | Enviar a solicitação de avaliação pelo WhatsApp. |
| WF004 | Receber Resposta | Receber a nota enviada pela cliente. |
| WF005 | AI Agent | Interpretar a nota e identificar comentários adicionais. |
| WF006 | Validar Avaliação | Validar a nota e verificar se o atendimento já foi avaliado. |
| WF007 | Registrar Avaliação | Salvar nota e comentário no Google Sheets. |
| WF008 | Atualizar Indicadores | Atualizar métricas de satisfação (NPS interno, média de avaliações etc.). |
| WF009 | Enviar Agradecimento | Enviar mensagem de agradecimento à cliente. |
| WF010 | Registrar Logs | Registrar toda a execução do processo para auditoria. |

---

# Critérios de Aceite

### CA001 – Enviar pesquisa automaticamente

**Dado que** um atendimento tenha sido concluído,

**Quando** o horário configurado para envio da pesquisa for atingido,

**Então** o sistema deverá enviar automaticamente uma solicitação de avaliação pelo WhatsApp.

---

### CA002 – Validar atendimento

**Dado que** a pesquisa seja iniciada,

**Quando** o sistema localizar o atendimento,

**Então** deverá confirmar que ele possui status **Concluído**.

---

### CA003 – Apresentar escala de avaliação

**Dado que** a cliente receba a pesquisa,

**Quando** visualizar a mensagem,

**Então** deverá ser apresentada uma escala de 1 a 5 estrelas.

---

### CA004 – Registrar nota

**Dado que** a cliente informe uma nota válida,

**Quando** o sistema receber a resposta,

**Então** deverá registrar a nota no Google Sheets.

---

### CA005 – Solicitar comentário

**Dado que** a nota tenha sido registrada,

**Quando** o fluxo continuar,

**Então** o sistema deverá perguntar se a cliente deseja deixar um comentário.

---

### CA006 – Registrar comentário

**Dado que** a cliente envie um comentário,

**Quando** o sistema receber a mensagem,

**Então** deverá registrar o comentário juntamente com a avaliação.

---

### CA007 – Permitir avaliação sem comentário

**Dado que** a cliente informe apenas a nota,

**Quando** o fluxo terminar,

**Então** o sistema deverá concluir a avaliação normalmente.

---

### CA008 – Impedir avaliações duplicadas

**Dado que** o atendimento já tenha sido avaliado,

**Quando** uma nova tentativa ocorrer,

**Então** o sistema deverá impedir o registro de uma segunda avaliação.

---

### CA009 – Validar nota

**Dado que** a cliente informe uma nota,

**Quando** o sistema validar a resposta,

**Então** deverá aceitar apenas valores entre 1 e 5 estrelas.

---

### CA010 – Atualizar indicadores

**Dado que** uma nova avaliação seja registrada,

**Quando** o processo for concluído,

**Então** os indicadores de satisfação deverão ser atualizados automaticamente.

---

### CA011 – Atualizar Google Sheets

**Dado que** a avaliação tenha sido registrada,

**Quando** o processo terminar,

**Então** o Google Sheets deverá conter a nota, comentário, data e identificação do atendimento.

---

### CA012 – Enviar agradecimento

**Dado que** a avaliação tenha sido concluída,

**Quando** o registro for salvo,

**Então** o sistema deverá enviar uma mensagem agradecendo a participação da cliente.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Utilizar linguagem cordial

**Dado que** o sistema interaja com a cliente,

**Quando** enviar qualquer mensagem,

**Então** deverá utilizar linguagem clara, respeitosa, amigável e profissional.

---

### CA015 – Garantir rastreabilidade

**Dado que** uma avaliação seja registrada,

**Quando** o processo for concluído,

**Então** a avaliação deverá permanecer vinculada ao atendimento correspondente, permitindo consultas futuras, geração de relatórios e análise de indicadores de qualidade.
