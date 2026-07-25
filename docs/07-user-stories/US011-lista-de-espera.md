# US011 – Lista de Espera

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US011 |
| **Título** | Lista de Espera |
| **Epic** | Gestão de Agendamentos |
| **Prioridade** | Média |
| **Story Points** | 8 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC011 – Lista de Espera |

---

# Descrição

Como cliente,

Quero entrar em uma lista de espera para um horário desejado,

Para que eu seja avisada automaticamente caso ocorra uma vaga disponível.

---

# Objetivo

Permitir que clientes interessadas em horários indisponíveis sejam cadastradas em uma lista de espera e notificadas automaticamente quando houver cancelamentos ou horários liberados.

---

# Valor de Negócio

A Lista de Espera reduz horários ociosos, aumenta a taxa de ocupação da agenda, melhora a experiência das clientes e reduz perdas financeiras causadas por cancelamentos de última hora.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas clientes cadastradas poderão entrar na Lista de Espera.
- RN002 – Cada cliente poderá possuir apenas uma solicitação ativa para o mesmo serviço.
- RN003 – A posição na lista será determinada pela data e hora da solicitação.
- RN004 – A vaga será oferecida seguindo a ordem da fila (FIFO).
- RN005 – O sistema deverá aguardar um tempo configurável para resposta da cliente.
- RN006 – Caso a cliente não responda dentro do prazo, a vaga será oferecida à próxima cliente da lista.
- RN007 – Após aceitar a vaga, a cliente será removida automaticamente da Lista de Espera.
- RN008 – Todas as movimentações da lista deverão ser registradas em log.

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

- WF001 – Receber Solicitação de Lista de Espera
- WF002 – Identificar Cliente
- WF003 – Validar Cadastro
- WF004 – Registrar Lista de Espera
- WF005 – Monitorar Cancelamentos
- WF006 – Identificar Cliente Elegível
- WF007 – Enviar Oferta da Vaga
- WF008 – Processar Resposta
- WF009 – Atualizar Agenda
- WF010 – Registrar Logs

---

# Fluxo da User Story

1. A cliente solicita entrar na Lista de Espera.
2. O sistema identifica a cliente.
3. O sistema verifica se já existe uma solicitação ativa.
4. O sistema registra a cliente na Lista de Espera.
5. O sistema confirma o cadastro.
6. O sistema monitora automaticamente cancelamentos.
7. Uma vaga é liberada.
8. O sistema identifica a primeira cliente elegível.
9. O sistema envia uma oferta da vaga pelo WhatsApp.
10. A cliente responde.
11. Caso aceite, o agendamento é criado automaticamente.
12. Caso recuse ou não responda, a vaga é oferecida à próxima cliente.
13. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Solicitar entrada

**Dado que** a cliente deseje um horário indisponível,

**Quando** solicitar entrar na Lista de Espera,

**Então** o sistema deverá iniciar automaticamente o cadastro.

---

## CA002 – Validar cadastro

**Dado que** a solicitação seja recebida,

**Quando** o sistema consultar o cadastro,

**Então** deverá confirmar que a cliente está cadastrada.

---

## CA003 – Evitar duplicidade

**Dado que** exista uma solicitação ativa para o mesmo serviço,

**Quando** a cliente tentar entrar novamente,

**Então** o sistema deverá impedir o cadastro duplicado.

---

## CA004 – Registrar solicitação

**Dado que** a cliente seja elegível,

**Quando** o cadastro for concluído,

**Então** o sistema deverá registrar:

- Cliente;
- Serviço;
- Data desejada (quando informada);
- Preferência de horário;
- Data e hora da solicitação.

---

## CA005 – Confirmar inclusão

**Dado que** o cadastro seja realizado,

**Quando** o processo terminar,

**Então** o sistema deverá enviar uma confirmação pelo WhatsApp.

---

## CA006 – Detectar vaga

**Dado que** ocorra um cancelamento,

**Quando** um horário for liberado,

**Então** o sistema deverá identificar automaticamente clientes compatíveis na Lista de Espera.

---

## CA007 – Oferecer vaga

**Dado que** exista uma cliente elegível,

**Quando** uma vaga estiver disponível,

**Então** o sistema deverá enviar automaticamente uma oferta da vaga pelo WhatsApp.

---

## CA008 – Processar aceite

**Dado que** a cliente aceite a vaga,

**Quando** responder positivamente,

**Então** o sistema deverá:

- Criar o agendamento;
- Atualizar o Google Calendar;
- Atualizar o Google Sheets;
- Remover a cliente da Lista de Espera.

---

## CA009 – Processar recusa

**Dado que** a cliente recuse a vaga,

**Quando** responder negativamente,

**Então** o sistema deverá oferecer a vaga para a próxima cliente da lista.

---

## CA010 – Expiração da oferta

**Dado que** a cliente não responda dentro do prazo configurado,

**Quando** o tempo expirar,

**Então** a oferta deverá ser cancelada automaticamente e enviada para a próxima cliente.

---

## CA011 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas em log.

---

## CA012 – Tratar falhas

**Dado que** ocorra erro durante qualquer etapa,

**Quando** o sistema identificar a falha,

**Então** deverá registrar o erro, preservar os dados e informar a administradora quando necessário.

---

## CA013 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Permitir cadastro na Lista de Espera.
- RF002 – Consultar cadastro da cliente.
- RF003 – Monitorar cancelamentos.
- RF004 – Identificar clientes elegíveis.
- RF005 – Enviar ofertas de vagas.
- RF006 – Processar respostas.
- RF007 – Criar agendamento automaticamente.
- RF008 – Atualizar Google Calendar.
- RF009 – Atualizar Google Sheets.
- RF010 – Registrar logs.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O sistema deverá identificar vagas disponíveis em até 1 minuto após um cancelamento.
- RNF002 – A disponibilidade mínima deverá ser de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as movimentações deverão ser registradas em log.
- RNF005 – O sistema deverá garantir que uma mesma vaga não seja oferecida simultaneamente para duas clientes.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Serviço Desejado | Sim |
| Data Desejada | Não |
| Preferência de Horário | Não |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Registro da Lista de Espera | Google Sheets |
| Oferta da Vaga | WhatsApp |
| Novo Agendamento | Google Calendar |
| Atualização da Lista | Google Sheets |
| Registro de Logs | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- A cliente puder entrar na Lista de Espera.
- O sistema detectar automaticamente horários liberados.
- As ofertas forem enviadas pelo WhatsApp.
- O aceite criar automaticamente um novo agendamento.
- A cliente for removida da Lista de Espera após aceitar a vaga.
- Todos os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story depende diretamente da **US001 – Agendar Atendimento**, **US004 – Cancelar Atendimento** e **US006 – Confirmar Agendamento**.
- O cancelamento de um atendimento deverá acionar automaticamente o workflow da Lista de Espera.
- O Google Calendar continuará sendo a fonte oficial da disponibilidade da agenda, enquanto o Google Sheets armazenará as informações da fila de espera.
- Em versões futuras, a Lista de Espera poderá utilizar critérios adicionais de priorização, como clientes VIP, frequência de atendimentos, valor gasto, programas de fidelidade ou preferências específicas de horários.
- Também poderá ser implementado um tempo de resposta configurável por serviço, além de notificações por e-mail e integração com aplicativos móveis.
