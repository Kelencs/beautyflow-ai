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

