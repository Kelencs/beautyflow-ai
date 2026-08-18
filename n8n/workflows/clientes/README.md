# Clientes — WF008–WF009

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Cadastrar e atualizar clientes sem duplicidade e sem apagar dados não informados.

## Workflows

| ID | Função |
|---|---|
| WF008 | Cadastrar Cliente |
| WF009 | Atualizar Cliente |

## Dependências

```text
WF008 ──► WF017
WF009 ──► WF017
```

WF008 também pode ser chamado pelo WF002 durante o atendimento.

## Integrações diretas

- Google Sheets;
- n8n Execute Workflow para WF017.

**Gemini e WhatsApp não são integrações diretas deste módulo.**

## WF008 — Cadastro

Responsabilidades:

- validar/normalizar entrada;
- consultar duplicidade;
- distinguir "não encontrado" de erro técnico;
- gerar ID do cliente;
- criar o registro;
- retornar resultado padronizado;
- registrar log via WF017.

### Comportamentos atuais conhecidos

O JSON atual ainda possui comportamentos que estão documentados como gaps de produto:

- `PRIMEIRO_ATENDIMENTO` e `ULTIMO_ATENDIMENTO` são preenchidos no cadastro;
- `ACEITA_MARKETING` pode ser criado como `SIM` pelo fluxo atual;
- existe uso/fallback legado de `EMP001` em pontos do projeto.

Não alterar a RN018/RN019/RN037 para "validar" esses comportamentos. Eles devem permanecer como gaps até decisão/correção.

## WF009 — Atualização

Responsabilidades:

- localizar o cliente;
- diferenciar cliente inexistente de erro técnico;
- realizar atualização parcial;
- preservar campos não informados;
- registrar log.

## Regras

- não criar duplicidade;
- preservar isolamento por empresa;
- atualização parcial não pode apagar dados válidos;
- erro técnico em Sheets não pode ser tratado como "cliente inexistente";
- consentimento de marketing deve ter origem confiável.

## Documentação

- `n8n/documentacao/clientes/`
- `docs/04-regras-de-negocio/`
- `tests/Casos-de-Teste/CT008...CT009`
