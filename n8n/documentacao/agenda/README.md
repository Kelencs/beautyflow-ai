# Agenda — WF004 a WF007

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/agenda/`.

## Visão geral

O módulo de Agenda concentra consulta de disponibilidade, criação, reagendamento e cancelamento. Os workflows combinam regras operacionais registradas no Google Sheets com ocupações/eventos do Google Calendar e utilizam os serviços centrais de comunicação e logs quando previsto no JSON.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF004 | Consultar Disponibilidade | `AGE-WF004-consultar-disponibilidade.json` | Calcular horários livres | `true` |
| WF005 | Criar Agendamento | `AGE-WF005-criar-agendamento.json` | Validar disponibilidade, criar Calendar/Sheets e comunicar | `true` |
| WF006 | Reagendar | `AGE-WF006-reagendar.json` | Localizar, validar prazo, consultar nova disponibilidade e reagendar | `true` |
| WF007 | Cancelar | `AGE-WF007-cancelar.json` | Localizar, validar prazo e cancelar | `true` |

## Dependências reais

```text
WF004 ─────────────────────────────► WF017

WF005 ─► WF004 ─► Google Calendar
   └────────────► AGENDAMENTOS
   └────────────► WF012 ─► WF017

WF006 ─► AGENDAMENTOS / CLIENTES / EMPRESAS
   └────► WF004
   └────► Google Calendar
   └────► WF012
   └────► WF017

WF007 ─► AGENDAMENTOS / CLIENTES / EMPRESAS
   └────► Google Calendar
   └────► WF012
   └────► WF017
```

## Integrações

- Google Sheets.
- Google Calendar.
- WF012 — comunicação centralizada quando o fluxo precisa responder ao cliente.
- WF017 — logs.

**Gemini não é integração direta deste módulo.** A interpretação de intenção acontece antes, no WF002.

## Google Sheets por workflow

- WF004: `SERVICOS`, `PROFISSIONAIS`, `DISPONIBILIDADES`, `AGENDAMENTOS`.
- WF005: `AGENDAMENTOS`.
- WF006: `AGENDAMENTOS`, `CLIENTES`, `EMPRESAS`.
- WF007: `AGENDAMENTOS`, `CLIENTES`, `EMPRESAS`.

## Regras e observações atuais

### WF004

- Calcula horários disponíveis cruzando regras de serviço/profissional/disponibilidade com ocupação do Calendar.
- Pode ser chamado pelo WF003, WF005 e WF006.
- Retorna estados como `OK`, `SEM_HORARIOS`, `SERVICO_NAO_ENCONTRADO`, `SEM_PROFISSIONAL` e `DATA_INVALIDA` conforme o fluxo atual.

### WF005

- Chama WF004 antes de criar o agendamento.
- Só segue para criação quando a disponibilidade é validada.
- Persiste o evento no Google Calendar e o agendamento no Google Sheets.
- Consolida sucesso, indisponibilidade e erro técnico antes da comunicação/log.

### WF006

- Prioriza `id_agendamento`; quando ausente, usa critérios do contrato atual para localizar o agendamento.
- Reaproveita `TEMPO_CANCELAMENTO_MIN` da empresa como regra de prazo do reagendamento atual.
- Consulta WF004 para nova disponibilidade.
- O node `GC - Atualizar Evento` deve ser descrito exatamente conforme os campos presentes no JSON exportado; não assumir atualização de campos não configurados.
- Sem `google_event_id`, o workflow segue o tratamento seguro definido no JSON.

### WF007

- Prioriza localização inequívoca do agendamento e bloqueia escolha arbitrária quando há múltiplos candidatos.
- Aplica a janela definida por `TEMPO_CANCELAMENTO_MIN`.
- Quando existe `google_event_id`, utiliza Google Calendar conforme o fluxo atual e reflete o resultado no Google Sheets.

## Configuração de Calendar

Os JSONs atuais contêm configuração de calendário diretamente nos workflows. Portanto este README **não assume resolução dinâmica de calendário por empresa** enquanto essa lógica não estiver implementada nos arquivos versionados.

## Documentação individual

- [`AGE-WF004.md`](../../documentacao/agenda/AGE-WF004.md)
- [`AGE-WF005.md`](../../documentacao/agenda/AGE-WF005.md)
- [`AGE-WF006.md`](../../documentacao/agenda/AGE-WF006.md)
- [`AGE-WF007.md`](../../documentacao/agenda/AGE-WF007.md)

## Manutenção

Mudanças em regras de horário, Calendar, abas, dependências WF012/WF017 ou contrato de entrada devem atualizar o JSON, a documentação individual e este README na mesma alteração.

