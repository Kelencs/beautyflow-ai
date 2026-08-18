# Atendimento — WF001–WF003

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Este módulo é a porta de entrada conversacional do BeautyFlow.

Ele recebe o webhook da Meta, normaliza o payload, resolve o cliente/contexto, utiliza Google Gemini e encaminha a intenção para o workflow correto.

## Workflows

| ID | Função |
|---|---|
| WF001 | Receber WhatsApp |
| WF002 | IA Atendimento |
| WF003 | Identificar Intenção |

## Fluxo atual

```text
WhatsApp Cloud API
       │
       ▼
WF001
       │
       ▼
WF002
       ├──► WF008 — cadastro quando cliente não existe
       │
       ▼
WF003
       ├──► WF005 — AGENDAR
       ├──► WF004 — CONSULTAR_DISPONIBILIDADE
       ├──► WF006 — REAGENDAR
       ├──► WF007 — CANCELAR
       └──► WF012 — OUTRO/fallback
```

## Responsabilidades

### WF001

- recebe GET/POST da Meta;
- responde ao `hub.challenge` no GET;
- normaliza o evento recebido;
- encaminha a mensagem para WF002.

**Comportamento atual conhecido:** o JSON não apresenta comparação explícita de `hub.verify_token` antes de responder ao challenge e atribui `id_empresa: 'EMP001'` no payload normalizado.

Não documentar validação de token como implementada enquanto o JSON não a possuir.

### WF002

- consulta/resolve cliente;
- pode chamar WF008;
- consulta contexto/memória disponível;
- chama Google Gemini;
- interpreta a saída da IA;
- registra comunicação/dados previstos no JSON;
- chama WF003.

**Integrações diretas:** Google Sheets e Google Gemini.

WF002 **não chama WF017 diretamente** no JSON atual.

### WF003

- normaliza/classifica a intenção recebida;
- roteia apenas para os destinos atualmente configurados;
- não executa genericamente Clientes, Financeiro ou Administração.

WF003 **não chama WF017 diretamente**.

## Integrações

| Integração | Workflow |
|---|---|
| WhatsApp Cloud API | WF001 |
| Google Gemini | WF002 |
| Google Sheets | WF002 |
| n8n Execute Workflow | WF001/WF002/WF003 conforme fluxo |

## Dados

WF002 utiliza dados operacionais conforme o JSON, incluindo cliente, mensagens/contexto e memória.

Não assumir que a IA consulta dinamicamente todo o catálogo de serviços/preços se o node/fonte não estiver explícito no fluxo.

## Gaps conhecidos

- tenant inicial/fallback `EMP001`;
- validação de verify token no GET do WF001 não está explícita no JSON atual;
- WF001–WF003 não possuem logging direto via WF017;
- isolamento SaaS completo ainda exige hardening.

## Documentação

- `n8n/documentacao/atendimento/`
- `n8n/documentacao/README.md`
- `tests/Casos-de-Teste/CT001...CT003`
