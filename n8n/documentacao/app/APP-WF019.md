# WF019 — APP - WF019 - Gateway App

> **Sincronização:** 2026-09-01
> **Fonte da verdade:** [`APP-WF019-gateway-app.json`](../../workflows/app/APP-WF019-gateway-app.json) no branch `main`.
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado (camada read-only completa desta rodada — ver seção 13, "Matriz READ-ONLY"). Regras ou operações que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Ser a camada de integração entre o backend NestJS do BeautyFlow App e os dados
operacionais do n8n, autenticando a chamada, validando o envelope de requisição e
devolvendo um envelope de resposta padronizado. **As 5 operações suportadas —
`clientes.listar`, `servicos.listar`, `profissionais.listar`, `empresa.obter` e
`disponibilidades.listar` — já foram validadas em ambiente real de homologação** (webhook
real, EMP001, tela BeautyFlow correspondente conferida com os dados reais devolvidos —
ver seção 7 para o detalhe de cada uma). Ver seção 13 para a auditoria completa de quais
outras leituras foram avaliadas e conscientemente NÃO implementadas nesta rodada (Agenda, Financeiro,
Comunicação, IA).

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

`operacao` também aceita `"servicos.listar"` (Fase 2), `"profissionais.listar"` (Fase 3),
`"empresa.obter"` e `"disponibilidades.listar"` — mesmo shape de requisição, só o valor do
campo muda. `idEmpresa` nunca vem do browser — o NestJS já o resolveu via Supabase Auth
(`SupabaseAuthGuard`/`@CurrentUser()`) antes de chamar o gateway.

## 4. Fluxo real do workflow

1. `Webhook - Gateway App` recebe o POST; a credencial Header Auth do próprio node
   rejeita a requisição (403, nativo do n8n) antes de qualquer node de negócio rodar se
   `X-BeautyFlow-Gateway-Key` estiver ausente/incorreto.
2. `CODE - Validar Envelope` normaliza `operacao`/`idEmpresa`/`requestId`/`dados` e
   calcula `erro_codigo`: `VALIDATION_ERROR` se `operacao` ausente; `TENANT_REQUIRED` se
   `idEmpresa` ausente; `INVALID_OPERATION` se a operação não for uma das 5 suportadas
   (`clientes.listar`, `servicos.listar`, `profissionais.listar`, `empresa.obter`,
   `disponibilidades.listar`).
3. `IF - Envelope Válido` decide: inválido vai direto para `CODE - Montar Erro`; válido
   segue para `SWITCH - Operação`.
4. `SWITCH - Operação` roteia por `$json.operacao` entre os 5 branches.
   `fallbackOutput: "none"`: como `CODE - Validar Envelope` já garante que só uma operação
   suportada chega até aqui, o fallback nunca deveria disparar na prática.
5. **Branch Clientes**: `GS - Buscar Clientes` lê `CLIENTES` filtrando por `ID_EMPRESA =
   idEmpresa` (`filtersUI`), com `alwaysOutputData` + `onError: continueRegularOutput`
   (mesmo padrão corrigido já usado em CLI-WF008/ADM-WF017/ADM-WF018 do projeto).
   **Validado em teste real** (ver seção 4.1): EMP001/EMP002 corretamente isolados.
   `IF - Erro Técnico Ao Buscar Clientes` verifica `$json.error` explicitamente — falha
   técnica vai para `CODE - Erro Upstream`; resultado normal (inclusive 0 linhas
   legítimas) segue para `CODE - Normalizar Clientes`, que descarta o item-placeholder de
   uma busca vazia (sem `ID_CLIENTE`) e mapeia cada linha real para o shape de
   integração — nunca inclui `ID_EMPRESA` nem colunas técnicas.
6. **Branch Serviços** (Fase 2, ver seção 11 para detalhes; **validado em homologação
   real** — ver seção 11): mesma estrutura do branch de Clientes — `GS - Buscar Serviços`
   (filtro `ID_EMPRESA`) → `IF - Erro Técnico Ao Buscar Serviços` → `CODE - Normalizar
   Serviços`.
7. **Branch Profissionais** (Fase 3, ver seção 11.1 para detalhes): mesma estrutura —
   `GS - Buscar Profissionais` (filtro `ID_EMPRESA`) → `IF - Erro Técnico Ao Buscar
   Profissionais` → `CODE - Normalizar Profissionais`.
8. **Branch Empresa** (camada read-only completa, ver seção 11.2): única operação
   **singular** do gateway — `GS - Buscar Empresa` (filtro `ID_EMPRESA`) → `IF - Erro
   Técnico Ao Buscar Empresa` → `CODE - Normalizar Empresa`, que produz um OBJETO único
   (`$json.empresa`), nunca um array; ausência de linha real vira `UPSTREAM_ERROR` (nunca
   "sucesso vazio", diferente das operações `.listar`).
9. **Branch Disponibilidades** (camada read-only completa, ver seção 11.3): mesma
   estrutura das `.listar` — `GS - Buscar Disponibilidades` (filtro `ID_EMPRESA`) → `IF -
   Erro Técnico Ao Buscar Disponibilidades` → `CODE - Normalizar Disponibilidades`.
10. `CODE - Erro Upstream` e `CODE - Montar Sucesso` são **compartilhados** entre os 5
    branches (cada um recebe uma conexão direta por branch, nunca simultâneas na mesma
    execução). `CODE - Montar Sucesso` lê `$json.clientes ?? $json.servicos ??
    $json.profissionais ?? $json.disponibilidades ?? $json.empresa` — qualquer um dos
    normalizadores pode ter produzido o campo. Todos convergem em `RESPOND - Resultado`
    (sem node `Merge` — conexão direta múltipla, ver seção 5), que responde ao Webhook
    (ver seção 4.2).

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

### 4.3 Resultado da homologação real da camada read-only completa

Confirmado com dados reais em `BEAUTYFLOW_HOMOLOGACAO` (documentId reapontado
manualmente nos 3 nodes `GS -` correspondentes, ver seção 9): webhook real, todas as 5
operações responderam corretamente.

- **`servicos.listar`**: EMP001/EMP002 isolados; hardening `UPSTREAM_ERROR` confirmado
  alterando `STATUS` de um serviço real para valor inválido, sem lista parcial;
  `ATIVO`/`INATIVO` corretos.
- **`profissionais.listar`**: tela `/profissionais` — 3 profissionais de EMP001 (2
  ativos, 1 inativo), `especialidade`/`telefone`/`email`/`status` corretos.
- **`empresa.obter`**: tela `/configuracoes`, aba Negócio — `nome` ("Studio Bella HML"),
  `telefone` e `email` reais de EMP001, `timezone`/`tempoCancelamentoMinutos`/
  `whatsappConfigurado` corretos.
- **`disponibilidades.listar`**: tela `/configuracoes`, aba Agenda — `America/Sao_Paulo`,
  janela de cancelamento até 120 minutos; grade por profissional correta (ex.: Beatriz
  Rocha com segunda e terça 09:00–18:00 e intervalo 12:00–13:00; Larissa Nunes com quarta
  10:00–19:00 e intervalo 13:00–14:00; demais dias corretamente fechados);
  `DIA_SEMANA_NUM=0` confirmado tratado como dado válido (domingo), nunca como ausência;
  `profissionalNome` resolvido corretamente via `ProfissionaisService`.

Nenhum dado sensível (headers, `webhookUrl`, `executionMode`, credencial, `documentId`,
`ID_EMPRESA`, `WHATSAPP_PHONE_NUMBER_ID`, `GOOGLE_CALENDAR_ID`) vazou em nenhuma das 5
respostas.

## 5. Regras e decisões implementadas

- Autenticação é responsabilidade do Header Auth do próprio Webhook — nenhum Code node
  compara a API key (ela nunca fica acessível ao código do workflow, só ao mecanismo de
  credencial do n8n).
- Todas as respostas HTTP desta Fase 1 usam status 200; o resultado real (sucesso ou
  erro) fica em `ok`/`error` no corpo — decisão deliberada de manter o transporte simples
  e a distinção de resultado inteiramente no envelope JSON (falha de autenticação é a
  única exceção, tratada pelo n8n antes de chegar a um node de negócio).
- Convergência de branches mutuamente exclusivos nunca usa `n8n-nodes-base.merge` —
  conexão direta múltipla no mesmo node regular (`CODE - Montar Erro`/`CODE - Montar
  Sucesso`/`RESPOND - Resultado` recebem uma conexão por branch), evitando o bug de
  travamento já documentado no histórico de correção do WF016 (Merge com `numberInputs`
  nunca satisfeito quando só um branch dispara por execução).
- `ID_EMPRESA` nunca aparece na resposta.
- `INVALID_OPERATION` cobre qualquer operação diferente das 5 suportadas — nenhum branch
  vazio para operações futuras (Agenda/Financeiro/Comunicação/IA — ver seção 13, todas
  avaliadas e conscientemente não implementadas nesta rodada) existe neste JSON.
  Adicionar uma 6ª operação exige: novo par `GS - Buscar <Recurso>`/`IF - Erro Técnico`,
  nova regra em `SWITCH - Operação`, atualizar `OPERACOES_SUPORTADAS` em `CODE - Validar Envelope`, e ligar o novo
  normalizador às conexões extras de `CODE - Erro Upstream`/`CODE - Montar Sucesso` (ver
  sticky note do workflow).
- O Webhook nunca deve responder com o payload bruto do próprio trigger — ver seção 4.2.
  Isso inclui, comprovado em teste real, o header de autenticação: nunca usar
  `responseMode: "lastNode"` neste workflow.

## 6. Integrações e dependências

- Google Sheets: `CLIENTES`, `SERVICOS` e `PROFISSIONAIS` (leitura), credencial
  reutilizada `Google Sheets account` (mesmo id já usado por WF004/WF006/WF007/WF008/
  WF009/WF010/WF011/WF013/WF014/WF015 — nenhuma credencial nova criada).
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

### 6.3 Schema real PROFISSIONAIS × contrato público (corrigido)

**Correção de schema**: uma auditoria anterior desta Fase 3, baseada só nos workflows
`AGE-WF004`/`COM-WF013`/`COM-WF014` (que leem só um subconjunto de colunas — filtro
`ID_EMPRESA`, e `ID_PROFISSIONAL`/`NOME` no código), concluiu incorretamente que
`TELEFONE`/`EMAIL`/`ESPECIALIDADE` não existiam na planilha real. **A planilha
`PROFISSIONAIS` real confirmada tem exatamente 12 colunas**: `ID_PROFISSIONAL`,
`ID_EMPRESA`, `NOME`, `ESPECIALIDADE`, `TELEFONE`, `EMAIL`, `GOOGLE_CALENDAR_ID`,
`DURACAO_INTERVALO_MIN`, `STATUS`, `DATA_ADMISSAO`, `DATA_CADASTRO`,
`ULTIMA_ATUALIZACAO`. `ESPECIALIDADE`/`TELEFONE`/`EMAIL` existem de fato e agora são
mapeadas corretamente (corrigido nesta tarefa).

| Coluna Sheets | Campo de integração (WF019) | Campo público `Profissional` | Transformação | Obrigatório? |
|---|---|---|---|---|
| `ID_PROFISSIONAL` | `idProfissional` | `idProfissional` | `String(...)` | Sim — ausência = linha ignorada como busca vazia SE nenhum outro campo estiver presente; caso contrário, linha corrompida (ver seção 11.1) |
| `ID_EMPRESA` | — (removido) | — (nunca exposto) | usado só como filtro (`filtersUI`) | — |
| `NOME` | `nome` | `nome` | `trim()`; vazio/ausente **falha a operação** | Sim |
| `ESPECIALIDADE` | `especialidade` | `especialidade` | `trim()`; vazio/ausente vira `null` — nunca fabricada, nunca inferida do `NOME`/serviços. **Opcional**: sozinha, nunca falha a operação | Não (opcional) |
| `TELEFONE` | `telefone` | `telefone` | preservado como **string** (nunca `Number(...)` — telefone é identificador/texto, não quantidade: evita perder zero à esquerda, `+` internacional e precisão); `trim()`; vazio/ausente vira `null`. **Opcional** | Não (opcional) |
| `EMAIL` | `email` | `email` | `trim()`; vazio/ausente vira `null` — nunca fabricado. **Opcional**: sozinho, nunca falha a operação | Não (opcional) |
| `GOOGLE_CALENDAR_ID` | **não lido** | **não existe no contrato** | identificador de integração interno (Google Calendar); expor ao contrato público é decisão de produto fora desta tarefa | Não se aplica |
| `DURACAO_INTERVALO_MIN` | **não lido** | **não existe no contrato** | existe na aba real; uso futuro previsto em Agenda/cálculo de disponibilidade, fora do escopo de `profissionais.listar` | Não se aplica |
| `STATUS` | `status` | `status` | `trim().toUpperCase()`; só `'ATIVO'`/`'INATIVO'` aceitos — qualquer outro valor **falha a operação** (nunca vira `'ATIVO'` por default) | Sim |
| `DATA_ADMISSAO` | **não lido** | **não existe no contrato** | existe na aba real; fora do escopo desta operação | Não se aplica |
| `DATA_CADASTRO` | **não lido** | **não existe no contrato** | existe na aba real; fora do escopo desta operação | Não se aplica |
| `ULTIMA_ATUALIZACAO` | **não lido** | **não existe no contrato** | existe na aba real; fora do escopo desta operação | Não se aplica |
| — (dependeria de AGENDAMENTOS) | — | `totalAtendimentos` | NestJS preenche com `null` — "não sabemos", nunca `0` fabricado (mesmo motivo de `Cliente.totalAtendimentos`) | Não se aplica |
| — (dependeria de AGENDAMENTOS) | — | `proximoAtendimento` | NestJS preenche com `null` | Não se aplica |

`GOOGLE_CALENDAR_ID`, `DURACAO_INTERVALO_MIN`, `DATA_ADMISSAO`, `DATA_CADASTRO` e
`ULTIMA_ATUALIZACAO` **nunca são lidos** por `CODE - Normalizar Profissionais` para o
shape de saída — não é gap acidental, é escopo deliberado (adicioná-los ao contrato
público é decisão de produto para uma fase futura). Eles **são**, no entanto,
considerados na distinção placeholder × linha corrompida (seção 11.1/13): a presença de
qualquer um deles numa linha sem `ID_PROFISSIONAL` já basta para classificá-la como dado
corrompido, nunca "nenhum profissional" (mesmo um valor `0` em `DURACAO_INTERVALO_MIN`
conta como presente, nunca como ausência).

`totalAtendimentos`/`proximoAtendimento` **não aparecem no shape de integração do
WF019** (`N8nGatewayProfissionalIntegracao` não tem esses dois campos) — dependeriam de
`AGENDAMENTOS`, que o workflow nem tenta ler para esta operação. É
`profissionais.service.ts` (NestJS), não o workflow, quem preenche esses dois campos do
contrato público `Profissional` com `null` — mesmo padrão já usado em
`toClienteFromIntegracao` para os campos que `CLIENTES` sozinha não calcula.

`GS - Buscar Profissionais` do WF019 filtra **só por `ID_EMPRESA`** — ao contrário de
`GS - Buscar Profissional` do `AGE-WF004` (que também filtra `STATUS = 'ATIVO'`, regra
própria dele para disponibilidade), `profissionais.listar` devolve a equipe inteira
(ativos e inativos), mesmo comportamento que `servicos.listar`/o mock do App já têm hoje.

### 6.4 Schema real EMPRESAS × contrato público (`empresa.obter`, corrigido)

**Correção de schema**: uma auditoria anterior, baseada só nos workflows WF001-018 que
usam um subconjunto de colunas, concluiu incorretamente que `EMPRESAS` só tinha 4
colunas confirmadas. **A planilha `EMPRESAS` real confirmada tem exatamente 18
colunas**: `ID_EMPRESA`, `NOME`, `CNPJ`, `TELEFONE`, `EMAIL`, `ENDERECO`, `CIDADE`, `UF`,
`CEP`, `TIMEZONE`, `HORARIO_FUNCIONAMENTO`, `TEMPO_CANCELAMENTO_MIN`,
`WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WABA_ID`, `GOOGLE_CALENDAR_ID`, `STATUS`,
`DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`. `NOME`/`TELEFONE`/`EMAIL` existem de fato e agora
alimentam `ConfiguracoesEmpresa.negocio` com dado real (corrigido nesta tarefa).

| Coluna Sheets | Campo de integração (WF019) | Campo público `ConfiguracoesEmpresa` | Transformação | Exposto? |
|---|---|---|---|---|
| `ID_EMPRESA` | — (filtro) | — (nunca exposto) | `filtersUI` | Não |
| `NOME` | `nome` | `negocio.nomeFantasia` | `trim()`; vazio/ausente vira `''` (mesmo tipo não-nulo do contrato) — nunca fabricado | Sim |
| `CNPJ` | **não lido** | **não existe no contrato** | App não tem modelo de CNPJ | Não se aplica |
| `TELEFONE` | `telefone` | `negocio.telefone` | preservado como **string** (nunca `Number(...)`); `trim()`; vazio/ausente vira `null` | Sim |
| `EMAIL` | `email` | `negocio.email` | `trim()`; vazio/ausente vira `null` — nunca fabricado | Sim |
| `ENDERECO`/`CIDADE`/`UF`/`CEP` | **não lidos** | **não existem no contrato** | App não tem modelo de endereço; documentado, nunca concatenado numa string inventada | Não se aplica |
| `TIMEZONE` | `timezone` | `agenda.timezone` | `trim()`; ausente/vazio falha a operação | Sim |
| `HORARIO_FUNCIONAMENTO` | **não lido** | **não existe no contrato** | conceito do estabelecimento, distinto de `DISPONIBILIDADES` (por profissional) — App não expõe horário único da empresa | Não se aplica |
| `TEMPO_CANCELAMENTO_MIN` | `tempoCancelamentoMinutos` | `agenda.janelaCancelamentoMinutos` | `Number(...)`; não finito/negativo falha a operação (nunca vira `0` silencioso) | Sim |
| `WHATSAPP_PHONE_NUMBER_ID` | — (nunca sai como valor) | `integracoes[0].status` | presença/ausência vira `whatsappConfigurado: boolean`; o valor cru nunca deixa `CODE - Normalizar Empresa` | Só como boolean derivado, nunca o ID |
| `WHATSAPP_WABA_ID` | **não lido** | **não existe no contrato** | identificador de integração interno | Não se aplica |
| `GOOGLE_CALENDAR_ID` | **não lido** | **não existe no contrato** | identificador de integração interno (Calendar da empresa — distinto do `GOOGLE_CALENDAR_ID` por profissional em `PROFISSIONAIS`) | Não se aplica |
| `STATUS` | **não lido** | **não existe no contrato** | administrativo; participa da distinção placeholder × linha corrompida | Não se aplica |
| `DATA_CADASTRO`/`ULTIMA_ATUALIZACAO` | **não lidos** | **não existem no contrato** | administrativos; participam da distinção placeholder × linha corrompida | Não se aplica |

`CNPJ`, `ENDERECO`, `CIDADE`, `UF`, `CEP`, `HORARIO_FUNCIONAMENTO`, `STATUS`,
`DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`, `WHATSAPP_WABA_ID` e `GOOGLE_CALENDAR_ID` **nunca
são lidos** por `CODE - Normalizar Empresa` para o shape de saída — decisão de escopo,
não gap acidental. Todos os 17 campos além de `ID_EMPRESA` participam, porém, da
detecção de linha corrompida: qualquer um presente numa linha sem `ID_EMPRESA` já basta
para classificá-la como dado inválido.

`empresa.obter` é a **única operação singular** do gateway: o envelope de sucesso
devolve `data` como o OBJETO direto (nunca um array), e ausência de linha real para o
`idEmpresa` autenticado é `UPSTREAM_ERROR` — nunca um "sucesso vazio" (diferente de uma
lista, não existe "nenhuma empresa" legítimo para um tenant já autenticado). Ver
`N8nGatewayEmpresaIntegracao` em `backend/src/n8n-gateway/n8n-gateway.types.ts` para o
comentário completo.

### 6.5 Schema real DISPONIBILIDADES × contrato público (`disponibilidades.listar`, corrigido)

**Correção de schema**: uma auditoria anterior, baseada só no subconjunto de colunas
lido por `AGE-WF004`, concluiu que `DISPONIBILIDADES` tinha 8 colunas. **A planilha real
confirmada tem exatamente 10**: `ID_DISPONIBILIDADE`, `ID_EMPRESA`, `ID_PROFISSIONAL`,
`DIA_SEMANA_NUM`, `DIA_SEMANA` (texto), `HORA_INICIO`, `HORA_FIM`, `INTERVALO_INICIO`,
`INTERVALO_FIM`, `ATIVO`.

| Coluna Sheets | Campo de integração (WF019) | Campo público `HorarioDia` | Transformação | Exposto? |
|---|---|---|---|---|
| `ID_DISPONIBILIDADE` | **não lido no shape de saída** | **não existe no contrato** | identificador interno de linha, sem uso no App; participa só da distinção placeholder × linha corrompida | Não se aplica |
| `ID_EMPRESA` | — (filtro) | — (nunca exposto) | `filtersUI` | Não |
| `ID_PROFISSIONAL` | `idProfissional` | — (usado para agrupar; `DisponibilidadeProfissional.profissionalNome` é resolvido em `configuracoes.service.ts` via `ProfissionaisService`, já integrado — nunca um join novo no workflow) | `String(...)`; obrigatório | Indiretamente (via nome) |
| `DIA_SEMANA_NUM` | `diaSemanaNum` (numérico, fiel à fonte) | `diaSemana` (string `DiaSemana`) | tradução 0=domingo..6=sábado feita em `configuracoes.service.ts` (convenção já documentada em código real de `AGE-WF004`, nunca inventada); só aceita inteiro 0-6 | Sim (traduzido) |
| `DIA_SEMANA` (texto) | **não lido no shape de saída** | **não existe como pass-through** | o `diaSemana` do contrato já é DERIVADO de `DIA_SEMANA_NUM` — expor o texto bruto criaria uma segunda fonte de verdade sem necessidade, e o vocabulário textual real desta coluna não está confirmado (sem evidência para validar consistência entre as duas). Participa só da distinção placeholder × linha corrompida | Não se aplica |
| `HORA_INICIO` | `horaInicio` | `horaInicio` | obrigatório quando `ATIVO='SIM'`; `null` quando fechado | Sim |
| `HORA_FIM` | `horaFim` | `horaFim` | idem `HORA_INICIO` | Sim |
| `INTERVALO_INICIO` | `intervaloInicio` | `intervaloInicio` | opcional; vazio/ausente vira `null` | Sim |
| `INTERVALO_FIM` | `intervaloFim` | `intervaloFim` | opcional; vazio/ausente vira `null` | Sim |
| `ATIVO` | `aberto` (boolean) | `aberto` | só `'SIM'`/`'NAO'` aceitos (trim+uppercase) — qualquer outro valor falha a operação inteira | Sim (traduzido) |

`GS - Buscar Disponibilidades` do WF019 filtra **só por `ID_EMPRESA`** — ao contrário de
`GS - Buscar Disponibilidade` do `AGE-WF004` (que também filtra `ATIVO='SIM'`, regra
própria dele para calcular horários livres), `disponibilidades.listar` devolve todos os
dias (abertos e fechados) de cada profissional, necessário para montar a grade completa
de 7 dias que o contrato público exige. Dias sem linha real para um profissional (ex.:
só 1 dia cadastrado de 7) são preenchidos como fechados por `configuracoes.service.ts` —
nunca fabricados como abertos. `ID_DISPONIBILIDADE`/`DIA_SEMANA` presentes numa linha sem
`ID_PROFISSIONAL` também classificam a linha como dado corrompido (ver seção 11.3).

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

`profissionais.listar` (Fase 3) devolve o mesmo shape de envelope, com `data` no formato:

```json
{ "ok": true, "data": [ { "idProfissional": "...", "nome": "...", "especialidade": "... ou null", "telefone": "... ou null", "email": "... ou null", "status": "ATIVO" } ], "meta": { "requestId": "..." } }
```

`disponibilidades.listar` devolve o mesmo shape de envelope, com `data` no formato:

```json
{ "ok": true, "data": [ { "idProfissional": "...", "diaSemanaNum": 1, "aberto": true, "horaInicio": "09:00", "horaFim": "18:00", "intervaloInicio": "12:00", "intervaloFim": null } ], "meta": { "requestId": "..." } }
```

`empresa.obter` é a **única operação singular**: `data` é o OBJETO direto, nunca um
array:

```json
{ "ok": true, "data": { "timezone": "America/Sao_Paulo", "tempoCancelamentoMinutos": 120, "whatsappConfigurado": true }, "meta": { "requestId": "..." } }
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
3. **Repetir o reapontamento do `documentId`** de `GS - Buscar Clientes`, `GS - Buscar
   Serviços`, `GS - Buscar Profissionais`, `GS - Buscar Empresa` e `GS - Buscar
   Disponibilidades` para a planilha `BEAUTYFLOW_HOMOLOGACAO` a cada novo reimport — já
   feito e validado com sucesso para as 5 operações (ver seção 7). O reimport reverte os
   cinco campos para o valor de produção gravado neste arquivo
   (`1lJtjTZU8xH8rNGZqqMwH8xlmGrUdm4ml-DFR4DOjV6E`) — o reapontamento manual precisa ser
   refeito a cada reimport futuro. **Nunca** testar contra produção.
4. Copiar a URL real do Webhook (aba "Produção" do node, após ativar) para
   `N8N_GATEWAY_URL` no `.env` local do backend, e o novo valor da credencial (passo 2)
   para `N8N_GATEWAY_API_KEY` — nunca commitar esses valores.
5. Manter o workflow inativo (`active: false`, valor já trazido pelo reimport) até
   revisão manual sua; ativar só quando decidir rodar o próximo teste real.

## 11. `servicos.listar` (Fase 2 — ✅ homologado em ambiente real)

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
- **Status do teste real**: `clientes.listar` e `servicos.listar` já foram validados de
  ponta a ponta em homologação real (EMP001/EMP002 corretamente isolados; hardening
  `UPSTREAM_ERROR` confirmado alterando `STATUS` de um serviço real para um valor
  inválido, sem lista parcial).

## 11.1 `profissionais.listar` (Fase 3 — ✅ homologado em ambiente real)

- **Schema real × contrato público**: ver seção 6.3.
- **`especialidade`/`telefone`/`email` (corrigido — não são mais tratados como gap)**: a
  aba `PROFISSIONAIS` real **tem** as colunas `ESPECIALIDADE`, `TELEFONE` e `EMAIL` — uma
  premissa anterior desta fase, de que não existiam, estava incompleta. `CODE -
  Normalizar Profissionais` agora mapeia os três: valor preenchido vira string
  normalizada (`trim()`), vazio/ausente vira `null` — nunca fabricado, nunca inferido do
  `NOME` ou de serviços associados. `telefone` nunca passa por conversão numérica (é
  texto/identificador, não quantidade — evita perder zero à esquerda, `+` internacional e
  precisão). Os três são opcionais: sozinhos, nunca fazem a operação falhar (diferente de
  `NOME`/`STATUS`), mas contam como "campo operacional presente" na distinção placeholder
  × linha corrompida abaixo. O frontend (`ProfissionaisTable.tsx`/
  `ProfissionalCardList.tsx`/`ProfissionalDetailsDrawer.tsx`) já renderiza os três
  condicionalmente (`?? "—"`/`?? "Não informado"`/`&&`) desde antes — nenhuma mudança de
  frontend foi necessária.
- **`totalAtendimentos`/`proximoAtendimento` — gap real, não corrigido aqui**: dependeriam
  de `AGENDAMENTOS`, que `PROFISSIONAIS` sozinha não tem — continuam `null` no modo `n8n`,
  preenchidos por `profissionais.service.ts` (NestJS), não pelo workflow.
- **Validação estrita de `STATUS`/`NOME` (mesmo padrão de hardening de Serviços)**:
  `CODE - Normalizar Profissionais` exige `NOME` não vazio e `STATUS` explicitamente
  `'ATIVO'`/`'INATIVO'` (trim+uppercase; qualquer outro valor nunca vira `'ATIVO'` por
  default). **Qualquer profissional real (com `ID_PROFISSIONAL`) que falhe uma dessas
  checagens faz a operação inteira responder `UPSTREAM_ERROR`** — nunca uma lista parcial
  silenciosa. A mensagem de erro é genérica (`"Um ou mais profissionais cadastrados
  possuem dados inválidos."`) e nunca expõe `ID_PROFISSIONAL`/`ID_EMPRESA`/planilha/linha
  bruta. `IF - Profissional Inválido Na Fonte` é o node que decide entre esse erro e
  `CODE - Montar Sucesso`. Comportamento coberto por testes em
  `wf019-workflow.simulation.spec.ts`.
- **Placeholder × linha corrompida (revisado na correção de schema)**: um item do
  `alwaysOutputData` sem NENHUM campo real presente (`NOME`/`STATUS`/`ESPECIALIDADE`/
  `TELEFONE`/`EMAIL`/`GOOGLE_CALENDAR_ID`/`DURACAO_INTERVALO_MIN`/`DATA_ADMISSAO`/
  `DATA_CADASTRO`/`ULTIMA_ATUALIZACAO` também ausentes) é busca legitimamente vazia
  (`data: []`); uma linha real com QUALQUER um desses campos preenchido mas
  `ID_PROFISSIONAL` ausente é dado corrompido, nunca "nenhum profissional" (a versão
  anterior só reconhecia `NOME`/`STATUS` para essa checagem — revisada para cobrir as 10
  colunas reais). Um valor `0` válido (ex.: `DURACAO_INTERVALO_MIN`) conta como presente,
  nunca como ausência.
- **Tenant**: mesmo filtro `ID_EMPRESA` dos branches de Clientes/Serviços, mesma defesa
  em profundidade. `GS - Buscar Profissionais` filtra só por `ID_EMPRESA` (não replica o
  filtro adicional `STATUS = 'ATIVO'` que `AGE-WF004` usa para disponibilidade) —
  `profissionais.listar` devolve a equipe inteira, ativos e inativos.
- **Perfil `profissional`**: preservada a mesma política já existente no NestJS
  (`profissionais.service.ts`) — um usuário com perfil `profissional` vê a equipe inteira
  da própria empresa, não só o próprio cadastro; nada nesta fase altera essa regra.
- **Configuração manual pendente**: `documentId` de `GS - Buscar Profissionais` continua
  apontando para produção na fonte versionada (mesma política dos branches de
  Clientes/Serviços — ver seção 6.1/9). Antes do primeiro teste real, reapontar
  manualmente para `BEAUTYFLOW_HOMOLOGACAO`, a mesma planilha de homologação já usada e
  validada por `clientes.listar`/`servicos.listar`.
- **Status do teste real**: ✅ **homologado** — webhook real, tela `/profissionais`
  validada com dados reais de EMP001 (3 profissionais: 2 ativos, 1 inativo;
  `especialidade`/`telefone`/`email`/`status` corretos).

## 11.2 `empresa.obter` (camada read-only completa — ✅ homologado em ambiente real)

- **Schema real × contrato público**: ver seção 6.4.
- **Operação singular**: diferente de todas as demais (`.listar`), `data` no envelope de
  sucesso é o objeto direto — nunca um array. Ausência de linha real para o `idEmpresa`
  autenticado, ou `TIMEZONE`/`TEMPO_CANCELAMENTO_MIN` ausentes/inválidos, fazem a operação
  falhar inteira com `UPSTREAM_ERROR` (nunca "sucesso vazio" — não existe "nenhuma
  empresa" legítimo para um tenant já autenticado).
- **`negocio` (nomeFantasia/telefone/email) corrigido — não é mais tratado como
  gap**: a aba `EMPRESAS` real **tem** as colunas `NOME`, `TELEFONE` e `EMAIL` — uma
  premissa anterior desta camada, de que não existiam, estava incompleta. `CODE -
  Normalizar Empresa` agora mapeia os três: valor preenchido vira string normalizada
  (`trim()`), `TELEFONE`/`EMAIL` vazio/ausente vira `null`, `NOME` vazio/ausente vira `''`
  (mesmo tipo não-nulo do contrato) — nunca fabricado, nunca um texto fictício do mock.
  `TELEFONE` nunca passa por conversão numérica. Nenhuma mudança de contrato
  (`ConfiguracoesNegocio` continua `string`/`string|null` como antes) nem de frontend foi
  necessária — `NegocioSection.tsx` já renderizava esses campos corretamente.
- **`WHATSAPP_PHONE_NUMBER_ID` nunca sai do workflow como valor** — só a presença/ausência
  vira `whatsappConfigurado: boolean`, computada dentro de `CODE - Normalizar Empresa`;
  minimização de dados, mesmo padrão de nunca expor `GOOGLE_CALENDAR_ID` no branch de
  Profissionais.
- **Tenant**: mesmo filtro `ID_EMPRESA` dos demais branches, mesma defesa em
  profundidade.
- **Configuração manual pendente**: `documentId` de `GS - Buscar Empresa` continua
  apontando para produção na fonte versionada (o reapontamento manual para
  `BEAUTYFLOW_HOMOLOGACAO`, feito para o teste real já realizado, precisa ser refeito a
  cada reimport futuro do JSON).
- **Status do teste real**: ✅ **homologado** — webhook real, tela `/configuracoes`
  (aba Negócio) validada com dados reais de EMP001 (`nome`, `telefone`, `email`,
  `timezone`, `tempoCancelamentoMinutos`, `whatsappConfigurado` todos corretos).

## 11.3 `disponibilidades.listar` (camada read-only completa — ✅ homologado em ambiente real)

- **Schema real × contrato público**: ver seção 6.5.
- **Validação estrita de `ID_PROFISSIONAL`/`DIA_SEMANA_NUM`/`ATIVO` (mesmo padrão de
  hardening de Serviços/Profissionais)**: `CODE - Normalizar Disponibilidades` exige
  `DIA_SEMANA_NUM` como inteiro 0-6 e `ATIVO` explicitamente `'SIM'`/`'NAO'`
  (trim+uppercase; qualquer outro valor nunca vira um default). Quando `ATIVO='SIM'`,
  `HORA_INICIO`/`HORA_FIM` também são obrigatórios (um dia aberto sem horário é dado
  corrompido). **Qualquer disponibilidade real (com `ID_PROFISSIONAL`) que falhe uma
  dessas checagens faz a operação inteira responder `UPSTREAM_ERROR`** — nunca uma lista
  parcial silenciosa.
- **Placeholder × linha corrompida (revisado — schema corrigido de 10 colunas)**: mesma
  distinção já validada em Serviços/Profissionais, agora considerando as 8 colunas reais
  além de `ID_PROFISSIONAL` (`ID_DISPONIBILIDADE`/`DIA_SEMANA_NUM`/`DIA_SEMANA`/`ATIVO`/
  `HORA_INICIO`/`HORA_FIM`/`INTERVALO_INICIO`/`INTERVALO_FIM`) para decidir "placeholder
  legítimo" x "dado corrompido" — a versão anterior só considerava 6 (sem
  `ID_DISPONIBILIDADE`/`DIA_SEMANA`), o que classificaria incorretamente uma linha
  corrompida com só, por exemplo, `ID_DISPONIBILIDADE` preenchido como "busca vazia". Um
  valor `0` válido (ex.: `DIA_SEMANA_NUM=0`, domingo) conta como presente, nunca como
  ausência.
- **`ID_DISPONIBILIDADE`/`DIA_SEMANA` (texto) — existem na fonte, deliberadamente fora do
  shape de saída**: `ID_DISPONIBILIDADE` é identificador interno de linha sem
  equivalente no contrato público; `DIA_SEMANA` (texto) não é repassado porque o
  `diaSemana` do contrato já é DERIVADO de `DIA_SEMANA_NUM` — expor as duas colunas
  criaria duas fontes de verdade para o mesmo conceito, e o vocabulário textual real de
  `DIA_SEMANA` não está confirmado (sem evidência para validar consistência entre elas
  sem arriscar inventar valores).
- **Tradução `DIA_SEMANA_NUM` (número) → `DiaSemana` (string) e grade de 7 dias**:
  acontecem em `configuracoes.service.ts` (NestJS), não no workflow — o shape de
  integração (`N8nGatewayDisponibilidadeIntegracao`) permanece fiel à fonte (numérico).
  Profissionais sem linha real para um dia da semana recebem esse dia como fechado por
  padrão — nunca um horário fabricado.
- **`profissionalNome` resolvido via `ProfissionaisService`**, já integrado —
  `disponibilidades.listar` nunca lê `PROFISSIONAIS` nem faz join novo no workflow.
- **Tenant**: mesmo filtro `ID_EMPRESA` dos demais branches, mesma defesa em
  profundidade. `GS - Buscar Disponibilidades` não replica o filtro `ATIVO='SIM'` que
  `AGE-WF004` usa (que só quer dias abertos para disponibilidade de agendamento) — aqui
  vêm todos os dias, necessário para montar a grade completa.
- **Configuração manual pendente**: `documentId` de `GS - Buscar Disponibilidades`
  continua apontando para produção na fonte versionada (mesmo reapontamento manual já
  refeito para o teste real realizado).
- **Status do teste real**: ✅ **homologado** — webhook real, tela `/configuracoes`
  (aba Agenda) validada com dados reais de EMP001: `America/Sao_Paulo`, janela de
  cancelamento até 120 minutos, `DIA_SEMANA_NUM=0` confirmado sem ser tratado como
  ausência, dias abertos/fechados e horários/intervalos corretos para os profissionais
  cadastrados (ver seção 4.3 para o detalhe completo).

## 13. Matriz READ-ONLY do APP-WF019

Auditoria completa de toda a camada de leitura candidata (backend, workflows WF001-WF018
e shared-types), feita nesta rodada para decidir com evidência — nunca por suposição —
quais operações read-only adicionais podiam ser implementadas com segurança.

| Módulo | Operação | Status | Fonte | Schema confiável? | Backend integrado? | Testada localmente? | Homologada? | Bloqueio |
|---|---|---|---|---|---|---|---|---|
| Clientes | `clientes.listar` | ✅ IMPLEMENTADA | CLIENTES | Sim | Sim | Sim | ✅ Sim | — |
| Serviços | `servicos.listar` | ✅ IMPLEMENTADA | SERVICOS | Sim | Sim | Sim | ✅ Sim | — |
| Profissionais | `profissionais.listar` | ✅ IMPLEMENTADA | PROFISSIONAIS | Sim | Sim | Sim | ✅ Sim | — |
| Configurações | `empresa.obter` | ✅ IMPLEMENTADA | EMPRESAS | Sim (18 colunas confirmadas, corrigido) | Sim | Sim | ✅ Sim | — (`negocio` corrigido: NOME/TELEFONE/EMAIL existem de fato — ver seção 11.2) |
| Configurações | `disponibilidades.listar` | ✅ IMPLEMENTADA | DISPONIBILIDADES | Sim (10 colunas confirmadas, corrigido) | Sim | Sim | ✅ Sim | — |
| Agenda | `agendamentos.listar` | ⛔ BLOQUEADA | AGENDAMENTOS | Sim (schema), mas vocabulário incompatível | Não | Não | Não | B2/B3 — `AGENDAMENTOS.STATUS` real só tem `{AGENDADO, CANCELADO}`; o contrato público exige 4 valores (`PENDENTE/CONFIRMADO/CONCLUIDO/CANCELADO`); mapear `AGENDADO`→`PENDENTE` ou `CONFIRMADO` seria inventar regra de produto |
| Financeiro | `pagamentos.listar` (nome provisório) | ⛔ BLOQUEADA | AGENDAMENTOS + PAGAMENTOS | Sim (ambas confirmadas) | Não | Não | Não | B8 — exigiria juntar 2 planilhas num único Code node (estado mais recente por `ID_AGENDAMENTO`, "PENDENTE" = ausência de linha); complexidade substancialmente maior que o padrão de leitura única já validado, não tentada nesta rodada por prudência |
| Comunicação | `mensagens.listar` (nome provisório) | ⛔ BLOQUEADA | MENSAGENS + LEMBRETES + PESQUISA + FOLLOWUPS + COBRANCAS | Sim (todas as 5 confirmadas) | Não | Não | Não | B2/B8 — mesclar 5 abas sem chave de correlação clara; decisões de produto em aberto (incluir MENSAGENS inbound? `MENSAGENS` cresce sem rotina de limpeza conhecida — ADM-WF018) |
| Configurações | disponibilidade de horário de funcionamento único | ➖ NÃO NECESSÁRIA | — | — | — | — | — | Não existe "horário único da empresa" no schema real — é sempre por profissional (`DISPONIBILIDADES`), já coberto por `disponibilidades.listar` |
| IA | `ia.obter` (memória ativa) | ⛔ BLOQUEADA | IA_MEMORIA | Não (sem writer) | Não | Não | Não | B4 — nenhum workflow (WF001-WF018) escreve em `IA_MEMORIA`; só WF002 lê. Uma leitura real seria sempre vazia ou de origem manual/desconhecida |
| IA | `ia.obter` (resumo/interações recentes) | ⛔ BLOQUEADA | MENSAGENS + CLIENTES | Parcial | Não | Não | Não | B1/B7/B8 — `resumo.status` não é determinável por tenant a partir de dado real (WF001 tem `id_empresa` fixo em código); `clientesComMemoriaAtiva` seria sempre 0 (depende de IA_MEMORIA, bloqueada); exigiria join MENSAGENS+CLIENTES; como `IaConfiguracao` é um objeto único, um campo genuinamente bloqueado bloqueia a operação inteira |

## 14. Ordem de homologação recomendada (próxima rodada — não executada nesta tarefa)

1. **`profissionais.listar`** — mesmo padrão já validado de `clientes.listar`/
   `servicos.listar`, sem dependência de outra operação.
2. **`empresa.obter`** — operação singular mais simples (1 linha, sem lista).
3. **`disponibilidades.listar`** — depende de `profissionais.listar` já estar validado
   (resolução de `profissionalNome` no NestJS usa `ProfissionaisService`).

## 15. Critério de manutenção desta documentação

Sempre que `APP-WF019-gateway-app.json` for alterado, este arquivo deve ser revisado na
mesma mudança. Em caso de divergência, o JSON versionado é a referência para o
comportamento implementado.
