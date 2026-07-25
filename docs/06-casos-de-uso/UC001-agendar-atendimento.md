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

