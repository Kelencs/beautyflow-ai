# Status do Projeto — BeautyFlow AI

**Data de referência:** 02/09/2026  
**Checkpoint técnico de referência:** `a723bff` — `feat: integrate real agenda through APP-WF019`

## Resumo executivo

O BeautyFlow AI possui dois blocos principais em evolução coordenada:

1. **núcleo operacional n8n**, com WF001–WF018 versionados e preservados;
2. **BeautyFlow App**, com frontend Next.js, backend NestJS, contratos compartilhados, autenticação via Supabase e integração read-only com dados operacionais reais por meio do `APP-WF019`.

O `APP-WF019` está atualmente na **v1.12**, com **6 operações read-only implementadas e homologadas**:

- `clientes.listar`;
- `servicos.listar`;
- `profissionais.listar`;
- `empresa.obter`;
- `disponibilidades.listar`;
- `agendamentos.listar`.

Clientes, Serviços, Profissionais, Configurações e Agenda já foram validados no BeautyFlow App com dados reais de `BEAUTYFLOW_HOMOLOGACAO`.

A Agenda permanece **read-only**: criar, editar, reagendar, cancelar e concluir atendimentos ainda não possuem escrita real pelo App. Financeiro, Comunicação e IA continuam sem integração operacional completa com o gateway.

## Estado por área

| Área | Estado atual |
|---|---|
| WF001–WF018 | Versionados e preservados; não alterados pela integração do App |
| Frontend | App/MVP implementado; módulos principais disponíveis |
| Backend | NestJS com módulos de domínio, autenticação/autorização e gateway n8n |
| shared-types | Implementado |
| Supabase/Auth | Implementado |
| APP-WF019 | **v1.12; 6 operações read-only homologadas** |
| Clientes | **Dados reais via APP-WF019; homologado E2E** |
| Serviços | **Dados reais via APP-WF019; homologado E2E** |
| Profissionais | **Dados reais via APP-WF019; homologado E2E** |
| Configurações | **Dados reais via `empresa.obter` + `disponibilidades.listar`; homologado E2E** |
| Agenda | **Leitura real via `agendamentos.listar`; homologada E2E em Hoje/Semana/Mês e detalhes** |
| Dashboard | Estruturado; usa Agenda real quando `DATA_SOURCE_AGENDA=n8n`, mas indicadores de confirmação permanecem 0 sem fonte real de confirmação |
| Relatórios | Estruturado; consome Agenda real quando habilitada, respeitando os mesmos limites de fonte |
| Financeiro | Implementado/estruturado; integração real bloqueada pela composição AGENDAMENTOS + PAGAMENTOS |
| Comunicação | Implementada/estruturada; integração real bloqueada pela composição/correlação entre fontes |
| IA | Implementada/estruturada; integração real bloqueada por lacunas da fonte, incluindo `IA_MEMORIA` sem writer conhecido |
| Dados operacionais WF001–WF018 | Google Sheets |
| Identidade/autenticação do App | Supabase |
| Integração App ↔ n8n | **Operacional em read-only para 6 operações** |
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
  └── APP-WF019 (gateway operacional read-only)
        ↓
      n8n
        ↓
      Google Sheets
```

O frontend **não acessa o n8n diretamente**. O NestJS é a fronteira de autenticação, autorização, contexto de empresa, regras de negócio, composição de dados e integração.

O `APP-WF019` é um **gateway/adaptador**, não um substituto do backend NestJS.

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

A camada read-only homologada preserva:

- `idEmpresa` resolvido server-side a partir do usuário autenticado;
- browser sem escolha livre de tenant;
- filtro `ID_EMPRESA` aplicado também no Google Sheets;
- `platform_admin` sem tenant explícito não recebe visão cross-tenant;
- profissionais continuam restritos aos próprios atendimentos quando aplicável;
- respostas sem `ID_EMPRESA` e sem identificadores técnicos desnecessários;
- credenciais e segredos reais não versionados;
- frontend sem chamada direta ao n8n;
- erros padronizados e sem fallback silencioso para mocks.

## Qualidade do checkpoint atual

No checkpoint `a723bff` foram registrados:

- **469 testes backend**;
- **20 suítes**;
- **469/469 verdes**;
- lint backend e frontend verdes;
- builds de `shared-types`, backend e frontend verdes;
- zero alteração em WF001–WF018;
- zero segredo real versionado;
- homologação manual da Agenda real concluída.

Não há atualmente GitHub Actions associados ao commit; a validação registrada foi executada localmente antes do push.

## Evidências da homologação da Agenda

Foram validados manualmente contra `BEAUTYFLOW_HOMOLOGACAO`:

- agosto/2026 em visão mensal: 6 agendamentos reais carregados;
- visão semanal de agosto com registros reais;
- setembro/2026 sem registros retornando estado vazio, sem erro;
- detalhes de atendimento com join real de Cliente + Profissional + Serviço;
- exemplo validado: Mariana Teste / Beatriz Rocha / Manicure Tradicional / 05/08/2026 / 14:00–16:00 / R$ 180,00 / `AGENDADO` / confirmação `—`;
- `agendamentos.listar` retornando sucesso no backend;
- `CONCLUIDO` aceito apenas quando gravado literalmente pela fonte;
- nenhuma fabricação de `PENDENTE` ou `CONFIRMADO`.

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

A integração do App é **somente leitura**. Permanecem pendentes:

- criar agendamento;
- editar atendimento;
- reagendar;
- cancelar;
- concluir atendimento;
- persistir confirmação real do cliente.

O botão visual “Concluir atendimento” não deve ser interpretado como persistência real enquanto não houver writer explícito.

Também permanece a dívida de configuração/hardcode legado do Google Calendar nos workflows antigos de Agenda; nenhuma correção foi feita em WF001–WF018 nesta fase.

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

A Agenda já está homologada em leitura. A próxima macrofase deve ser escolhida conscientemente entre:

1. **evoluir a Agenda para operações de escrita**, começando por uma decisão de arquitetura para criar/reagendar/cancelar/concluir sem duplicar regras dos WF004–WF007; ou
2. avançar para **Financeiro read-only**, após definir a composição AGENDAMENTOS + PAGAMENTOS e seus estados.

Recomendação atual: priorizar a **Agenda operacional completa** antes de abrir um novo módulo, mantendo escrita e leitura separadas em checkpoints pequenos e homologáveis.

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

A Agenda deve ser descrita hoje como **operacional em leitura**, e não como operacional completa.

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
