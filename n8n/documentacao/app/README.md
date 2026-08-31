# App — WF019

> **Sincronização:** 2026-08-27
> **Fonte da verdade:** JSON em `n8n/workflows/app/`.

## Visão geral

O módulo App é a camada de integração do BeautyFlow App (Next.js + NestJS) com os dados
operacionais do n8n. É deliberadamente separado do pipeline conversacional
(Atendimento/Agenda/Clientes/Financeiro/Comunicação/Administração) — não chama nem é
chamado por WF001–WF018.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF019 | Gateway App | `APP-WF019-gateway-app.json` | Autenticar, validar e rotear chamadas do NestJS para dados operacionais — só `clientes.listar` nesta fase | `false` |

## Integrações reais

- Google Sheets: `CLIENTES` (leitura, mesmo credential `Google Sheets account` já usado
  pelos demais módulos).

**Nenhuma integração com WhatsApp, Gemini, Google Calendar ou Google Drive.**

## Fluxo do WF019

```text
Webhook (Header Auth) — rejeita ANTES de qualquer node de negócio
        ↓
normaliza/valida envelope (operacao/idEmpresa/requestId/dados)
        ↓
envelope inválido? ── sim ──► monta erro (VALIDATION_ERROR/TENANT_REQUIRED/INVALID_OPERATION)
        │
       não
        ↓
busca CLIENTES filtrado por ID_EMPRESA
        ↓
falha técnica? ── sim ──► monta erro (UPSTREAM_ERROR)
        │
       não
        ↓
normaliza linhas (sem ID_EMPRESA, sem coluna técnica)
        ↓
monta sucesso {ok:true, data, meta:{requestId}}
        ↓
responde ao Webhook
```

## Regras atuais

- `idEmpresa` só é aceito de quem chama o webhook autenticado (o NestJS) — nunca
  reinterpretado a partir de outro campo do payload.
- Lista vazia é sucesso (`ok:true, data:[]`), nunca um código de erro.
- Erro técnico de Sheets nunca é confundido com "vazio legítimo" (checagem explícita de
  `$json.error`, mesmo padrão já corrigido em CLI-WF008/ADM-WF017/ADM-WF018).
- Convergência de branches mutuamente exclusivos (envelope inválido / erro técnico /
  sucesso) nunca usa `n8n-nodes-base.merge` — conexão direta múltipla no mesmo node
  regular, seguindo o padrão corrigido já documentado no projeto (ver
  `n8n/README.md`/histórico de auditoria do WF016).
- Nenhuma credencial real é gravada no JSON — a credencial de Header Auth é um
  placeholder (`CONFIGURAR_CREDENCIAL_HEADER_AUTH`) até ser criada manualmente no n8n
  Cloud.

## Documentação individual

- [`APP-WF019.md`](./APP-WF019.md)

## Manutenção

Sempre conferir: filtro por `ID_EMPRESA`, ausência de campos técnicos/segredos na
resposta, e que nenhuma operação nova foi documentada sem o Code node de validação e o
fluxo real correspondentes.
