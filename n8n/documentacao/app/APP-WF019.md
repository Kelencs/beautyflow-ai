# WF019 — APP - WF019 - Gateway App

> **Sincronização:** 2026-09-02  
> **Checkpoint:** `a723bff` — `feat: integrate real agenda through APP-WF019`  
> **Fonte da verdade:** [`APP-WF019-gateway-app.json`](../../workflows/app/APP-WF019-gateway-app.json) no branch `main`.

## 1. Objetivo

O `APP-WF019` é a camada de integração server-to-server entre o backend NestJS do BeautyFlow App e os dados operacionais acessados pelo n8n.

Responsabilidades do gateway:

- receber chamadas autenticadas do NestJS;
- validar envelope e tenant;
- rotear operações read-only;
- consultar Google Sheets com isolamento por `ID_EMPRESA`;
- normalizar/hardenizar o shape de integração;
- devolver envelope padronizado;
- não expor campos técnicos ou segredos desnecessários.

O WF019 **não substitui o NestJS**. Autenticação do usuário, autorização, contexto de empresa, regras de negócio, composição entre recursos e contrato público permanecem no backend.

WF001–WF018 continuam independentes e não são chamados por este gateway.

## 2. Identificação técnica

- **Workflow:** `APP - WF019 - Gateway App`
- **ID funcional:** `WF019`
- **Versão documental/Sticky Note:** `v1.12`
- **Arquivo:** `n8n/workflows/app/APP-WF019-gateway-app.json`
- **Nodes:** 32
- **Status no JSON:** `active:false`
- **Gatilho:** Webhook POST
- **Path:** `beautyflow-app`
- **Autenticação:** Header Auth (`X-BeautyFlow-Gateway-Key`)
- **Resposta:** `responseMode=responseNode` + `RESPOND - Resultado`
- **Response body:** `={{ $json }}`
- **Merge:** nenhum

## 3. Operações suportadas

O gateway reconhece exatamente 6 operações read-only:

| Operação | Fonte | Tipo | Estado |
|---|---|---|---|
| `clientes.listar` | `CLIENTES` | lista | ✅ homologada |
| `servicos.listar` | `SERVICOS` | lista | ✅ homologada |
| `profissionais.listar` | `PROFISSIONAIS` | lista | ✅ homologada |
| `empresa.obter` | `EMPRESAS` | singular | ✅ homologada |
| `disponibilidades.listar` | `DISPONIBILIDADES` | lista | ✅ homologada |
| `agendamentos.listar` | `AGENDAMENTOS` | lista + período | ✅ homologada |

Qualquer outra operação retorna `INVALID_OPERATION`.

Uma nova operação só deve ser considerada implementada quando existir simultaneamente em:

1. `OPERACOES_SUPORTADAS` no `CODE - Validar Envelope`;
2. `SWITCH - Operação`;
3. branch real conectado;
4. testes;
5. documentação.

## 4. Envelope de requisição

Exemplo genérico:

```json
{
  "operacao": "clientes.listar",
  "idEmpresa": "EMP001",
  "requestId": "uuid-gerado-pelo-nestjs",
  "dados": {}
}
```

Agenda:

```json
{
  "operacao": "agendamentos.listar",
  "idEmpresa": "EMP001",
  "requestId": "uuid-gerado-pelo-nestjs",
  "dados": {
    "dataInicio": "2026-08-01",
    "dataFim": "2026-08-31"
  }
}
```

`idEmpresa` nunca vem livremente do browser. O NestJS resolve o tenant a partir do usuário autenticado antes de chamar o gateway.

## 5. Fluxo real

```text
Webhook - Gateway App
        ↓
CODE - Validar Envelope
        ↓
IF - Envelope Válido
        ├── inválido ───────────────► CODE - Montar Erro
        ↓ válido
SWITCH - Operação
        ↓
branch do recurso
        ↓
GS - Buscar <Recurso>
        ↓
IF - Erro Técnico Ao Buscar <Recurso>
        ├── erro ──────────────────► CODE - Erro Upstream
        ↓ normal
CODE - Normalizar <Recurso>
        ↓
[IF - <Recurso> Inválido Na Fonte, quando aplicável]
        ├── inválido ──────────────► CODE - Montar Erro
        ↓ válido
CODE - Montar Sucesso
        ↓
RESPOND - Resultado
```

Branches mutuamente exclusivos convergem por conexões diretas. Não usar `Merge` nessa topologia.

## 6. Respostas

### Sucesso

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "requestId": "uuid"
  }
}
```

### Erro de negócio/integração

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

O transporte permanece HTTP 200 para envelopes de sucesso/erro do gateway. Falha de Header Auth é rejeitada pelo próprio n8n antes dos nodes de negócio.

## 7. Decisões de segurança

- Header Auth configurado no Webhook; API key nunca é comparada em Code node.
- `idEmpresa` vem do NestJS autenticado.
- Google Sheets aplica filtro `ID_EMPRESA` na fonte.
- `ID_EMPRESA` nunca sai no payload público do gateway.
- identificadores técnicos sem necessidade não são devolvidos.
- nenhum segredo real deve ser versionado.
- `responseMode=lastNode` é proibido neste workflow porque pode devolver payload bruto do trigger.
- `RESPOND - Resultado` deve usar o objeto `={{ $json }}`, nunca `JSON.stringify($json)`.
- sem fallback silencioso para mock dentro do n8n.

## 8. Clientes

Fluxo:

```text
GS - Buscar Clientes
→ IF - Erro Técnico Ao Buscar Clientes
→ CODE - Normalizar Clientes
→ CODE - Montar Sucesso
```

Shape de integração contém dados de cadastro necessários ao App e nunca inclui `ID_EMPRESA`.

Busca vazia legítima retorna `[]`.

## 9. Serviços

Fluxo:

```text
GS - Buscar Serviços
→ IF - Erro Técnico Ao Buscar Serviços
→ CODE - Normalizar Serviços
→ IF - Serviço Inválido Na Fonte
→ sucesso/erro
```

Hardening atual exige campos estruturais, status `ATIVO|INATIVO`, duração e valor válidos. Uma linha real inválida reprova a operação inteira; não há lista parcial silenciosa.

## 10. Profissionais

Fluxo:

```text
GS - Buscar Profissionais
→ IF - Erro Técnico Ao Buscar Profissionais
→ CODE - Normalizar Profissionais
→ IF - Profissional Inválido Na Fonte
→ sucesso/erro
```

Campos públicos relevantes são normalizados; Google Calendar ID e demais campos técnicos permanecem internos à fonte.

## 11. Empresa

`empresa.obter` é a única operação singular.

Fluxo:

```text
GS - Buscar Empresa
→ IF - Erro Técnico Ao Buscar Empresa
→ CODE - Normalizar Empresa
→ IF - Empresa Inválida Na Fonte
→ sucesso/erro
```

Regras:

- 0 linha real → `UPSTREAM_ERROR`;
- 1 linha válida → sucesso;
- 2+ linhas reais → `UPSTREAM_ERROR`;
- timezone e tempo de cancelamento precisam ser válidos;
- `WHATSAPP_PHONE_NUMBER_ID` vira apenas boolean `whatsappConfigurado`, nunca é exposto.

## 12. Disponibilidades

Fluxo:

```text
GS - Buscar Disponibilidades
→ IF - Erro Técnico Ao Buscar Disponibilidades
→ CODE - Normalizar Disponibilidades
→ IF - Disponibilidade Inválida Na Fonte
→ sucesso/erro
```

Regras principais:

- `DIA_SEMANA_NUM` aceita 0–6; `0` é válido;
- `ATIVO` aceita `SIM|NAO`;
- quando aberto, início/fim são obrigatórios;
- nome do profissional é resolvido no NestJS;
- dias sem linha real são tratados no backend, não fabricados pelo WF019.

## 13. Agenda — `agendamentos.listar`

### 13.1 Schema confirmado

A aba `AGENDAMENTOS` possui **18 colunas**:

```text
ID_AGENDAMENTO
ID_EMPRESA
ID_CLIENTE
ID_PROFISSIONAL
ID_SERVICO
DATA
HORA_INICIO
HORA_FIM
DURACAO_MIN
VALOR
STATUS
ORIGEM
OBSERVACOES
GOOGLE_EVENT_ID
DATA_CRIACAO
ULTIMA_ATUALIZACAO
DATA_CANCELAMENTO
MOTIVO_CANCELAMENTO
```

O gateway não devolve todas essas colunas. O shape é minimizado.

### 13.2 Fluxo

```text
GS - Buscar Agendamentos
→ IF - Erro Técnico Ao Buscar Agendamentos
→ CODE - Normalizar Agendamentos
→ IF - Agendamento Inválido Na Fonte
→ sucesso/erro
```

### 13.3 Tenant isolation

`GS - Buscar Agendamentos` filtra obrigatoriamente:

```text
ID_EMPRESA = {{ $json.idEmpresa }}
```

Não carregar dados de outras empresas para depois filtrar somente no NestJS.

### 13.4 Período

O backend envia:

```text
dataInicio
dataFim
```

O Code node revalida presença/formato e aplica o corte por período.

O comportamento atual é:

1. buscar linhas da empresa;
2. validar todas as linhas reais;
3. somente depois filtrar `dataInicio <= data <= dataFim`.

Isso mantém hardening forte, mas pode fazer um dado histórico inválido fora do intervalo derrubar a consulta atual. A ordem deve ser reavaliada futuramente como decisão explícita; não foi alterada no checkpoint `a723bff`.

### 13.5 Status real

A homologação revelou que a fonte sustenta literalmente:

```text
AGENDADO
CONCLUIDO
CANCELADO
```

Whitelist atual:

```js
new Set(['AGENDADO', 'CONCLUIDO', 'CANCELADO'])
```

Regras:

- `AGENDADO` → `AGENDADO`;
- `CONCLUIDO` → `CONCLUIDO` somente quando a fonte trouxer literalmente;
- `CANCELADO` → `CANCELADO`;
- `PENDENTE` → inválido para `AGENDAMENTOS.STATUS`;
- `CONFIRMADO` → inválido para `AGENDAMENTOS.STATUS`.

Nunca inferir `CONCLUIDO` por horário, pagamento ou outra heurística.

### 13.6 Confirmação

`statusConfirmacao` não existe na fonte e não é produzido pelo WF019.

O NestJS monta o contrato público com:

```text
statusConfirmacao = null
```

para todos os agendamentos reais até que exista uma fonte explícita de confirmação.

### 13.7 Shape de integração

```ts
interface N8nGatewayAgendamentoIntegracao {
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

Não inclui:

- `ID_EMPRESA`;
- `GOOGLE_EVENT_ID`;
- origem;
- observações;
- datas técnicas;
- nomes de cliente/profissional/serviço;
- `statusConfirmacao`.

### 13.8 Join no NestJS

O NestJS compõe em paralelo:

```text
agendamentos.listar
clientes.listar
profissionais.listar
servicos.listar
```

Depois resolve:

```text
idCliente      → clienteNome + clienteTelefone
idProfissional → profissionalNome
idServico      → servicoNome
```

Referência inexistente é inconsistência técnica e gera erro controlado. O backend não fabrica nomes como “Cliente desconhecido”.

## 14. Homologação real da Agenda

Homologação concluída em 02/09/2026 contra `BEAUTYFLOW_HOMOLOGACAO`.

Evidências funcionais:

- `agendamentos.listar` → sucesso no backend;
- agosto/2026 → 6 agendamentos reais em visão mensal;
- visão semanal de agosto → registros reais;
- setembro/2026 → `data:[]` e estado vazio correto, sem erro;
- detalhe real validado:
  - cliente: Mariana Teste;
  - profissional: Beatriz Rocha;
  - serviço: Manicure Tradicional;
  - data: 05/08/2026;
  - horário: 14:00–16:00;
  - valor: R$ 180,00;
  - status: `AGENDADO`;
  - confirmação: `—` (`null`).
- `CONCLUIDO` foi observado literalmente na fonte durante homologação e passou a integrar a whitelist v1.12.
- referências órfãs nos dados de homologação foram identificadas pelo hardening de integridade do NestJS, sem mascaramento.

## 15. JSON versionado × homologação Cloud

O arquivo versionado usa `BEAUTYFLOW3.1` como documentId operacional.

Para homologação, após importação/reimportação no n8n Cloud, reapontar manualmente os 6 nodes:

```text
GS - Buscar Clientes
GS - Buscar Serviços
GS - Buscar Profissionais
GS - Buscar Empresa
GS - Buscar Disponibilidades
GS - Buscar Agendamentos
```

para `BEAUTYFLOW_HOMOLOGACAO`.

O arquivo versionado continua com `active:false`; ativação/publicação no Cloud é manual.

A fonte de verdade é o JSON versionado. Edições manuais do Cloud não devem ser exportadas por cima do repositório sem revisão.

## 16. Flags no NestJS relacionadas ao gateway

```env
DATA_SOURCE_CLIENTES=mock|n8n
DATA_SOURCE_SERVICOS=mock|n8n
DATA_SOURCE_PROFISSIONAIS=mock|n8n
DATA_SOURCE_CONFIGURACOES=mock|n8n
DATA_SOURCE_AGENDA=mock|n8n
```

Default: `mock`.

Quando uma flag está em `n8n`, falha do gateway não deve cair silenciosamente para mock.

## 17. Operações conscientemente não implementadas

### Agenda — escrita

Ainda não existem via WF019:

```text
agenda.criar
agenda.editar
agenda.reagendar
agenda.cancelar
agenda.concluir
```

Também não existe writer real de confirmação do cliente.

### Financeiro

Read-only permanece bloqueado pela composição `AGENDAMENTOS + PAGAMENTOS` e decisões de domínio/status.

### Comunicação

Permanece bloqueada pela correlação entre múltiplas abas e ausência de contrato consolidado.

### IA

`IA_MEMORIA` não tem writer conhecido em WF001–WF018; não afirmar memória persistente real sem evidência de fonte.

## 18. Dívidas técnicas preservadas

- escrita da Agenda;
- captura/persistência de confirmação;
- Google Calendar legado nos workflows de Agenda;
- revisão futura da ordem validação × filtro por período;
- hardening adicional dos regex de data/hora;
- performance/timeout do gateway a monitorar;
- Financeiro, Comunicação e IA reais.

## 19. Qualidade do checkpoint `a723bff`

- 469 testes;
- 20 suítes;
- 469/469 verdes;
- lint backend e frontend verdes;
- builds shared-types/backend/frontend verdes;
- WF001–WF018 intactos;
- nenhum `.env` real alterado;
- nenhum segredo encontrado no diff;
- Agenda real homologada manualmente.

## 20. Próxima evolução recomendada

A próxima evolução do WF019 não deve ser adicionar operações aleatórias. A prioridade recomendada é desenhar a **Agenda operacional de escrita** em checkpoints separados, definindo claramente:

1. autoridade das regras entre NestJS e WF004–WF007;
2. criação;
3. reagendamento;
4. cancelamento;
5. conclusão explícita;
6. confirmação do cliente como eixo separado.

Até lá, o status correto é:

> **WF019 v1.12 operacional e homologado em read-only para 6 operações; Agenda operacional em leitura, escrita ainda pendente.**
