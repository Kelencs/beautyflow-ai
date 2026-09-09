# Status do Projeto — BeautyFlow AI

**Data de referência:** 09/09/2026

**Checkpoint funcional anterior:** `a723bff` — `feat: integrate real agenda through APP-WF019` (Agenda read-only).

**Checkpoint funcional atual:** `585e710` — `feat: add homologated agenda cancellation command` (APP-WF020 / `agenda.cancelar`, homologado E2E em `BEAUTYFLOW_HOMOLOGACAO`).

**`main` no GitHub:** `a891306` — `docs: sync BeautyFlow after APP-WF020 homologation`. `585e710` e este commit documental já estão publicados em `origin/main`. `a6385d2` foi o commit documental que precedeu a implementação do WF020 (só documentação, sem mudança funcional).

## Resumo executivo

O BeautyFlow AI possui dois blocos principais em evolução coordenada:

1. **núcleo operacional n8n**, com WF001–WF018 versionados e preservados;
2. **BeautyFlow App**, com frontend Next.js, backend NestJS, contratos compartilhados, autenticação via Supabase e integração real com dados operacionais por meio de dois gateways separados: `APP-WF019` (leitura) e `APP-WF020` (comandos de escrita da Agenda).

O `APP-WF019` está na **v1.12**, com **6 operações read-only implementadas e homologadas**:

- `clientes.listar`;
- `servicos.listar`;
- `profissionais.listar`;
- `empresa.obter`;
- `disponibilidades.listar`;
- `agendamentos.listar`.

O `APP-WF020` é um gateway novo, com **1 operação de escrita homologada em HML**: `agenda.cancelar`.

Clientes, Serviços, Profissionais, Configurações e Agenda já foram validados no BeautyFlow App com dados reais de `BEAUTYFLOW_HOMOLOGACAO`.

A Agenda possui **leitura real homologada via APP-WF019 e a primeira operação de escrita homologada via APP-WF020: `agenda.cancelar`**. Continuam pendentes: criar; reagendar; concluir; confirmação real do cliente; sincronização com Google Calendar; demais escritas. A arquitetura adotou comandos explícitos — não há (nem haverá) um `editar` genérico. Financeiro, Comunicação e IA continuam sem integração operacional completa com o gateway.

## Estado por área

| Área | Estado atual |
|---|---|
| WF001–WF018 | Versionados e preservados; não alterados pela integração do App |
| Frontend | App/MVP implementado; módulos principais disponíveis |
| Backend | NestJS com módulos de domínio, autenticação/autorização e gateway n8n |
| shared-types | Implementado |
| Supabase/Auth | Implementado |
| APP-WF019 | **v1.12; 6 operações read-only homologadas** |
| APP-WF020 | **v1.0; gateway de comandos de escrita da Agenda; `agenda.cancelar` homologado E2E em HML — versionado no checkpoint funcional `585e710`** |
| Clientes | **Dados reais via APP-WF019; homologado E2E** |
| Serviços | **Dados reais via APP-WF019; homologado E2E** |
| Profissionais | **Dados reais via APP-WF019; homologado E2E** |
| Configurações | **Dados reais via `empresa.obter` + `disponibilidades.listar`; homologado E2E** |
| Agenda | **Leitura real via `agendamentos.listar` (APP-WF019), homologada E2E em Hoje/Semana/Mês e detalhes; primeira escrita real via `agenda.cancelar` (APP-WF020), homologada E2E em HML** |
| Dashboard | Estruturado; usa Agenda real quando `DATA_SOURCE_AGENDA=n8n`, mas indicadores de confirmação permanecem 0 sem fonte real de confirmação |
| Relatórios | Estruturado; consome Agenda real quando habilitada, respeitando os mesmos limites de fonte |
| Financeiro | Implementado/estruturado; integração real bloqueada pela composição AGENDAMENTOS + PAGAMENTOS |
| Comunicação | Implementada/estruturada; integração real bloqueada pela composição/correlação entre fontes |
| IA | Implementada/estruturada; integração real bloqueada por lacunas da fonte, incluindo `IA_MEMORIA` sem writer conhecido |
| Dados operacionais WF001–WF018 | Google Sheets |
| Identidade/autenticação do App | Supabase |
| Integração App ↔ n8n | **Operacional em read-only para 6 operações (APP-WF019) + 1 operação de escrita homologada em HML (APP-WF020: `agenda.cancelar`)** |
| Substituição de mocks do App | **Em andamento, módulo a módulo** |
| Migração operacional completa para Postgres | Futuro; não é pré-requisito imediato |

## Arquitetura atual

### Núcleo operacional n8n

```text
WhatsApp
  ↓
n8n
  ├── Gemini
  ├── Google Sheets
  ├── Google Calendar
  └── Google Drive
```

### BeautyFlow App

```text
Usuário
  ↓
Next.js
  ↓
NestJS
  ├── Supabase (Auth / identidade)
  ├── APP-WF019 (gateway operacional read-only)
  │     ↓
  │   n8n → Google Sheets
  └── APP-WF020 (gateway de comandos — agenda.cancelar)
        ↓
      n8n → Google Sheets
```

O frontend **não acessa o n8n diretamente**. O NestJS é a fronteira de autenticação, autorização, contexto de empresa, regras de negócio, composição de dados e integração.

`APP-WF019` e `APP-WF020` são **gateways/adaptadores**, não substitutos do backend NestJS — READ e WRITE são deliberadamente workflows separados: WF019 nunca ganha escrita, WF020 nunca chama WF019 nem os workflows legados de Agenda (`AGE-WF004/005/006/007`).

## APP-WF019 — estado homologado

O workflow versionado `n8n/workflows/app/APP-WF019-gateway-app.json` possui atualmente 6 operações read-only:

| Operação | Fonte | Estado |
|---|---|---|
| `clientes.listar` | CLIENTES | ✅ Homologada |
| `servicos.listar` | SERVICOS | ✅ Homologada |
| `profissionais.listar` | PROFISSIONAIS | ✅ Homologada |
| `empresa.obter` | EMPRESAS | ✅ Homologada |
| `disponibilidades.listar` | DISPONIBILIDADES | ✅ Homologada |
| `agendamentos.listar` | AGENDAMENTOS | ✅ Homologada |

O JSON versionado permanece com `active:false`. Ativação/publicação no n8n Cloud é uma etapa operacional controlada.

### Telas validadas com dados reais

| Tela | Situação |
|---|---|
| `/clientes` | ✅ dados reais |
| `/servicos` | ✅ dados reais |
| `/profissionais` | ✅ dados reais |
| `/configuracoes` — Negócio | ✅ dados reais |
| `/configuracoes` — Agenda | ✅ timezone, janela de cancelamento e disponibilidades reais |
| `/agenda` — Hoje | ✅ leitura real / estado vazio válido |
| `/agenda` — Semana | ✅ leitura real homologada |
| `/agenda` — Mês | ✅ leitura real homologada |
| `/agenda` — Detalhes | ✅ cliente, profissional, serviço, data, horário, valor e status reais |
| `/agenda` — Cancelar | ✅ escrita real homologada em HML via APP-WF020 (`agenda.cancelar`) |

## APP-WF020 — estado homologado (versionado no checkpoint funcional `585e710`)

O workflow `n8n/workflows/app/APP-WF020-agenda-commands.json` é um gateway novo, separado do WF019, dedicado a **comandos de escrita da Agenda**. Nesta fase implementa **1 operação**, homologada E2E contra `BEAUTYFLOW_HOMOLOGACAO`:

| Operação | Estado |
|---|---|
| `agenda.cancelar` | ✅ Homologada em HML (Google Sheets) |

Fluxo: `Next.js (Server Action) → NestJS PATCH /agenda/:id/cancelar → N8nGatewayCommandsClient → APP-WF020 → Google Sheets AGENDAMENTOS`.

Regras homologadas:

- `AGENDADO → CANCELADO` é a única transição executada;
- `CANCELADO` → sucesso idempotente, sem nova escrita (validado empiricamente: duas chamadas sobre a mesma linha preservaram o mesmo `DATA_CANCELAMENTO`/`MOTIVO_CANCELAMENTO`);
- `CONCLUIDO` → `409 CONFLICT`, sem escrita;
- motivo opcional (default `"Cancelado pelo usuário"` resolvido pelo NestJS);
- somente `STATUS`, `DATA_CANCELAMENTO`, `MOTIVO_CANCELAMENTO` e `ULTIMA_ATUALIZACAO` são alterados; demais campos preservados.

Tenant e autorização:

- `idEmpresa` deriva exclusivamente do usuário autenticado no NestJS — browser não envia livremente;
- `GS - Buscar Agendamento` localiza a linha por `ID_EMPRESA` + `ID_AGENDAMENTO`;
- `CODE - Localizar E Validar Agendamento` valida tenant/recurso/estado antes de qualquer escrita;
- `GS - Cancelar Agendamento` (`Update Row`) casa a linha só por `ID_AGENDAMENTO` — limitação conhecida e documentada da operação `Update Row` nesta versão do n8n Cloud (a alternativa, `Append or Update Row`, foi descartada por introduzir semântica de `append` em não-match, indesejável para um cancelamento). A segurança do tenant no comando depende da cadeia completa acima, não só deste node; `ID_AGENDAMENTO` precisa permanecer globalmente único; match composto real no update permanece dívida técnica futura;
- owner pode cancelar qualquer agendamento da própria empresa; profissional só pode cancelar o próprio (teste negativo E2E homologado); o cenário positivo "profissional cancela o próprio" não foi executado contra dado real nesta rodada (permanece coberto por teste automatizado); `platform_admin` sem contexto operacional explícito permanece negado.

Google Calendar **não participa** do `agenda.cancelar` nesta fase — cancelamento pelo App não sincroniza o Calendar. Isso é uma dívida registrada, não um bug escondido; Google Sheets segue como source of truth operacional deste comando.

Header Auth do webhook do WF020 atualmente **compartilha a mesma credencial** do WF019 no n8n Cloud — segregação READ/WRITE permanece dívida de segurança pendente.

Homologação executada contra a fixture `AGE-HML-CANCEL-001` em `BEAUTYFLOW_HOMOLOGACAO`: cancelamento E2E pela UI, idempotência real, tenant negativo, profissional negativo e `CONCLUIDO → CONFLICT` todos validados; campos alterados/preservados conferidos diretamente na planilha.

Detalhe completo: [`n8n/documentacao/app/APP-WF020.md`](../n8n/documentacao/app/APP-WF020.md).

**Checkpoint funcional do APP-WF020: `585e710`** (`feat: add homologated agenda cancellation command`) — implementado, homologado em HML e publicado em `origin/main`.

## Agenda — modelo de domínio e integração real

O contrato do App separa **ciclo de vida do atendimento** de **confirmação do cliente**.

```ts
type StatusAgendamento = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
type StatusConfirmacao = 'PENDENTE' | 'CONFIRMADO';
```

`AgendaItem` possui:

```ts
status: StatusAgendamento;
statusConfirmacao: StatusConfirmacao | null;
```

A fonte real de `AGENDAMENTOS.STATUS`, confirmada durante a homologação, sustenta atualmente:

```text
AGENDADO
CONCLUIDO
CANCELADO
```

`PENDENTE` e `CONFIRMADO` **não são inferidos**. Para dados reais, o NestJS define:

```text
statusConfirmacao = null
```

Não existe inferência por horário passado, pagamento, lembrete ou qualquer outro sinal indireto.

### `agendamentos.listar`

O branch real aplica:

- filtro `ID_EMPRESA` na fonte;
- validação de `dataInicio`/`dataFim`;
- whitelist explícita de `AGENDADO|CONCLUIDO|CANCELADO`;
- hardening de campos obrigatórios;
- resposta mínima com IDs e dados operacionais;
- nenhum `ID_EMPRESA` na resposta.

O NestJS faz o join de:

```text
idCliente      → ClientesService
idProfissional → ProfissionaisService
idServico      → ServicosService
```

Referência inexistente é tratada como inconsistência da fonte; o backend não fabrica nomes para esconder o problema.

## Estado dos dados e flags de fonte

O núcleo operacional continua usando Google Sheets como persistência operacional. O App usa Supabase para identidade/autenticação.

Flags disponíveis no backend:

- `DATA_SOURCE_CLIENTES=mock|n8n`;
- `DATA_SOURCE_SERVICOS=mock|n8n`;
- `DATA_SOURCE_PROFISSIONAIS=mock|n8n`;
- `DATA_SOURCE_CONFIGURACOES=mock|n8n`;
- `DATA_SOURCE_AGENDA=mock|n8n`.

O default permanece `mock`, evitando ativação acidental de integração real em ambientes não preparados.

Quando `DATA_SOURCE_AGENDA=n8n`, falha do gateway **não** gera fallback silencioso para mock; o App recebe erro controlado.

## Segurança e multi-tenancy

A camada homologada (leitura via WF019 e a primeira escrita via WF020) preserva:

- `idEmpresa` resolvido server-side a partir do usuário autenticado;
- browser sem escolha livre de tenant;
- filtro `ID_EMPRESA` aplicado também no Google Sheets, tanto na leitura (WF019) quanto na localização da linha antes de escrever (WF020);
- `platform_admin` sem tenant explícito não recebe visão cross-tenant; no WF020, `platform_admin` é negado pelo NestJS antes de qualquer chamada ao gateway;
- profissionais continuam restritos aos próprios atendimentos quando aplicável — no WF020 isso já foi validado E2E no cenário negativo (profissional não cancela agendamento de outro);
- respostas sem `ID_EMPRESA` e sem identificadores técnicos desnecessários;
- credenciais e segredos reais não versionados;
- frontend sem chamada direta ao n8n;
- erros padronizados e sem fallback silencioso para mocks.

**Dívida de segurança registrada:** o Header Auth do webhook do WF020 ainda compartilha a mesma credencial do WF019 no n8n Cloud — segregação READ/WRITE das credenciais permanece pendente.

## Qualidade do checkpoint atual

**No checkpoint funcional anterior `a723bff` foram registrados:**

- **469 testes backend**;
- **20 suítes**;
- **469/469 verdes**;
- lint backend e frontend verdes;
- builds de `shared-types`, backend e frontend verdes;
- zero alteração em WF001–WF018;
- zero segredo real versionado;
- homologação manual da Agenda real (leitura) concluída.

**No checkpoint funcional atual `585e710` (APP-WF020 — `agenda.cancelar`) foram registrados:**

- **525 testes backend**;
- **23 suítes**;
- **525/525 verdes**;
- lint backend e frontend verdes;
- builds de `shared-types`, backend e frontend verdes;
- zero alteração em WF001–WF019;
- zero segredo real versionado;
- homologação E2E do `agenda.cancelar` em HML concluída.

`a6385d2` foi o commit documental que precedeu esta implementação (só documentação, sem mudança funcional). `585e710` já está publicado em `origin/main`.

Não há atualmente GitHub Actions associados a nenhum dos dois checkpoints; a validação registrada foi executada localmente antes de cada push.

## Evidências da homologação da Agenda

### Leitura (APP-WF019)

Foram validados manualmente contra `BEAUTYFLOW_HOMOLOGACAO`:

- agosto/2026 em visão mensal: 6 agendamentos reais carregados;
- visão semanal de agosto com registros reais;
- setembro/2026 sem registros retornando estado vazio, sem erro;
- detalhes de atendimento com join real de Cliente + Profissional + Serviço;
- exemplo validado: Mariana Teste / Beatriz Rocha / Manicure Tradicional / 05/08/2026 / 14:00–16:00 / R$ 180,00 / `AGENDADO` / confirmação `—`;
- `agendamentos.listar` retornando sucesso no backend;
- `CONCLUIDO` aceito apenas quando gravado literalmente pela fonte;
- nenhuma fabricação de `PENDENTE` ou `CONFIRMADO`.

### Escrita — `agenda.cancelar` (APP-WF020)

Foram validados manualmente contra `BEAUTYFLOW_HOMOLOGACAO`, fixture `AGE-HML-CANCEL-001`:

- cancelamento E2E pela UI (confirmação exibida, sem exposição de IDs internos, painel atualizado);
- idempotência: segunda chamada sobre a mesma linha já `CANCELADO` preservou `DATA_CANCELAMENTO`/`MOTIVO_CANCELAMENTO`/`ULTIMA_ATUALIZACAO` idênticos;
- tenant negativo: outra empresa tentando cancelar um agendamento real de `EMP001` → `NOT_FOUND`, sem alteração;
- profissional negativo: profissional tentando cancelar agendamento de outro profissional → `NOT_FOUND`, sem alteração;
- `CONCLUIDO → CONFLICT`, sem escrita;
- campos alterados (`STATUS`, `DATA_CANCELAMENTO`, `MOTIVO_CANCELAMENTO`, `ULTIMA_ATUALIZACAO`) e preservados (demais colunas) conferidos diretamente na planilha.

Cenário positivo "profissional cancela o próprio" **não** foi executado contra dado real (permanece coberto por teste automatizado).

## Homologação × JSON versionado

O JSON versionado do APP-WF019 continua apontando para `BEAUTYFLOW3.1`.

Para homologação, os **6 nodes `GS -`** precisam ser reapontados manualmente no n8n Cloud para `BEAUTYFLOW_HOMOLOGACAO`:

1. `GS - Buscar Clientes`;
2. `GS - Buscar Serviços`;
3. `GS - Buscar Profissionais`;
4. `GS - Buscar Empresa`;
5. `GS - Buscar Disponibilidades`;
6. `GS - Buscar Agendamentos`.

Esse reapontamento é operacional e precisa ser refeito após reimportações quando o objetivo for testar novamente contra homologação.

## Gaps e dívidas preservadas

### Agenda — escrita

A primeira operação de escrita (`agenda.cancelar`, via APP-WF020) já está homologada em HML. Permanecem pendentes:

- criar agendamento;
- reagendar;
- concluir atendimento;
- persistir confirmação real do cliente.

A arquitetura adotou comandos explícitos por operação — não existe (nem está planejado) um `editar` genérico.

O botão visual “Concluir atendimento” não deve ser interpretado como persistência real enquanto não houver writer explícito.

Dívidas específicas do `agenda.cancelar` (detalhe completo em [`../n8n/documentacao/app/APP-WF020.md`](../n8n/documentacao/app/APP-WF020.md)):

1. Google Calendar não sincroniza o cancelamento;
2. Header Auth compartilhado entre WF019 e WF020 no n8n Cloud;
3. `Update Row` do WF020 casa a linha só por `ID_AGENDAMENTO` (limitação da operação no n8n Cloud);
4. `ID_AGENDAMENTO` precisa permanecer globalmente único para essa proteção de tenant se sustentar;
5. match composto real no update permanece dívida técnica futura;
6. cenário E2E positivo de profissional cancelando o próprio agendamento não foi executado contra dado real.

Também permanece a dívida de configuração/hardcode legado do Google Calendar nos workflows antigos de Agenda; nenhuma correção foi feita em WF001–WF018/APP-WF019 nesta fase.

### Financeiro

A leitura real exige composição entre `AGENDAMENTOS` e `PAGAMENTOS`, além de regras de status e resolução de nomes. Não foi implementada no APP-WF019.

### Comunicação

Há múltiplas fontes (`MENSAGENS`, `LEMBRETES`, `PESQUISA`, `FOLLOWUPS`, `COBRANCAS`) sem uma chave única de correlação consolidada para o contrato do App.

### IA

`IA_MEMORIA` é lida por workflows existentes, mas não há writer conhecido entre WF001–WF018. O App não deve afirmar memória persistente nem status por tenant sem fonte confiável.

### Outros gaps

- multiempresa de produção: revisar defaults, fallbacks e configurações fixas antes da escala SaaS;
- observabilidade: ampliar telemetria e tratamento operacional de falhas;
- performance do gateway: continuar monitorando latência e timeout sem introduzir cache/retry prematuramente;
- `agendamentos.listar`: hoje todas as linhas da empresa são validadas antes do corte por período; avaliar futuramente se dado histórico fora do intervalo deve bloquear a consulta atual;
- validação de data/hora no gateway pode receber hardening adicional em uma iteração futura;
- hardening geral de produção antes do lançamento comercial.

## Próxima macrofase recomendada

A Agenda já está homologada em leitura, e a primeira operação de escrita (`agenda.cancelar`) já foi homologada em HML via APP-WF020. A próxima macrofase deve ser escolhida conscientemente entre:

1. **continuar evoluindo a Agenda em escrita**, implementando e homologando `agenda.criar`/`agenda.reagendar`/`agenda.concluir` em checkpoints separados, sem duplicar regras dos WF004–WF007; ou
2. avançar para **Financeiro read-only**, após definir a composição AGENDAMENTOS + PAGAMENTOS e seus estados.

Recomendação atual: priorizar a **Agenda operacional completa** antes de abrir um novo módulo, mantendo cada comando de escrita em checkpoints pequenos e homologáveis (mesmo padrão usado para `agenda.cancelar`).

## Critério para declarar um módulo operacional

Um módulo pode ser classificado como operacional quando:

- consulta/escrita usa a fonte real necessária ao caso de uso;
- autenticação e autorização estão ativas;
- isolamento multiempresa foi validado;
- regras de negócio são preservadas;
- não há dados inventados para preencher lacunas da fonte;
- erros e indisponibilidade são tratados;
- existem testes/evidências mínimas;
- a documentação foi atualizada.

A Agenda deve ser descrita hoje como **operacional em leitura, com a primeira operação de escrita (`agenda.cancelar`) homologada em HML**, e não como operacional completa.

## Governança documental

Mudanças relevantes no App, workflows, contratos ou arquitetura devem atualizar, quando aplicável:

- `README.md`;
- `docs/STATUS-DO-PROJETO.md`;
- documentação de arquitetura;
- README do workspace afetado;
- testes/matriz de rastreabilidade;
- documentação específica do workflow ou módulo.

### Regra de checkpoint

```text
Implementar
  ↓
Testar
  ↓
Homologar
  ↓
Atualizar documentação
  ↓
Commit / push
  ↓
Próximo módulo
```
