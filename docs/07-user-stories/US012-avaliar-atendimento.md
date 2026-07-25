# US012 – Avaliar Atendimento

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US012 |
| **Título** | Avaliar Atendimento |
| **Epic** | Experiência do Cliente |
| **Prioridade** | Média |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC012 – Avaliar Atendimento |

---

# Descrição

Como cliente,

Quero avaliar o atendimento recebido após meu procedimento,

Para que eu possa informar meu nível de satisfação e contribuir para a melhoria contínua dos serviços prestados.

---

# Objetivo

Permitir que a cliente avalie automaticamente o atendimento realizado por meio do WhatsApp, registrando sua satisfação, comentários e sugestões para apoiar a melhoria contínua do negócio.

---

# Valor de Negócio

A coleta automática de avaliações permite medir a satisfação das clientes, identificar oportunidades de melhoria, aumentar a fidelização e gerar indicadores importantes para a gestão do salão.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas atendimentos com status **Concluído** poderão ser avaliados.
- RN002 – Cada atendimento poderá receber apenas uma avaliação.
- RN003 – A solicitação de avaliação deverá ser enviada automaticamente após a conclusão do atendimento.
- RN004 – A avaliação será composta por nota de 1 a 5 estrelas.
- RN005 – O comentário da cliente será opcional.
- RN006 – Todas as avaliações deverão ser registradas no Google Sheets.
- RN007 – O sistema deverá registrar data e hora da avaliação.
- RN008 – Todas as avaliações deverão permanecer disponíveis para consultas e relatórios.

---

# Dependências

## Serviços

- WhatsApp Cloud API
- Google Sheets API
- Google Calendar API
- OpenAI
- n8n

---

## Workflows

- WF001 – Identificar Atendimento Concluído
- WF002 – Enviar Solicitação de Avaliação
- WF003 – Receber Avaliação
- WF004 – Validar Dados
- WF005 – Registrar Avaliação
- WF006 – Atualizar Indicadores
- WF007 – Registrar Logs

---

# Fluxo da User Story

1. O atendimento é concluído.
2. O sistema identifica a conclusão do atendimento.
3. O sistema envia automaticamente uma solicitação de avaliação.
4. A cliente responde com uma nota de 1 a 5.
5. O sistema solicita um comentário opcional.
6. A cliente envia o comentário ou opta por não comentar.
7. O sistema valida as informações.
8. O sistema registra a avaliação no Google Sheets.
9. O sistema atualiza os indicadores de satisfação.
10. O sistema agradece pela participação.
11. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Identificar atendimento concluído

**Dado que** um atendimento seja finalizado,

**Quando** seu status for alterado para **Concluído**,

**Então** o sistema deverá iniciar automaticamente o workflow de avaliação.

---

## CA002 – Enviar solicitação

**Dado que** o atendimento tenha sido concluído,

**Quando** o workflow iniciar,

**Então** o sistema deverá enviar uma mensagem solicitando a avaliação.

---

## CA003 – Receber nota

**Dado que** a cliente receba a solicitação,

**Quando** responder,

**Então** deverá ser possível informar uma nota entre **1 e 5 estrelas**.

---

## CA004 – Validar nota

**Dado que** a cliente envie uma nota,

**Quando** o sistema receber a resposta,

**Então** deverá validar que o valor informado esteja entre 1 e 5.

---

## CA005 – Solicitar comentário

**Dado que** a nota tenha sido registrada,

**Quando** o processo continuar,

**Então** o sistema deverá oferecer a opção de registrar um comentário.

---

## CA006 – Registrar avaliação

**Dado que** a avaliação seja válida,

**Quando** o processamento terminar,

**Então** o sistema deverá registrar:

- Nome da cliente;
- Atendimento;
- Serviço realizado;
- Nota;
- Comentário (quando informado);
- Data;
- Hora.

---

## CA007 – Evitar duplicidade

**Dado que** o atendimento já possua uma avaliação,

**Quando** uma nova tentativa ocorrer,

**Então** o sistema deverá impedir uma segunda avaliação para o mesmo atendimento.

---

## CA008 – Atualizar indicadores

**Dado que** uma nova avaliação seja registrada,

**Quando** o processo for concluído,

**Então** o sistema deverá atualizar automaticamente os indicadores de satisfação.

---

## CA009 – Agradecer participação

**Dado que** a avaliação tenha sido registrada,

**Quando** o processo terminar,

**Então** o sistema deverá enviar uma mensagem de agradecimento à cliente.

---

## CA010 – Registrar logs

**Dado que** qualquer etapa do workflow seja executada,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas para auditoria.

---

## CA011 – Tratar falhas

**Dado que** ocorra erro durante o registro da avaliação,

**Quando** o sistema identificar a falha,

**Então** deverá registrar o erro e informar a cliente.

---

## CA012 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** houver interação,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Identificar atendimento concluído.
- RF002 – Enviar solicitação de avaliação.
- RF003 – Receber nota da cliente.
- RF004 – Receber comentário opcional.
- RF005 – Validar avaliação.
- RF006 – Registrar avaliação.
- RF007 – Atualizar indicadores.
- RF008 – Enviar mensagem de agradecimento.
- RF009 – Registrar logs.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – A solicitação deverá ser enviada em até 30 minutos após a conclusão do atendimento.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as avaliações deverão ser registradas em log.
- RNF005 – Os dados das avaliações deverão permanecer íntegros e disponíveis para consultas futuras.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |
| ID do Atendimento | Sim |
| Nota (1 a 5) | Sim |
| Comentário | Não |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Avaliação Registrada | Google Sheets |
| Indicadores Atualizados | Google Sheets |
| Mensagem de Agradecimento | WhatsApp |
| Registro de Logs | Sistema |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- A solicitação de avaliação for enviada automaticamente.
- A nota e o comentário forem registrados corretamente.
- Não for possível avaliar o mesmo atendimento duas vezes.
- Os indicadores de satisfação forem atualizados automaticamente.
- A mensagem de agradecimento for enviada.
- Todos os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story depende da conclusão do fluxo de atendimento iniciado na **US001 – Agendar Atendimento**.
- As avaliações poderão ser utilizadas para alimentar dashboards no Power BI, permitindo acompanhar indicadores como média de satisfação, quantidade de avaliações, evolução mensal e percentual de clientes satisfeitas.
- Em versões futuras, poderão ser implementadas funcionalidades como:
  - NPS (Net Promoter Score);
  - envio automático de cupons para clientes que avaliarem positivamente;
  - abertura automática de chamados para avaliações negativas;
  - análise de sentimento utilizando IA sobre os comentários;
  - geração automática de solicitações de depoimentos para Google Meu Negócio e redes sociais.
