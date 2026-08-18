# WF007 — AGE - WF007 - Cancelar Agendamento

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`AGE-WF007-cancelar.json`](../../workflows/agenda/AGE-WF007-cancelar.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Localizar e cancelar um agendamento dentro da janela permitida, refletindo o cancelamento no Google Calendar quando possível e no Google Sheets.

## 2. Identificação técnica

- **Workflow:** `AGE - WF007 - Cancelar Agendamento`
- **ID funcional:** `WF007`
- **Arquivo JSON:** `AGE-WF007-cancelar.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; normalmente acionado pelo WF003 na intenção `CANCELAR`.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Contexto de empresa/cliente, `id_agendamento` opcional, telefone, data, `google_event_id`, motivo, `phone_number_id`, origem e demais dados do atendimento.

## 4. Fluxo real do workflow

1. Busca agendamentos com status `AGENDADO` e o cliente por telefone.
2. Localiza o agendamento priorizando ID e, quando necessário, cliente/data.
3. Busca a empresa e obtém a configuração da janela de cancelamento.
4. `CODE - Validar Prazo` compara o horário do agendamento com `TEMPO_CANCELAMENTO_MIN`.
5. Quando existe `google_event_id`, exclui o evento no Google Calendar.
6. Atualiza a linha de `AGENDAMENTOS` para `CANCELADO`, gravando data/motivo do cancelamento e última atualização.
7. Quando não existe `google_event_id`, o fluxo pode seguir diretamente para a atualização da planilha.
8. Os resultados convergem, WF012 comunica o cliente e WF017 registra o evento.

## 5. Regras e decisões implementadas

- Cancelamento automático depende da janela `TEMPO_CANCELAMENTO_MIN` da empresa; não há prazo fixo de duas horas no JSON atual.
- O status persistido no agendamento é `CANCELADO`.
- O motivo e a data de cancelamento são registrados quando a atualização ocorre.
- O calendário utilizado está configurado diretamente como **BeautyFlow - Studio Bella**.
- A ausência de `google_event_id` não impede, por si só, a atualização do status no Sheets.

## 6. Integrações e dependências

- Google Sheets: `AGENDAMENTOS`, `CLIENTES`, `EMPRESAS`.
- Google Calendar.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Resultados de negócio cobrem cancelamento concluído, agendamento não localizado/múltiplo, cancelamento fora do prazo e erro técnico.

## 8. Tratamento de erros e bloqueios

- Falha no Calendar/Sheets percorre os ramos técnicos configurados antes da consolidação.

## 9. Observações do JSON atual

- A resposta ao cliente é enviada via WF012, não por HTTP direto neste workflow.

## 10. Critério de manutenção desta documentação

Sempre que `AGE-WF007-cancelar.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
