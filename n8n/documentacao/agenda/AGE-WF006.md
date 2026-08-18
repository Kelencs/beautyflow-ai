# WF006 — AGE - WF006 - Reagendar

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`AGE-WF006-reagendar.json`](../../workflows/agenda/AGE-WF006-reagendar.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Localizar um agendamento existente, validar a janela de alteração, consultar nova disponibilidade e executar o reagendamento quando os requisitos do fluxo atual são atendidos.

## 2. Identificação técnica

- **Workflow:** `AGE - WF006 - Reagendar`
- **ID funcional:** `WF006`
- **Arquivo JSON:** `AGE-WF006-reagendar.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; normalmente acionado pelo WF003 na intenção `REAGENDAR`.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Contexto de empresa/cliente, `id_agendamento` opcional, telefone, data/hora novas, profissional, `google_event_id`, `phone_number_id`, origem e demais dados conversacionais.

## 4. Fluxo real do workflow

1. Busca agendamentos `AGENDADO` da empresa e busca cliente por telefone.
2. `CODE - Localizar Agendamento` prioriza `id_agendamento`; sem ele, resolve por `id_cliente`/telefone e usa data para desambiguar quando necessário.
3. Busca a empresa em `EMPRESAS`.
4. `CODE - Validar Prazo` calcula o tempo até o agendamento e compara com `TEMPO_CANCELAMENTO_MIN` da empresa.
5. Dentro do prazo permitido, chama WF004 para consultar nova disponibilidade.
6. `CODE - Selecionar Novo Horário` valida a hora solicitada contra a lista real do WF004 ou seleciona o primeiro horário disponível.
7. Se não houver `google_event_id`, retorna `SEM_GOOGLE_EVENT_ID` e não segue para atualização automática.
8. Com ID de evento, aciona `GC - Atualizar Evento` e depois atualiza `AGENDAMENTOS` no Google Sheets.
9. Os ramos convergem, WF012 comunica o cliente e WF017 registra log; o SET final prepara a saída.

## 5. Regras e decisões implementadas

- Prioridade de localização: ID do agendamento; depois cliente; data é usada como critério de desambiguação quando há múltiplos candidatos.
- O prazo de reagendamento reutiliza o campo `TEMPO_CANCELAMENTO_MIN` da empresa.
- Novo horário precisa constar na disponibilidade produzida pelo WF004.
- Sem `google_event_id`, a automação não atualiza o agendamento e sinaliza necessidade de tratamento.
- O calendário configurado é **BeautyFlow - Studio Bella**.
- No JSON exportado, o node `GC - Atualizar Evento` possui `updateFields: {}`. Esta documentação não presume campos de Calendar que não aparecem configurados no arquivo.

## 6. Integrações e dependências

- Google Sheets: `AGENDAMENTOS`, `CLIENTES`, `EMPRESAS`.
- WF004 — Consultar Disponibilidade.
- Google Calendar.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Status de negócio incluem localização não encontrada/múltipla, prazo bloqueado, indisponibilidade, ausência de Google Event ID e sucesso `REAGENDADO`.

## 8. Tratamento de erros e bloqueios

- Condições de negócio bloqueiam a atualização antes dos nodes externos correspondentes.
- Falhas técnicas de atualização são consolidadas no fluxo de erro previsto pelo JSON.

## 9. Observações do JSON atual

- O JSON atual não implementa uma regra separada de “apenas um reagendamento”; a documentação deve refletir somente as validações presentes.

## 10. Critério de manutenção desta documentação

Sempre que `AGE-WF006-reagendar.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
