# App — WF019 + WF020

> **Sincronização:** 2026-09-09
>
> **Checkpoint funcional anterior:** `a723bff` (WF019 — Agenda read-only)
>
> **Checkpoint funcional atual:** `585e710` (WF020 — `agenda.cancelar`) — publicado em `origin/main`
>
> `a6385d2` foi o commit documental que precedeu esta implementação (só documentação, sem mudança funcional).
>
> **Fonte da verdade:** JSON em `n8n/workflows/app/APP-WF019-gateway-app.json` e `n8n/workflows/app/APP-WF020-agenda-commands.json`.

## Visão geral

O módulo App é a camada de integração do BeautyFlow App (Next.js + NestJS) com os dados operacionais acessados pelo n8n. Ele é dividido em dois gateways com responsabilidades deliberadamente separadas:

```text
APP
├── APP-WF019 — Gateway READ-ONLY (nunca ganha operação de escrita)
└── APP-WF020 — Gateway de COMANDOS de escrita da Agenda
```

Ambos são deliberadamente separados do pipeline conversacional WF001–WF018 (não chamam nem são chamados pelos workflows legados) e **um do outro**: o WF020 nunca chama o WF019, e o WF019 nunca ganha uma operação de escrita. Essa separação READ/WRITE é uma decisão de arquitetura — não uma expansão do WF019 — porque isola o risco de um bug de escrita regredir uma leitura já homologada, e permite homologar cada comando de escrita novo incrementalmente.

O NestJS continua sendo o backend principal e a fronteira de autenticação, autorização, contexto de empresa, composição de dados e regras de negócio. Os dois workflows atuam como **gateway/adaptador de integração**, não como substituto do backend.

## Estado atual

### APP-WF019 (leitura)

Está na **v1.12**, com **6 operações read-only implementadas e homologadas**:

| Operação | Fonte | Estado |
|---|---|---|
| `clientes.listar` | `CLIENTES` | ✅ Homologada |
| `servicos.listar` | `SERVICOS` | ✅ Homologada |
| `profissionais.listar` | `PROFISSIONAIS` | ✅ Homologada |
| `empresa.obter` | `EMPRESAS` | ✅ Homologada |
| `disponibilidades.listar` | `DISPONIBILIDADES` | ✅ Homologada |
| `agendamentos.listar` | `AGENDAMENTOS` | ✅ Homologada |

As telas `/clientes`, `/servicos`, `/profissionais`, `/configuracoes` e `/agenda` foram validadas com dados reais de homologação.

### APP-WF020 (comandos de escrita)

Novo gateway, com **1 operação implementada e homologada E2E em `BEAUTYFLOW_HOMOLOGACAO`** (Google Sheets), versionado no checkpoint funcional `585e710`:

| Operação | Estado |
|---|---|
| `agenda.cancelar` | ✅ Homologada em HML (Google Sheets) |

`agenda.criar`, `agenda.reagendar` e `agenda.concluir` ainda não existem. Detalhes completos (contrato, tenant, autorização, idempotência, limitações conhecidas e dívidas) em [`APP-WF020.md`](./APP-WF020.md).

## Workflow

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF019 | Gateway App | `APP-WF019-gateway-app.json` | Autenticar, validar e rotear chamadas server-to-server do NestJS para dados operacionais read-only | `false` |
| WF020 | Agenda Commands | `APP-WF020-agenda-commands.json` | Autenticar, validar e rotear comandos de escrita da Agenda (hoje só `agenda.cancelar`) | `false` no JSON local; `Published`/ativo em `BEAUTYFLOW_HOMOLOGACAO` durante a homologação |

O `active:false` do JSON versionado é deliberado em ambos. Ativação/publicação no n8n Cloud é uma etapa operacional controlada.

## Fluxo do WF019

```text
Webhook POST + Header Auth
        ↓
CODE - Validar Envelope
        ↓
IF - Envelope Válido
        ↓
SWITCH - Operação
        ↓
clientes.listar
servicos.listar
profissionais.listar
empresa.obter
disponibilidades.listar
agendamentos.listar
        ↓
Google Sheets filtrado por ID_EMPRESA
        ↓
checagem de erro técnico
        ↓
normalização/hardening
        ↓
CODE - Montar Sucesso / CODE - Montar Erro
        ↓
RESPOND - Resultado
```

O workflow não usa `Merge` para convergir branches mutuamente exclusivos.

## Envelope

Requisição enviada exclusivamente pelo NestJS:

```json
{
  "operacao": "agendamentos.listar",
  "idEmpresa": "EMP001",
  "requestId": "uuid",
  "dados": {
    "dataInicio": "2026-08-01",
    "dataFim": "2026-08-31"
  }
}
```

Sucesso:

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "requestId": "uuid"
  }
}
```

Erro:

```json
{
  "ok": false,
  "error": {
    "code": "UPSTREAM_ERROR",
    "message": "Mensagem controlada"
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

## Agenda real — `agendamentos.listar`

A operação `agendamentos.listar` foi adicionada no checkpoint `a723bff` e homologada contra `BEAUTYFLOW_HOMOLOGACAO`.

### Fonte e isolamento

`GS - Buscar Agendamentos` lê `AGENDAMENTOS` com filtro:

```text
ID_EMPRESA = idEmpresa
```

`idEmpresa` já foi resolvido pelo NestJS a partir do usuário autenticado. O browser nunca fornece livremente o tenant.

### Período

`dataInicio` e `dataFim` chegam em `dados`. Como o node Google Sheets usa lookup de igualdade, o corte por intervalo é aplicado em `CODE - Normalizar Agendamentos`.

No comportamento atual, todas as linhas reais da empresa são validadas antes do corte por período. Essa escolha preserva hardening forte, mas permanece registrada como ponto de avaliação futura caso lixo histórico passe a bloquear consultas atuais.

### Status

A homologação confirmou três valores literais na fonte:

```text
AGENDADO
CONCLUIDO
CANCELADO
```

`PENDENTE` e `CONFIRMADO` **não são aceitos** no gateway como status do atendimento.

`CONCLUIDO` é reconhecido somente quando a própria fonte o grava literalmente. Nunca é inferido por data, horário, pagamento ou lembrete.

`statusConfirmacao` não é produzido pelo WF019. O NestJS acrescenta `null` ao montar o contrato público real.

### Shape mínimo de integração

O WF019 devolve somente:

```ts
{
  idAgendamento: string;
  idCliente: string;
  idProfissional: string;
  idServico: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
}
```

Não devolve `ID_EMPRESA`, Google Calendar ID, origem, observações ou datas técnicas.

Os nomes de Cliente/Profissional/Serviço são resolvidos no NestJS via composição com os services correspondentes.

## Hardening atual

- filtro de tenant na fonte;
- lista vazia legítima em `.listar` retorna `ok:true, data:[]`;
- erro técnico de Sheets não é confundido com lista vazia;
- linha real corrompida não é tratada como placeholder;
- Serviços/Profissionais/Disponibilidades/Agenda não devolvem lista parcial quando há dado obrigatório inválido;
- `empresa.obter` é singular e falha para ausência, duplicidade ou campos estruturais inválidos;
- nenhum `ID_EMPRESA` é devolvido;
- nenhum segredo real é versionado;
- sem fallback silencioso para mock dentro do n8n;
- `responseMode` permanece `responseNode` e `RESPOND - Resultado` usa `={{ $json }}`.

## Homologação

### Agenda

Foram validados manualmente:

- visão mensal de agosto/2026 com 6 agendamentos reais;
- visão semanal com registros;
- setembro/2026 vazio sem erro;
- detalhes de atendimento com join real de Cliente + Profissional + Serviço;
- exemplo: Mariana Teste / Beatriz Rocha / Manicure Tradicional / 05/08/2026 / 14:00–16:00 / R$ 180,00 / `AGENDADO` / confirmação `—`;
- `CONCLUIDO` real aceito sem inferência;
- `agendamentos.listar` retornando sucesso no backend.

### documentId

O JSON versionado permanece apontando para `BEAUTYFLOW3.1`.

Para homologação no n8n Cloud, os **6 nodes `GS -`** devem ser reapontados manualmente para `BEAUTYFLOW_HOMOLOGACAO` após importação/reimportação:

1. `GS - Buscar Clientes`;
2. `GS - Buscar Serviços`;
3. `GS - Buscar Profissionais`;
4. `GS - Buscar Empresa`;
5. `GS - Buscar Disponibilidades`;
6. `GS - Buscar Agendamentos`.

## Integrações ainda não implementadas

### Agenda — escrita

`agenda.cancelar` já está homologado via APP-WF020 (ver seção acima e [`APP-WF020.md`](./APP-WF020.md)). Ainda não existem:

- criar;
- reagendar;
- concluir;
- persistir confirmação do cliente.

A arquitetura adotou comandos explícitos, não um `editar` genérico. A Agenda é hoje **operacional em leitura, com a primeira operação de escrita homologada** — ainda não operacional completa.

### Financeiro

Continua bloqueado pela composição `AGENDAMENTOS + PAGAMENTOS` e decisões de contrato/status.

### Comunicação

Continua bloqueada pela correlação entre `MENSAGENS`, `LEMBRETES`, `PESQUISA`, `FOLLOWUPS` e `COBRANCAS`.

### IA

Continua bloqueada por lacunas de fonte; `IA_MEMORIA` não possui writer conhecido em WF001–WF018.

## Qualidade

**Checkpoint funcional anterior** (`a723bff` — WF019):

- 469 testes;
- 20 suítes;
- 469/469 verdes;
- lint backend/frontend verde;
- builds shared-types/backend/frontend verdes;
- WF001–WF018 intactos;
- zero segredo real versionado.

**Checkpoint funcional atual** (`585e710` — WF019 + WF020):

- 525 testes;
- 23 suítes;
- 525/525 verdes;
- lint backend/frontend verde;
- builds shared-types/backend/frontend verdes;
- WF001–WF019 intactos;
- zero segredo real versionado.

`a6385d2` foi o commit documental que precedeu esta implementação (só documentação, sem mudança funcional). `585e710` já está publicado em `origin/main`.

## Documentação individual

- [`APP-WF019.md`](./APP-WF019.md)
- [`APP-WF020.md`](./APP-WF020.md)
- [`../../../docs/STATUS-DO-PROJETO.md`](../../../docs/STATUS-DO-PROJETO.md)

## Manutenção

Sempre conferir:

- filtro por `ID_EMPRESA`;
- coerência entre `OPERACOES_SUPORTADAS`, `SWITCH - Operação` e branches reais;
- ausência de campos técnicos/segredos na resposta;
- coerência entre contrato do NestJS e shape do gateway;
- inexistência de fallback silencioso;
- `responseMode=responseNode` + `responseBody={{ $json }}`;
- documentação sincronizada com o JSON realmente versionado e com o estado homologado.
