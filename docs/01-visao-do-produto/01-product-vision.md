# Product Vision — BeautyFlow AI

## Visão

Para profissionais e empresas do setor de beleza que perdem tempo com tarefas operacionais e atendimento repetitivo, o BeautyFlow AI é uma plataforma de automação e gestão que conecta WhatsApp, IA, agenda, relacionamento e operação em um fluxo único.

Ao contrário de um chatbot isolado, o BeautyFlow executa processos de negócio rastreáveis — consulta disponibilidade, cria/reagenda/cancela agendamentos, registra clientes e pagamentos, envia comunicações e mantém logs.

## Produto atual

O núcleo executável atual é formado pelos WF001–WF018 no n8n, integrados a:
- WhatsApp Cloud API;
- Google Gemini;
- Google Sheets;
- Google Calendar;
- Google Drive.

## Evolução

O BeautyFlow App adicionará uma interface web sem duplicar as regras já executadas no n8n.

Stack aprovada:
- Next.js;
- NestJS;
- TypeScript;
- Tailwind;
- Supabase Auth/Postgres para a camada nova;
- Google Gemini como provedor de IA.

## Não usar como descrição atual
- OpenAI/GPT como provedor implementado;
- Evolution API como dependência do produto atual;
- PostgreSQL completo como substituto já ativo das Sheets.
