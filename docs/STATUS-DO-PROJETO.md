# Status do Projeto — BeautyFlow AI

**Data de referência:** 01/09/2026  
**Checkpoint técnico de referência:** `3b45ea6` — `feat: integrate professionals and settings through APP-WF019`

## Resumo executivo

O BeautyFlow possui dois blocos principais em evolução coordenada:

1. **núcleo operacional n8n**, com WF001–WF018 versionados e documentados;
2. **BeautyFlow App**, com frontend Next.js, backend NestJS, contratos compartilhados, autenticação via Supabase e integração read-only com dados operacionais reais por meio do `APP-WF019`.

O `APP-WF019` deixou de ser apenas planejado. A primeira camada read-only está **implementada e homologada em ambiente real** com 5 operações:

- `clientes.listar`;
- `servicos.listar`;
- `profissionais.listar`;
- `empresa.obter`;
- `disponibilidades.listar`.

Clientes, Serviços, Profissionais e Configurações já foram validados no BeautyFlow App com dados reais da homologação. Agenda, Financeiro, Comunicação e IA continuam sem integração operacional completa com o gateway e permanecem bloqueados por decisões de domínio e/ou composição de fontes.

## Estado por área

| Área | Estado atual |
|---|---|
| WF001–WF018 | Versionados; documentação técnica existente; não alterados pelo checkpoint APP-WF019 |
| MVP n8n | Implementado com validações e gaps conhecidos por cenário |
| QA n8n | CT001–CT018, evidências e matriz em `tests/` |
| Frontend | App/MVP implementado; módulos principais disponíveis |
| Backend | NestJS estruturado com módulos de domínio e autenticação/autorização |
| shared-types | Implementado |
| Supabase/Auth | Implementado no App |
| APP-WF019 | **Implementado; camada read-only com 5 operações homologadas** |
| Clientes | **Dados reais via APP-WF019; homologado E2E** |
| Serviços | **Dados reais via APP-WF019; homologado E2E** |
| Profissionais | **Dados reais via APP-WF019; homologado E2E** |
| Configurações | **Dados reais via `empresa.obter` + `disponibilidades.listar`; homologado E2E** |
| Dashboard | Implementado/estruturado; parte dos indicadores depende de módulos ainda mockados |
| Agenda | Implementada/estruturada; integração real bloqueada por decisão do modelo de status |
| Financeiro | Implementado/estruturado; integração real bloqueada pela composição AGENDAMENTOS + PAGAMENTOS |
| Comunicação | Implementada/estruturada; integração real bloqueada pela composição/correlação entre fontes |
| Relatórios | Implementado/estruturado; depende da maturidade das fontes integradas |
| IA | Implementada/estruturada; integração real bloqueada por lacunas da fonte, incluindo `IA_MEMORIA` sem writer conhecido |
| EMP-WF021 | Planejado |
| Dados operacionais WF001–WF018 | Google Sheets |
| Identidade/autenticação do App | Supabase |
| Integração App ↔ n8n | **Parcial e operacional em read-only para 5 operações** |
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
  └── APP-WF019 (integração operacional read-only)
        ↓
      n8n
        ↓
      Google Sheets
```

O frontend **não acessa o n8n diretamente**. O NestJS continua sendo a fronteira de autenticação, autorização, contexto de empresa, regras de negócio e integração.

O `APP-WF019` deve ser tratado como **gateway/adaptador de integração**, e não como substituto do backend NestJS.

## APP-WF019 — estado homologado

O workflow versionado `n8n/workflows/app/APP-WF019-gateway-app.json` possui atualmente 5 operações read-only:

| Operação | Fonte | Estado |
|---|---|---|
| `clientes.listar` | CLIENTES | ✅ Homologada |
| `servicos.listar` | SERVICOS | ✅ Homologada |
| `profissionais.listar` | PROFISSIONAIS | ✅ Homologada |
| `empresa.obter` | EMPRESAS | ✅ Homologada |
| `disponibilidades.listar` | DISPONIBILIDADES | ✅ Homologada |

O workflow versionado permanece com `active:false`. A ativação/publicação e o reapontamento das fontes no n8n Cloud são passos operacionais controlados.

### Telas validadas com dados reais

| Tela | Situação |
|---|---|
| `/clientes` | ✅ dados reais |
| `/servicos` | ✅ dados reais |
| `/profissionais` | ✅ dados reais |
| `/configuracoes` — Negócio | ✅ dados reais |
| `/configuracoes` — Agenda | ✅ timezone, janela de cancelamento e disponibilidades reais |

## Estado dos dados e fontes

O núcleo operacional n8n continua usando Google Sheets como persistência operacional.

O BeautyFlow App usa Supabase para autenticação e identidade, enquanto os módulos já integrados consultam os dados operacionais por meio do backend NestJS e do `APP-WF019`.

A troca entre mock e n8n é controlada por flags de fonte no backend:

- `DATA_SOURCE_CLIENTES=mock|n8n`;
- `DATA_SOURCE_SERVICOS=mock|n8n`;
- `DATA_SOURCE_PROFISSIONAIS=mock|n8n`;
- `DATA_SOURCE_CONFIGURACOES=mock|n8n`.

O default permanece `mock`, evitando ativação acidental de integração real em ambientes não preparados.

## Segurança e multi-tenancy

A camada read-only homologada preserva os seguintes princípios:

- `idEmpresa` é resolvido server-side a partir do usuário autenticado;
- o browser não escolhe livremente o tenant;
- os branches do APP-WF019 filtram por `ID_EMPRESA` na fonte;
- respostas não expõem `ID_EMPRESA` nem identificadores internos sensíveis desnecessários;
- credenciais e segredos reais não são versionados;
- o frontend não chama webhooks do n8n diretamente;
- erros de integração usam envelope padronizado e não fazem fallback silencioso para mock.

## Qualidade do checkpoint atual

No checkpoint `3b45ea6` foram registrados:

- **424 testes backend**;
- **20 suítes**;
- **100% verde**;
- lint backend e frontend sem erros/warnings;
- builds de `shared-types`, backend e frontend verdes;
- boot sem erro de DI;
- zero alteração em WF001–WF018;
- zero segredo real versionado.

## Pontos que permanecem como gap

### Agenda

A fonte real `AGENDAMENTOS.STATUS` trabalha atualmente com:

```text
AGENDADO
CANCELADO
```

O contrato atual do App utiliza:

```text
PENDENTE
CONFIRMADO
CONCLUIDO
CANCELADO
```

Essa diferença não deve ser resolvida por conversão arbitrária. É necessária uma decisão explícita de produto/domínio antes de implementar `agendamentos.listar`.

Também permanece como dívida a configuração/hardcode legado de Google Calendar (`BeautyFlow - Studio Bella`) nos workflows antigos de Agenda.

### Financeiro

A leitura real exige composição entre `AGENDAMENTOS` e `PAGAMENTOS`, além da resolução de nomes e regras de status. Não foi implementada no APP-WF019 nesta camada.

### Comunicação

Há múltiplas fontes (`MENSAGENS`, `LEMBRETES`, `PESQUISA`, `FOLLOWUPS`, `COBRANCAS`) sem uma chave única de correlação consolidada para o contrato do App. A integração permanece bloqueada até decisão de modelo.

### IA

`IA_MEMORIA` é lida por workflows existentes, mas não há writer conhecido entre WF001–WF018. O App não deve afirmar memória persistente nem status por tenant sem fonte confiável.

### Outros gaps preservados

- RN014: confirmar/aplicar inequivocamente o limite de um reagendamento no fluxo correspondente;
- consentimento de marketing: revisar origem/default e consistência entre cadastro e follow-up;
- VIP: definição final ainda depende de decisão de produto;
- pesquisa: WF014 envia pesquisa; captura completa da nota/comentário permanece pendente;
- WF013–WF015: execução periódica depende de orquestração externa;
- multiempresa de produção: eliminar/revisar defaults, fallbacks e configurações fixas antes da escala SaaS;
- observabilidade: ampliar telemetria, logs e tratamento operacional de falhas;
- hardening geral de produção antes de lançamento comercial.

## Performance observada

Durante a homologação foram observadas latências aproximadas de:

- `clientes.listar`: ~4,8 s;
- `servicos.listar`: ~4,9 s.

Isso não bloqueia o MVP/homologação, mas deve continuar sendo monitorado. Nenhuma otimização, cache ou Redis foi introduzido neste checkpoint.

## Homologação × JSON versionado

O JSON versionado do APP-WF019 continua apontando para a fonte de produção `BEAUTYFLOW3.1`.

Durante a homologação real, os nodes `GS -` das 5 operações foram reapontados manualmente no n8n Cloud para `BEAUTYFLOW_HOMOLOGACAO`.

Esse reapontamento é operacional e precisa ser refeito após reimportações do JSON quando o objetivo for testar novamente contra homologação.

## Próxima macrofase recomendada

A próxima etapa **não é adicionar mais uma operação ao gateway sem antes resolver o domínio da Agenda**.

Ordem recomendada:

1. auditar o uso de `PENDENTE`, `CONFIRMADO`, `CONCLUIDO`, `CANCELADO` e `AGENDADO` no App, backend, testes, mocks e workflows;
2. definir explicitamente o modelo de status do agendamento e, se aplicável, separar status do atendimento de status de confirmação;
3. atualizar contratos, mocks e regras afetadas de forma controlada;
4. somente então implementar `agendamentos.listar` no APP-WF019;
5. homologar Agenda E2E com dados reais;
6. avançar para Financeiro, Comunicação e IA conforme as decisões de domínio e disponibilidade das fontes.

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

O BeautyFlow App como um todo ainda não deve ser apresentado como totalmente operacional enquanto módulos centrais dependerem de mocks ou decisões de domínio pendentes.

## Governança documental

A documentação deve refletir o estado atual do código. Mudanças relevantes no App, workflows, contratos ou arquitetura devem atualizar, quando aplicável:

- `README.md`;
- `docs/STATUS-DO-PROJETO.md`;
- documentação de arquitetura;
- README do workspace afetado;
- testes/matriz de rastreabilidade;
- documentação específica do workflow ou módulo.

### Regra de checkpoint

Para as próximas fases, o fluxo recomendado é:

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
