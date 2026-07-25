# US007 – Enviar Lembretes de Agendamento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US007 |
| **Título** | Enviar Lembretes de Agendamento |
| **Epic** | Comunicação com Clientes |
| **Prioridade** | Alta |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC007 – Enviar Lembretes de Agendamento |

---

# Descrição

Como cliente,

Quero receber lembretes automáticos do meu agendamento pelo WhatsApp,

Para que eu não esqueça do atendimento e possa confirmar minha presença ou reagendar caso necessário.

---

# Objetivo

Enviar lembretes automáticos antes do horário agendado, reduzindo faltas, atrasos e cancelamentos de última hora, além de oferecer à cliente opções rápidas para confirmar, reagendar ou cancelar o atendimento.

---

# Valor de Negócio

O envio automático de lembretes diminui o índice de faltas (no-show), melhora a organização da agenda, reduz perdas financeiras e aumenta a satisfação das clientes.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas agendamentos com status **Agendado** poderão receber lembretes.
- RN002 – Os lembretes deverão ser enviados automaticamente pelo n8n.
- RN003 – O Google Calendar será a fonte oficial dos horários.
- RN004 – O sistema deverá permitir configurar a antecedência do lembrete.
- RN005 – O sistema deverá registrar o envio de todos os lembretes.
- RN006 – Caso o agendamento seja cancelado, nenhum lembrete deverá ser enviado.
- RN007 – Cada lembrete deverá ser enviado apenas uma vez.
- RN008 – A cliente poderá responder diretamente ao lembrete.
- RN009 – As respostas da cliente poderão iniciar automaticamente outros fluxos do sistema.

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

- WF001 – Scheduler de Lembretes
- WF002 – Buscar Agendamentos do Dia
- WF003 – Validar Status do Agendamento
- WF004 – Montar Mensagem
- WF005 – Enviar WhatsApp
- WF006 – Processar Resposta da Cliente
- WF007 – Registrar Logs

---

# Fluxo da User Story

1. O Scheduler do n8n é executado automaticamente.
2. O sistema consulta os agendamentos do Google Calendar.
3. O sistema identifica os atendimentos que deverão receber lembrete.
4. O sistema verifica se o lembrete já foi enviado.
5. O sistema monta a mensagem personalizada.
6. O sistema envia o lembrete pelo WhatsApp.
7. A cliente recebe o lembrete.
8. A cliente poderá:
   - Confirmar presença;
   - Solicitar reagendamento;
   - Solicitar cancelamento;
   - Não responder.
9. O sistema registra a resposta da cliente.
10. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Executar envio automático

**Dado que** exista um agendamento futuro,

**Quando** chegar o horário configurado para envio,

**Então** o sistema deverá iniciar automaticamente o workflow de lembretes.

---

## CA002 – Consultar agenda

**Dado que** o workflow tenha sido iniciado,

**Quando** consultar o Google Calendar,

**Então** deverá recuperar todos os agendamentos elegíveis para receber lembrete.

---

## CA003 – Validar status

**Dado que** um agendamento seja encontrado,

**Quando** o sistema verificar seu status,

**Então** apenas agendamentos com status **Agendado** deverão receber lembretes.

---

## CA004 – Enviar lembrete

**Dado que** o atendimento esteja apto,

**Quando** o processamento for concluído,

**Então** o sistema deverá enviar automaticamente um lembrete pelo WhatsApp.

---

## CA005 – Conteúdo da mensagem

**Dado que** o lembrete seja enviado,

**Quando** a cliente receber a mensagem,

**Então** deverão ser exibidos:

- Nome da cliente;
- Serviço;
- Data;
- Horário;
- Nome da profissional;
- Mensagem de confirmação;
- Opções para confirmar, reagendar ou cancelar.

---

## CA006 – Evitar duplicidade

**Dado que** um lembrete já tenha sido enviado,

**Quando** o workflow for executado novamente,

**Então** o sistema não deverá reenviar o mesmo lembrete.

---

## CA007 – Registrar resposta

**Dado que** a cliente responda ao lembrete,

**Quando** o sistema receber a mensagem,

**Então** deverá registrar a resposta e iniciar o fluxo correspondente.

---

## CA008 – Não enviar para cancelados

**Dado que** o agendamento esteja cancelado,

**Quando** o workflow consultar a agenda,

**Então** nenhum lembrete deverá ser enviado.

---

## CA009 – Registrar logs

**Dado que** o processo seja executado,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas para auditoria.

---

## CA010 – Tratar falhas

**Dado que** ocorra erro no envio do WhatsApp,

**Quando** o sistema identificar a falha,

**Então** deverá registrar o erro e permitir uma nova tentativa de envio.

---

## CA011 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** houver interação com a cliente,

**Então** deverá utilizar linguagem clara, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Consultar agendamentos futuros.
- RF002 – Identificar atendimentos elegíveis.
- RF003 – Gerar lembretes automáticos.
- RF004 – Enviar mensagens pelo WhatsApp.
- RF005 – Registrar respostas da cliente.
- RF006 – Acionar fluxos de confirmação, reagendamento ou cancelamento.
- RF007 – Registrar logs do processo.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – Os lembretes deverão ser enviados automaticamente no horário configurado.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todos os envios deverão ser registrados em log.
- RNF005 – O sistema deverá suportar múltiplos envios simultâneos.
- RNF006 – O tempo máximo para envio de cada lembrete deverá ser de até 10 segundos.

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
| Antecedência do Lembrete | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Mensagem de Lembrete | WhatsApp |
| Status do Envio | Google Sheets |
| Resposta da Cliente | Google Sheets |
| Registro de Logs | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Scheduler do n8n estiver funcionando corretamente.
- O Google Calendar for consultado automaticamente.
- O lembrete for enviado pelo WhatsApp.
- As respostas da cliente forem processadas corretamente.
- Nenhum lembrete duplicado for enviado.
- Todos os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story depende da **US001 – Agendar Atendimento** e complementa a **US006 – Confirmar Agendamento**.
- O Scheduler do n8n poderá ser configurado para enviar lembretes com diferentes antecedências (por exemplo, 24 horas, 2 horas ou 1 hora antes do atendimento).
- A resposta da cliente poderá iniciar automaticamente os fluxos de **UC003 – Reagendar Atendimento**, **UC004 – Cancelar Atendimento** ou simplesmente registrar a confirmação de presença.
- Em versões futuras, o sistema poderá enviar lembretes adicionais com orientações pré-atendimento, localização do salão, políticas de atraso e links para pagamento antecipado.
