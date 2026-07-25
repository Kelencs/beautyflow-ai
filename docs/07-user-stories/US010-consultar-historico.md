# US010 – Consultar Histórico de Atendimentos

## Identificação

| Campo | Valor |
|--------|-------|
| **ID** | US010 |
| **Título** | Consultar Histórico de Atendimentos |
| **Epic** | Gestão de Clientes |
| **Prioridade** | Média |
| **Story Points** | 5 |
| **Status** | Backlog |
| **Caso de Uso Relacionado** | UC010 – Consultar Histórico de Atendimentos |

---

# Descrição

Como cliente,

Quero consultar meu histórico de atendimentos pelo WhatsApp,

Para que eu possa visualizar os serviços realizados anteriormente, suas datas e demais informações dos meus atendimentos.

---

# Objetivo

Permitir que a cliente consulte, de forma rápida e automatizada, todo o seu histórico de atendimentos registrados no sistema, utilizando apenas uma conversa pelo WhatsApp.

---

# Valor de Negócio

Disponibilizar o histórico de atendimentos aumenta a transparência, melhora a experiência da cliente e auxilia na fidelização, além de permitir futuras recomendações personalizadas de serviços.

---

# Regras de Negócio Relacionadas

- RN001 – Apenas clientes cadastradas poderão consultar seu histórico.
- RN002 – O número do WhatsApp será utilizado como identificador da cliente.
- RN003 – Somente atendimentos da própria cliente poderão ser exibidos.
- RN004 – O histórico deverá ser apresentado em ordem cronológica decrescente.
- RN005 – Apenas atendimentos concluídos deverão ser exibidos por padrão.
- RN006 – O sistema poderá limitar a quantidade de registros exibidos por mensagem.
- RN007 – Todas as consultas deverão ser registradas em log.
- RN008 – Os dados apresentados deverão refletir as informações registradas no Google Sheets.

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
- WF004 – Buscar Histórico
- WF005 – Organizar Dados
- WF006 – Gerar Resposta
- WF007 – Enviar Histórico
- WF008 – Registrar Logs

---

# Fluxo da User Story

1. A cliente solicita seu histórico de atendimentos.
2. O sistema identifica o número do WhatsApp.
3. O sistema localiza o cadastro da cliente.
4. O sistema consulta os atendimentos registrados.
5. O sistema organiza os registros do mais recente para o mais antigo.
6. O sistema monta a resposta.
7. O sistema envia o histórico pelo WhatsApp.
8. O sistema registra a operação nos logs.
9. O processo é encerrado.

---

# Critérios de Aceite

## CA001 – Identificar cliente

**Dado que** a cliente envie uma solicitação de histórico,

**Quando** o sistema identificar seu número do WhatsApp,

**Então** deverá localizar seu cadastro.

---

## CA002 – Validar cadastro

**Dado que** a cliente solicite seu histórico,

**Quando** o sistema consultar o Google Sheets,

**Então** deverá confirmar que a cliente está cadastrada.

---

## CA003 – Buscar histórico

**Dado que** a cliente esteja cadastrada,

**Quando** a consulta for realizada,

**Então** o sistema deverá recuperar todos os atendimentos concluídos da cliente.

---

## CA004 – Organizar informações

**Dado que** existam atendimentos registrados,

**Quando** os dados forem recuperados,

**Então** deverão ser apresentados do mais recente para o mais antigo.

---

## CA005 – Exibir informações

**Dado que** o histórico seja apresentado,

**Quando** a cliente receber a mensagem,

**Então** cada atendimento deverá conter:

- Data;
- Horário;
- Serviço realizado;
- Profissional;
- Status do atendimento.

---

## CA006 – Histórico vazio

**Dado que** a cliente ainda não possua atendimentos concluídos,

**Quando** a consulta for realizada,

**Então** o sistema deverá informar que não há histórico disponível.

---

## CA007 – Limitar quantidade

**Dado que** a cliente possua muitos atendimentos,

**Quando** o histórico for apresentado,

**Então** o sistema poderá limitar a quantidade de registros exibidos em uma única mensagem e oferecer a continuação da consulta.

---

## CA008 – Privacidade

**Dado que** o histórico seja consultado,

**Quando** os dados forem exibidos,

**Então** apenas informações da própria cliente deverão ser apresentadas.

---

## CA009 – Registrar logs

**Dado que** o processo seja executado,

**Quando** ocorrer sucesso ou falha,

**Então** todas as operações deverão ser registradas em log.

---

## CA010 – Tratar falhas

**Dado que** ocorra erro durante a consulta,

**Quando** o sistema detectar a falha,

**Então** deverá informar a cliente e registrar o erro.

---

## CA011 – Linguagem cordial

**Dado que** o sistema envie mensagens,

**Quando** responder à cliente,

**Então** deverá utilizar linguagem clara, objetiva, amigável e profissional.

---

# Requisitos Funcionais Relacionados

- RF001 – Receber mensagens do WhatsApp.
- RF002 – Identificar cliente.
- RF003 – Consultar cadastro.
- RF004 – Buscar histórico de atendimentos.
- RF005 – Organizar histórico.
- RF006 – Enviar histórico pelo WhatsApp.
- RF007 – Registrar logs.

---

# Requisitos Não Funcionais Relacionados

- RNF001 – A consulta deverá ser concluída em até 5 segundos.
- RNF002 – O sistema deverá possuir disponibilidade mínima de 99,5%.
- RNF003 – Toda comunicação deverá utilizar HTTPS.
- RNF004 – Todas as consultas deverão ser registradas em log.
- RNF005 – O sistema deverá garantir a confidencialidade das informações da cliente.

---

# Dados de Entrada

| Campo | Obrigatório |
|--------|-------------|
| Número do WhatsApp | Sim |

---

# Dados de Saída

| Campo | Destino |
|--------|----------|
| Histórico de Atendimentos | WhatsApp |
| Registro da Consulta | Logs |

---

# Critério de Pronto (Definition of Done)

A User Story será considerada concluída quando:

- Todos os critérios de aceite forem aprovados.
- O Workflow do n8n estiver funcionando corretamente.
- O histórico for recuperado corretamente do Google Sheets.
- As informações forem apresentadas em ordem cronológica decrescente.
- Apenas dados da própria cliente forem exibidos.
- Os logs forem registrados.
- A documentação estiver atualizada.
- O código estiver versionado no GitHub.
- O Product Owner aprovar a funcionalidade.

---

# Observações

- Esta User Story complementa a **US008 – Cadastrar Cliente** e a **US009 – Atualizar Cadastro**, utilizando o cadastro existente para localizar os atendimentos.
- O Google Sheets será a fonte oficial do histórico durante o MVP.
- Em versões futuras, o histórico poderá incluir:
  - Fotos dos resultados dos procedimentos;
  - Produtos utilizados;
  - Observações da profissional;
  - Valores pagos;
  - Forma de pagamento;
  - Avaliações realizadas pela cliente;
  - Recomendações para o próximo atendimento.
- O histórico também poderá ser utilizado futuramente para alimentar agentes de IA responsáveis por recomendações personalizadas de serviços e campanhas de fidelização.
