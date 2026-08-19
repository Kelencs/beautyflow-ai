# CLAUDE.md — BeautyFlow AI Development Guide

> **Versão:** 3.0  
> **Sincronização:** 19/08/2026  
> **Escopo:** repositório `beautyflow-ai`

## 1. Papel deste arquivo

Este arquivo orienta agentes de desenvolvimento que trabalham no BeautyFlow.

Ele não substitui os artefatos oficiais do projeto.

### Fontes oficiais

| Tema | Fonte |
|---|---|
| Comportamento atual dos workflows | `n8n/workflows/**/*.json` |
| Documentação técnica n8n | `n8n/documentacao/` |
| Visão/RF/RNF/RN/UC/US | `docs/` |
| Arquitetura oficial | `docs/09-arquitetura/` |
| Modelo de dados | `docs/10-modelo-de-dados/` |
| QA/evidências | `tests/` |
| Status técnico | `docs/STATUS-DO-PROJETO.md` |

## 2. Regra fundamental

**Código executável representa o comportamento atual.  
Requisitos representam a intenção do produto.**

Se houver divergência, não alterar silenciosamente o requisito para fazê-lo coincidir com o código. Classificar como gap e propor a correção apropriada.

---

# 3. Estado atual

## Núcleo operacional

WF001–WF018 estão versionados.

Stack atual:

- n8n Cloud;
- WhatsApp Cloud API / Meta;
- Google Gemini;
- Google Sheets;
- Google Calendar;
- Google Drive;
- GitHub.

## BeautyFlow App

### Implementado — Fase 0A

- Next.js scaffold;
- NestJS scaffold;
- `libs/shared-types`;
- estrutura de monorepo/workspaces.

### Planejado

- Supabase Auth/Postgres;
- `usuarios`;
- `auditoria_app`;
- `convites`;
- `onboarding_empresas`;
- RolesGuard;
- APP-WF019;
- EMP-WF021;
- módulos e telas operacionais.

Não documentar componentes planejados como se já estivessem implementados.

---

# 4. Estratégia de dados

## Atual

Google Sheets é a persistência operacional dos WF001–WF018.

Abas:

- AGENDAMENTOS
- CLIENTES
- COBRANCAS
- DISPONIBILIDADES
- EMPRESAS
- FOLLOWUPS
- IA_MEMORIA
- LEMBRETES
- LOGS
- MENSAGENS
- PAGAMENTOS
- PESQUISAS
- PROFISSIONAIS
- SERVICOS

## App planejado

Supabase/Postgres será usado inicialmente para dados da camada App e identidade.

## Futuro

Migração operacional completa para PostgreSQL é futura.

Não executar scripts aspiracionais como se fossem migrations aprovadas.

---

# 5. Arquitetura dos workflows

```text
WhatsApp
  ↓
WF001
  ↓
WF002
  ├── WF008 quando necessário
  ↓
WF003
  ├── WF005 — AGENDAR
  ├── WF004 — CONSULTAR_DISPONIBILIDADE
  ├── WF006 — REAGENDAR
  ├── WF007 — CANCELAR
  └── WF012 — OUTRO/fallback
```

Dependências atuais:

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

WF001, WF002 e WF003 não chamam WF017 diretamente.

---

# 6. Gaps conhecidos que não devem ser apagados

Até que código/testes mudem:

1. WF001 usa `id_empresa: 'EMP001'`.
2. WF001 responde ao challenge sem comparação explícita do verify token no JSON atual.
3. Alguns fluxos usam fallback `EMP001`.
4. WF004–WF007 possuem Calendar configurado diretamente.
5. RN014 continua gap no WF006.
6. WF008 possui gap semântico de primeiro/último atendimento.
7. origem/default de `ACEITA_MARKETING` precisa de revisão.
8. WF013–WF015 não possuem Schedule/Cron interno.
9. WF014 envia pesquisa, mas não processa nota/comentário.
10. WF016/WF018 implementam retenção; não existe regra de “nunca excluir”.
11. `active` no JSON não comprova estado atual no Cloud.
12. hardening multiempresa ainda é necessário.

Não “resolver” esses pontos mudando apenas a documentação.

---

# 7. Regras ao alterar workflows

Antes:

1. identificar chamadores;
2. identificar dependências;
3. ler JSON;
4. ler doc individual;
5. revisar RN/RF/UC/US;
6. revisar CT/evidência;
7. verificar integrações;
8. verificar multi-item/pairedItem.

Depois:

1. testar caminho normal;
2. testar bloqueios;
3. testar erro técnico;
4. executar regressão;
5. exportar JSON;
6. atualizar documentação;
7. atualizar CT/evidência/matriz;
8. revisar segredos;
9. commit/PR.

---

# 8. Regras n8n

## Erro técnico x vazio legítimo

Nunca tratar falha externa como “não encontrado” apenas porque o retorno está vazio.

Revisar:

- `alwaysOutputData`;
- `onError`;
- branch de erro;
- Code/IF de avaliação.

## Multi-item

Validar:

- 0 itens;
- 1 item;
- 2+ itens;
- erro global sem `pairedItem`, quando aplicável.

Preservar correlação de:

- `ID_EMPRESA`;
- `ID_CLIENTE`;
- `ID_AGENDAMENTO`;
- IDs transacionais;
- tentativa;
- valor;
- telefone;
- contexto.

## Execute Workflow

Definir conscientemente se executa por lote ou por item.

## Logging

WF017 é logger central **dos workflows que o chamam**.

Não adicionar WF017 apenas para uniformizar documentação.

Não deixar o logger substituir o resultado funcional do chamador.

---

# 9. Integrações

## WhatsApp

- entrada direta: WF001;
- saída direta: WF012.

Outros workflows delegam envio ao WF012.

## Gemini

Uso atual: WF002.

Não trocar provedor sem decisão arquitetural.

Não permitir que IA invente horário/preço/dado operacional.

## Calendar

Uso direto: WF004–WF007.

Não documentar resolução dinâmica multiempresa antes de implementá-la.

## Sheets

Persistência operacional atual.

Não alterar estrutura física sem análise de impacto.

## Drive

WF016 realiza backup.

---

# 10. Regras globais críticas

Consultar `docs/04-regras-de-negocio/README.md`.

Destaques:

- RN009 — intervalo por serviço;
- RN011 — antecedência configurável;
- RN014 — gap de limite de reagendamento;
- RN037 — consentimento;
- RN041–RN045 — pagamentos;
- RN046–RN051 — cobrança;
- RN052–RN054 — pesquisa;
- RN055–RN061 — follow-up;
- RN062–RN065 — backup/logs/retenção.

Não usar numerações antigas em documentação nova.

---

# 11. Financeiro

Pagamentos são transacionais.

Não introduzir `UNIQUE(id_agendamento)` em modelo futuro sem reconciliar com múltiplas transações.

Cobrança deve usar o estado financeiro mais recente e nunca cobrar linha histórica PARCIAL quando já existe estado PAGO.

---

# 12. Comunicação

- WF012: envio centralizado WhatsApp;
- WF013: lembretes, sem Cron interno;
- WF014: envia pesquisa, não captura avaliação;
- WF015: follow-up/reengajamento, não campanhas genéricas.

---

# 13. Administração

WF016 pode remover backups conforme política de retenção.

WF018 pode remover logs conforme política de retenção.

Portanto são proibidas exclusões **fora da política**, não toda exclusão.

WF017 deve evitar recursão do próprio logger.

---

# 14. BeautyFlow App

Arquitetura aprovada:

```text
Browser
  ↓
Next.js
  ↓
NestJS
  ├── Supabase Auth/Postgres (planejado)
  ↓
APP-WF019 (planejado)
  ↓
n8n
```

Frontend não deve chamar n8n diretamente.

Autorização deve ser server-side.

---

# 15. Multiempresa

Objetivo: isolamento por `ID_EMPRESA`.

Antes de produção SaaS:

- remover defaults inseguros;
- resolver recursos por empresa;
- testar cross-tenant;
- validar backend/RLS quando implementados.

Nunca introduzir novo fallback silencioso de tenant.

---

# 16. Segurança

Nunca expor/versionar:

- tokens;
- passwords;
- API keys;
- client secrets;
- private keys;
- JWTs;
- Supabase Secret Key.

Usar dados sintéticos em exemplos/testes.

---

# 17. Testes

Fonte oficial: `tests/`.

```text
WF001 ↔ CT001
...
WF018 ↔ CT018
```

Status implementado ≠ status validado.

Correção crítica exige regressão.

---

# 18. Documentação

Ao alterar comportamento:

- atualizar doc individual do workflow;
- README do módulo;
- `n8n/README.md` se arquitetura global mudar;
- RF/RNF/RN/UC/US se necessário;
- CT/evidência;
- Matriz;
- `docs/STATUS-DO-PROJETO.md` quando necessário.

Arquitetura oficial: `docs/09-arquitetura/`.

Não usar `docs/arquitetura/` como fonte nova.

---

# 19. Banco e SQL

`database/` é material legado/aspiracional.

Para mudanças:

1. consultar `docs/10-modelo-de-dados/`;
2. verificar dados reais dos workflows;
3. não executar SQL documental como migration;
4. criar migrations reais apenas na fase correspondente.

---

# 20. Definition of Done

- [ ] requisito aprovado respeitado;
- [ ] código/JSON versionado;
- [ ] testes aplicáveis passam;
- [ ] erro técnico considerado;
- [ ] multi-item considerado;
- [ ] segurança revisada;
- [ ] documentação atualizada;
- [ ] CT/evidência atualizados;
- [ ] matriz revisada;
- [ ] gaps remanescentes explícitos.

---

# 21. Regra final para agentes

Ao encontrar inconsistência:

1. não adivinhar;
2. consultar fonte oficial;
3. distinguir comportamento atual de intenção;
4. declarar gap;
5. propor menor alteração segura;
6. analisar impacto;
7. preservar evidência e rastreabilidade.

BeautyFlow AI © 2026
