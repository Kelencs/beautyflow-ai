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

