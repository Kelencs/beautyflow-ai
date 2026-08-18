# n8n — BeautyFlow

> **Projeto:** BeautyFlow  
> **Plataforma:** n8n Cloud  
> **Workflows versionados:** WF001–WF018  
> **Sincronização desta documentação:** 18/08/2026  
> **Fonte da verdade:** arquivos JSON em `n8n/workflows/` no branch `main`.

## 1. Visão geral

A pasta `n8n/` reúne a camada de automação do BeautyFlow. Os workflows atuais cobrem entrada e atendimento via WhatsApp, interpretação por IA, agenda, cadastro de clientes, financeiro, comunicação automatizada e rotinas administrativas.

Esta documentação descreve **o comportamento efetivamente presente nos JSONs versionados**. Quando houver divergência entre um README e um workflow, o JSON do workflow é a referência de implementação e a documentação deve ser atualizada na mesma mudança.

## 2. Estrutura da pasta

```text
n8n/
├── backups/
├── credentials/
├── documentacao/
│   ├── atendimento/
│   ├── agenda/
│   ├── clientes/
│   ├── financeiro/
│   ├── comunicacao/
│   └── administracao/
├── templates/
├── workflows/
│   ├── atendimento/
│   ├── agenda/
│   ├── clientes/
│   ├── financeiro/
│   ├── comunicacao/
│   └── administracao/
└── README.md
```

## 3. Catálogo dos workflows

| ID | Módulo | Workflow | Arquivo | `active` no JSON |
|---|---|---|---|---|
| WF001 | Atendimento | Receber WhatsApp | `ATD-WF001-receber-whatsapp.json` | `true` |
| WF002 | Atendimento | IA Atendimento | `ATD-WF002-ia-atendimento.json` | `true` |
| WF003 | Atendimento | Identificar Intenção | `ATD-WF003-identificar-intencao.json` | `true` |
| WF004 | Agenda | Consultar Disponibilidade | `AGE-WF004-consultar-disponibilidade.json` | `true` |
| WF005 | Agenda | Criar Agendamento | `AGE-WF005-criar-agendamento.json` | `true` |
| WF006 | Agenda | Reagendar | `AGE-WF006-reagendar.json` | `true` |
| WF007 | Agenda | Cancelar | `AGE-WF007-cancelar.json` | `true` |
| WF008 | Clientes | Cadastrar Cliente | `CLI-WF008-cadastrar-cliente.json` | `false` |
| WF009 | Clientes | Atualizar Cliente | `CLI-WF009-atualizar-cliente.json` | `true` |
| WF010 | Financeiro | Registrar Pagamento | `FIN-WF010-registrar-pagamento.json` | `false` |
| WF011 | Financeiro | Cobrança | `FIN-WF011-cobranca.json` | `false` |
| WF012 | Comunicação | Confirmação / envio WhatsApp | `COM-WF012-confirmacao.json` | `true` |
| WF013 | Comunicação | Lembrete | `COM-WF013-lembrete.json` | `false` |
| WF014 | Comunicação | Pesquisa | `COM-WF014-pesquisa.json` | `false` |
| WF015 | Comunicação | Follow-up | `COM-WF015-follow-up.json` | `false` |
| WF016 | Administração | Backup | `ADM-WF016-backup.json` | `false` |
| WF017 | Administração | Logs | `ADM-WF017-logs.json` | `true` |
| WF018 | Administração | Limpeza | `ADM-WF018-limpeza.json` | `false` |

> O campo `active` acima reproduz o valor exportado no JSON do Git. Ele não deve ser usado sozinho como evidência do estado atual do workflow no n8n Cloud nem como evidência de teste.

## 4. Arquitetura funcional atual

### 4.1 Entrada e atendimento

```text
WhatsApp Cloud API
       │
       ▼
WF001 — Webhook / normalização
       │
       ▼
WF002 — cliente + contexto + Gemini
       │
       ├──► WF008 — cadastra cliente quando necessário
       │
       ▼
WF003 — roteamento de intenção
       ├──► WF005 — AGENDAR
       ├──► WF004 — CONSULTAR_DISPONIBILIDADE
       ├──► WF006 — REAGENDAR
       ├──► WF007 — CANCELAR
       └──► WF012 — resposta conversacional/fallback
```

### 4.2 Dependências entre subworkflows

```text
WF004 ───────────────────────────────► WF017
WF005 ──► WF004 ──► WF012 ──────────► WF017
WF006 ──► WF004 ──► WF012 ──────────► WF017
WF007 ─────────────► WF012 ──────────► WF017
WF008 ───────────────────────────────► WF017
WF009 ───────────────────────────────► WF017
WF010 ───────────────────────────────► WF017
WF011 ─────────────► WF012 ──────────► WF017
WF012 ───────────────────────────────► WF017
WF013 ─────────────► WF012 ──────────► WF017
WF014 ─────────────► WF012 ──────────► WF017
WF015 ─────────────► WF012 ──────────► WF017
WF016 ───────────────────────────────► WF017
WF018 ───────────────────────────────► WF017
```

WF001, WF002 e WF003 **não chamam o WF017 diretamente nos JSONs atuais**.

## 5. Módulos

### Atendimento — WF001 a WF003

Responsável pela entrada via WhatsApp, normalização do payload, identificação/cadastro do cliente, consulta de contexto, interpretação via Gemini e roteamento da intenção.

Documentação do módulo: [`workflows/atendimento/README.md`](workflows/atendimento/README.md)

### Agenda — WF004 a WF007

Responsável por disponibilidade, criação, reagendamento e cancelamento, utilizando Google Sheets e Google Calendar conforme o comportamento implementado em cada workflow.

Documentação do módulo: [`workflows/agenda/README.md`](workflows/agenda/README.md)

### Clientes — WF008 e WF009

Responsável por cadastro com prevenção de duplicidade e atualização parcial do cadastro.

Documentação do módulo: [`workflows/clientes/README.md`](workflows/clientes/README.md)

### Financeiro — WF010 e WF011

Responsável por registro transacional de pagamentos e cobrança automática de saldos pendentes.

Documentação do módulo: [`workflows/financeiro/README.md`](workflows/financeiro/README.md)

### Comunicação — WF012 a WF015

Centraliza envio WhatsApp e automatiza lembretes, pesquisas pós-atendimento e follow-ups.

Documentação do módulo: [`workflows/comunicacao/README.md`](workflows/comunicacao/README.md)

### Administração — WF016 a WF018

Responsável por backup, persistência central de logs e política de retenção dos logs.

Documentação do módulo: [`workflows/administracao/README.md`](workflows/administracao/README.md)

## 6. Integrações atuais

### WhatsApp Cloud API / Meta

- **WF001:** recebe os webhooks GET/POST da Meta.
- **WF012:** realiza o envio centralizado de mensagens de texto pela API do WhatsApp.
- **WF005, WF006, WF007, WF011, WF013, WF014 e WF015:** utilizam WhatsApp **indiretamente**, delegando o envio ao WF012.

### Google Gemini

- **WF002:** interpreta a mensagem e produz intenção, confiança, entidades e resposta ao cliente.

### Google Calendar

Usado diretamente pelos workflows de Agenda:

- WF004
- WF005
- WF006
- WF007

Nos JSONs atuais, o calendário está configurado diretamente nos workflows correspondentes; a documentação deve registrar esse fato sem assumir resolução dinâmica multiempresa que ainda não esteja implementada.

### Google Sheets

Uso direto nos JSONs atuais:

- WF002
- WF004
- WF005
- WF006
- WF007
- WF008
- WF009
- WF010
- WF011
- WF012
- WF013
- WF014
- WF015
- WF017
- WF018

WF001, WF003 e WF016 não usam node Google Sheets diretamente; o WF016 opera o backup por Google Drive.

### Google Drive

- **WF016:** copia integralmente a planilha principal para o Google Drive e aplica retenção dos backups antigos.

## 7. Dados operacionais utilizados

A automação atual trabalha, conforme cada workflow, com as abas da planilha BeautyFlow, incluindo:

- `AGENDAMENTOS`
- `CLIENTES`
- `COBRANCAS`
- `DISPONIBILIDADES`
- `EMPRESAS`
- `FOLLOWUPS`
- `IA_MEMORIA`
- `LEMBRETES`
- `LOGS`
- `MENSAGENS`
- `PAGAMENTOS`
- `PESQUISAS`
- `PROFISSIONAIS`
- `SERVICOS`

O filtro por `ID_EMPRESA`, quando presente, deve ser preservado. Alguns JSONs atuais ainda possuem `EMP001` fixo ou como fallback; isso deve ser tratado como **comportamento implementado atual**, não como uma garantia de isolamento multiempresa completo.

## 8. Convenção de nomenclatura

### Workflows

```text
<MODULO>-WF<NUMERO>-<DESCRICAO>
```

Prefixos:

| Prefixo | Módulo |
|---|---|
| `ATD` | Atendimento |
| `AGE` | Agenda |
| `CLI` | Clientes |
| `FIN` | Financeiro |
| `COM` | Comunicação |
| `ADM` | Administração |

### Nodes

Os JSONs atuais utilizam principalmente prefixos funcionais:

- `TRG` — trigger
- `SET` — preparação/normalização de dados
- `CODE` — regra/processamento
- `IF` / `SWITCH` — decisão
- `GS` — Google Sheets
- `GC` — Google Calendar
- `HTTP` — chamada HTTP
- `EXEC` — Execute Workflow
- `MERGE` — convergência quando aplicável
- `RESP` — resposta de webhook
- `DRIVE` — Google Drive

Novos nodes devem usar nomes descritivos. Nomes genéricos já existentes em workflows antigos não devem ser usados como modelo para novos fluxos.

## 9. Padrões implementados

Os workflows mais recentes seguem, quando aplicável, o padrão:

```text
Trigger
  ↓
Normalização / validação
  ↓
Busca de dados
  ↓
Avaliação de erro técnico x resultado de negócio
  ↓
Processamento / persistência
  ↓
Comunicação
  ↓
Log
  ↓
Saída
```

Princípios importantes observados nos JSONs atuais:

- diferenciar retorno vazio legítimo de erro técnico;
- filtrar dados por empresa quando o contrato exigir `id_empresa`;
- preservar correlação quando houver múltiplos itens;
- evitar que a saída do WF017 substitua a saída funcional do workflow chamador;
- manter histórico transacional de pagamentos;
- aplicar idempotência em lembretes, pesquisas, cobranças e follow-ups conforme a implementação de cada fluxo;
- centralizar envio WhatsApp no WF012 e logs no WF017 quando esses subworkflows são utilizados.

## 10. Comportamentos atuais que precisam ser conhecidos

Esta seção registra fatos do código atual para evitar que a documentação descreva uma arquitetura ainda não implementada.

- WF001 atribui `id_empresa: 'EMP001'` ao payload normalizado do WhatsApp.
- WF002 e outros workflows mantêm fallbacks para `EMP001` em determinados pontos.
- WF001 responde ao `hub.challenge` no GET; o JSON atual não apresenta uma condição de comparação do `hub.verify_token` antes da resposta.
- WF004–WF007 utilizam configuração de Google Calendar presente diretamente nos JSONs atuais.
- WF006 contém o node de atualização do evento do Calendar com o comportamento exatamente definido no JSON exportado; não se deve documentar campos adicionais que não estejam configurados.
- WF013, WF014 e WF015 não possuem Schedule/Cron no JSON atual e dependem de acionamento externo periódico.
- WF016 possui Schedule de 02:00, mas está exportado com `active:false`.
- WF018 possui Schedule de 03:00, mas está exportado com `active:false`.
- WF018 pode excluir registros de `LOGS` expirados conforme a política de retenção; portanto a regra correta não é “nunca excluir logs”, e sim “excluir apenas pela política implementada”.

## 11. Backup e retenção

Há dois conceitos diferentes:

1. `n8n/backups/` — área versionada do repositório para artefatos de backup mantidos no Git, quando aplicável.
2. **WF016** — rotina operacional que copia a planilha BeautyFlow integralmente no Google Drive e remove backups com mais de 30 dias conforme o JSON atual.

Logs possuem política própria:

- **WF018:** remove da aba `LOGS` registros com mais de 90 dias conforme os critérios implementados.

## 12. Documentação técnica individual

Cada workflow possui documentação em `n8n/documentacao/<modulo>/`.

A documentação individual deve registrar:

- objetivo;
- gatilho;
- entradas;
- fluxo real;
- regras implementadas;
- integrações e dependências;
- saídas e estados;
- tratamento de erros;
- observações específicas do JSON.

## 13. Processo de alteração

Ao alterar um workflow:

1. alterar e testar o workflow no ambiente apropriado;
2. exportar o JSON atualizado;
3. substituir o JSON correspondente em `n8n/workflows/`;
4. atualizar a documentação individual do workflow;
5. atualizar o README do módulo se dependências ou responsabilidades mudarem;
6. atualizar este README se a arquitetura global mudar;
7. atualizar evidências de teste e rastreabilidade quando aplicável;
8. revisar se credenciais ou segredos foram incluídos indevidamente;
9. realizar commit/PR conforme o processo do repositório.

## 14. Checklist de sincronização JSON ↔ documentação

Antes de considerar uma alteração documentada:

- [ ] Nome e arquivo do workflow conferem com o JSON.
- [ ] Gatilho documentado existe no JSON.
- [ ] Entradas documentadas existem no contrato atual.
- [ ] Dependências `Execute Workflow` estão corretas.
- [ ] Integrações Google/Meta/Gemini refletem nodes realmente existentes.
- [ ] Abas do Google Sheets citadas são realmente utilizadas.
- [ ] Regras de negócio descritas aparecem no código/nodes atuais.
- [ ] Status/saídas documentados correspondem ao fluxo.
- [ ] Tratamento de erro documentado corresponde aos ramos atuais.
- [ ] `active` é apresentado apenas como estado do JSON exportado.
- [ ] Evidência de teste não é inferida somente do conteúdo do JSON.

## 15. Compatibilidade atual

- n8n Cloud
- WhatsApp Cloud API / Meta
- Google Gemini
- Google Sheets
- Google Calendar
- Google Drive
- GitHub

---

BeautyFlow © 2026
