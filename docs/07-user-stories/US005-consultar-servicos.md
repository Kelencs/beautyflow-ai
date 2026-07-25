# US005 – Consultar Serviços e Preços

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US005 |
| **Título** | Consultar Serviços e Preços |
| **Epic** | Catálogo de Serviços |
| **Prioridade** | Alta |
| **Story Points** | 3 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC005 – Consultar Serviços e Preços |

---

# Descrição

Como cliente,

Quero consultar os serviços oferecidos pela nail designer e seus respectivos preços pelo WhatsApp,

Para que eu possa escolher o serviço desejado antes de realizar um agendamento.

---

# Objetivo

Permitir que a cliente consulte, de forma rápida e automática, o catálogo de serviços, seus preços, duração e descrição, sem necessidade de atendimento manual.

---

# Valor de Negócio

Disponibilizar automaticamente as informações dos serviços reduz o tempo gasto respondendo dúvidas frequentes, melhora a experiência da cliente e aumenta as chances de conversão em agendamentos.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas serviços ativos poderão ser apresentados.
- RN002 – Os preços deverão ser consultados diretamente no Google Sheets.
- RN003 – O sistema deverá apresentar a duração estimada de cada serviço.
- RN004 – Os preços deverão ser sempre atualizados em tempo real.
- RN005 – Serviços inativos não deverão ser exibidos.
- RN006 – O sistema deverá permitir a consulta de um serviço específico ou da lista completa.
- RN007 – Após a consulta, o sistema deverá oferecer a opção de realizar um agendamento.

---

# Dependências

## Serviços

- WhatsApp Cloud API
- Google Sheets API
- OpenAI
- n8n

---

## Workflows

- WF001 – Receber Mensagem WhatsApp
- WF002 – Identificar Cliente
- WF003 – Identificar Intenção
- WF004 – Consultar Catálogo de Serviços
- WF005 – Buscar Informações no Google Sheets
- WF006 – Formatar Resposta
- WF007 – Enviar Lista de Serviços
- WF008 – Registrar Logs

---

# Fluxo da User Story

1. A cliente envia uma mensagem perguntando sobre serviços ou preços.
2. O sistema identifica a intenção da mensagem.
3. O sistema consulta o Google Sheets.
4. O sistema recupera os serviços ativos.
5. O sistema organiza as informações.
6. O sistema envia a lista de serviços disponíveis.
7. O sistema pergunta se a cliente deseja realizar um agendamento.
8. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Receber solicitação

**Dado que** a cliente envie uma mensagem perguntando sobre serviços,

**Quando** o sistema receber a mensagem,

**Então** deverá iniciar automaticamente a consulta do catálogo.

---

## CA002 – Consultar catálogo

**Dado que** a solicitação seja válida,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá recuperar todos os serviços ativos.

---

## CA003 – Exibir serviços

**Dado que** existam serviços cadastrados,

**Quando** a consulta for concluída,

**Então** o sistema deverá apresentar:

- Nome do serviço;
- Descrição;
- Duração;
- Preço.

---

## CA004 – Não exibir serviços inativos

**Dado que** existam serviços inativos,

**Quando** o catálogo for apresentado,

**Então** esses serviços não deverão ser exibidos.

---

## CA005 – Consultar serviço específico

**Dado que** a cliente solicite informações sobre um serviço específico,

**Quando** o sistema localizar o serviço,

**Então** deverá apresentar apenas as informações correspondentes.

---

## CA006 – Informações atualizadas

**Dado que** os preços tenham sido alterados no Google Sheets,

**Quando** uma nova consulta ocorrer,

**Então** o sistema deverá apresentar os valores atualizados.

---

## CA007 – Incentivar agendamento

**Dado que** a consulta tenha sido concluída,

**Quando** os serviços forem apresentados,

**Então** o sistema deverá perguntar se a cliente deseja agendar um horário.

---

## CA008 – Catálogo vazio

**Dado que** não existam serviços cadastrados,

**Quando** a consulta for realizada,

**Então** o sistema deverá informar que não há serviços disponíveis no momento.

---

## CA009 – Registrar logs

**Dado que** o processo seja executado,

**Quando** houver sucesso ou erro,

**Então** todas as operações deverão ser registradas para auditoria.

---

## CA010 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** responder à cliente,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar intenção da cliente.
- RF003 – Consultar catálogo de serviços.
- RF004 – Consultar preços.
- RF005 – Consultar duração dos serviços.
- RF006 – Enviar informações pelo WhatsApp.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – A consulta deverá ser concluída em até 5 segundos.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as consultas deverão ser registradas em log.
- RNF005 – O sistema deverá suportar múltiplas consultas simultâneas.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Nome do Serviço (opcional) | Não |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Lista de serviços | WhatsApp |
| Descrição | WhatsApp |
| Duração | WhatsApp |
| Preço | WhatsApp |
| Registro da consulta | Logs |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O Google Sheets for consultado em tempo real.
- Apenas serviços ativos forem apresentados.
- Os preços e a duração estiverem corretos.
- A cliente receber a opção de iniciar um agendamento.
- Os logs forem gravados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story serve como apoio para a **US001 – Agendar Atendimento**, permitindo que a cliente conheça os serviços antes de realizar um agendamento.
- O Google Sheets será a fonte oficial do catálogo de serviços durante o MVP.
- Em versões futuras, o catálogo poderá incluir imagens, tempo de manutenção recomendado, promoções, pacotes e serviços adicionais.
- Após a apresentação dos serviços, o AI Agent deverá conduzir a conversa naturalmente para o fluxo de agendamento quando a cliente demonstrar interesse.
