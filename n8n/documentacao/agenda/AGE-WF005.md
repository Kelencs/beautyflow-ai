# WF005 — AGE - WF005 - Criar Agendamento

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`AGE-WF005-criar-agendamento.json`](../../workflows/agenda/AGE-WF005-criar-agendamento.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Criar um agendamento somente após validar disponibilidade, persistindo o evento no Google Calendar e o registro operacional no Google Sheets, e comunicar o resultado ao cliente.

## 2. Identificação técnica

- **Workflow:** `AGE - WF005 - Criar Agendamento`
- **ID funcional:** `WF005`
- **Arquivo JSON:** `AGE-WF005-criar-agendamento.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; normalmente acionado pelo WF003 na intenção `AGENDAR`.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Contexto de cliente, empresa, serviço, data, horário, período, profissional, `phone_number_id`, origem e demais dados de atendimento.

## 4. Fluxo real do workflow

1. Chama WF004 para obter a disponibilidade real.
2. `CODE - Validar Disponibilidade` valida o retorno do WF004 e a hora solicitada; quando não existe hora explícita, seleciona deterministicamente o primeiro horário livre.
3. Calcula hora final a partir da duração e bloqueia intervalos que atravessem a meia-noite.
4. Quando disponível, `CODE - Gerar Agendamento` cria o identificador e o registro lógico do agendamento com status `AGENDADO`.
5. `GC - Criar Evento` cria o evento no Google Calendar configurado.
6. `GS - Registrar Agendamento` grava a linha na aba `AGENDAMENTOS`, incluindo o ID retornado pelo Calendar.
7. Os ramos de sucesso, indisponibilidade e erro técnico convergem.
8. WF012 envia a resposta ao cliente e WF017 registra o resultado.
9. O SET final devolve o contrato do WF005.

## 5. Regras e decisões implementadas

- Agendamento só é criado após consulta ao WF004.
- Uma hora solicitada precisa estar na lista de horários retornada pelo WF004.
- Sem hora solicitada, o primeiro horário livre é escolhido.
- Intervalo que ultrapassa 00:00 é bloqueado.
- IDs de agendamento são gerados no próprio workflow.
- O Calendar atual está configurado diretamente como **BeautyFlow - Studio Bella**.
- O fluxo cria o evento do Calendar antes de anexar o registro à planilha; o JSON atual não possui compensação automática para excluir o evento caso a gravação posterior no Sheets falhe.

## 6. Integrações e dependências

- WF004 — Consultar Disponibilidade.
- Google Calendar.
- Google Sheets: `AGENDAMENTOS`.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Sucesso de criação retorna status de confirmação e dados do agendamento.
- Indisponibilidade preserva o motivo/status vindo da validação.
- Falhas de Calendar/Sheets são consolidadas como erro técnico.

## 8. Tratamento de erros e bloqueios

- Erros dos nodes de Calendar/Sheets são encaminhados para ramo técnico configurado com tratamento de erro.
- Quando a disponibilidade é inválida, não cria Calendar nem registro em AGENDAMENTOS.

## 9. Observações do JSON atual

- A mensagem ao cliente é centralizada no WF012.

## 10. Critério de manutenção desta documentação

Sempre que `AGE-WF005-criar-agendamento.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
