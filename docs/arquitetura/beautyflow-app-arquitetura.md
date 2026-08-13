# BeautyFlow App — Arquitetura e Plano de Implementação

## Contexto

O BeautyFlow hoje é 100% automação n8n + Google Sheets, acionada via WhatsApp/IA. Não existe nenhuma interface para os profissionais de beleza (donos de salão, staff) gerenciarem agenda, clientes, financeiro etc. diretamente — e vários workflows já construídos e validados (ex.: `CLI-WF009 Atualizar Cliente`, `FIN-WF010 Registrar Pagamento`, `FIN-WF011 Cobrança`) **não têm nenhum chamador hoje**, porque o único caminho de entrada é o fluxo de IA via WhatsApp (WF001→WF002→WF003), que só cobre 5 intenções (AGENDAR, CONSULTAR_DISPONIBILIDADE, REAGENDAR, CANCELAR, OUTRO). O objetivo do BeautyFlow App é ser essa interface — e, no processo, ser o primeiro chamador real de workflows já prontos.

A análise do repositório encontrou dois "futuros" documentados de forma inconsistente: `docs/10-modelo-de-dados/` e `database/01-create-tables.sql` já descrevem um schema PostgreSQL de 16 tabelas (que nenhum workflow usa), enquanto os 14 workflows reais operam 100% sobre 14 abas do Google Sheets (`BEAUTYFLOW3.1`, schema diferente, MAIÚSCULAS). Não existe hoje nenhum conceito de login/usuário — só EMPRESAS e PROFISSIONAIS, sem credenciais. Duas decisões foram levantadas e confirmadas com o usuário antes deste plano:

1. **Estratégia de dados: híbrida.** Autenticação/usuários (que não existem hoje) vão para um banco Postgres novo (Supabase). Dados operacionais (Agendamentos, Clientes, Pagamentos, Agenda etc.) continuam 100% no Google Sheets, sem migração agora, acessados através dos workflows n8n já validados — nunca duplicando a lógica de negócio (RN006/007/009/011/014/021 etc.) no App.
2. **Stack**: Next.js (React/TypeScript) no frontend, NestJS (Node/TypeScript) no backend, Tailwind CSS, Supabase (Postgres + Auth) para a camada nova, mantendo Google Gemini como provedor de IA (já configurado e pago no n8n — não introduzir OpenAI).

**Nenhum workflow n8n é alterado neste momento.** O plano propõe dois workflows aditivos novos como entregáveis de fase futura — o gateway `APP-WF019` e, após revisão do usuário, também `EMP-WF021 - Criar Empresa` (ver seção de Onboarding) — seguindo exatamente o padrão de dispatch já usado pelo `ATD-WF003`. Nenhum dos workflows WF001-WF018 existentes é tocado; construir os novos está fora do escopo desta tarefa de planejamento.

> **Revisão pós-aprovação inicial**: o usuário aprovou a arquitetura em linhas gerais, mas apontou um gap crítico no onboarding — `/registrar-empresa` dependia implicitamente de a empresa já existir na aba EMPRESAS, mas **não existe hoje nenhum workflow que escreva em EMPRESAS**. As seções "Fluxo de Onboarding" e a linha "Fase 0" abaixo foram revisadas para resolver isso com um novo workflow aditivo `EMP-WF021 - Criar Empresa`, com uma ordem de transação desenhada especificamente para nunca deixar um usuário órfão no Supabase caso a criação da empresa no n8n/Sheets falhe.

## Descobertas-chave da análise do repositório

- **Estrutura real**: `frontend/`, `backend/`, `arquitetura/`, `prompts/`, `scripts/`, `assets/` são scaffolds vazios (só README stub) — greenfield total para o App. `database/` já tem DDL PostgreSQL real (16 tabelas) mas não usado por nada. `docs/` tem uma árvore rica: regras de negócio RN001-040, requisitos RF/RNF, casos de uso UC001-012, user stories US001-012, personas PER001-005, e escopo de MVP aprovado pela product owner (`docs/01-visao-do-produto/04-product-scope.md`).
- **Cadeia de chamadas confirmada (leitura direta dos JSONs)**: WF001 (webhook, WhatsApp) → WF002 (resolve/cria cliente via WF008, lê IA_MEMORIA, chama Gemini `gemini-3-flash-preview`, loga em MENSAGENS) → WF003 (roteador puro, Switch de 5 intenções) → WF004/005/006/007 (agenda) ou WF012 (fallback/OUTRO). WF008-018 são `executeWorkflowTrigger` — só chamáveis de dentro do n8n hoje, nenhum exposto via HTTP além do WF001.
- **Credenciais**: Google Sheets, Google Calendar e Gemini configurados e funcionando. WhatsApp Cloud API e Google Drive ainda são placeholders (`CONFIGURAR`) — o canal WhatsApp em si não está 100% operacional ainda; isso não bloqueia o App (interface separada), mas explica por que features de "Comunicação" na Fase 3 são somente leitura/gatilho manual.
- **Convenções arquiteturais do n8n que o gateway futuro deve respeitar**: Trigger→Validação→Busca→Processamento→Atualização→Log→Resposta; toda chamada ao WF017 usa `node_origem` dinâmico (nunca string fixa); nunca usar `Merge` para convergir ramos mutuamente exclusivos (bug real, confirmado em produção nesta mesma sessão); toda consulta a Sheets filtra por `ID_EMPRESA`.
- **Schema real das 14 abas do Google Sheets** (`BEAUTYFLOW3.1`, id `1lJtjTZU8xH8rNGZqqMwH8xlmGrUdm4ml-DFR4DOjV6E`): AGENDAMENTOS, CLIENTES, COBRANCAS, DISPONIBILIDADES, EMPRESAS, FOLLOWUPS, IA_MEMORIA, LEMBRETES, LOGS, MENSAGENS, PAGAMENTOS, PESQUISAS, PROFISSIONAIS, SERVICOS — colunas completas levantadas e usadas para desenhar os DTOs do backend (ver `libs/shared-types`).

## Estrutura de pastas proposta

### `frontend/` (Next.js App Router)

```
frontend/
├── middleware.ts                     # refresh de sessão Supabase + guarda de rota por papel
├── src/
│   ├── app/
│   │   ├── (auth)/{login,registrar-empresa,esqueci-senha}/page.tsx
│   │   ├── (app)/                    # shell autenticado, nav por papel
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── agenda/{page.tsx,[idAgendamento]/page.tsx}
│   │   │   ├── clientes/{page.tsx,[idCliente]/page.tsx}
│   │   │   ├── profissionais/{page.tsx,[idProfissional]/page.tsx,novo/page.tsx}
│   │   │   ├── servicos/page.tsx
│   │   │   ├── financeiro/{page.tsx,novo/page.tsx,cobrancas/page.tsx}
│   │   │   ├── comunicacao/page.tsx
│   │   │   ├── relatorios/page.tsx
│   │   │   ├── empresa/{page.tsx,usuarios/page.tsx}
│   │   │   └── ia/page.tsx
│   │   └── (admin)/                  # PER005, guarda platform_admin
│   │       ├── empresas/page.tsx
│   │       ├── logs/page.tsx
│   │       └── backup/page.tsx
│   ├── components/{ui,layout,agenda,clientes,financeiro,servicos,comunicacao}/
│   ├── features/{agenda,clientes,financeiro,profissionais,servicos,auth}/{api.ts,hooks.ts,types.ts}
│   ├── lib/{supabase,api,auth,utils}/
│   ├── providers/                    # QueryClientProvider, EmpresaContext, RoleContext
│   └── config/env.ts                 # env tipado (zod)
```

### `backend/` (NestJS)

```
backend/
├── src/
│   ├── common/{decorators,guards,interceptors,filters,dto}/
│   ├── modules/{auth,usuarios,agenda,clientes,profissionais,servicos,financeiro,comunicacao,relatorios,admin}/
│   ├── gateway/
│   │   ├── gateway-client.service.ts  # cliente HTTP único para APP-WF019 (timeout, 1 retry de rede, circuit breaker)
│   │   ├── gateway.types.ts
│   │   └── gateway-actions.enum.ts
│   ├── cache/read-cache.service.ts    # TTL curto (15-30s) para leituras via gateway
│   └── database/supabase.service.ts   # cliente Supabase server-side (service role)
├── libs/shared-types/src/{dto,gateway-contract}/  # DTOs compartilhados com o frontend
```

Monorepo via npm workspaces (`package.json` raiz com `workspaces: ["frontend","backend","libs/*"]`) — evita duplicar DTOs manualmente sem exigir codegen.

**Regra de integração fixa**: o frontend nunca chama o n8n diretamente; toda leitura/escrita operacional passa pelo NestJS, que fala com o gateway n8n. Isso mantém um único ponto de auditoria (`auditoria_app`) e um único lugar para lidar com timeout/retry.

## Páginas por persona

| Persona | Rotas principais | Depende de |
|---|---|---|
| **PER001 Proprietário** (escopo total da empresa) | `/dashboard`, `/agenda`, `/clientes`, `/profissionais`, `/servicos`, `/financeiro`, `/comunicacao`, `/relatorios`, `/empresa`, `/empresa/usuarios`, `/ia` | gateway → WF004-015, `usuarios` (Supabase) |
| **PER003 Profissional** (escopo próprio, `id_profissional` forçado no backend) | `/dashboard`, `/agenda`, `/clientes`, `/comunicacao` (filtrados) | mesmos workflows, filtro obrigatório server-side |
| **PER005 Admin da plataforma** (cross-tenant, área leve dentro do mesmo app) | `/admin/empresas`, `/admin/logs`, `/admin/backup` | gateway → WF016-018 |

Rotas owner-only (`/profissionais`, `/servicos`, `/financeiro`, `/empresa`, `/relatorios`) ficam ocultas e retornam 403 para `profissional` — enforcement real é no NestJS (`RolesGuard`), não só ocultação de UI.

## Componentes de maior superfície de regra de negócio

- `agenda/CalendarView`, `AppointmentForm`, `SlotPicker`, `DisponibilidadeEditor` — view sobre dados validados pelo servidor; validação de sobreposição/buffer (RN006/007/009) e reagendamento único (RN014) **sempre no n8n**, nunca recalculada no cliente.
- `clientes/ClientForm` / `ClientHistory` — chamam WF008 (criar)/WF009 (atualizar, hoje órfão — o App é seu primeiro chamador real).
- `clientes/VipBadge` — puramente apresentacional, flag calculada no servidor (RN021: >10 atendimentos), nunca recomputada no cliente.
- `financeiro/PaymentForm` — registra pagamento via WF010, trata pagamento parcial (`VALOR_PAGO` vs `VALOR_PENDENTE`).
- `layout/RoleGate` — único ponto de ocultação de UI por papel, sempre respaldado pelo guard real do backend.

Convenção: organização por feature (`components/<módulo>/`), não atomic design — mapeia 1:1 com os módulos do MVP aprovado, facilita auditoria de onde cada regra RN vive.

Códigos de erro RN-prefixados (`RN007_CONFLITO_HORARIO`, `RN011_JANELA_CANCELAMENTO`, `RN014_REAGENDAMENTO_UNICO`, etc.) definidos uma vez em `libs/shared-types/src/dto/business-errors.ts` e mapeados para mensagens localizadas nos componentes acima.

## Schema Postgres/Supabase (somente o que é novo)

Escopo estrito: autenticação, usuários, papéis, auditoria do App. **Nenhuma tabela duplica AGENDAMENTOS/CLIENTES/etc.** — isso continua nas Sheets. O DDL aspiracional em `database/01-create-tables.sql` já modela `usuarios`/`empresas`/`profissionais` como tabelas Postgres reais com FK — não aplicável aqui, porque nossa decisão híbrida mantém empresas/profissionais nas Sheets. Reaproveito a convenção de nomes desse DDL (`id_` prefix, `ativo`, `criado_em`/`atualizado_em`, e o nome de coluna `perfil` em vez de `papel` para ficar consistente com o que já existe) onde faz sentido.

```sql
-- Supabase Auth já possui auth.users (id, email, senha) — não modelado aqui.

CREATE TABLE public.usuarios (
    id_usuario      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    id_empresa      TEXT,                  -- FK lógica -> Sheets EMPRESAS.ID_EMPRESA (não é FK real, ver nota).
                                            -- NULL obrigatório para platform_admin, e NOT NULL obrigatório
                                            -- para owner/profissional (ver CHECK abaixo) — um admin da
                                            -- plataforma é cross-tenant por definição e nunca pertence a
                                            -- uma empresa específica.
    id_profissional TEXT,                 -- FK lógica -> Sheets PROFISSIONAIS.ID_PROFISSIONAL (NULL se owner/admin puro)
    nome            VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    perfil          VARCHAR(30) NOT NULL DEFAULT 'profissional'
                    CHECK (perfil IN ('owner','profissional','platform_admin')),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT chk_usuarios_empresa_obrigatoria
        CHECK (
            (perfil IN ('owner','profissional') AND id_empresa IS NOT NULL)
            OR (perfil = 'platform_admin' AND id_empresa IS NULL)
        )
);
CREATE INDEX idx_usuarios_empresa ON public.usuarios(id_empresa);
CREATE UNIQUE INDEX uq_usuarios_email ON public.usuarios(lower(email));

-- "quem no App fez o quê" — distinto da aba LOGS (que audita execuções do n8n).
-- id_empresa continua NOT NULL de propósito: toda ação tem um escopo, mesmo que esse
-- escopo seja "plataforma inteira". Para ações administrativas globais (platform_admin
-- disparando backup, listando empresas cross-tenant, etc.), grava-se o literal 'GLOBAL' —
-- exatamente a mesma convenção já validada em produção nos workflows ADM-WF016/ADM-WF018
-- (que usam id_empresa='GLOBAL' explicitamente em vez de string vazia/NULL silencioso).
-- Isso evita reintroduzir o mesmo tipo de "default silencioso" que já foi corrigido no n8n
-- nesta sessão (ver ADM-WF017), mantendo uma única convenção para "sem empresa específica"
-- em todo o sistema (n8n e App).
CREATE TABLE public.auditoria_app (
    id_auditoria    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa      TEXT NOT NULL,          -- 'GLOBAL' para ações administrativas cross-tenant
    id_usuario      UUID NOT NULL REFERENCES public.usuarios(id_usuario),
    acao            VARCHAR(60) NOT NULL,   -- ex.: 'AGENDA_CRIAR', 'PAGAMENTO_REGISTRAR', 'ADMIN_BACKUP_DISPARAR'
    entidade        VARCHAR(50),
    id_entidade     TEXT,                   -- ID do lado das Sheets
    payload         JSONB,
    resultado       VARCHAR(20) NOT NULL,   -- 'SUCESSO' | 'ERRO'
    erro_detalhe    TEXT,
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_auditoria_empresa_data ON public.auditoria_app(id_empresa, criado_em DESC);

CREATE TABLE public.convites (        -- onboarding de staff (owner convida um PROFISSIONAIS para ter acesso ao App)
    id_convite      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa      TEXT NOT NULL,
    id_profissional TEXT,
    email           VARCHAR(150) NOT NULL,
    perfil          VARCHAR(30) NOT NULL DEFAULT 'profissional',
    status          VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aceito','expirado','revogado')),
    token           UUID NOT NULL DEFAULT gen_random_uuid(),
    expira_em       TIMESTAMP NOT NULL,
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);
```

**Nota de integridade referencial**: `id_empresa`/`id_profissional` são `TEXT` (formato de ID das Sheets), não FK real — Postgres não consegue validar contra uma planilha. O NestJS valida esses IDs contra as Sheets (via ação de "lookup" no gateway) no momento da escrita (convite/onboarding).

**RLS**: habilitado em `usuarios`/`auditoria_app`/`convites`, funções `current_empresa()`/`current_papel()` (SECURITY DEFINER) para políticas `id_empresa = current_empresa() OR current_papel() = 'platform_admin'`. Na prática, o NestJS usa a service-role key do Supabase para escritas em nome de requisições já autorizadas — RLS é a camada de defesa extra, não o mecanismo primário de autorização (que é o `RolesGuard` do NestJS + escopo `id_empresa` explícito em toda chamada ao gateway).

## Fluxo de Onboarding (revisado)

**Gap identificado**: `/registrar-empresa` precisa criar uma empresa nova do zero — hoje não existe workflow nenhum que escreva na aba EMPRESAS (só leitura, em todos os workflows revisados). Sem isso, um novo cliente BeautyFlow não consegue se cadastrar sozinho.

**Solução**: novo workflow aditivo **`EMP-WF021 - Criar Empresa`** (pasta nova `n8n/workflows/empresas/`, mantendo a convenção `DOMINIO-WFXXX-nome`), chamado pelo gateway `APP-WF019` através da action `EMPRESA_CRIAR`. **Idempotente por design** — ver "Ordem da transação" abaixo para o porquê: `EMP-WF021` **recebe `ID_EMPRESA` já pronto no payload** (gerado pelo NestJS antes de chamar o gateway, não mais gerado dentro do workflow) e segue Trigger→Validação→**Busca**→Processamento→Atualização→Log→Resposta, onde a etapa de Busca É o próprio mecanismo de idempotência:
- `GS - Buscar Empresa Existente` (filtro `ID_EMPRESA` = payload) — verifica se essa empresa já existe.
- Se existir → retorna sucesso imediatamente com os dados já existentes (nenhum append é tentado); `evento_resultado` continua `EMPRESA_CRIADA` do ponto de vista do chamador (o resultado observável é o mesmo: "essa empresa existe"), mas a mensagem interna registra que já existia, para fins de observabilidade.
- Se não existir → `GS - Registrar Empresa` (append), com `onError` tratado em node dedicado — nunca via Merge —, chamada ao WF017 com `node_origem` dinâmico, igual ao padrão de todos os workflows já corrigidos nesta sessão.
- **Nunca cria uma segunda empresa para o mesmo `ID_EMPRESA`.** **Não altera WF001-WF018.**

> **Schema de EMPRESAS — o que está confirmado vs. o que falta confirmar (reverificado diretamente no código antes desta revisão, não é suposição):**
>
> **Confirmado por grep em todo `n8n/workflows/` (buscando literalmente `empresa.CAMPO`/`emp.CAMPO` e todo node com `"operation": "append"`):**
> - `ID_EMPRESA` — chave primária/multi-tenant, usada em toda consulta.
> - `WHATSAPP_PHONE_NUMBER_ID` — dereferenciado em `COM-WF013`, `COM-WF014`, `COM-WF015`, `FIN-WF011`.
> - `TIMEZONE` — dereferenciado nos mesmos 3 workflows de comunicação.
> - `TEMPO_CANCELAMENTO_MIN` — dereferenciado em `AGE-WF007-cancelar.json` (`emp.TEMPO_CANCELAMENTO_MIN`, node `CODE - Validar Prazo`).
> - **Confirmado que não existe hoje nenhum node de escrita (`append`) para EMPRESAS em nenhum dos 18 workflows** — todos os 9 nodes `"operation": "append"` do repositório escrevem em COBRANCAS, LOGS, PAGAMENTOS, MENSAGENS, AGENDAMENTOS, CLIENTES, FOLLOWUPS, LEMBRETES ou PESQUISAS, nunca em EMPRESAS. Isso confirma o gap com certeza, não é suposição.
>
> **Ainda não confirmado (nenhum workflow existente referencia esses campos, mas o formulário de cadastro provavelmente precisa deles)**: nome da empresa/razão social, telefone de contato, e-mail de contato, endereço — nenhum desses aparece em código porque nenhum workflow jamais os leu ou escreveu. **Antes de implementar `EMP-WF021`, é necessário abrir a planilha BEAUTYFLOW3.1 real e verificar exatamente quais colunas a aba EMPRESAS já possui** (podem já existir colunas não utilizadas por nenhum workflow ainda) — isso é um item de verificação explícito do início da Fase 0, não algo que este plano decide por conta própria. `EMP-WF021` deve escrever exatamente nas colunas que existirem, na ordem existente, sem renomear/reordenar nada (regra do projeto).

### Ordem da transação (revisada) e por que ela fecha a janela de duplicidade

**Problema da versão anterior deste plano**: a empresa era criada no n8n/Sheets *antes* de qualquer registro existir no Postgres. Havia uma janela real entre "`EMP-WF021` grava em EMPRESAS" e "`NestJS` grava `onboarding_empresas`" em que uma queda do processo deixava a empresa criada sem nenhum rastro no Postgres — um retry não encontraria nada para resumir e criaria uma **segunda** empresa.

**Correção**: o Postgres (que é transacional de verdade) passa a ser a fonte da verdade do `ID_EMPRESA` **antes** de qualquer chamada ao n8n, e `EMP-WF021` se torna idempotente nesse mesmo ID — a ordem exata é:

1. **NestJS busca ou cria `public.onboarding_empresas` por e-mail.** Se já existe uma linha para esse e-mail (retry), reaproveita o `id_empresa` e o `status` já gravados — nunca gera um novo ID nesse caso. Se não existe, **gera o `ID_EMPRESA` agora** (mesmo padrão de todo o projeto, `EMP${Date.now()}${entropia aleatória}`, só que gerado em TypeScript no NestJS em vez de dentro de um Code node do n8n) e insere a linha com `status='iniciado'`. Essa gravação é uma transação Postgres local, comum — sem nenhuma dependência externa, portanto segura e barata de garantir.
2. **NestJS chama `APP-WF019` → `EMPRESA_CRIAR` → `EMP-WF021`, passando o `id_empresa` já gerado no passo 1.** `EMP-WF021` busca esse `ID_EMPRESA` em EMPRESAS antes de gravar: se já existir (porque uma tentativa anterior já teve sucesso e isto é um retry), retorna sucesso sem duplicar nada; se não existir, grava. **Isso é o que fecha a janela**: não importa quantas vezes o passo 2 seja repetido por causa de uma falha de rede/timeout, o resultado em EMPRESAS é sempre "essa uma empresa existe", nunca duas.
3. **Sucesso do passo 2** → `UPDATE onboarding_empresas SET status='empresa_criada'`.
4. **NestJS cria o usuário no Supabase Auth** (`auth.admin.createUser`, com `id_empresa` gravado em `user_metadata`) **e** insere `public.usuarios` (`perfil='owner'`) em sequência, dentro do mesmo tratamento de erro.
5. **Se a criação em `usuarios` falhar depois do Auth ter sido criado com sucesso**: ação compensatória imediata — `auth.admin.deleteUser(id)` remove o usuário Auth recém-criado antes de responder. `onboarding_empresas.status` permanece `'empresa_criada'` (não avança), então uma nova tentativa do mesmo e-mail pula direto para o passo 4 — o passo 2 nunca é repetido, porque a linha do Postgres já sabe que a empresa existe. **Resultado: nunca existe um usuário Supabase sem `public.usuarios` correspondente por mais que a duração de uma única requisição, e nunca existe uma segunda empresa para o mesmo onboarding.**
6. **Sucesso completo** → `onboarding_empresas.status = 'concluido'`.

A empresa criada no passo 2 nunca é excluída automaticamente — alinhado com a regra do projeto de nunca apagar dados; uma empresa "órfã" (sem usuário ainda, num cenário raríssimo de o processo cair entre os passos 3 e 4) é inofensiva e barata de reconciliar depois, ao contrário de uma conta de login órfã.

`public.onboarding_empresas` (nova tabela, escopo mínimo — só orquestra o onboarding, não duplica dado nenhum de EMPRESAS):

```sql
CREATE TABLE public.onboarding_empresas (
    id_onboarding   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(150) NOT NULL,
    id_empresa      TEXT NOT NULL,           -- gerado pelo NestJS já na criação desta linha (passo 1) — nunca NULL
    status          VARCHAR(20) NOT NULL DEFAULT 'iniciado'
                    CHECK (status IN ('iniciado','empresa_criada','concluido')),
    criado_em       TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_onboarding_email ON public.onboarding_empresas(lower(email));
```

O `UNIQUE` em `email` é o mecanismo de "busca ou cria" do passo 1: uma segunda submissão do mesmo formulário (duplo clique, retry após timeout) sempre encontra a linha existente — com o `id_empresa` já fixado — e resume a partir do `status` gravado, em vez de gerar um novo ID e tentar criar tudo de novo.

### Credenciais do owner em `/registrar-empresa` (MVP: e-mail + senha diretos, sem etapa extra)

Decisão: para não complicar o onboarding com um passo "confirme seu e-mail antes de continuar", o formulário de `/registrar-empresa` já coleta **e-mail + senha diretamente**, e a conta fica utilizável imediatamente após o cadastro:

1. O formulário único coleta: dados da empresa (pendente de confirmação exata do schema, ver nota acima) + nome do proprietário + e-mail + senha (confirmação de senha é só validação de UX no cliente, não é enviada ao backend).
2. No passo 4 da transação, o NestJS chama `supabase.auth.admin.createUser({ email, password, email_confirm: true })` — `email_confirm: true` marca o e-mail como confirmado imediatamente, sem exigir clique em link de verificação. Isso é intencional para o MVP (cadastro auto-serviço de um cliente pagante, não um formulário público de baixa confiança); verificação de e-mail por link fica como item de hardening pós-MVP, não bloqueia esta fase.
3. Após a resposta de sucesso do backend (`onboarding_empresas.status='concluido'`), o **frontend** chama o `supabase.auth.signInWithPassword({ email, senha })` normal (SDK cliente padrão, chave anônima) usando as mesmas credenciais já digitadas no formulário — isso estabelece a sessão real do usuário sem o backend precisar fabricar/retransmitir tokens. Login instantâneo, redireciona para `/dashboard`.

## Autenticação e autorização

**`public.usuarios` é criado durante a transação de onboarding (passo 4 do fluxo descrito acima), nunca no primeiro login.** O login normal (owner recorrente, ou profissional após aceitar convite) é somente autenticação + leitura de um registro que já existe:

1. **Onboarding do owner** (`/registrar-empresa`) segue exatamente a ordem já definida: EMPRESA (n8n/Sheets) → Supabase Auth (`auth.users`) → `public.usuarios` (perfil='owner') → conclusão. Convite de profissional segue o mesmo princípio: `public.usuarios` (perfil='profissional') só é criado quando o convite é aceito (Supabase Auth criado no aceite), nunca antes.
2. **Login normal** (toda sessão subsequente, de qualquer papel): Supabase Auth autentica e emite JWT; frontend guarda via `@supabase/ssr` (cookies httpOnly). Nenhuma escrita acontece em `public.usuarios` neste passo — a linha já existe desde o onboarding/aceite de convite.
3. NestJS valida o JWT (`SupabaseAuthGuard`) e **resolve** (nunca cria) `id_empresa`/`perfil`/`id_profissional` via **consulta direta a `usuarios`** — não via custom claims no JWT (decisão: claims só atualizam na reemissão do token, uma consulta indexada mantém a mudança de papel efetiva na mesma sessão). Se a consulta não encontrar nenhuma linha em `usuarios` para o `sub` do JWT (ex.: onboarding travou entre os passos 3-4 do fluxo de transação e foi compensado, ou um acesso a `auth.users` sem contraparte por qualquer outro motivo), o backend retorna 401/403 explícito ("cadastro incompleto") em vez de assumir qualquer papel default — nunca criar `usuarios` implicitamente aqui.
4. `RolesGuard` (`@Roles('owner')`) força regras por endpoint; para chamadas de um `profissional`, o backend **sempre** injeta `id_profissional` no payload do gateway, ignorando qualquer valor vindo do cliente.
5. Frontend: `middleware.ts` protege rotas `(app)`/`(admin)`; `RoleGate` só esconde UI — nunca é a barreira de segurança real.

## Estratégia de integração com o n8n (gateway `APP-WF019`, fase futura — não construir agora)

- **Um único webhook, roteado por `action`** (mesmo padrão de Switch já usado pelo `ATD-WF003`): `POST /webhook/app-gateway`, header `X-API-Key`, corpo `{ action, id_empresa, id_usuario_app, payload }`. Resposta uniforme `{ sucesso, dados }` ou `{ sucesso:false, codigo_erro, mensagem }`.
- Autenticação na fronteira é `X-API-Key` (segredo compartilhado backend-to-backend) — não o JWT do Supabase, que o n8n não valida; o NestJS é o único chamador dessa URL.
- Cada módulo do NestJS mapeia sua ação para uma chamada via `GatewayClientService` (timeout ~10s, 1 retry só em falha de rede — nunca em rejeição de regra de negócio, circuit breaker), grava linha em `auditoria_app`, e traduz `codigo_erro` (`RN007_...`, `RN011_...`, `RN014_...`) para HTTP 409/422.
- Timeout/indisponibilidade do gateway → 503 genérico + toast com retry; a tentativa falha fica registrada em auditoria para reconciliação (idempotência via `id_operacao` gerado pelo NestJS é item de hardening, não bloqueia o MVP).
- **Leitura**: chamadas síncronas por requisição ao gateway na Fase 1, com cache TTL curto (15-30s, in-process, sem nova infraestrutura) para ações de leitura (`AGENDA_CONSULTAR_DISPONIBILIDADE`, `CLIENTE_LISTAR`, `COBRANCA_LISTAR`) adicionado assim que a página de Agenda for construída. Escritas sempre invalidam o cache correspondente. Nada de read-replica/event-sourcing — desproporcional para um sistema apoiado em Sheets.

**Gaps identificados** (informativo, não bloqueia o plano): `SERVICOS` e as configurações de `EMPRESAS` não têm nenhum workflow de escrita hoje — vão precisar de um pequeno workflow novo (ex. `SER-WF020`) na Fase 1, aditivo, sem tocar nada existente.

## Fases de entrega

| Fase | Entregáveis | Personas | Workflow(s) n8n novo(s) necessário(s) (autorização futura) |
|---|---|---|---|
| **Fase 0 — Fundações, Auth e Onboarding** | Monorepo, Supabase provisionado (`usuarios`/`auditoria_app`/`convites`/`onboarding_empresas` + RLS), fluxo completo de `/registrar-empresa` (empresa→auth→usuarios com rollback compensatório), convite de staff, guards NestJS, AppShell/RoleGate, CI básico | PER001 (onboarding), PER003 (convite) | `APP-WF019` com a branch `EMPRESA_CRIAR` já funcional (não mais esqueleto vazio); **novo `EMP-WF021 - Criar Empresa`** |
| **Fase 1 — MVP Operacional** | Agenda (criar/reagendar/cancelar/consultar), Clientes (listar/criar/atualizar — primeiro chamador real do WF009), Profissionais (elenco + disponibilidades), Serviços (catálogo) | PER001 (completo), PER003 (escopo próprio) | Branches `AGENDA_*`→WF004-007, `CLIENTE_*`→WF008-009; novo `SER-WF020` |
| **Fase 2 — Financeiro + Dashboard** | Registro de pagamento/histórico, Cobranças, Dashboard, Relatórios básicos | PER001 (financeiro é exclusivo do owner no MVP) | Branches `PAGAMENTO_*`/`COBRANCA_*`→WF010-011 |
| **Fase 3 — Comunicação/IA + Admin** | Feed de leitura (MENSAGENS/LEMBRETES/PESQUISAS/FOLLOWUPS), gatilho manual, visão IA_MEMORIA, área admin (empresas cross-tenant, Logs, disparo de Backup) | PER001, PER005 | Branches `COMUNICACAO_*`→WF012-015, `ADMIN_*`→WF016-018 |
| **Fase Futura — Migração Postgres completa** | Alinhado ao Fase 2 do roadmap do README raiz: finalizar o schema de 16 tabelas, migrar dados das Sheets, workflows n8n passam a ler/escrever Postgres em vez de Sheets. Só depois disso o backend do App poderia falar direto com Postgres para dados operacionais. | Todas | — (fora de escopo de qualquer fase acima) |

## Arquivos-chave já confirmados (referência para implementação futura)

- `database/01-create-tables.sql` — convenções de nome (`id_`, `ativo`, `criado_em`) reaproveitadas no schema Supabase novo.
- `n8n/workflows/atendimento/ATD-WF003-identificar-intencao.json` — padrão de Switch/dispatch que o `APP-WF019` deve replicar.
- `n8n/workflows/clientes/CLI-WF009-atualizar-cliente.json` — workflow órfão validado, primeiro caso real de uso do gateway.
- `n8n/workflows/empresas/EMP-WF021-criar-empresa.json` — **novo**, não existe ainda; a ser criado na Fase 0 seguindo o mesmo padrão arquitetural (Trigger→Validação→Processamento→Atualização→Log→Resposta) confirmado nos workflows existentes.
- `README.md` (raiz) — linguagem de Fase 1-4 com a qual a numeração de fases deste plano deve ficar consistente.
- `docs/01-visao-do-produto/04-product-scope.md` — escopo de MVP aprovado pela product owner, base do agrupamento de páginas.

## Como este plano deve ser verificado

Isto é um documento de arquitetura — nada foi implementado ainda. Antes de iniciar a Fase 0:
1. Confirmar com o usuário que quer prosseguir com esta arquitetura (aprovação deste plano).
2. Ao final da Fase 0, verificação concreta: login/registro funcionando end-to-end contra um Supabase real, `usuarios` populada corretamente, guards do NestJS rejeitando token inválido/papel incorreto em teste manual. Especificamente para o onboarding: testar o caminho feliz completo (empresa→auth→usuarios), e simular a falha do passo 4 (ex.: derrubando a conexão com o Postgres momentaneamente) para confirmar que o usuário Supabase Auth criado no passo 4 é efetivamente removido (`deleteUser`) e que uma nova tentativa com o mesmo e-mail resume a partir de `onboarding_empresas.status='empresa_criada'` sem duplicar a linha em EMPRESAS.
3. Ao final de cada fase seguinte, verificação concreta: cada ação de escrita via gateway deve ser conferida diretamente na aba correspondente do Google Sheets (não apenas na resposta da API) — mesmo padrão de validação já usado nos workflows n8n existentes nesta sessão (checagem estática + simulação Node.js + confirmação real).
4. Nenhum dos workflows `WF001`-`WF018` existentes deve ser alterado em nenhuma fase deste plano. Os únicos workflows novos autorizados pela arquitetura são: **`APP-WF019`** (gateway), **`SER-WF020`** (catálogo de serviços, Fase 1) e **`EMP-WF021`** (criar empresa, Fase 0). Isso deve ser conferido via `git status`/diff antes de qualquer commit, exatamente como já é prática neste repositório.
