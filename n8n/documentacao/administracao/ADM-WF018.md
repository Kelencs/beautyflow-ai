# WF018 — ADM - WF018 - Limpeza

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ADM-WF018-limpeza.json`](../../workflows/administracao/ADM-WF018-limpeza.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Aplicar a política de retenção da aba LOGS, removendo somente registros expirados de forma segura por row_number.

## 2. Identificação técnica

- **Workflow:** `ADM - WF018 - Limpeza`
- **ID funcional:** `WF018`
- **Arquivo JSON:** `ADM-WF018-limpeza.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** Dois gatilhos: `Execute Workflow Trigger` e Schedule diário configurado para 03:00.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Pode ser acionado como subworkflow; a rotina administrativa trabalha com `id_empresa=GLOBAL`.

## 4. Fluxo real do workflow

1. Prepara o contexto de limpeza e a política de retenção de 90 dias.
2. `GS - Buscar Logs` carrega registros da aba `LOGS` com `row_number`.
3. O código valida `ID_LOG`, `DATA_HORA` e `row_number` e seleciona somente logs com idade superior a 90 dias.
4. Ordena os `row_number` em ordem decrescente para evitar deslocamento de linhas durante múltiplas exclusões.
5. `GS - Excluir Log Expirado` remove cada linha selecionada.
6. Consolida quantidade excluída, falhas de exclusão e status final.
7. WF017 registra o resultado da limpeza.

## 5. Regras e decisões implementadas

- Retenção de `LOGS`: 90 dias.
- Somente registros com data válida e `row_number` numérico válido podem ser excluídos.
- Exclusão ocorre do maior `row_number` para o menor.
- O escopo atual é **somente a aba LOGS**.
- O JSON atual não limpa automaticamente AGENDAMENTOS, CLIENTES, PAGAMENTOS, COBRANCAS, EMPRESAS, DISPONIBILIDADES, PROFISSIONAIS, SERVICOS, FOLLOWUPS, LEMBRETES ou PESQUISAS; também não há rotina de limpeza de MENSAGENS/IA_MEMORIA neste WF018.

## 6. Integrações e dependências

- Google Sheets: `LOGS`.
- WF017 — Logs.

## 7. Saídas e estados

- Campos principais: `id_empresa`, `status`, `data_hora`, `retencao_dias_logs`, `logs_excluidos`, `logs_com_falha_exclusao`, `erro`, `execution_id`.
- Status final indica limpeza concluída ou erro de limpeza conforme consolidação.

## 8. Tratamento de erros e bloqueios

- Falhas individuais de exclusão são contabilizadas na consolidação.
- Itens sem data/row_number válido não são removidos.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`; o Schedule de 03:00 só executará automaticamente quando o workflow estiver ativo.

## 10. Critério de manutenção desta documentação

Sempre que `ADM-WF018-limpeza.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
