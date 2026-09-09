# WF020 — APP - WF020 - Agenda Commands

> **Sincronização:** 2026-09-09
> **Checkpoint funcional:** `585e710` — `feat: add homologated agenda cancellation command`. **Estado:** implementado + homologado E2E em `BEAUTYFLOW_HOMOLOGACAO` + publicado em `origin/main`.
> **Fonte da verdade:** [`APP-WF020-agenda-commands.json`](../../workflows/app/APP-WF020-agenda-commands.json).

## 1. Objetivo

O `APP-WF020` é a camada de integração server-to-server para **comandos de escrita da Agenda** do BeautyFlow App. É um workflow novo, deliberadamente separado do `APP-WF019` (que permanece 100% read-only) — não uma expansão dele.

Por quê um workflow novo e não uma expansão do WF019: isolar comandos de escrita evita que um bug de escrita regrida uma leitura já homologada 6 vezes, e permite homologar cada comando de escrita novo incrementalmente, um de cada vez.

Responsabilidades do gateway:

- receber chamadas autenticadas do NestJS;
- validar envelope e tenant;
- rotear o comando solicitado (hoje só `agenda.cancelar`);
- localizar a linha real em `AGENDAMENTOS` com isolamento por `ID_EMPRESA` + `ID_AGENDAMENTO`;
- validar tenant/recurso/estado antes de qualquer escrita;
- gravar apenas os campos que o comando autoriza;
- devolver envelope padronizado.

O WF020 **não substitui o NestJS**. Autenticação do usuário, autorização por perfil, contexto de empresa, regras de negócio e contrato público permanecem no backend. O WF020 nunca chama WF001–WF019 nem os workflows legados de Agenda (`AGE-WF004/005/006/007`, que continuam existindo só para o fluxo WhatsApp, sem nenhuma alteração).

## 2. Identificação técnica

- **Workflow:** `APP - WF020 - Agenda Commands`
- **ID funcional:** `WF020`
- **Versão documental/Sticky Note:** `v1.0`
- **Arquivo:** `n8n/workflows/app/APP-WF020-agenda-commands.json`
- **Nodes:** 14
- **Status no JSON local:** `active:false` (ativação/publicação no n8n Cloud é etapa manual controlada; durante a homologação o workflow foi publicado/ativado em `BEAUTYFLOW_HOMOLOGACAO`)
- **Gatilho:** Webhook POST
- **Path:** `beautyflow-app-agenda-commands`
- **Autenticação:** Header Auth (`X-BeautyFlow-Gateway-Key`)
- **Resposta:** `responseMode=responseNode` + `RESPOND - Resultado`, `responseBody={{ $json }}`
- **Merge:** nenhum (convergência de branches mutuamente exclusivos sem `n8n-nodes-base.merge`, mesmo padrão do WF019)

## 3. Arquitetura

```text
Next.js (Client Component)
  ↓ Server Action ("use server")
NestJS — PATCH /agenda/:id/cancelar
  ↓ N8nGatewayCommandsClient (env próprio: N8N_GATEWAY_COMMANDS_URL/API_KEY)
APP-WF020 (agenda.cancelar)
  ↓
Google Sheets AGENDAMENTOS (BEAUTYFLOW_HOMOLOGACAO nesta fase)
```

`N8nGatewayCommandsClient` é deliberadamente um cliente separado de `N8nGatewayClient` (leitura, WF019) — uma reconfiguração acidental de um nunca pode fazer o outro apontar para o lugar errado. Os dois compartilham o mesmo formato de envelope (`{ok, data|error, meta:{requestId}}`, `isN8nGatewayEnvelope`).

READ (Agenda) continua 100% via `Next.js → NestJS → APP-WF019 → Sheets`. WRITE (Agenda) passa a ser `Next.js → NestJS → APP-WF020 → Sheets`. Nenhum dos dois caminhos chama diretamente `AGE-WF004/005/006/007`.

## 4. Operação `agenda.cancelar`

Única operação implementada nesta fase. Qualquer outra operação recebida devolve `INVALID_OPERATION`.

### Contrato — requisição (NestJS → WF020)

```json
{
  "operacao": "agenda.cancelar",
  "idEmpresa": "EMP001",
  "requestId": "uuid",
  "dados": {
    "idAgendamento": "AGE-HML-CANCEL-001",
    "motivo": "Cancelado pelo usuário",
    "chamadorPerfil": "owner",
    "chamadorIdProfissional": ""
  }
}
```

`idEmpresa`, `chamadorPerfil` e `chamadorIdProfissional` são sempre resolvidos pelo NestJS a partir do usuário autenticado (`SupabaseAuthGuard` + `@CurrentUser()`) — **nunca vêm do browser**. `motivo` já chega normalizado (trim, sem `<`/`>`, máx. 300 caracteres) e com o default `"Cancelado pelo usuário"` já resolvido pelo NestJS quando o App não informa nada.

### Contrato — endpoint do App

```text
PATCH /agenda/:id/cancelar
Body: { "motivo"?: string }
```

O controller não aceita `idEmpresa`, `status`, `GOOGLE_EVENT_ID` nem qualquer outro campo além de `motivo` — nada disso pode vir do browser.

### Sucesso

```json
{
  "ok": true,
  "data": { "idAgendamento": "AGE-HML-CANCEL-001", "status": "CANCELADO" },
  "meta": { "requestId": "uuid" }
}
```

### Erro

```json
{
  "ok": false,
  "error": { "code": "NOT_FOUND", "message": "Agendamento não encontrado." },
  "meta": { "requestId": "uuid" }
}
```

Códigos possíveis: `AUTH_FAILED`, `TENANT_REQUIRED`, `INVALID_OPERATION`, `VALIDATION_ERROR`, `UPSTREAM_ERROR`, `INTERNAL_ERROR`, `NOT_FOUND`, `CONFLICT`. O NestJS mapeia `NOT_FOUND`→404, `CONFLICT`→409, qualquer outro→503.

## 5. Fluxo real (nodes)

```text
Webhook - Gateway App Commands (POST + Header Auth)
        ↓
CODE - Validar Envelope
        ↓
IF - Envelope Válido
        ↓
GS - Buscar Agendamento (filtra ID_EMPRESA + ID_AGENDAMENTO)
        ↓
IF - Erro Técnico Ao Buscar Agendamento
        ↓
CODE - Localizar E Validar Agendamento (tenant, profissional, estado)
        ↓
IF - Erro Ao Localizar Agendamento
        ↓
IF - Precisa Cancelar (AGENDADO → segue; CANCELADO → pula direto para sucesso idempotente)
        ↓
GS - Cancelar Agendamento (Update Row)
        ↓
CODE - Montar Sucesso / CODE - Montar Erro / CODE - Erro Upstream
        ↓
RESPOND - Resultado
```

## 6. Autenticação e tenant

- `idEmpresa` chega sempre resolvido pelo NestJS — nunca do browser, nunca um valor livre.
- `GS - Buscar Agendamento` filtra por `ID_EMPRESA` **e** `ID_AGENDAMENTO` juntos (nunca só pelo segundo) — mesma exigência de tenant isolation na fonte já aplicada em todo o WF019, e um endurecimento além do padrão legado de `AGE-WF007` (que só casava por `ID_AGENDAMENTO`).
- `CODE - Localizar E Validar Agendamento` valida o tenant/recurso sobre essa linha ANTES de qualquer escrita — só depois disso o fluxo pode alcançar `GS - Cancelar Agendamento`.
- Nunca usa: `idEmpresa` vindo do browser; fallback `'EMP001'`; Calendar ID hardcoded; `"BeautyFlow - Studio Bella"`; `status` vindo livremente do frontend; `GOOGLE_EVENT_ID` vindo do frontend.

## 7. Autorização por perfil

- **owner**: pode cancelar qualquer agendamento da própria empresa.
- **profissional**: só pode cancelar o próprio agendamento (`ID_PROFISSIONAL` da linha == `chamadorIdProfissional`). O NestJS resolve a IDENTIDADE do chamador (perfil + idProfissional, via `SupabaseAuthGuard` — nunca do browser) e envia como `dados.chamadorPerfil`/`dados.chamadorIdProfissional`; `CODE - Localizar E Validar Agendamento` aplica a regra na MESMA leitura que já localizou a linha (evita uma segunda chamada de rede só para descobrir o dono antes de autorizar).
- **"Não encontrado" e "encontrado mas é de outro profissional" convergem propositalmente no mesmo `NOT_FOUND`** — nunca revela a diferença (mesmo princípio de `buscarPorId` no NestJS, usado em Clientes/Serviços/Profissionais).
- **platform_admin**: nunca chega a esta chamada — o NestJS nega ANTES (`ForbiddenException` em `agenda.service.ts`), preferência segura por negar em vez de inventar um bypass administrativo.

## 8. Máquina de estados

- `AGENDADO → CANCELADO`: única transição executada.
- `CONCLUIDO` → tentar cancelar: `CONFLICT` (409 no NestJS), nenhuma escrita.
- `CANCELADO` → cancelar de novo: **idempotente** — sucesso, sem tocar `GS - Cancelar Agendamento` de novo (nunca reescreve `DATA_CANCELAMENTO`/`MOTIVO_CANCELAMENTO` já gravados).
- Qualquer `STATUS` fora da whitelist real (`AGENDADO`/`CONCLUIDO`/`CANCELADO`) é `UPSTREAM_ERROR` — nunca inventa uma transição.

## 9. Idempotência

Validada empiricamente na homologação (ver seção 14): duas chamadas de cancelamento sobre o mesmo `AGE-HML-CANCEL-001`, minutos de diferença, resultaram em `DATA_CANCELAMENTO`, `ULTIMA_ATUALIZACAO` e `MOTIVO_CANCELAMENTO` idênticos — a segunda chamada não re-escreveu nada, apesar de o backend também ter retornado sucesso (esperado: idempotência não é erro).

## 10. Campos alterados e preservados

**Alterados no sucesso real (`AGENDADO → CANCELADO`):** `STATUS='CANCELADO'`, `DATA_CANCELAMENTO` (timestamp gerado pelo próprio workflow, nunca pelo browser), `MOTIVO_CANCELAMENTO` (já normalizado pelo NestJS, cortado de novo em 500 como defesa em profundidade), `ULTIMA_ATUALIZACAO`.

**Preservados (nunca tocados):** `ID_AGENDAMENTO`, `ID_CLIENTE`, `ID_PROFISSIONAL`, `ID_SERVICO`, `DATA`, `HORA_INICIO`, `HORA_FIM`, `DURACAO_MIN`, `VALOR`, `ORIGEM`, `DATA_CRIACAO`, `GOOGLE_EVENT_ID`. `ID_EMPRESA` é regravado com o mesmo valor já validado (nunca hardcoded) — ver seção 11 sobre por que ele não participa do match.

## 11. Limitação conhecida — match do update usa só `ID_AGENDAMENTO`

`GS - Cancelar Agendamento` usa a operação `Update Row` do node Google Sheets. Auditoria confirmou que, nesta versão do n8n Cloud, a UI dessa operação expõe **um único** campo "Column to match on" — não suporta múltiplas colunas de match (diferente de `Append or Update Row`, que suportaria, mas foi **descartada deliberadamente**: introduziria semântica de `append` em caso de não-match, indesejável para um comando de cancelamento).

Por isso o update casa a linha só por `ID_AGENDAMENTO`, não por `ID_EMPRESA`+`ID_AGENDAMENTO` juntos. **Isso é um risco residual controlado, não ausência de risco**: a segurança do tenant no comando não depende exclusivamente deste node — depende da cadeia completa (NestJS resolve `idEmpresa` → `GS - Buscar Agendamento` filtra por `ID_EMPRESA`+`ID_AGENDAMENTO` → `CODE - Localizar E Validar Agendamento` valida tenant/recurso → só então o update roda) e exige que `ID_AGENDAMENTO` permaneça **globalmente único** no sistema (verdade hoje, dado o gerador de ID). Match composto real no update permanece **dívida técnica / melhoria futura**, condicionada a uma decisão de arquitetura ainda não tomada (trocar de operação, com as implicações acima reavaliadas).

O JSON local (`matchingColumns: ["ID_AGENDAMENTO"]`) e o node real no n8n Cloud estão alinhados — não há mais divergência entre artefato versionável e Cloud homologado nesse ponto.

## 12. Google Calendar — deliberadamente fora do escopo

A auditoria da escrita da Agenda encontrou 4 workflows legados (`AGE-WF004/005/006/007`) usando um único calendário hardcoded (`"BeautyFlow - Studio Bella"`) e nenhuma leitura real de `PROFISSIONAIS.GOOGLE_CALENDAR_ID`/`EMPRESAS.GOOGLE_CALENDAR_ID` em lugar nenhum do projeto — não existe hoje uma regra inequívoca de qual coluna é autoridade nem se há fallback profissional→empresa.

Decisão registrada (não inventada, decidida explicitamente durante a implementação): `GOOGLE_EVENT_ID` não é lido nem escrito por este workflow; nenhum node Google Calendar existe no WF020. Google Sheets é a **única** fonte tocada e é o source of truth operacional desta fase. **Cancelamento pelo App não sincroniza Google Calendar** — isso é uma dívida registrada, não um bug escondido. Sincronizar Calendar fica para uma tarefa futura, quando a regra de resolução de calendário for decidida.

## 13. Header Auth compartilhado — dívida de segurança

Decisão original era que o WF020 usasse uma credencial Header Auth **exclusiva** para comandos. Na prática, durante a homologação, WF019 e WF020 continuam **compartilhando a mesma credencial** `"Header Auth account"` no n8n Cloud (confirmado: a credencial aparece vinculada a 2 workflows). Isso foi uma decisão explícita para esta rodada de homologação (não um esquecimento), registrada aqui como **dívida de segurança pendente**: segregar credenciais READ/WRITE seria o próximo passo antes de produção.

## 14. Homologação real (`BEAUTYFLOW_HOMOLOGACAO`)

Fixture usada: `AGE-HML-CANCEL-001` (`EMP001`, `CLI-HML-001`, `PRO-HML-001`, `SRV-HML-001`, status inicial `AGENDADO`, 10/09/2026 14:00–15:00, R$50,00).

Cenários validados contra dados reais:

- **Cancelamento real pela UI**: confirmação exibida (cliente/data/hora), motivo informado, sem exposição de `requestId`/IDs internos/stack; painel fechou e a Agenda atualizou sozinha; card passou a "Cancelado". Sheets: `STATUS=CANCELADO`, `DATA_CANCELAMENTO` e `ULTIMA_ATUALIZACAO` preenchidos com o mesmo timestamp, `MOTIVO_CANCELAMENTO` gravado; todos os demais campos preservados.
- **Idempotência**: segunda chamada sobre o mesmo agendamento já `CANCELADO` (sem restaurar, motivo vazio) → sucesso, mas `DATA_CANCELAMENTO`/`MOTIVO_CANCELAMENTO`/`ULTIMA_ATUALIZACAO` permaneceram idênticos aos da primeira chamada.
- **Tenant negativo**: chamada com `idEmpresa` de outra empresa tentando cancelar um agendamento real de `EMP001` → `NOT_FOUND`, linha alvo intacta.
- **Profissional negativo**: `chamadorPerfil=profissional` com `chamadorIdProfissional` de um profissional diferente do dono do agendamento → `NOT_FOUND`, sem escrita.
- **CONCLUIDO**: tentativa de cancelar um agendamento já `CONCLUIDO` → `CONFLICT`, sem escrita.

### Cenário ainda não executado

O cenário positivo "profissional cancela o próprio agendamento" **não foi executado contra dado real** nesta rodada, para não destruir fixtures históricas de outras homologações (WF010/WF011/WF013) que só existiam como `AGENDADO` de profissionais específicos. Permanece **coberto por teste automatizado** (`agenda.service.spec.ts`, casos de mock para owner/profissional e argumentos de chamada).

### Bug de dados encontrado e corrigido durante a homologação

A fixture `AGE-HML-CANCEL-001` tinha as colunas `DURACAO_MIN` e `HORA_FIM` trocadas (`15:00:00` e `60` invertidos), o que quebrava a validação de tipo do WF019 e derrubava a tela `/agenda` inteira para **todos** os agendamentos (erro `UPSTREAM_ERROR: "Um ou mais agendamentos cadastrados possuem dados inválidos"`). Corrigido diretamente na planilha (dado, não workflow) com autorização explícita antes do teste.

### documentId

`BEAUTYFLOW_HOMOLOGACAO` (mesma planilha usada pelo WF019 — confirmado por inspeção direta dos IDs de documento de ambos os workflows, não é uma planilha separada).

## 15. Erros — convergência sem Merge

`CODE - Montar Sucesso` e `CODE - Montar Erro` recebem múltiplas conexões diretas cada, uma por branch mutuamente exclusivo — nunca um `n8n-nodes-base.merge` (mesmo motivo documentado no WF019: `Merge` com `numberInputs` trava quando só um branch dispara por execução). Nenhuma mensagem de erro expõe stack, payload bruto do Sheets, credencial ou API key.

## 16. Qualidade — checkpoint funcional `585e710`

- 525 testes;
- 23 suítes;
- 525/525 verdes;
- lint backend/frontend verde;
- builds shared-types/backend/frontend verdes;
- WF001–WF019 intactos;
- zero segredo real versionado no diff.

O checkpoint funcional do APP-WF020 é `585e710` (`feat: add homologated agenda cancellation command`), publicado em `origin/main` junto com o commit documental `docs: sync BeautyFlow after APP-WF020 homologation`.

## 17. Dívidas técnicas preservadas

1. Google Calendar não sincroniza cancelamento (seção 12).
2. Header Auth compartilhado entre WF019/WF020 (seção 13).
3. `Update Row` do WF020 casa apenas por `ID_AGENDAMENTO` (seção 11).
4. `ID_AGENDAMENTO` precisa permanecer globalmente único para a proteção de tenant do update se sustentar.
5. Match composto real no update é dívida futura, condicionada a decisão de arquitetura.
6. Cenário E2E positivo de profissional cancelando o próprio agendamento não foi executado contra dado real (seção 14).
7. `agenda.criar`, `agenda.reagendar` e `agenda.concluir` ainda não implementados nem homologados.

## 18. Critérios antes de produção

O checkpoint funcional `585e710` já foi publicado em `origin/main`. Antes de considerar `agenda.cancelar` pronto para produção, ainda faltam:

- decidir e segregar Header Auth READ/WRITE (dívida 2);
- decidir se o risco residual do match por `ID_AGENDAMENTO` único é aceitável em produção ou se justifica revisar a operação do node (dívida 3–5);
- decidir a regra de resolução de Google Calendar (`PROFISSIONAIS` vs `EMPRESAS`, com/sem fallback) antes de sincronizar cancelamento com o Calendar;
- executar o cenário E2E positivo de profissional contra uma fixture dedicada (não uma fixture histórica de outro workflow);
- reapontar de `BEAUTYFLOW_HOMOLOGACAO` para a planilha de produção real, com o mesmo cuidado de configuração manual usado na homologação.

## 19. Documentação relacionada

- [`README.md`](./README.md) — visão geral do módulo App (WF019 + WF020).
- [`APP-WF019.md`](./APP-WF019.md) — gateway de leitura.
- [`../../../docs/STATUS-DO-PROJETO.md`](../../../docs/STATUS-DO-PROJETO.md).
