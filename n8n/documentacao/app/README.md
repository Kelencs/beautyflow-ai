# App — WF019

> **Sincronização:** 2026-09-02  
> **Checkpoint de referência:** `a723bff`  
> **Fonte da verdade:** JSON em `n8n/workflows/app/APP-WF019-gateway-app.json`.

## Visão geral

O módulo App é a camada de integração do BeautyFlow App (Next.js + NestJS) com os dados operacionais acessados pelo n8n.

Ele é deliberadamente separado do pipeline conversacional WF001–WF018: o `APP-WF019` **não chama nem é chamado** pelos workflows legados.

O NestJS continua sendo o backend principal e a fronteira de autenticação, autorização, contexto de empresa, composição de dados e regras de negócio. O WF019 atua como **gateway/adaptador de integração**, não como substituto do backend.

## Estado atual

O `APP-WF019` está na **v1.12**, com **6 operações read-only implementadas e homologadas**:

| Operação | Fonte | Estado |
|---|---|---|
| `clientes.listar` | `CLIENTES` | ✅ Homologada |
| `servicos.listar` | `SERVICOS` | ✅ Homologada |
| `profissionais.listar` | `PROFISSIONAIS` | ✅ Homologada |
| `empresa.obter` | `EMPRESAS` | ✅ Homologada |
| `disponibilidades.listar` | `DISPONIBILIDADES` | ✅ Homologada |
| `agendamentos.listar` | `AGENDAMENTOS` | ✅ Homologada |

As telas `/clientes`, `/servicos`, `/profissionais`, `/configuracoes` e `/agenda` foram validadas com dados reais de homologação.

## Workflow

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF019 | Gateway App | `APP-WF019-gateway-app.json` | Autenticar, validar e rotear chamadas server-to-server do NestJS para dados operacionais read-only | `false` |

O `active:false` do JSON versionado é deliberado. Ativação/publicação no n8n Cloud é uma etapa operacional controlada.

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

Ainda não existem no App via WF019:

- criar;
- editar;
- reagendar;
- cancelar;
- concluir;
- persistir confirmação do cliente.

A Agenda é hoje **operacional em leitura**, não operacional completa.

### Financeiro

Continua bloqueado pela composição `AGENDAMENTOS + PAGAMENTOS` e decisões de contrato/status.

### Comunicação

Continua bloqueada pela correlação entre `MENSAGENS`, `LEMBRETES`, `PESQUISA`, `FOLLOWUPS` e `COBRANCAS`.

### IA

Continua bloqueada por lacunas de fonte; `IA_MEMORIA` não possui writer conhecido em WF001–WF018.

## Qualidade do checkpoint

Checkpoint `a723bff`:

- 469 testes;
- 20 suítes;
- 469/469 verdes;
- lint backend/frontend verde;
- builds shared-types/backend/frontend verdes;
- WF001–WF018 intactos;
- zero segredo real versionado.

## Documentação individual

- [`APP-WF019.md`](./APP-WF019.md)
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
