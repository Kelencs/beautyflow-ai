# US009 – Atualizar Cadastro da Cliente

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US009 |
| **Título** | Atualizar Cadastro da Cliente |
| **Epic** | Gestão de Clientes |
| **Prioridade** | Média |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC009 – Atualizar Cadastro da Cliente |

---

# Descrição

Como cliente,

Quero atualizar meus dados cadastrais pelo WhatsApp,

Para que minhas informações permaneçam corretas e atualizadas para futuros atendimentos.

---

# Objetivo

Permitir que a cliente atualize suas informações cadastrais de forma rápida e automatizada através do WhatsApp, mantendo a base de dados sempre consistente.

---

# Valor de Negócio

Um cadastro atualizado melhora a comunicação com a cliente, reduz erros nos atendimentos, facilita campanhas de marketing e aumenta a qualidade dos dados utilizados pelo sistema.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas clientes cadastradas poderão atualizar seus dados.
- RN002 – O número do WhatsApp não poderá ser alterado.
- RN003 – Apenas os campos permitidos poderão ser atualizados.
- RN004 – Todas as alterações deverão ser registradas em histórico.
- RN005 – O Google Sheets será atualizado imediatamente após a confirmação.
- RN006 – Os dados deverão ser validados antes da atualização.
- RN007 – Toda alteração deverá registrar data e hora.
- RN008 – O sistema deverá enviar uma confirmação após a atualização.

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
- WF003 – Localizar Cadastro
- WF004 – Identificar Campo a Atualizar
- WF005 – Validar Dados
- WF006 – Atualizar Google Sheets
- WF007 – Registrar Histórico
- WF008 – Enviar Confirmação
- WF009 – Registrar Logs

---

# Fluxo da User Story

1. A cliente envia uma mensagem solicitando a atualização cadastral.
2. O sistema identifica a cliente pelo número do WhatsApp.
3. O sistema localiza o cadastro existente.
4. O sistema pergunta qual informação deseja alterar.
5. A cliente informa o campo.
6. O sistema solicita o novo valor.
7. A cliente envia a nova informação.
8. O sistema valida os dados.
9. O sistema atualiza o Google Sheets.
10. O sistema registra o histórico da alteração.
11. O sistema envia uma confirmação.
12. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Identificar cliente

**Dado que** uma mensagem seja recebida,

**Quando** o sistema identificar o número do WhatsApp,

**Então** deverá localizar o cadastro correspondente.

---

## CA002 – Verificar existência do cadastro

**Dado que** a cliente solicite atualização,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá confirmar que a cliente está cadastrada.

---

## CA003 – Solicitar informação

**Dado que** o cadastro exista,

**Quando** o fluxo iniciar,

**Então** o sistema deverá perguntar qual dado deseja alterar.

---

## CA004 – Validar campo

**Dado que** a cliente informe o campo,

**Quando** o sistema receber a informação,

**Então** deverá verificar se aquele campo pode ser alterado.

---

## CA005 – Solicitar novo valor

**Dado que** o campo seja válido,

**Quando** o sistema continuar,

**Então** deverá solicitar o novo valor.

---

## CA006 – Validar informação

**Dado que** a cliente envie o novo valor,

**Quando** o sistema receber a resposta,

**Então** deverá validar o conteúdo antes da atualização.

---

## CA007 – Atualizar cadastro

**Dado que** os dados sejam válidos,

**Quando** o processamento continuar,

**Então** o Google Sheets deverá ser atualizado automaticamente.

---

## CA008 – Registrar histórico

**Dado que** o cadastro tenha sido atualizado,

**Quando** o processo terminar,

**Então** o sistema deverá registrar:

- Campo alterado;
- Valor anterior;
- Novo valor;
- Data;
- Hora.

---

## CA009 – Enviar confirmação

**Dado que** a atualização tenha sido concluída,

**Quando** o sistema finalizar o processamento,

**Então** deverá enviar uma confirmação pelo WhatsApp.

---

## CA010 – Campo não permitido

**Dado que** a cliente tente alterar um campo não permitido,

**Quando** o sistema identificar essa situação,

**Então** deverá informar que a alteração não é permitida.

---

## CA011 – Tratar falhas

**Dado que** ocorra erro durante a atualização,

**Quando** o sistema detectar a falha,

**Então** deverá informar a cliente e registrar o erro.

---

## CA012 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas em log.

---

## CA013 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar cliente.
- RF003 – Consultar cadastro.
- RF004 – Permitir atualização cadastral.
- RF005 – Validar informações.
- RF006 – Atualizar Google Sheets.
- RF007 – Registrar histórico.
- RF008 – Enviar confirmação.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – A atualização deverá ser concluída em até 5 segundos.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as alterações deverão ser registradas em log.
- RNF005 – O sistema deverá garantir a integridade dos dados cadastrados.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| Campo a Atualizar | Sim |
| Novo Valor | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Cadastro Atualizado | Google Sheets |
| Histórico da Alteração | Google Sheets |
| Confirmação | WhatsApp |
| Registro de Logs | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O Google Sheets for atualizado automaticamente.
- O histórico da alteração for registrado.
- A confirmação for enviada pelo WhatsApp.
- Os logs forem gravados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story complementa a **US008 – Cadastrar Cliente**.
- O número do WhatsApp será utilizado como identificador único e não poderá ser alterado por este fluxo.
- Os campos inicialmente permitidos para atualização serão:
  - Nome;
  - E-mail;
  - Data de Nascimento;
  - Observações;
  - Preferências de Atendimento.
- Em versões futuras, o sistema poderá permitir o envio de fotos de referência, preferências de cores, alergias a produtos, redes sociais e outras informações relevantes para personalização do atendimento.
- Todas as alterações deverão permanecer registradas para auditoria e rastreabilidade.
