# Agenda — WF004–WF007

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Gerenciar disponibilidade e ciclo de vida dos agendamentos.

## Workflows

| ID | Função |
|---|---|
| WF004 | Consultar Disponibilidade |
| WF005 | Criar Agendamento |
| WF006 | Reagendar |
| WF007 | Cancelar |

## Dependências atuais

```text
WF004 ───────────────────────────────► WF017

WF005 ──► WF004
      └──► WF012
      └──► WF017

WF006 ──► WF004
      └──► WF012
      └──► WF017

WF007 ──► WF012
      └──► WF017
```

## Integrações diretas

- Google Calendar — WF004–WF007;
- Google Sheets — WF004–WF007;
- n8n Execute Workflow.

WhatsApp é utilizado **indiretamente** por WF005–WF007 por meio do WF012.

**Gemini não é integração direta deste módulo.**

## Regras principais

- validar disponibilidade antes de confirmar criação;
- considerar duração/intervalo configurado do serviço;
- evitar sobreposição;
- respeitar `ID_EMPRESA` quando o contrato exige;
- cancelamento respeita `TEMPO_CANCELAMENTO_MIN` da empresa;
- reagendamento deve consultar a nova disponibilidade.

## Configuração atual do Calendar

Os JSONs atuais possuem configuração do Google Calendar diretamente nos workflows.

Isso deve ser documentado como **estado atual**, sem afirmar que já existe resolução dinâmica do Calendar por empresa.

## Gap de reagendamento

A documentação funcional mantém RN014 — máximo de um reagendamento — como **gap de implementação**.

Não marcar essa regra como cumprida até existir controle explícito e teste correspondente.

O node de atualização do Calendar no WF006 deve ser documentado exatamente como exportado; não inventar campos que não estejam configurados.

## Tratamento de erro

Erros de Calendar/Sheets devem ser diferenciados de:

- horário não disponível;
- serviço não encontrado;
- data inválida;
- agendamento não encontrado;
- bloqueio de antecedência.

## Documentação

- `n8n/documentacao/agenda/`
- `docs/04-regras-de-negocio/`
- `tests/Casos-de-Teste/CT004...CT007`
