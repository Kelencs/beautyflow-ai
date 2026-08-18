# Casos de Teste

## Convenção

A partir de 18/08/2026, cada workflow n8n possui um caso principal correspondente.

| Caso | Workflow | Nome |
|---|---|---|
| CT001 | WF001 | ATD - Receber WhatsApp |
| CT002 | WF002 | ATD - IA Atendimento |
| CT003 | WF003 | ATD - Identificar Intenção |
| CT004 | WF004 | AGE - Consultar Disponibilidade |
| CT005 | WF005 | AGE - Criar Agendamento |
| CT006 | WF006 | AGE - Reagendar |
| CT007 | WF007 | AGE - Cancelar Agendamento |
| CT008 | WF008 | CLI - Cadastrar Cliente |
| CT009 | WF009 | CLI - Atualizar Cliente |
| CT010 | WF010 | FIN - Registrar Pagamento |
| CT011 | WF011 | FIN - Cobrança |
| CT012 | WF012 | COM - Confirmação/Comunicação |
| CT013 | WF013 | COM - Lembrete |
| CT014 | WF014 | COM - Pesquisa |
| CT015 | WF015 | COM - Follow-up |
| CT016 | WF016 | ADM - Backup |
| CT017 | WF017 | ADM - Logs |
| CT018 | WF018 | ADM - Limpeza |

Os CTs funcionam como roteiro de regressão. A aprovação efetiva deve ser registrada em `../Evidencias/`.

## Status

Não preencher `Resultado obtido` permanentemente com dados de execução se o mesmo CT for reutilizado. Para preservar histórico, registrar execução datada em evidências e referenciar o CT.
