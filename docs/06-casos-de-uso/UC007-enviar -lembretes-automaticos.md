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
