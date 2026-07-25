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
