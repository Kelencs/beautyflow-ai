# Testes — BeautyFlow AI

> **Sincronização:** 18/08/2026  
> **Fonte técnica dos workflows:** `n8n/workflows/**/WF001–WF018` no branch `main`.  
> **Princípio:** o status de teste é baseado em evidência registrada; a existência de um JSON atualizado não é, por si só, evidência de aprovação.

## 1. Objetivo

Este diretório centraliza planejamento, casos de teste, rastreabilidade, testes de integração, testes não funcionais e evidências do BeautyFlow AI.

A documentação foi reorganizada para acompanhar a arquitetura atual de **18 workflows n8n**, evitando referências históricas que não correspondem mais ao projeto, como OpenAI, `10-Testes/` e a antiga matriz limitada a WF001–WF010.

## 2. Estrutura atual

```text
tests/
├── README.md
├── Plano-de-Testes.md
├── Estrategia-de-Testes.md
├── Ambiente-de-Testes.md
├── Matriz-de-Rastreabilidade.md
├── Relatorio-Auditoria-Tests-2026-08-18.md
│
├── Casos-de-Teste/
│   ├── README.md
│   └── CT001 ... CT018
│
├── Evidencias/
│   ├── README.md
│   ├── BeautyFlow-Documentacao-Testes-Workflows-2026-08-14.md   # histórico; manter
│   └── BeautyFlow-Status-Testes-Workflows-2026-08-18.md
│
├── Testes-de-API/
│   ├── README.md
│   ├── WhatsApp-Cloud-API.md
│   ├── Google-Calendar.md
│   ├── Google-Sheets.md
│   ├── Google-Gemini.md
│   └── Google-Drive.md
│
├── Testes-de-Aceitacao/
│   ├── README.md
│   ├── UAT-Cliente.md
│   ├── UAT-Profissional.md
│   ├── UAT-Proprietario.md
│   └── UAT-Administrador.md
│
├── Testes-de-Carga/
│   ├── README.md
│   ├── Simulacao-100-Mensagens.md
│   ├── Simulacao-1000-Mensagens.md
│   └── Stress-Test.md
│
└── Testes-de-Seguranca/
    ├── README.md
    ├── Autenticacao.md
    ├── Permissoes.md
    ├── Rate-Limit.md
    └── Logs.md
```

## 3. Cobertura dos workflows

| Workflow | Nome | Caso principal | Status de evidência |
|---|---|---|---|
| WF001 | ATD - Receber WhatsApp | CT001 | ⚪ Revalidar evidência consolidada |
| WF002 | ATD - IA Atendimento | CT002 | ⚪ Revalidar evidência consolidada |
| WF003 | ATD - Identificar Intenção | CT003 | ⚪ Revalidar evidência consolidada |
| WF004 | AGE - Consultar Disponibilidade | CT004 | ⚪ Revalidar evidência consolidada |
| WF005 | AGE - Criar Agendamento | CT005 | ⚪ Revalidar evidência consolidada |
| WF006 | AGE - Reagendar | CT006 | ⚪ Revalidar evidência consolidada |
| WF007 | AGE - Cancelar Agendamento | CT007 | ⚪ Revalidar evidência consolidada |
| WF008 | CLI - Cadastrar Cliente | CT008 | ✅ Validado |
| WF009 | CLI - Atualizar Cliente | CT009 | ✅ Validado |
| WF010 | FIN - Registrar Pagamento | CT010 | ✅ Validado |
| WF011 | FIN - Cobrança | CT011 | ✅ Validado |
| WF012 | COM - Confirmação/Comunicação | CT012 | 🟡 Lógica validada; integração externa deve ser revalidada no ambiente alvo |
| WF013 | COM - Lembrete | CT013 | ✅ Validado |
| WF014 | COM - Pesquisa | CT014 | 🟡 Parcialmente validado; manter pendência explícita até evidência final |
| WF015 | COM - Follow-up | CT015 | ✅ Validado em rodada posterior ao relatório de 14/08 |
| WF016 | ADM - Backup | CT016 | ✅ Validado |
| WF017 | ADM - Logs | CT017 | ✅ Validado |
| WF018 | ADM - Limpeza | CT018 | ✅ Validado |

> `⚪` não significa que o workflow falhou. Significa apenas que a evidência consolidada disponível nesta revisão não é suficiente para marcar o workflow como aprovado sem inventar resultados.

## 4. Integrações consideradas

- n8n Cloud;
- WhatsApp Cloud API / Meta;
- Google Gemini;
- Google Calendar;
- Google Sheets;
- Google Drive;
- chamadas entre subworkflows.

## 5. Convenção dos casos

Cada workflow possui um caso principal:

```text
WF001 ↔ CT001
WF002 ↔ CT002
...
WF018 ↔ CT018
```

Cada CT contém cenários de sucesso, bloqueio de negócio, erro técnico e regressão quando aplicável.

## 6. Evidência

Toda aprovação deve apontar para uma evidência verificável, como execução do n8n, print, log, registro em Sheets/Drive/Calendar ou relatório consolidado.

Não apagar o relatório de **14/08/2026**: ele é histórico. O arquivo de **18/08/2026** registra o estado consolidado posterior.

## 7. Regra de manutenção

Sempre que um JSON de workflow for alterado:

1. revisar sua documentação em `n8n/documentacao`;
2. revisar o CT correspondente;
3. executar regressão;
4. registrar evidência;
5. atualizar `Matriz-de-Rastreabilidade.md`;
6. atualizar o status consolidado.
