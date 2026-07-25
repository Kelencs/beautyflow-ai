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
