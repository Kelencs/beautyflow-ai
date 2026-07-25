# **UC012 – Avaliar Atendimento**

---

# Objetivo

Permitir que a cliente avalie o atendimento recebido após a conclusão do serviço, por meio do WhatsApp, registrando sua satisfação, comentários e sugestões de melhoria. As avaliações poderão ser utilizadas para indicadores de qualidade, fidelização de clientes e melhoria contínua dos serviços prestados.

---

# Atores

## Ator Principal

- Cliente

## Atores Secundários

- Nail Designer
- WhatsApp Cloud API
- n8n
- AI Agent
- Google Sheets (Avaliações)
- Google Calendar

---

# Pré-condições

- A cliente deve possuir um atendimento concluído.
- O atendimento deve estar registrado como **Concluído**.
- A WhatsApp Cloud API deve estar configurada e ativa.
- O Webhook da Meta deve estar operacional.
- O AI Agent deve estar operacional.
- O Google Sheets deve estar acessível.
- O Workflow de envio de avaliações deve estar habilitado.

---

# Fluxo Principal

1. Após a conclusão do atendimento, o sistema agenda automaticamente o envio da pesquisa de satisfação.

2. No horário configurado, o n8n envia uma mensagem pelo WhatsApp.

3. A cliente recebe uma mensagem solicitando sua avaliação.

4. O sistema apresenta uma escala de avaliação de 1 a 5 estrelas.

Exemplo:

⭐ 1 - Muito Insatisfeita

⭐⭐ 2 - Insatisfeita

⭐⭐⭐ 3 - Regular

⭐⭐⭐⭐ 4 - Satisfeita

⭐⭐⭐⭐⭐ 5 - Muito Satisfeita

5. A cliente informa sua nota.

6. O sistema registra a avaliação.

7. O sistema pergunta se a cliente deseja deixar um comentário.

8. A cliente envia um comentário (opcional).

9. O sistema registra o comentário.

10. O sistema atualiza o Google Sheets.

11. O sistema agradece pela avaliação.

12. O caso de uso é encerrado.

---

# Fluxos Alternativos

## FA001 – Cliente informa apenas a nota

O sistema registra a nota e encerra o fluxo.

---

## FA002 – Cliente informa nota e comentário

O sistema registra ambas as informações.

---

## FA003 – Cliente não deseja avaliar

O sistema registra a recusa e encerra o atendimento.

---

## FA004 – Cliente envia apenas comentário

O sistema solicita que seja informada também a nota da avaliação.

---

## FA005 – Cliente altera a avaliação

Enquanto o fluxo estiver aberto, a cliente poderá alterar sua nota antes da finalização.

---

# Exceções

## EX001 – Atendimento não encontrado

O sistema informa:

> "Não encontrei um atendimento concluído para realizar esta avaliação."

---

## EX002 – Atendimento já avaliado

O sistema informa:

> "Este atendimento já foi avaliado anteriormente."

---

## EX003 – Google Sheets indisponível

O sistema registra o erro e informa que não foi possível salvar a avaliação.

---

## EX004 – Erro durante o registro

O sistema registra o erro para auditoria e informa a cliente sobre a indisponibilidade temporária.

---

# Regras de Negócio

- RN001 – Apenas atendimentos concluídos poderão ser avaliados.
- RN002 – Cada atendimento poderá receber apenas uma avaliação.
- RN003 – A nota deverá estar entre 1 e 5 estrelas.
- RN004 – O comentário será opcional.
- RN005 – A avaliação ficará vinculada ao atendimento realizado.
- RN006 – Todas as avaliações deverão possuir data e hora.
- RN007 – O histórico de avaliações não poderá ser excluído automaticamente.
- RN023 – O sistema deverá utilizar linguagem cordial.
- RN033 – Todas as avaliações deverão ser registradas para geração de indicadores.

---

# Dados Utilizados

## Entrada

- Número do WhatsApp
- Identificador do atendimento
- Nota da avaliação
- Comentário (opcional)

---

## Processamento

- Localização do atendimento
- Validação do status
- Validação da nota
- Registro da avaliação
- Registro do comentário
- Atualização do Google Sheets

---

## Saída

- Avaliação registrada
- Comentário registrado
- Google Sheets atualizado
- Mensagem de agradecimento enviada

---

# User Story

**ID:** US012

**Título:** Avaliar atendimento

**Como** cliente,

**Quero** avaliar o atendimento recebido,

**Para que** eu possa compartilhar minha experiência e contribuir para a melhoria dos serviços prestados.

---

# Workflows n8n Relacionados

| Workflow | Nome | Responsabilidade |
|-----------|------|------------------|
| WF001 | Scheduler Pós-Atendimento | Identificar atendimentos concluídos e iniciar a pesquisa de satisfação. |
| WF002 | Buscar Atendimento | Localizar o atendimento realizado no Google Calendar ou Google Sheets. |
| WF003 | Enviar Pesquisa | Enviar a solicitação de avaliação pelo WhatsApp. |
| WF004 | Receber Resposta | Receber a nota enviada pela cliente. |
| WF005 | AI Agent | Interpretar a nota e identificar comentários adicionais. |
| WF006 | Validar Avaliação | Validar a nota e verificar se o atendimento já foi avaliado. |
| WF007 | Registrar Avaliação | Salvar nota e comentário no Google Sheets. |
| WF008 | Atualizar Indicadores | Atualizar métricas de satisfação (NPS interno, média de avaliações etc.). |
| WF009 | Enviar Agradecimento | Enviar mensagem de agradecimento à cliente. |
| WF010 | Registrar Logs | Registrar toda a execução do processo para auditoria. |

---

# Critérios de Aceite

### CA001 – Enviar pesquisa automaticamente

**Dado que** um atendimento tenha sido concluído,

**Quando** o horário configurado para envio da pesquisa for atingido,

**Então** o sistema deverá enviar automaticamente uma solicitação de avaliação pelo WhatsApp.

---

### CA002 – Validar atendimento

**Dado que** a pesquisa seja iniciada,

**Quando** o sistema localizar o atendimento,

**Então** deverá confirmar que ele possui status **Concluído**.

---

### CA003 – Apresentar escala de avaliação

**Dado que** a cliente receba a pesquisa,

**Quando** visualizar a mensagem,

**Então** deverá ser apresentada uma escala de 1 a 5 estrelas.

---

### CA004 – Registrar nota

**Dado que** a cliente informe uma nota válida,

**Quando** o sistema receber a resposta,

**Então** deverá registrar a nota no Google Sheets.

---

### CA005 – Solicitar comentário

**Dado que** a nota tenha sido registrada,

**Quando** o fluxo continuar,

**Então** o sistema deverá perguntar se a cliente deseja deixar um comentário.

---

### CA006 – Registrar comentário

**Dado que** a cliente envie um comentário,

**Quando** o sistema receber a mensagem,

**Então** deverá registrar o comentário juntamente com a avaliação.

---

### CA007 – Permitir avaliação sem comentário

**Dado que** a cliente informe apenas a nota,

**Quando** o fluxo terminar,

**Então** o sistema deverá concluir a avaliação normalmente.

---

### CA008 – Impedir avaliações duplicadas

**Dado que** o atendimento já tenha sido avaliado,

**Quando** uma nova tentativa ocorrer,

**Então** o sistema deverá impedir o registro de uma segunda avaliação.

---

### CA009 – Validar nota

**Dado que** a cliente informe uma nota,

**Quando** o sistema validar a resposta,

**Então** deverá aceitar apenas valores entre 1 e 5 estrelas.

---

### CA010 – Atualizar indicadores

**Dado que** uma nova avaliação seja registrada,

**Quando** o processo for concluído,

**Então** os indicadores de satisfação deverão ser atualizados automaticamente.

---

### CA011 – Atualizar Google Sheets

**Dado que** a avaliação tenha sido registrada,

**Quando** o processo terminar,

**Então** o Google Sheets deverá conter a nota, comentário, data e identificação do atendimento.

---

### CA012 – Enviar agradecimento

**Dado que** a avaliação tenha sido concluída,

**Quando** o registro for salvo,

**Então** o sistema deverá enviar uma mensagem agradecendo a participação da cliente.

---

### CA013 – Registrar logs

**Dado que** qualquer etapa do processo seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** o sistema deverá registrar logs para auditoria.

---

### CA014 – Utilizar linguagem cordial

**Dado que** o sistema interaja com a cliente,

**Quando** enviar qualquer mensagem,

**Então** deverá utilizar linguagem clara, respeitosa, amigável e profissional.

---

### CA015 – Garantir rastreabilidade

**Dado que** uma avaliação seja registrada,

**Quando** o processo for concluído,

**Então** a avaliação deverá permanecer vinculada ao atendimento correspondente, permitindo consultas futuras, geração de relatórios e análise de indicadores de qualidade.

