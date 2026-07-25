
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
