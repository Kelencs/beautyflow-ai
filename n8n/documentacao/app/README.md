# App — WF019

> **Sincronização:** 2026-09-01  
> **Checkpoint de referência:** `3b45ea6`  
> **Fonte da verdade:** JSON em `n8n/workflows/app/`.

## Visão geral

O módulo App é a camada de integração do BeautyFlow App (Next.js + NestJS) com os dados operacionais acessados pelo n8n. Ele é deliberadamente separado do pipeline conversacional (Atendimento/Agenda/Clientes/Financeiro/Comunicação/Administração) — não chama nem é chamado por WF001–WF018.

O NestJS continua sendo o backend principal e a fronteira de autenticação, autorização, contexto de empresa e regras de negócio. O WF019 atua como **gateway/adaptador de integração**, não como substituto do backend.

## Estado atual

A camada read-only do WF019 está **implementada e homologada em ambiente real** com 5 operações:

| Operação | Fonte | Estado |
|---|---|---|
| `clientes.listar` | `CLIENTES` | ✅ Homologada |
| `servicos.listar` | `SERVICOS` | ✅ Homologada |
| `profissionais.listar` | `PROFISSIONAIS` | ✅ Homologada |
| `empresa.obter` | `EMPRESAS` | ✅ Homologada |
| `disponibilidades.listar` | `DISPONIBILIDADES` | ✅ Homologada |

As telas `/clientes`, `/servicos`, `/profissionais` e `/configuracoes` foram validadas com dados reais de homologação.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF019 | Gateway App | `APP-WF019-gateway-app.json` | Autenticar, validar e rotear chamadas do NestJS para dados operacionais das 5 operações read-only homologadas | `false` |

O `active:false` do JSON versionado é deliberado. Publicação/ativação no n8n Cloud é uma etapa operacional controlada.

## Integrações reais

- Google Sheets: `CLIENTES`, `SERVICOS`, `PROFISSIONAIS`, `EMPRESAS` e `DISPONIBILIDADES` (leitura, mesma credencial `Google Sheets account` já usada pelos demais módulos).
- Agenda (`AGENDAMENTOS`), Financeiro (`PAGAMENTOS`) e Comunicação (`MENSAGENS` e demais fontes) foram auditados e permaneceram conscientemente bloqueados nesta rodada.
- IA continua bloqueada por lacunas da fonte, incluindo `IA_MEMORIA` sem writer conhecido entre WF001–WF018.

**O WF019 atual não integra diretamente WhatsApp, Gemini, Google Calendar ou Google Drive.**

## Fluxo do WF019

```text
Webhook (Header Auth)
        ↓
normaliza/valida envelope (operacao/idEmpresa/requestId/dados)
        ↓
envelope inválido? ── sim ──► monta erro
        │
       não
        ↓
SWITCH - Operação
        ↓
clientes.listar | servicos.listar | profissionais.listar |
empresa.obter | disponibilidades.listar
        ↓
Google Sheets filtrado por ID_EMPRESA
        ↓
falha técnica? ── sim ──► UPSTREAM_ERROR
        │
       não
        ↓
normaliza resposta mínima
        ↓
{ok:true, data, meta:{requestId}}
        ↓
Respond to Webhook
```

## Regras atuais

- `idEmpresa` é resolvido pelo NestJS a partir do usuário autenticado; o browser não escolhe livremente o tenant.
- O WF019 aplica filtro por `ID_EMPRESA` também na fonte, como defesa em profundidade.
- Lista vazia em operações `.listar` é sucesso (`ok:true, data:[]`), nunca erro por si só.
- Erro técnico de Sheets nunca é confundido com vazio legítimo.
- `empresa.obter` é singular e possui hardening para 0, 1 ou múltiplas linhas reais.
- Nenhuma credencial real é gravada no JSON versionado.
- Nenhum `ID_EMPRESA`, credencial ou identificador interno sensível desnecessário é devolvido ao App.
- Não existe fallback silencioso para mock dentro do n8n; a seleção `mock|n8n` pertence ao NestJS.
- Uma nova operação só pode ser documentada quando existir também em `OPERACOES_SUPORTADAS`, no `SWITCH - Operação` e no fluxo real do JSON.

## Homologação e documentId

O JSON versionado permanece configurado para a fonte `BEAUTYFLOW3.1`.

Durante a homologação, os 5 nodes `GS -` foram reapontados manualmente no n8n Cloud para `BEAUTYFLOW_HOMOLOGACAO`. Esse reapontamento não deve ser confundido com o estado do JSON versionado e precisa ser refeito após reimportações quando o objetivo for homologar novamente.

## Bloqueio atual da Agenda

A próxima operação não deve ser adicionada antes de uma decisão explícita de domínio.

A fonte real de `AGENDAMENTOS.STATUS` usa:

```text
AGENDADO
CANCELADO
```

O contrato atual do App usa:

```text
PENDENTE
CONFIRMADO
CONCLUIDO
CANCELADO
```

Não deve haver conversão arbitrária entre esses vocabulários. O próximo passo é auditar e decidir o modelo de status antes de implementar `agendamentos.listar`.

## Documentação individual

- [`APP-WF019.md`](./APP-WF019.md)
- [`../../../docs/STATUS-DO-PROJETO.md`](../../../docs/STATUS-DO-PROJETO.md)

## Manutenção

Sempre conferir:

- filtro por `ID_EMPRESA`;
- ausência de campos técnicos/segredos na resposta;
- coerência entre contrato do NestJS e shape do gateway;
- inexistência de fallback silencioso;
- documentação sincronizada com o JSON realmente versionado e com o estado homologado.
