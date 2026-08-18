# WF017 — ADM - WF017 - Logs

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ADM-WF017-logs.json`](../../workflows/administracao/ADM-WF017-logs.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Centralizar a criação e persistência de logs dos workflows do BeautyFlow na aba LOGS.

## 2. Identificação técnica

- **Workflow:** `ADM - WF017 - Logs`
- **ID funcional:** `WF017`
- **Arquivo JSON:** `ADM-WF017-logs.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; serviço central de persistência de logs.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `workflow`, `node`, `tipo`, `evento`, `status`, `mensagem`, `dados`, `execution_id`.

## 4. Fluxo real do workflow

1. `CODE - Preparar Log` normaliza os campos e gera `ID_LOG` e `DATA_HORA`.
2. Quando `dados` é objeto, serializa para JSON; valores nulos/vazios são normalizados.
3. `ID_EMPRESA` usa `NAO_INFORMADO` quando não existe valor.
4. `TIPO` e `STATUS` são padronizados em caixa alta ou `NAO_INFORMADO`.
5. `EXECUTION_ID` utiliza o valor recebido ou o ID da execução atual.
6. `GS - Registrar Log` adiciona a linha à aba `LOGS`.
7. Ramo de sucesso devolve `log_registrado=true`; falha de persistência devolve `false` e o erro.

## 5. Regras e decisões implementadas

- Um log recebe ID próprio (`LOG...`) e timestamp ISO.
- O workflow não chama a si mesmo para logar falhas e, portanto, evita recursão.
- Campos ausentes recebem defaults explícitos em vez de impedir obrigatoriamente a gravação.

## 6. Integrações e dependências

- Google Sheets: `LOGS`.

## 7. Saídas e estados

- `log_registrado` (boolean), `id_log`, `data_hora` e `erro`.

## 8. Tratamento de erros e bloqueios

- Falha na gravação do Sheets é devolvida ao chamador sem tentar registrar um novo log dentro do próprio WF017.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `true`.
- O WF017 é utilizado pelos workflows que possuem chamada explícita a ele; os JSONs atuais de WF001, WF002 e WF003 não possuem chamada direta ao WF017.

## 10. Critério de manutenção desta documentação

Sempre que `ADM-WF017-logs.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
