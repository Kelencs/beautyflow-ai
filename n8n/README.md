# n8n — BeautyFlow AI

> **Versão:** 3.0  
> **Sincronização:** 18/08/2026  
> **Plataforma:** n8n Cloud  
> **Workflows versionados:** WF001–WF018  
> **Fonte de verdade da implementação:** JSONs em `n8n/workflows/`

## 1. Objetivo

A pasta `n8n/` contém a camada de automação operacional do BeautyFlow AI.

Os workflows atuais executam:

- entrada e atendimento via WhatsApp;
- interpretação por Google Gemini;
- consulta/criação/reagendamento/cancelamento de agenda;
- cadastro e atualização de clientes;
- registro de pagamentos e cobrança;
- envio de mensagens, lembretes, pesquisas e follow-ups;
- backup, logging e retenção de logs.

Quando houver divergência entre documentação e JSON, **o JSON versionado representa o comportamento implementado atual**. A documentação deve ser corrigida na mesma alteração.

A intenção do produto continua sendo definida pelos RF/RNF/RN/UC/US em `docs/`.

---

## 2. Estrutura

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

### Fontes relacionadas

- documentação técnica consolidada: `n8n/documentacao/README.md`;
- documentação individual: `n8n/documentacao/<modulo>/`;
- testes: `tests/`;
- requisitos e arquitetura: `docs/`.

---

## 3. Catálogo dos workflows

| ID | Módulo | Função | Arquivo |
|---|---|---|---|
| WF001 | Atendimento | Receber WhatsApp | `ATD-WF001-receber-whatsapp.json` |
| WF002 | Atendimento | IA Atendimento | `ATD-WF002-ia-atendimento.json` |
| WF003 | Atendimento | Identificar Intenção | `ATD-WF003-identificar-intencao.json` |
| WF004 | Agenda | Consultar Disponibilidade | `AGE-WF004-consultar-disponibilidade.json` |
| WF005 | Agenda | Criar Agendamento | `AGE-WF005-criar-agendamento.json` |
| WF006 | Agenda | Reagendar | `AGE-WF006-reagendar.json` |
| WF007 | Agenda | Cancelar | `AGE-WF007-cancelar.json` |
| WF008 | Clientes | Cadastrar Cliente | `CLI-WF008-cadastrar-cliente.json` |
| WF009 | Clientes | Atualizar Cliente | `CLI-WF009-atualizar-cliente.json` |
| WF010 | Financeiro | Registrar Pagamento | `FIN-WF010-registrar-pagamento.json` |
| WF011 | Financeiro | Cobrança | `FIN-WF011-cobranca.json` |
| WF012 | Comunicação | Envio centralizado WhatsApp | `COM-WF012-confirmacao.json` |
| WF013 | Comunicação | Lembrete | `COM-WF013-lembrete.json` |
| WF014 | Comunicação | Pesquisa | `COM-WF014-pesquisa.json` |
| WF015 | Comunicação | Follow-up | `COM-WF015-follow-up.json` |
| WF016 | Administração | Backup | `ADM-WF016-backup.json` |
| WF017 | Administração | Logs | `ADM-WF017-logs.json` |
| WF018 | Administração | Limpeza de LOGS | `ADM-WF018-limpeza.json` |

> O campo `active` exportado nos JSONs não deve ser tratado como evidência suficiente do estado atual no n8n Cloud.

---

## 4. Arquitetura funcional atual

### 4.1 Entrada e atendimento

```text
WhatsApp Cloud API
       │
       ▼
WF001 — webhook / normalização
       │
       ▼
WF002 — cliente + contexto + Gemini
       │
       ├──► WF008 — cadastro quando necessário
       │
       ▼
WF003 — roteamento
       ├──► WF005 — AGENDAR
       ├──► WF004 — CONSULTAR_DISPONIBILIDADE
       ├──► WF006 — REAGENDAR
       ├──► WF007 — CANCELAR
       └──► WF012 — fallback/resposta conversacional
```

WF003 **não chama** Clientes, Financeiro, Administração ou todos os workflows genericamente. O roteamento acima corresponde ao desenho atual.

### 4.2 Dependências de subworkflow

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

**WF001, WF002 e WF003 não chamam WF017 diretamente nos JSONs atuais.**

---

## 5. Módulos

### Atendimento — WF001–WF003

Entrada WhatsApp, normalização, identificação/cadastro de cliente, contexto, Gemini e roteamento.

Ver: `workflows/atendimento/README.md`.

### Agenda — WF004–WF007

Disponibilidade, criação, reagendamento e cancelamento com Google Calendar e dados operacionais.

Ver: `workflows/agenda/README.md`.

### Clientes — WF008–WF009

Cadastro com prevenção de duplicidade e atualização parcial.

Ver: `workflows/clientes/README.md`.

### Financeiro — WF010–WF011

Pagamentos transacionais e cobrança de saldo pendente.

Ver: `workflows/financeiro/README.md`.

### Comunicação — WF012–WF015

Envio centralizado no WhatsApp, lembrete, pesquisa e follow-up.

Ver: `workflows/comunicacao/README.md`.

### Administração — WF016–WF018

Backup, logging e retenção controlada.

Ver: `workflows/administracao/README.md`.

---

## 6. Integrações atuais

| Integração | Uso direto |
|---|---|
| WhatsApp Cloud API / Meta | WF001, WF012 |
| Google Gemini | WF002 |
| Google Calendar | WF004, WF005, WF006, WF007 |
| Google Sheets | WF002, WF004–WF015, WF017, WF018 |
| Google Drive | WF016 |

WF005, WF006, WF007, WF011, WF013, WF014 e WF015 usam WhatsApp **indiretamente**, por meio do WF012.

WF001, WF003 e WF016 não usam node Google Sheets diretamente.

---

## 7. Dados operacionais

A automação utiliza, conforme cada fluxo:

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

### Multiempresa

`ID_EMPRESA` deve ser preservado nos contratos e filtros aplicáveis.

Entretanto, alguns JSONs atuais ainda possuem `EMP001` fixo ou como fallback. Isso é **comportamento legado conhecido**, não garantia de isolamento SaaS completo.

Não adicionar novos fallbacks silenciosos de tenant.

---

## 8. Comportamentos atuais importantes

Estes fatos devem permanecer documentados até o código mudar:

- WF001 normaliza o payload com `id_empresa: 'EMP001'`.
- WF001 responde ao `hub.challenge`; o JSON atual não contém comparação explícita de `hub.verify_token` antes da resposta.
- WF002 e outros fluxos ainda possuem fallbacks para `EMP001`.
- WF004–WF007 possuem configuração do Google Calendar diretamente nos JSONs atuais.
- WF013, WF014 e WF015 não possuem Schedule/Cron interno; dependem de acionamento externo.
- WF016 possui Schedule de 02:00 no JSON e realiza backup via Google Drive.
- WF018 possui Schedule de 03:00 e aplica retenção da aba `LOGS`.
- O `active` do JSON não é evidência de execução real no Cloud.

Esses itens são gaps/configurações atuais e **não devem ser ocultados na documentação**.

---

## 9. Padrões de implementação

Quando aplicável:

```text
Trigger
  ↓
Normalização / validação
  ↓
Busca de dados
  ↓
Erro técnico x resultado de negócio
  ↓
Processamento / persistência
  ↓
Comunicação
  ↓
Log
  ↓
Saída
```

Princípios:

- diferenciar zero itens legítimo de erro técnico;
- preservar correlação com múltiplos itens;
- manter `ID_EMPRESA` nos fluxos tenant-scoped;
- não deixar WF017 substituir a saída funcional do chamador;
- pagamentos são históricos/transacionais;
- aplicar idempotência em cobrança, lembrete, pesquisa e follow-up;
- centralizar envio WhatsApp no WF012 quando o fluxo precisar enviar texto;
- usar WF017 apenas nos fluxos que efetivamente o chamam.

---

## 10. Nomenclatura

### Workflows

```text
<MODULO>-WF<NUMERO>-<DESCRICAO>
```

| Prefixo | Módulo |
|---|---|
| `ATD` | Atendimento |
| `AGE` | Agenda |
| `CLI` | Clientes |
| `FIN` | Financeiro |
| `COM` | Comunicação |
| `ADM` | Administração |

### Nodes

Prefixos atuais:

- `TRG`
- `SET`
- `CODE`
- `IF`
- `SWITCH`
- `GS`
- `GC`
- `HTTP`
- `EXEC`
- `MERGE`
- `RESP`
- `DRIVE`

Novos nodes devem receber nomes descritivos. Nomes genéricos legados não devem ser copiados como padrão.

---

## 11. Credenciais e segredos

Nunca versionar:

- tokens Meta;
- API keys;
- senhas;
- client secrets;
- private keys;
- JWTs;
- Supabase Secret Key futura.

Utilizar credenciais do n8n e mecanismos server-side apropriados.

Valores operacionais não devem ser classificados automaticamente como "credencial". Parâmetros de negócio/configuração devem ter fonte adequada e rastreável.

---

## 12. Backup e retenção

Dois conceitos são diferentes:

1. `n8n/backups/`: artefatos versionados quando aplicável.
2. WF016: rotina operacional que copia a planilha principal para Google Drive e remove backups elegíveis com mais de 30 dias.

Logs:

- WF018 pode remover da aba `LOGS` registros elegíveis com mais de 90 dias.

Portanto, a regra correta **não é** "nunca excluir logs/backups".

A regra correta é:

> excluir somente pelas políticas de retenção implementadas e validadas.

---

## 13. Processo de alteração

Ao alterar um workflow:

1. identificar chamadores e dependentes;
2. revisar JSON e documentação individual;
3. validar dados/integrações afetados;
4. alterar e testar no ambiente apropriado;
5. exportar o JSON;
6. substituir o arquivo em `n8n/workflows/`;
7. atualizar `n8n/documentacao/<modulo>/`;
8. atualizar README do módulo se necessário;
9. atualizar `n8n/README.md` se a arquitetura global mudar;
10. atualizar RF/RN/UC/US se houver mudança funcional;
11. atualizar CT/evidência/matriz em `tests/`;
12. revisar segredos;
13. commit/PR.

---

## 14. Checklist JSON ↔ documentação

- [ ] Nome do workflow confere.
- [ ] Trigger descrito existe.
- [ ] Entradas correspondem ao contrato.
- [ ] Dependências `Execute Workflow` estão corretas.
- [ ] Integrações citadas existem.
- [ ] Abas Sheets citadas existem no fluxo.
- [ ] Regras descritas aparecem no código.
- [ ] Saídas/status correspondem.
- [ ] Tratamento de erro corresponde.
- [ ] `active` é tratado apenas como valor exportado.
- [ ] Evidência de teste não é inferida do JSON.
- [ ] Gaps conhecidos não foram escondidos.

---

## 15. Compatibilidade atual

- n8n Cloud
- WhatsApp Cloud API / Meta
- Google Gemini
- Google Sheets
- Google Calendar
- Google Drive
- GitHub

Para a arquitetura do BeautyFlow App, consultar `docs/09-arquitetura/`.

---

BeautyFlow AI © 2026
