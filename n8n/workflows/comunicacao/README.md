# Comunicação — WF012–WF015

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Centralizar o envio de mensagens pelo WhatsApp e executar automações de comunicação pós-agendamento.

## Workflows

| ID | Função |
|---|---|
| WF012 | Envio centralizado / confirmação |
| WF013 | Lembrete |
| WF014 | Pesquisa pós-atendimento |
| WF015 | Follow-up / reengajamento |

## Dependências

```text
WF012 ───────────────────────────────► WF017

WF013 ──► WF012
      └──► WF017

WF014 ──► WF012
      └──► WF017

WF015 ──► WF012
      └──► WF017
```

## Integrações diretas

### WF012
- WhatsApp Cloud API;
- Google Sheets;
- WF017.

### WF013–WF015
- Google Sheets;
- WF012;
- WF017.

WF013–WF015 utilizam WhatsApp **indiretamente**, por WF012.

**Google Calendar e Gemini não são integrações diretas deste módulo.**

## WF012 — envio centralizado

Responsabilidades:

- validar dados mínimos de comunicação;
- enviar texto pela WhatsApp Cloud API;
- registrar tentativa/resultado em `MENSAGENS`;
- devolver saída padronizada ao chamador;
- registrar log via WF017.

Falha Meta deve ser distinguida de validação de entrada.

## WF013 — lembrete

- avalia janelas técnicas de 24h/2h;
- controla idempotência;
- consulta dados relacionados;
- delega envio ao WF012.

**Não possui Schedule/Cron no JSON atual.** Depende de acionamento externo periódico.

Regras globais: RN034–RN035.

## WF014 — pesquisa

- seleciona atendimento elegível na janela técnica atual após `HORA_FIM`;
- controla duplicidade;
- envia a pesquisa;
- registra a tentativa.

WF014 é **emissor da pesquisa**. Ele não recebe/processa nota e comentário.

**Não possui Schedule/Cron no JSON atual.**

Regras globais: RN052–RN054.

## WF015 — follow-up

Elegibilidade atual:

- cliente `ATIVO`;
- `ACEITA_MARKETING=SIM`;
- último atendimento real derivado de AGENDAMENTOS;
- sem agendamento futuro;
- tentativa 1: 30–33 dias;
- tentativa 2: 45–48 dias;
- máximo 2 tentativas por ciclo;
- idempotência por ciclo.

**Não possui Schedule/Cron no JSON atual.**

Regras globais: RN055–RN061.

### Consentimento

O WF015 respeita o valor `ACEITA_MARKETING`, mas a origem/default desse consentimento no cadastro permanece como gap conhecido.

## Documentação

- `n8n/documentacao/comunicacao/`
- `docs/04-regras-de-negocio/`
- `tests/Casos-de-Teste/CT012...CT015`
