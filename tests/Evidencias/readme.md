# Evidências de Testes — BeautyFlow AI

Esta pasta preserva evidências e consolidações das execuções de teste do BeautyFlow.

## 1. Regra de versionamento

Relatórios datados são **históricos imutáveis**.

Não reescrever um relatório antigo para fazê-lo parecer atual. Quando o estado mudar:

1. manter o relatório anterior;
2. criar nova consolidação datada;
3. atualizar a Matriz de Rastreabilidade e o README de testes quando necessário.

## 2. Arquivos oficiais

### Histórico

`BeautyFlow-Documentacao-Testes-Workflows-2026-08-14.md`

Fotografia do estado dos testes em 14/08/2026. Deve permanecer no repositório mesmo quando seus status forem superados por evidências posteriores.

### Consolidação atual

`BeautyFlow-Status-Testes-Workflows-2026-08-18.md`

Consolidação posterior, incluindo validações realizadas depois do relatório de 14/08.

## 3. Evidência mínima recomendada

Cada execução relevante deve registrar, quando disponível:

- workflow;
- CT/cenário;
- data/hora;
- ambiente;
- dados sintéticos utilizados;
- execution ID do n8n;
- resultado esperado;
- resultado observado;
- status final;
- print/log;
- efeito em Sheets/Calendar/Drive/Meta;
- bug encontrado;
- correção aplicada;
- resultado da regressão.

## 4. Regras

- Não registrar token, API key ou segredo.
- Não usar dados pessoais reais quando dados sintéticos forem suficientes.
- Erro de credencial externa deve ser distinguido de erro da regra funcional.
- A presença de JSON no Git não constitui evidência de aprovação.
- Print isolado deve ser acompanhado de contexto suficiente para auditoria.
- Testes manuais parciais no editor não devem ser apresentados como execução limpa final.

## 5. Relação com outros artefatos

```text
CT
 ↓
Execução
 ↓
Evidência
 ↓
Status consolidado
 ↓
Matriz de Rastreabilidade
```

A fonte oficial dos casos é `../Casos-de-Teste/`.

## 6. Arquivo legado

O arquivo antigo `readme.md` com "r" minúsculo deve ser removido após a inclusão deste `README.md`, para evitar dois índices da mesma pasta.
