<> Markdow

Caso de Uso 01 – Agendar Atendimento

Objetivo: Permitir que a cliente agende um horário pelo WhatsApp.

Atores: 
Cliente /
IA /
WhatsApp Cloud API /
n8n /
Google Calendar /
Google Sheets /

Pré-condições:
WhatsApp conectado /
Google Calendar configurado /
Google Sheets disponível.

Fluxo Principal

Cliente
    │
    ▼
Envia mensagem

"Quero agendar um horário"
    │
    ▼
Webhook recebe mensagem
    │
    ▼
IA identifica intenção
    │
    ▼
Cliente já existe?
 ┌───────────────┐
 │      NÃO      │
 └──────┬────────┘
        ▼
Cadastrar cliente
        │
        ▼
Perguntar serviço
        │
        ▼
Cliente escolhe serviço
        │
        ▼
Consultar duração
        │
        ▼
Consultar Google Calendar
        │
        ▼
Existem horários?
   │           │
   │Não        │Sim
   ▼           ▼
Informar       Mostrar opções
indisponível      │
                  ▼
        Cliente escolhe horário
                  │
                  ▼
Criar Evento Google Calendar
                  │
                  ▼
Salvar no Google Sheets
                  │
                  ▼
Enviar confirmação
                  │
                  ▼
Fim****

--------
UC002 – Consultar Horários Disponíveis
Objetivo

Permitir que a cliente consulte os horários disponíveis para um determinado serviço, considerando a agenda da profissional e as regras de negócio definidas.

Atores
Ator Principal
Cliente
Atores Secundários
WhatsApp Cloud API
n8n
AI Agent
Google Calendar
Google Sheets (registro da consulta)
Pré-condições
O WhatsApp Cloud API deve estar conectado.
O webhook da Meta deve estar ativo.
O Google Calendar deve estar configurado.
O AI Agent deve estar operacional.
O serviço solicitado deve estar cadastrado.
A agenda da profissional deve estar sincronizada com o Google Calendar.
Pós-condições
Em caso de sucesso
Os horários disponíveis são enviados ao cliente.
A consulta pode ser registrada para fins de análise.
Em caso de falha
O cliente é informado que não foi possível consultar a agenda.
O erro é registrado nos logs do sistema.
Fluxo Principal
Cliente envia:

"Tem horário amanhã?"

↓

WhatsApp Cloud API

↓

Webhook

↓

Workflow Receber Mensagem

↓

AI identifica intenção:
Consultar Horários

↓

Identificar serviço

↓

Consultar duração do serviço

↓

Consultar Google Calendar

↓

Aplicar regras de negócio

↓

Existem horários disponíveis?

        │
   ┌────┴─────┐
   │          │
 NÃO         SIM
   │          │
   ▼          ▼
Informar    Montar lista
indisponível de horários
              │
              ▼
Enviar resposta ao cliente

↓

Registrar consulta (opcional)

↓

Fim
Fluxos Alternativos
FA01 – Cliente não informa o serviço

A IA pergunta:

"Qual serviço você deseja agendar?"

Após a resposta, o fluxo principal continua.

FA02 – Cliente informa uma data inválida

A IA responde:

"Não consegui identificar a data. Poderia informar novamente?"

FA03 – Cliente solicita horários para outro dia

A IA consulta a nova data e reinicia a busca.

Exceções
EX01 – Google Calendar indisponível
Registrar erro.
Informar ao cliente que a agenda está temporariamente indisponível.
EX02 – Serviço não encontrado

A IA informa:

"Não encontrei esse serviço. Posso enviar a lista de serviços disponíveis?"

EX03 – Nenhum horário disponível

A IA oferece datas alternativas.

Exemplo:

Quinta-feira às 10:00
Sexta-feira às 15:00
Sábado às 09:00
Regras de Negócio Relacionadas
RN006 – Um horário só pode possuir um atendimento.
RN007 – Não permitir sobreposição de horários.
RN008 – Cada serviço possui uma duração específica.
RN009 – Deve existir um intervalo de 10 minutos entre atendimentos.
RN010 – Sempre consultar o Google Calendar antes de responder.
RN026 – Nunca informar horários sem consultar a agenda.
Dados Utilizados
Entrada
Número do cliente
Data desejada
Serviço desejado
Processamento
Identificação do cliente
Consulta da duração do serviço
Consulta ao Google Calendar
Aplicação das regras de negócio
Saída
Lista de horários disponíveis ou
Mensagem informando indisponibilidade e alternativas.
