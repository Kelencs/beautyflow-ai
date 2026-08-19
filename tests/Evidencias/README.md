# Evidências de Testes — BeautyFlow AI

Esta pasta preserva evidências e consolidações das execuções de teste do BeautyFlow.

## 1. Regra de versionamento

Relatórios datados são **históricos imutáveis**.

Quando o estado mudar:

1. manter relatório anterior;
2. criar nova consolidação datada;
3. atualizar Matriz/README quando necessário.

## 2. Arquivos oficiais

### Histórico

`BeautyFlow-Documentacao-Testes-Workflows-2026-08-14.md`

Fotografia do estado de 14/08/2026.

### Consolidação atual

`BeautyFlow-Status-Testes-Workflows-2026-08-18.md`

Consolidação posterior, incluindo validações feitas depois do relatório histórico.

## 3. Evidência mínima

Registrar, quando disponível:

- workflow;
- CT/cenário;
- data/hora;
- ambiente;
- dados sintéticos;
- execution ID;
- esperado;
- observado;
- status;
- print/log;
- efeito em Sheets/Calendar/Drive/Meta;
- bug;
- correção;
- regressão.

## 4. Regras

- não registrar segredos;
- não usar dados pessoais reais sem necessidade;
- separar erro externo de erro de regra;
- JSON no Git não é evidência suficiente;
- print isolado deve ter contexto;
- execução parcial não deve ser apresentada como validação final.

## 5. Relação

```text
CT
 ↓
Execução
 ↓
Evidência
 ↓
Status consolidado
 ↓
Matriz
```

Fonte dos casos: `../Casos-de-Teste/`.

## 6. Compatibilidade de nome

O arquivo legado `readme.md` deve ser removido para existir apenas este `README.md`.
