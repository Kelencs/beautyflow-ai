# Status do Projeto — BeautyFlow AI

**Data de referência:** 27/08/2026

## Resumo executivo

O BeautyFlow possui dois blocos principais em evolução paralela:

1. **núcleo operacional n8n**, com WF001–WF018 versionados e documentados;
2. **BeautyFlow App**, com frontend Next.js, backend NestJS, contratos compartilhados e autenticação/base via Supabase.

O App já ultrapassou a antiga classificação de “Fase 0A / scaffold”. Os principais módulos de domínio estão estruturados no backend e disponíveis no frontend. A principal pendência arquitetural é a integração operacional entre o backend e os workflows n8n por meio do `APP-WF019`, seguida da substituição progressiva dos dados mockados por dados reais.

## Estado por área

| Área | Estado |
|---|---|
| WF001–WF018 | Versionados; documentação técnica existente |
| MVP n8n | Implementado com validações e gaps conhecidos por cenário |
| QA n8n | CT001–CT018, evidências e matriz em `tests/` |
| Frontend | Implementado em nível de App/MVP visual com módulos operacionais |
| Backend | NestJS estruturado com módulos de domínio |
| shared-types | Implementado |
| Supabase/Auth | Implementado no App |
| Dashboard | Implementado/estruturado |
| Agenda | Implementada/estruturada; integração operacional real pendente |
| Clientes | Implementado/estruturado |
| Serviços | Implementado/estruturado |
| Profissionais | Implementado/estruturado |
| Financeiro | Implementado/estruturado |
| Comunicação | Implementado/estruturado |
| Relatórios | Implementado/estruturado |
| IA | Implementado/estruturado |
| Configurações | Implementado/estruturado |
| APP-WF019 | Planejado; próxima integração principal |
| EMP-WF021 | Planejado |
| Dados operacionais WF001–WF018 | Google Sheets |
| Identidade/autenticação do App | Supabase |
| Integração completa App ↔ n8n | Pendente |
| Substituição de mocks do App | Pendente, progressiva |
| Migração operacional completa para Postgres | Futuro; não é pré-requisito imediato |

## Arquitetura atual

### Núcleo n8n

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
Next.js
  ↓
NestJS
  ↓
Supabase
```

### Próxima integração

```text
Next.js
  ↓
NestJS
  ↓
APP-WF019
  ↓
WFs n8n
```

O frontend não deve acessar o n8n diretamente.

## Módulos atuais do App

### Backend

- Auth
- Agenda
- Clientes
- Serviços
- Profissionais
- Dashboard
- Financeiro
- Comunicação
- Relatórios
- Configurações
- IA

### Frontend

- Dashboard
- Agenda
- Clientes
- Serviços
- Profissionais
- Financeiro
- Comunicação
- Relatórios
- IA
- Configurações

## Estado dos dados

O núcleo n8n continua usando Google Sheets como persistência operacional.

O BeautyFlow App possui Supabase para autenticação/base de identidade, porém a integração operacional com os workflows ainda não está concluída.

Enquanto o `APP-WF019` não for implementado, módulos do App podem utilizar dados de demonstração/mock para validação da experiência, contratos e arquitetura.

## Pontos que permanecem como gap

- RN014: confirmar/aplicar inequivocamente o limite de um reagendamento no fluxo correspondente.
- Consentimento de marketing: revisar origem/default e consistência entre cadastro e follow-up.
- VIP: definição final ainda depende de decisão de produto.
- Pesquisa: WF014 envia pesquisa; captura completa da nota/comentário permanece pendente.
- WF013–WF015: execução periódica depende de orquestração externa.
- Multiempresa de produção: eliminar/revisar defaults, fallbacks e configurações fixas antes da escala SaaS.
- APP-WF019: ainda não implementado.
- Dados mockados: substituir progressivamente por dados operacionais reais.
- Integração: criar testes de integração App ↔ gateway ↔ n8n.
- Segurança: realizar hardening antes de produção comercial.
- Observabilidade: ampliar telemetria, logs e tratamento operacional de falhas.

## Próxima macrofase recomendada

1. manter README, STATUS e READMEs dos workspaces sincronizados;
2. implementar `APP-WF019`;
3. conectar primeiro a Agenda como fluxo vertical de referência;
4. validar autenticação, isolamento multiempresa, erros, timeout e auditoria de ponta a ponta;
5. substituir mocks módulo a módulo;
6. implementar onboarding/`EMP-WF021`;
7. ampliar testes automatizados e regressão;
8. adicionar CI/CD, hardening e observabilidade;
9. preparar ambiente de demonstração;
10. preparar produção somente após validação operacional.

## Critério para declarar o App operacional

O BeautyFlow App não deve ser apresentado como totalmente operacional enquanto as telas principais dependerem de mocks.

Um módulo pode ser classificado como operacional quando:

- consulta/escrita usa a fonte real;
- autenticação e autorização estão ativas;
- isolamento multiempresa foi validado;
- regras de negócio são preservadas;
- erros e indisponibilidade são tratados;
- existem testes/evidências mínimas;
- a documentação foi atualizada.

## Observação de governança

A documentação deve refletir o estado atual do código. Mudanças relevantes no App, workflows, contratos ou arquitetura devem atualizar, quando aplicável:

- `README.md`;
- `docs/STATUS-DO-PROJETO.md`;
- documentação de arquitetura;
- README do workspace afetado;
- testes/matriz de rastreabilidade;
- documentação específica do workflow ou módulo.

