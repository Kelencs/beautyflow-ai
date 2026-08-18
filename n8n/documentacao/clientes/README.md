# Clientes — WF008 e WF009

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/clientes/`.

## Visão geral

O módulo de Clientes executa cadastro com prevenção de duplicidade e atualização parcial segura dos dados cadastrais.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF008 | Cadastrar Cliente | `CLI-WF008-cadastrar-cliente.json` | Validar telefone, detectar duplicidade e cadastrar | `false` |
| WF009 | Atualizar Cliente | `CLI-WF009-atualizar-cliente.json` | Localizar cliente e aplicar atualização parcial | `true` |

## Integrações reais

- Google Sheets: `CLIENTES`.
- WF017 — Logs.

**Gemini e WhatsApp não são integrações diretas deste módulo.** O WF008 pode ser chamado pelo WF002 durante o atendimento, mas a IA permanece no módulo Atendimento.

## Fluxo do WF008

```text
Execute Workflow Trigger
        ↓
normaliza/valida entrada
        ↓
busca CLIENTES por empresa + telefone
        ↓
avalia: erro técnico / vazio / encontrado
        ↓
cliente existente? ── sim ──► bloqueia duplicidade
        │
       não
        ↓
gera ID e persiste cliente
        ↓
WF017
        ↓
saída
```

## Fluxo do WF009

```text
Execute Workflow Trigger
        ↓
normaliza entrada
        ↓
busca por ID_EMPRESA + ID_CLIENTE
ou ID_EMPRESA + telefone normalizado
        ↓
avalia 0 / 1 / múltiplos / erro
        ↓
monta atualização parcial
        ↓
atualiza CLIENTES
        ↓
WF017
        ↓
saída
```

## Regras atuais

### WF008

- Prevenção de duplicidade usa empresa + telefone normalizado.
- Vazio legítimo na busca não é tratado como erro técnico.
- Erro de Google Sheets não deve criar cliente por engano.
- O JSON atual possui fallback `EMP001` em sua preparação de dados.
- O cadastro atual grava `ACEITA_MARKETING='SIM'` para novos clientes conforme o JSON versionado.
- Resultados incluem `CLIENTE_CRIADO`, `CLIENTE_EXISTENTE` e `ERRO_CADASTRO`.

### WF009

- Localização prioriza ID do cliente; telefone funciona como fallback conforme o fluxo implementado.
- Busca sempre considera `ID_EMPRESA`.
- Múltiplos registros bloqueiam atualização automática.
- Campos vazios/null/undefined não apagam o valor existente.
- Campos protegidos definidos pelo workflow não são sobrescritos pela atualização parcial.
- Resultados incluem `CLIENTE_ATUALIZADO`, `CLIENTE_NAO_ENCONTRADO` e `ERRO_ATUALIZACAO`.

## Documentação individual

- [`CLI-WF008.md`](../../documentacao/clientes/CLI-WF008.md)
- [`CLI-WF009.md`](../../documentacao/clientes/CLI-WF009.md)

## Manutenção

Sempre conferir filtros por `ID_EMPRESA`, normalização do telefone, campos protegidos e tratamento de erro técnico ao alterar estes workflows.

