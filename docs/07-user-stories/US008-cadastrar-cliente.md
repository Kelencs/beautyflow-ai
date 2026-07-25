# US008 – Cadastrar Cliente

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US008 |
| **Título** | Cadastrar Cliente |
| **Epic** | Gestão de Clientes |
| **Prioridade** | Alta |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC008 – Cadastrar Cliente |

---

# Descrição

Como cliente,

Quero ser cadastrada automaticamente ao entrar em contato pelo WhatsApp,

Para que eu não precise informar meus dados toda vez que desejar agendar um atendimento.

---

# Objetivo

Permitir que o sistema identifique clientes novas e realize o cadastro automático de seus dados básicos, criando um registro único que será utilizado nos demais processos do BeautyFlow AI.

---

# Valor de Negócio

O cadastro automático reduz atrito no atendimento, melhora a experiência da cliente, facilita a personalização das conversas e cria uma base de dados organizada para agendamentos, histórico e campanhas futuras.

---

# Regras de Negócio Relacionadas

- RN001 – O número do WhatsApp será o identificador único da cliente.
- RN002 – Não poderá existir mais de um cadastro para o mesmo número.
- RN003 – O cadastro deverá ser criado automaticamente quando a cliente não existir.
- RN004 – O nome da cliente será obrigatório para conclusão do cadastro.
- RN005 – O sistema deverá registrar data e hora do cadastro.
- RN006 – O status inicial da cliente será **Ativa**.
- RN007 – O sistema deverá permitir atualização futura dos dados.
- RN008 – Todas as operações de cadastro deverão ser registradas em log.

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
- WF003 – Consultar Cadastro
- WF004 – Solicitar Nome
- WF005 – Validar Dados
- WF006 – Criar Cadastro
- WF007 – Registrar Logs
- WF008 – Enviar Confirmação

---

# Fluxo da User Story

1. A cliente envia uma mensagem pelo WhatsApp.
2. O sistema identifica o número do telefone.
3. O sistema consulta o Google Sheets.
4. O sistema verifica se já existe cadastro.
5. Caso não exista, o sistema solicita o nome da cliente.
6. A cliente informa o nome.
7. O sistema valida os dados recebidos.
8. O sistema cria o cadastro no Google Sheets.
9. O sistema registra data e hora do cadastro.
10. O sistema envia uma mensagem confirmando o cadastro.
11. O fluxo original do atendimento continua normalmente.
12. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Identificar cliente

**Dado que** uma mensagem seja recebida,

**Quando** o sistema identificar o número do WhatsApp,

**Então** deverá verificar se a cliente já está cadastrada.

---

## CA002 – Evitar duplicidade

**Dado que** o número já exista no Google Sheets,

**Quando** a consulta for realizada,

**Então** nenhum novo cadastro deverá ser criado.

---

## CA003 – Solicitar nome

**Dado que** a cliente não esteja cadastrada,

**Quando** o sistema iniciar o cadastro,

**Então** deverá solicitar o nome da cliente.

---

## CA004 – Validar nome

**Dado que** a cliente informe o nome,

**Quando** o sistema receber a resposta,

**Então** deverá validar que o nome não está vazio.

---

## CA005 – Criar cadastro

**Dado que** o nome seja válido,

**Quando** o processamento continuar,

**Então** o sistema deverá criar automaticamente o cadastro no Google Sheets.

---

## CA006 – Registrar data

**Dado que** o cadastro seja criado,

**Quando** o processo for concluído,

**Então** o sistema deverá registrar a data e hora do cadastro.

---

## CA007 – Definir status inicial

**Dado que** o cadastro seja criado,

**Quando** o registro for salvo,

**Então** o status da cliente deverá ser definido como **Ativa**.

---

## CA008 – Enviar confirmação

**Dado que** o cadastro tenha sido concluído,

**Quando** o processo terminar,

**Então** o sistema deverá enviar uma mensagem confirmando o cadastro.

---

## CA009 – Continuar atendimento

**Dado que** o cadastro tenha sido realizado durante outro fluxo,

**Quando** o cadastro terminar,

**Então** o sistema deverá retornar automaticamente ao fluxo original do atendimento.

---

## CA010 – Tratar falhas

**Dado que** ocorra erro ao salvar os dados,

**Quando** o sistema identificar a falha,

**Então** deverá informar a cliente e registrar o erro.

---

## CA011 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas para auditoria.

---

## CA012 – Linguagem cordial

**Dado que** o sistema envie mensagens para a cliente,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar cliente pelo número do telefone.
- RF003 – Consultar cadastro existente.
- RF004 – Solicitar nome da cliente.
- RF005 – Validar dados informados.
- RF006 – Criar cadastro no Google Sheets.
- RF007 – Registrar data e hora do cadastro.
- RF008 – Enviar confirmação.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – O cadastro deverá ser concluído em até 5 segundos após o recebimento do nome.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as operações deverão ser registradas em log.
- RNF005 – O sistema deverá garantir unicidade do cadastro por número de telefone.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Nome da Cliente | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Cadastro da Cliente | Google Sheets |
| Data e Hora do Cadastro | Google Sheets |
| Status da Cliente | Google Sheets |
| Mensagem de Confirmação | WhatsApp |
| Registro de Logs | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O Google Sheets for atualizado automaticamente.
- Não forem criados cadastros duplicados.
- A mensagem de confirmação for enviada.
- O fluxo original do atendimento continuar normalmente.
- Todos os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story é utilizada como base para praticamente todos os demais fluxos do BeautyFlow AI.
- O cadastro automático reduz a necessidade de formulários e melhora a conversão de novos contatos em clientes.
- Em versões futuras, poderão ser adicionados campos como e-mail, data de nascimento, endereço e preferências de atendimento.
- O Google Sheets será a base de clientes inicial do MVP, podendo ser substituído futuramente por um banco de dados relacional sem alterar a lógica dos workflows do n8n.
