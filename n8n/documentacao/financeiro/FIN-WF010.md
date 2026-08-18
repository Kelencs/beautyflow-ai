# WF010 — FIN - WF010 - Registrar Pagamento

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`FIN-WF010-registrar-pagamento.json`](../../workflows/financeiro/FIN-WF010-registrar-pagamento.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Registrar pagamentos como histórico transacional, validar o valor e recalcular o estado financeiro do agendamento a partir dos pagamentos acumulados.

## 2. Identificação técnica

- **Workflow:** `FIN - WF010 - Registrar Pagamento`
- **ID funcional:** `WF010`
- **Arquivo JSON:** `FIN-WF010-registrar-pagamento.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger` para registrar uma nova transação de pagamento.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Contexto contendo `id_empresa`, `id_agendamento`, `id_cliente`, valor pago (campo bruto/normalizado), forma de pagamento, observações, origem e `dados`.

## 4. Fluxo real do workflow

1. Valida o valor informado; valor deve ser numérico e maior que zero.
2. Busca o agendamento relacionado e diferencia vazio legítimo de erro técnico.
3. Busca pagamentos anteriores do agendamento/empresa e diferencia erro técnico de ausência de histórico.
4. Calcula o total pago acumulado e o saldo em relação ao valor do agendamento.
5. Monta uma nova linha transacional em `PAGAMENTOS` com o estado financeiro resultante.
6. `GS - Registrar Pagamento` adiciona o novo registro; pagamentos anteriores não são sobrescritos.
7. Consolida sucesso/erros, registra o evento no WF017 e prepara a saída final.

## 5. Regras e decisões implementadas

- Valor pago deve ser número maior que zero; caso contrário retorna `VALOR_INVALIDO`.
- `PAGAMENTOS` é tratado como histórico transacional: cada pagamento gera nova linha.
- O estado `PARCIAL`/`PAGO` é calculado considerando o valor do agendamento e o acumulado de pagamentos.
- Erro técnico do Google Sheets é tratado separadamente de “nenhum registro encontrado”.

## 6. Integrações e dependências

- Google Sheets: `AGENDAMENTOS`, `PAGAMENTOS`.
- WF017 — Logs.

## 7. Saídas e estados

- Resultado financeiro com identificadores, valor recebido/acumulado/pendente e estado do pagamento; validações podem retornar `VALOR_INVALIDO` e erros técnicos retornam status de erro.

## 8. Tratamento de erros e bloqueios

- Há tratamento específico para falha de busca de agendamento, falha de busca de pagamentos e falha de registro.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`.
- O workflow grava histórico em `PAGAMENTOS`; esta documentação não atribui atualização de AGENDAMENTOS que não esteja explicitamente demonstrada pelo fluxo.

## 10. Critério de manutenção desta documentação

Sempre que `FIN-WF010-registrar-pagamento.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
