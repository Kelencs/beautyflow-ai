# WF019 — APP - WF019 - Gateway App

> **Sincronização:** 2026-08-31
> **Fonte da verdade:** [`APP-WF019-gateway-app.json`](../../workflows/app/APP-WF019-gateway-app.json) no branch `main`.
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado (Fase 2). Regras ou operações que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Ser a camada de integração entre o backend NestJS do BeautyFlow App e os dados
operacionais do n8n, autenticando a chamada, validando o envelope de requisição e
devolvendo um envelope de resposta padronizado. Nesta Fase 2, conhece `clientes.listar`
(Fase 1, validado em homologação real) e `servicos.listar` (Fase 2, ainda não testado em
ambiente real — ver seção 11).

## 2. Identificação técnica

- **Workflow:** `APP - WF019 - Gateway App`
- **ID funcional:** `WF019`
- **Arquivo JSON:** `APP-WF019-gateway-app.json`
- **Status `active` no JSON versionado:** `false` (ativação é passo manual após revisão/import — ver seção 9)
- **Gatilho:** `Webhook` (POST), path `beautyflow-app`, autenticado via Header Auth.

## 3. Entradas

Corpo da requisição (JSON), enviado exclusivamente pelo backend NestJS
(`N8nGatewayClient`, `backend/src/n8n-gateway/n8n-gateway.client.ts`):

```json
{
  "operacao": "clientes.listar",
  "idEmpresa": "EMP001",
  "requestId": "uuid-gerado-pelo-nestjs",
  "dados": {}
}
```

`operacao` também aceita `"servicos.listar"` (Fase 2) — mesmo shape de requisição, só o
valor do campo muda. `idEmpresa` nunca vem do browser — o NestJS já o resolveu via
Supabase Auth (`SupabaseAuthGuard`/`@CurrentUser()`) antes de chamar o gateway.

## 4. Fluxo real do workflow

1. `Webhook - Gateway App` recebe o POST; a credencial Header Auth do próprio node
   rejeita a requisição (403, nativo do n8n) antes de qualquer node de negócio rodar se
   `X-BeautyFlow-Gateway-Key` estiver ausente/incorreto.
2. `CODE - Validar Envelope` normaliza `operacao`/`idEmpresa`/`requestId`/`dados` e
   calcula `erro_codigo`: `VALIDATION_ERROR` se `operacao` ausente; `TENANT_REQUIRED` se
   `idEmpresa` ausente; `INVALID_OPERATION` se a operação não for `clientes.listar` nem
   `servicos.listar`.
3. `IF - Envelope Válido` decide: inválido vai direto para `CODE - Montar Erro`; válido
   segue para `SWITCH - Operação`.
4. `SWITCH - Operação` (Fase 2) roteia por `$json.operacao` — `clientes.listar` para o
   branch de Clientes, `servicos.listar` para o branch de Serviços. `fallbackOutput:
   "none"`: como `CODE - Validar Envelope` já garante que só uma operação suportada
   chega até aqui, o fallback nunca deveria disparar na prática.
5. **Branch Clientes**: `GS - Buscar Clientes` lê `CLIENTES` filtrando por `ID_EMPRESA =
   idEmpresa` (`filtersUI`), com `alwaysOutputData` + `onError: continueRegularOutput`
   (mesmo padrão corrigido já usado em CLI-WF008/ADM-WF017/ADM-WF018 do projeto).
   **Validado em teste real** (ver seção 4.1): EMP001/EMP002 corretamente isolados.
   `IF - Erro Técnico Ao Buscar Clientes` verifica `$json.error` explicitamente — falha
   técnica vai para `CODE - Erro Upstream`; resultado normal (inclusive 0 linhas
   legítimas) segue para `CODE - Normalizar Clientes`, que descarta o item-placeholder de
   uma busca vazia (sem `ID_CLIENTE`) e mapeia cada linha real para o shape de
   integração — nunca inclui `ID_EMPRESA` nem colunas técnicas.
6. **Branch Serviços** (Fase 2, ver seção 11 para detalhes): mesma estrutura do branch de
   Clientes — `GS - Buscar Serviços` (filtro `ID_EMPRESA`) → `IF - Erro Técnico Ao Buscar
   Serviços` → `CODE - Normalizar Serviços`.
7. `CODE - Erro Upstream` e `CODE - Montar Sucesso` são **compartilhados** entre os dois
   branches (cada um recebe 2 conexões diretas — uma de cada branch, nunca simultâneas na
   mesma execução). `CODE - Montar Sucesso` lê `$json.clientes ?? $json.servicos` —
   qualquer um dos dois normalizadores pode ter produzido o campo. Ambos convergem em
   `RESPOND - Resultado` (sem node `Merge` — conexão direta múltipla, ver seção 5), que
   responde ao Webhook (ver seção 4.2).

### 4.1 Resultado do primeiro teste real de integração

Confirmado com dados reais na planilha de homologação (`BEAUTYFLOW_HOMOLOGACAO`,
configurada manualmente no Cloud — ver seção 6.1): Webhook POST, Header Auth,
`clientes.listar`, filtro por `ID_EMPRESA`, isolamento EMP001/EMP002 e normalização dos
clientes funcionaram corretamente — **essa lógica não foi mexida nesta correção**. O único
problema real estava na resposta HTTP final (seção 4.2).

### 4.2 Estratégia de resposta HTTP (corrigida nesta tarefa — v1.1)

**Escolhida a opção "Webhook + Respond to Webhook"** (`responseMode: "responseNode"` no
Webhook + um único `RESPOND - Resultado` no fim de cada branch) — é a única das duas
formas do node Webhook que permite decidir explicitamente o corpo da resposta; "When Last
Node Finishes" (`responseMode: "lastNode"`) devolve o output cru do último node
*executado*, que nesta topologia pode ser o próprio trigger, incluindo `headers`
(com o header de autenticação), `params`, `query`, `body`, `webhookUrl` e
`executionMode` — confirmado em teste real, e por isso terminantemente proibido aqui.
Essa mesma estratégia (`responseNode` + `respondToWebhook` dedicado) já é usada,
comprovada em produção, em `ATD-WF001-receber-whatsapp.json` (`active: true`) — não é uma
escolha nova para o projeto.

**Causa raiz do body HTTP vazio** (observado mesmo já usando `responseNode`): o
`RESPOND - Resultado` usava `responseBody: "={{ JSON.stringify($json) }}"`.
`JSON.stringify(...)` devolve uma **string**, mas o node "Respond to Webhook" em modo
`respondWith: "json"` espera a expressão resolver para o **objeto** a ser serializado —
passar uma string pré-serializada nesse campo não produz o corpo esperado. A comparação
direta com `RESP - Evento Recebido` do WF001 (mesmo `typeVersion: 1.4`, mesmo
`respondWith: "json"`, testado em produção) confirma o padrão correto: o campo
`responseBody` deve resolver para o dado a ser devolvido, não para uma string JSON já
formatada. **Corrigido para `responseBody: "={{ $json }}"`.**

Nenhuma mudança foi necessária nos Code nodes (`CODE - Montar Sucesso`/`CODE - Montar
Erro`) — cada um já produzia exatamente 1 item com o shape correto; o defeito estava
isolado no node de resposta.

## 5. Regras e decisões implementadas

- Autenticação é responsabilidade do Header Auth do próprio Webhook — nenhum Code node
  compara a API key (ela nunca fica acessível ao código do workflow, só ao mecanismo de
  credencial do n8n).
- Todas as respostas HTTP desta Fase 1 usam status 200; o resultado real (sucesso ou
  erro) fica em `ok`/`error` no corpo — decisão deliberada de manter o transporte simples
  e a distinção de resultado inteiramente no envelope JSON (falha de autenticação é a
  única exceção, tratada pelo n8n antes de chegar a um node de negócio).
- Convergência de branches mutuamente exclusivos nunca usa `n8n-nodes-base.merge` —
  conexão direta múltipla no mesmo node regular (`CODE - Montar Erro` recebe 2 conexões;
  `RESPOND - Resultado` recebe 2 conexões), evitando o bug de travamento já documentado
  no histórico de correção do WF016 (Merge com `numberInputs` nunca satisfeito quando só
  um branch dispara por execução).
- `ID_EMPRESA` nunca aparece na resposta.
- `INVALID_OPERATION` cobre qualquer operação diferente de `clientes.listar`/
  `servicos.listar` — nenhum branch vazio para operações futuras (Agenda/Financeiro/etc.)
  existe neste JSON. Adicionar uma 3ª operação exige: novo par `GS - Buscar
  <Recurso>`/`IF - Erro Técnico`, nova regra em `SWITCH - Operação`, atualizar
  `OPERACOES_SUPORTADAS` em `CODE - Validar Envelope`, e ligar o novo normalizador às
  conexões extras de `CODE - Erro Upstream`/`CODE - Montar Sucesso` (ver sticky note do
  workflow).
- O Webhook nunca deve responder com o payload bruto do próprio trigger — ver seção 4.2.
  Isso inclui, comprovado em teste real, o header de autenticação: nunca usar
  `responseMode: "lastNode"` neste workflow.

## 6. Integrações e dependências

- Google Sheets: `CLIENTES` e `SERVICOS` (leitura), credencial reutilizada `Google Sheets
  account` (mesmo id já usado por WF004/WF006/WF007/WF008/WF009/WF010/WF011/WF013/
  WF014/WF015 — nenhuma credencial nova criada).
- Nenhuma chamada a WF001–WF018.

### 6.2 Schema real SERVICOS × contrato público (Fase 2, corrigido)

**Correção de premissa**: uma auditoria anterior (baseada só em `AGE-WF004-consultar-
disponibilidade.json`, `COM-WF013-lembrete.json` e `COM-WF014-pesquisa.json` — workflows
que só leem um subconjunto das colunas) concluiu incorretamente que `DESCRICAO` não
existia na aba real. **A planilha `SERVICOS` real confirmada tem exatamente 11 colunas**:
`ID_SERVICO`, `ID_EMPRESA`, `NOME`, `CATEGORIA`, `DESCRICAO`, `DURACAO_MIN`,
`TEMPO_INTERVALO_MIN`, `VALOR`, `STATUS`, `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`.
`DESCRICAO` existe de fato e agora é mapeada corretamente (corrigido nesta tarefa).

| Coluna Sheets | Campo de integração (WF019) | Campo público `Servico` | Transformação | Obrigatório? |
|---|---|---|---|---|
| `ID_SERVICO` | `idServico` | `idServico` | `String(...)` | Sim — ausência = linha ignorada como busca vazia SE nenhum outro campo estiver presente; caso contrário, linha corrompida (ver seção 11) |
| `ID_EMPRESA` | — (removido) | — (nunca exposto) | usado só como filtro (`filtersUI`) | — |
| `NOME` | `nome` | `nome` | `trim()`; vazio/ausente **falha a operação** (v1.3) | Sim |
| `CATEGORIA` | **não lido** | **não existe no contrato** | existe na aba real; adicioná-la ao contrato público é decisão de produto fora desta tarefa | Não se aplica |
| `DESCRICAO` | `descricao` | `descricao` | `trim()`; vazio/ausente vira `null` — nunca fabricada, nunca substituída pelo `NOME`. **Opcional**: sozinha, nunca falha a operação (corrigido nesta tarefa — antes era sempre `null` por premissa errada) | Não (opcional) |
| `DURACAO_MIN` | `duracaoMinutos` | `duracaoMinutos` | `Number(...)`; não finito/negativo **falha a operação** (v1.3, nunca 0 fabricado) | Sim |
| `TEMPO_INTERVALO_MIN` | **não lido** | **não existe no contrato** | usado só pelo cálculo de disponibilidade do WF004 — fora do escopo de `servicos.listar` | Não se aplica |
| `VALOR` | `valor` | `valor` | parse defensivo BR-currency-aware (`"R$ 1.250,50"` → `1250.5`); não finito/negativo **falha a operação** (v1.3) | Sim |
| `STATUS` | `status` | `status` | `trim().toUpperCase()`; só `'ATIVO'`/`'INATIVO'` aceitos — qualquer outro valor **falha a operação** (v1.3, nunca vira `'ATIVO'` por default) | Sim |
| `DATA_CADASTRO` | **não lido** | **não existe no contrato** | existe na aba real; fora do escopo desta operação | Não se aplica |
| `ULTIMA_ATUALIZACAO` | **não lido** | **não existe no contrato** | existe na aba real; fora do escopo desta operação | Não se aplica |

`CATEGORIA`, `TEMPO_INTERVALO_MIN`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` **nunca são
lidos** por `CODE - Normalizar Serviços` — não é um gap acidental, é escopo deliberado
desta operação (adicioná-los ao contrato público `Servico` é decisão de produto para uma
fase futura, não erro a corrigir agora).

**Hardening v1.3**: até a correção desta tarefa, uma linha com `STATUS`/`DURACAO_MIN`/
`VALOR` inválido era silenciosamente descartada (a operação continuava, só com menos
itens). Isso mascarava dado corrompido da fonte. Agora, qualquer serviço real da empresa
(linha com `ID_SERVICO`) com um campo obrigatório inválido faz a operação **inteira**
falhar com `UPSTREAM_ERROR` — nunca uma lista parcial silenciosamente incompleta. Só a
linha-placeholder do `alwaysOutputData` (busca legitimamente vazia, sem `ID_SERVICO`)
continua sendo tratada como sucesso com `data: []`.

**`WF004` filtra `GS - Buscar Serviço` também por `STATUS = 'ATIVO'`** (é a regra própria
dele para cálculo de disponibilidade) — `GS - Buscar Serviços` do WF019 **não** replica
esse filtro: `servicos.listar` devolve o catálogo inteiro (ativos e inativos), mesmo
comportamento que o mock do App já tem hoje (`SERVICOS_MOCK_RECORDS` inclui `SRV007`/
`SRV008` como `INATIVO`).

### 6.1 Credencial × planilha (não confundir)

A **credencial** (`googleSheetsOAuth2Api`, id `bV94b0kU1RKmLn1F`, nome "Google Sheets
account") só autentica a conta Google usada pelo node — ela não determina qual planilha é
lida. Quem determina a planilha é o **`documentId`** do node `GS - Buscar Clientes`. A
mesma credencial pode ler qualquer planilha à qual a conta Google tenha acesso; trocar de
planilha (produção → homologação) é uma mudança só no `documentId`, nunca na credencial.

**Estado atual, confirmado por leitura direta do JSON** (`n8n/workflows/app/APP-WF019-gateway-app.json`,
node `GS - Buscar Clientes`):

| Campo | Valor |
|---|---|
| `documentId.value` | `1lJtjTZU8xH8rNGZqqMwH8xlmGrUdm4ml-DFR4DOjV6E` |
| `documentId.cachedResultName` | `BEAUTYFLOW3.1` |
| `sheetName.cachedResultName` | `CLIENTES` (gid `1174621667`) |
| Credencial | `googleSheetsOAuth2Api` id `bV94b0kU1RKmLn1F` ("Google Sheets account") — reutilizada, mesma de WF004/WF006-WF015 |
| Aponta para produção? | **Sim, na fonte versionada.** `1lJtjTZU8xH8rNGZqqMwH8xlmGrUdm4ml-DFR4DOjV6E`/`BEAUTYFLOW3.1` é a mesma planilha de produção usada por WF001–WF018 (confirmado por grep cruzado nos demais workflows) — não é um placeholder. |
| Depende de configuração manual? | Sim — o primeiro teste real já foi feito apontando manualmente (só na cópia do n8n Cloud, nunca neste arquivo) para uma planilha `BEAUTYFLOW_HOMOLOGACAO` já existente, com sucesso (isolamento EMP001/EMP002 confirmado). |

**O JSON versionado continua apontando para produção de propósito** — o `documentId` da
homologação não é conhecido/gravado aqui para não inventar um valor nem arriscar
confundir qual planilha é a "fonte de verdade" do arquivo. Sempre que este arquivo for
reimportado no n8n Cloud, o passo manual de trocar o `documentId` de `GS - Buscar
Clientes` de volta para `BEAUTYFLOW_HOMOLOGACAO` precisa ser refeito (ver seção 9) — o
import por si só reverteria esse node para produção.

## 7. Saídas e estados

Envelope de sucesso — **este objeto é literalmente o corpo HTTP** (`RESPOND - Resultado`,
`responseBody: "={{ $json }}"`), nunca embrulhado em array, nunca uma string:

```json
{ "ok": true, "data": [ { "idCliente": "...", "nome": "...", "...": "..." } ], "meta": { "requestId": "..." } }
```

`servicos.listar` devolve o mesmo shape de envelope, com `data` no formato:

```json
{ "ok": true, "data": [ { "idServico": "...", "nome": "...", "status": "ATIVO", "duracaoMinutos": 120, "valor": 120 } ], "meta": { "requestId": "..." } }
```

Envelope de erro — mesmo mecanismo de resposta, mesmo formato:

```json
{ "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "..." }, "meta": { "requestId": "..." } }
```

Códigos possíveis nesta fase: `VALIDATION_ERROR`, `TENANT_REQUIRED`, `INVALID_OPERATION`,
`UPSTREAM_ERROR`. `AUTH_FAILED` e `INTERNAL_ERROR` são produzidos pelo NestJS
(`N8nGatewayClient`), não pelo corpo de resposta deste workflow — ver seção 8.

## 8. Tratamento de erros e bloqueios

- Falha de autenticação (API key ausente/incorreta): o próprio n8n responde com seu
  status de erro nativo (401/403) antes de qualquer node rodar; o `N8nGatewayClient` do
  NestJS interpreta esse status HTTP como `AUTH_FAILED` (nunca tenta interpretar o corpo
  dessa resposta como o envelope `{ok,...}`).
- Falha técnica ao ler `CLIENTES` (Sheets fora do ar, aba renomeada, etc.): detectada
  explicitamente via `$json.error` (nunca inferida de "0 itens"), vira `UPSTREAM_ERROR`.
- Gateway não configurado do lado NestJS (`N8N_GATEWAY_URL`/`N8N_GATEWAY_API_KEY`
  ausentes) ou resposta em formato inesperado: tratado inteiramente do lado NestJS como
  `INTERNAL_ERROR`/`UPSTREAM_ERROR`, sem sequer chamar o webhook no primeiro caso.

## 9. Passos manuais necessários no n8n Cloud (não feitos nesta tarefa)

**Drift conhecido**: o WF019 no n8n Cloud foi editado manualmente durante os testes
(`responseMode` trocado para "When Last Node Finishes" em algum momento, entre outras
mudanças pontuais) — a cópia do Cloud **não** é mais confiável como referência. A fonte
de verdade voltou a ser só este arquivo. Recomendação: **substituir** o workflow no Cloud
pela versão corrigida (reimportar por cima do mesmo workflow existente, mesmo `id`
`4gvaicjXEZDgCcO7` — não é necessário apagar e recriar do zero, já que o `id` interno
identifica o mesmo workflow), não tentar reconciliar manualmente as edições feitas
durante o teste.

1. No n8n Cloud, reimportar `APP-WF019-gateway-app.json` **por cima** do workflow `APP -
   WF019 - Gateway App` existente (mesmo `id`) — isso substitui `responseMode`, o
   `RESPOND - Resultado` corrigido e todo o resto pelo conteúdo deste arquivo.
2. Recriar a credencial **Header Auth** (`X-BeautyFlow-Gateway-Key`) — como a API key foi
   rotacionada mais de uma vez durante os testes, gere um valor novo neste passo, não
   reaproveite nenhum valor antigo — e associá-la ao node `Webhook - Gateway App`
   (o reimport traz de volta o placeholder `CONFIGURAR_CREDENCIAL_HEADER_AUTH`, que
   precisa ser substituído pela credencial real de novo).
3. **Repetir o reapontamento do `documentId`** de `GS - Buscar Clientes` **e (novo na
   Fase 2) de `GS - Buscar Serviços`** para a planilha `BEAUTYFLOW_HOMOLOGACAO` (já
   existe e já foi usada com sucesso em `clientes.listar` — ver seção 6.1). O reimport
   reverte os dois campos para o valor de produção gravado neste arquivo
   (`1lJtjTZU8xH8rNGZqqMwH8xlmGrUdm4ml-DFR4DOjV6E`). **Não** testar contra produção.
   `servicos.listar` ainda não foi testado em nenhum ambiente real — ver seção 11.
4. Copiar a URL real do Webhook (aba "Produção" do node, após ativar) para
   `N8N_GATEWAY_URL` no `.env` local do backend, e o novo valor da credencial (passo 2)
   para `N8N_GATEWAY_API_KEY` — nunca commitar esses valores.
5. Manter o workflow inativo (`active: false`, valor já trazido pelo reimport) até
   revisão manual sua; ativar só quando decidir rodar o próximo teste real.

## 11. `servicos.listar` (Fase 2 — implementado, ainda não testado em ambiente real)

- **Schema real × contrato público**: ver seção 6.2.
- **`descricao` (corrigido — não é mais tratada como gap)**: a aba `SERVICOS` real **tem**
  a coluna `DESCRICAO` — uma premissa anterior deste projeto, de que a coluna não
  existia, estava errada. `CODE - Normalizar Serviços` agora mapeia `DESCRICAO` →
  `descricao`: valor preenchido vira string normalizada (`trim()`), vazio/ausente vira
  `null` — nunca fabricada, nunca substituída pelo `NOME`. `descricao` é opcional:
  sozinha, nunca faz a operação falhar (diferente de `NOME`/`STATUS`/`DURACAO_MIN`/
  `VALOR`), mas conta como "campo operacional presente" na distinção placeholder ×
  linha corrompida do hardening v1.4 (uma linha com `DESCRICAO` preenchida mas
  `ID_SERVICO` vazio também é tratada como dado corrompido, não como busca vazia). O
  frontend (`ServicoCardList.tsx`/`ServicoDetailsDrawer.tsx`) já renderiza `descricao`
  condicionalmente (`{servico.descricao && ...}`) desde antes — nenhuma mudança de
  frontend foi necessária.
- **`categoria`/`dataCadastro`/`ultimaAtualizacao` — não fazem parte do contrato**:
  `CATEGORIA`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem na aba real, mas o
  contrato público `Servico` não tem campos correspondentes. Documentado como fonte
  existente, não exposta — adicioná-los é decisão de produto para uma fase futura, não
  tomada nesta tarefa.
- **Validação estrita de `STATUS`/`VALOR`/`DURACAO_MIN`/`NOME` (hardening v1.3)**:
  `CODE - Normalizar Serviços` exige `NOME` não vazio, `STATUS` explicitamente
  `'ATIVO'`/`'INATIVO'` (trim+uppercase; qualquer outro valor — `''`, `'ATIV'`,
  `'PENDENTE'`, `'DESATIVADO'` etc. — nunca vira `'ATIVO'` por default) e
  `VALOR`/`DURACAO_MIN` finitos e não-negativos (`VALOR` aceita formato BR:
  `"R$ 1.250,50"`, `"90,50"`). **Qualquer serviço real (com `ID_SERVICO`) que falhe uma
  dessas checagens faz a operação inteira responder `UPSTREAM_ERROR`** — nunca uma lista
  parcial silenciosa com o item corrompido só "sumindo". A mensagem de erro é genérica
  (`"Um ou mais serviços cadastrados possuem dados inválidos."`) e nunca expõe
  `ID_SERVICO`/`ID_EMPRESA`/planilha/linha bruta. `IF - Serviço Inválido Na Fonte` é o
  node que decide entre esse erro e `CODE - Montar Sucesso`. Comportamento coberto por
  testes em `wf019-workflow.simulation.spec.ts`.
- **Tenant**: mesmo filtro `ID_EMPRESA` do branch de Clientes, mesma defesa em
  profundidade.
- **`TEMPO_INTERVALO_MIN`**: existe na aba real (usado só pelo cálculo de disponibilidade
  do WF004), mas não faz parte do contrato público `Servico` — o WF019 nem chega a lê-lo
  para esta operação.
- **Configuração manual pendente**: `documentId` de `GS - Buscar Serviços` continua
  apontando para produção na fonte versionada (mesma política do branch de Clientes — ver
  seção 6.1/9). Antes do primeiro teste real, reapontar manualmente para
  `BEAUTYFLOW_HOMOLOGACAO`, a mesma planilha de homologação já usada e validada por
  `clientes.listar`.
- **Status do teste real**: `clientes.listar` já foi validado de ponta a ponta em
  homologação (seção 4.1). `servicos.listar` foi implementado e validado só por
  simulação local (`node --check` + execução real do JS de cada Code node fora do n8n,
  sem chamar Sheets/Cloud) — **nenhum teste real contra o n8n Cloud foi feito nesta
  tarefa**, conforme escopo explicitamente pedido.

## 12. Critério de manutenção desta documentação

Sempre que `APP-WF019-gateway-app.json` for alterado, este arquivo deve ser revisado na
mesma mudança. Em caso de divergência, o JSON versionado é a referência para o
comportamento implementado.
