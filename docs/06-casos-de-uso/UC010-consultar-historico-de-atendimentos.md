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
