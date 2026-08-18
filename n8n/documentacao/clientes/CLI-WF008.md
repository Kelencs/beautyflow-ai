# WF008 — CLI - WF008 - Cadastrar Cliente

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`CLI-WF008-cadastrar-cliente.json`](../../workflows/clientes/CLI-WF008-cadastrar-cliente.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Cadastrar clientes com prevenção de duplicidade por empresa/telefone, validação de telefone e registro centralizado de log.

## 2. Identificação técnica

- **Workflow:** `CLI - WF008 - Cadastrar Cliente`
- **ID funcional:** `WF008`
- **Arquivo JSON:** `CLI-WF008-cadastrar-cliente.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger`; é utilizado pelo WF002 quando o telefone ainda não está cadastrado.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `telefone_cliente`, `nome_cliente`, `origem` e dados recebidos pelo contrato do subworkflow.

## 4. Fluxo real do workflow

1. `SET - Preparar Cadastro` normaliza empresa, telefone, nome e origem; `id_empresa` usa fallback `EMP001`.
2. Valida telefone; números fora da faixa de 10 a 15 dígitos geram `ERRO_CADASTRO`.
3. Busca duplicidade em `CLIENTES` e avalia explicitamente: encontrado, vazio legítimo ou erro técnico.
4. Cliente existente retorna `CLIENTE_EXISTENTE`; se houver múltiplos registros do mesmo telefone, utiliza o mais antigo e sinaliza aviso.
5. Cliente novo recebe ID `CLI-...`, timestamps, `STATUS=ATIVO`, `ACEITA_MARKETING=SIM`, `PRIMEIRO_ATENDIMENTO` e `ULTIMO_ATENDIMENTO` com o instante atual.
6. `GS - Criar Cliente` adiciona a linha em `CLIENTES`.
7. Os resultados convergem, WF017 registra log e o SET final devolve o contrato de cadastro.

## 5. Regras e decisões implementadas

- Telefone deve conter entre 10 e 15 dígitos numéricos.
- Duplicidade é tratada antes da criação.
- Erro técnico de Sheets não é interpretado como “cliente inexistente”.
- O JSON atual define `ACEITA_MARKETING=SIM` automaticamente para novos clientes.
- O JSON atual define `id_empresa=EMP001` quando a entrada não informa empresa.

## 6. Integrações e dependências

- Google Sheets: `CLIENTES`.
- WF017 — Logs.

## 7. Saídas e estados

- `CLIENTE_CRIADO`, `CLIENTE_EXISTENTE` ou `ERRO_CADASTRO`, com identificador do cliente quando disponível, flag `cliente_novo`, indicador de múltiplos registros e mensagem de erro.

## 8. Tratamento de erros e bloqueios

- Telefone inválido é erro de validação.
- Falha técnica na consulta ou criação do cliente resulta em `ERRO_CADASTRO`.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`; como subworkflow, ele ainda pode ser referenciado por Execute Workflow conforme ambiente/importação.
- O opt-in de marketing não é coletado pelo WF008 atual; o campo é gravado como `SIM`.

## 10. Critério de manutenção desta documentação

Sempre que `CLI-WF008-cadastrar-cliente.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
