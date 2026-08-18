# WF009 — CLI - WF009 - Atualizar Cliente

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`CLI-WF009-atualizar-cliente.json`](../../workflows/clientes/CLI-WF009-atualizar-cliente.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Atualizar parcialmente um cadastro de cliente sem apagar campos existentes quando novos valores não são fornecidos.

## 2. Identificação técnica

- **Workflow:** `CLI - WF009 - Atualizar Cliente`
- **ID funcional:** `WF009`
- **Arquivo JSON:** `CLI-WF009-atualizar-cliente.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger` para atualização parcial de cadastro.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `id_cliente`, `telefone_cliente`, `nome_cliente`, `email`, `data_nascimento`, `observacoes`, `status`, `origem`, `dados` (objeto).

## 4. Fluxo real do workflow

1. Busca clientes da empresa na aba `CLIENTES` usando node com `alwaysOutputData` e tratamento de erro pela saída regular.
2. `CODE - Avaliar Cliente Encontrado` separa erro técnico, cliente ausente e cliente válido.
3. Para cliente válido, `CODE - Montar Atualização Parcial` combina os campos novos com os dados atuais.
4. Campos novos vazios/nulos não apagam automaticamente o valor existente; o código preserva o dado atual.
5. `GS - Atualizar Cliente` atualiza a linha por `ID_CLIENTE` e registra `ULTIMA_ATUALIZACAO`.
6. Os ramos são consolidados, WF017 registra o resultado e o SET final expõe a saída.

## 5. Regras e decisões implementadas

- A atualização é parcial: somente valores efetivamente fornecidos substituem o cadastro atual.
- Erro técnico na busca não é convertido em “cliente não encontrado”.
- A empresa é utilizada para restringir o conjunto pesquisado antes da resolução do cliente.

## 6. Integrações e dependências

- Google Sheets: `CLIENTES`.
- WF017 — Logs.

## 7. Saídas e estados

- `CLIENTE_ATUALIZADO`, `CLIENTE_NAO_ENCONTRADO` ou `ERRO_ATUALIZACAO`, além dos dados correlacionados do cliente.

## 8. Tratamento de erros e bloqueios

- Falha de busca e falha de atualização possuem ramos técnicos próprios e chegam à consolidação como erro.

## 9. Observações do JSON atual

- A lógica preserva dados existentes quando os campos recebidos estão ausentes ou vazios.

## 10. Critério de manutenção desta documentação

Sempre que `CLI-WF009-atualizar-cliente.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
