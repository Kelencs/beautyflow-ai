# Casos de Uso

| ID | Caso de Uso | Status | Fluxo |
|---|---|---|---|
| UC001 | Agendar Atendimento | Implementado | WF001→WF002→WF003→WF005/WF004/WF012 |
| UC002 | Consultar Horários Disponíveis | Implementado | WF001→WF002→WF003→WF004 |
| UC003 | Reagendar Atendimento | Implementado com gap RN014 | WF001→WF002→WF003→WF006→WF004/WF012 |
| UC004 | Cancelar Atendimento | Implementado | WF001→WF002→WF003→WF007→WF012 |
| UC005 | Consultar Serviços, Preços e Duração | Parcial | WF001→WF002 |
| UC006 | Receber Confirmação do Agendamento | Implementado | WF005→WF012 |
| UC007 | Receber Lembretes | Parcial | Chamador→WF013→WF012 |
| UC008 | Cadastrar Cliente | Implementado | WF002→WF008 |
| UC009 | Atualizar Cadastro | Implementado | WF009 |
| UC010 | Consultar Histórico | Backlog | App futuro |
| UC011 | Lista de Espera | Backlog | Não implementado |
| UC012 | Registrar Avaliação Recebida | Backlog | Não implementado; WF014 só envia |
| UC013 | Registrar Pagamento | Implementado | WF010 |
| UC014 | Executar Cobrança Automática | Implementado | WF011→WF012 |
| UC015 | Enviar Pesquisa Pós-Atendimento | Parcial | Chamador→WF014→WF012 |
| UC016 | Reengajar Cliente Inativo | Parcial | Chamador→WF015→WF012 |

## Regra
Os UCs usam as RNs globais de `04-regras-de-negocio/`.
