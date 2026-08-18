# Administração — WF016 a WF018

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/administracao/`.

## Visão geral

O módulo de Administração oferece três serviços distintos: backup da planilha, persistência central de logs e limpeza dos logs expirados. Eles não devem ser descritos como uma sequência obrigatória entre si; cada workflow possui gatilho e finalidade próprios.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF016 | Backup | `ADM-WF016-backup.json` | Copiar a planilha para Google Drive e aplicar retenção | `false` |
| WF017 | Logs | `ADM-WF017-logs.json` | Persistir logs centralizados em `LOGS` | `true` |
| WF018 | Limpeza | `ADM-WF018-limpeza.json` | Excluir da aba `LOGS` somente registros expirados | `false` |

## WF016 — Backup

### Gatilhos

- Execute Workflow Trigger.
- Schedule diário configurado para 02:00.

### Fluxo atual

```text
prepara nome do backup
        ↓
Google Drive — copia planilha inteira
        ↓
valida cópia
        ↓
lista backups existentes
        ↓
seleciona backups > 30 dias
        ↓
exclui expirados
        ↓
consolida resultado
        ↓
WF017
```

### Regras

- backup é uma cópia integral do arquivo da planilha no Google Drive;
- nome inclui data/hora;
- retenção atual: 30 dias;
- a limpeza considera o prefixo esperado de backup e não deve excluir a planilha original;
- usa contexto administrativo/global para logging;
- o JSON está exportado com `active:false`, portanto a existência do Schedule não é evidência de execução automática ativa no ambiente.

## WF017 — Logs

### Gatilho

- Execute Workflow Trigger.

### Integração

- Google Sheets: `LOGS`.

### Responsabilidade

Centralizar a persistência de eventos produzidos por outros workflows. O contrato recebe o contexto do evento, constrói o registro e grava uma linha em `LOGS`.

O JSON atual de WF001, WF002 e WF003 não chama WF017 diretamente. Portanto não documentar que “WF001–WF016 sempre chamam WF017”.

## WF018 — Limpeza

### Gatilhos

- Execute Workflow Trigger.
- Schedule diário configurado para 03:00.

### Integrações

- Google Sheets: `LOGS`.
- WF017 — Logs.

### Fluxo atual

```text
lê LOGS
  ↓
calcula idade
  ↓
seleciona registros > 90 dias
  ↓
exclui por row_number
  ↓
consolida sucesso/falha
  ↓
WF017
```

### Regra de retenção correta

A regra **não é “nunca excluir logs”**.

A regra implementada é:

> Logs podem ser excluídos pelo WF018 quando atendem à política de retenção implementada, atualmente superior a 90 dias, usando a identificação segura da linha.

WF018 não deve ser documentado como rotina genérica de exclusão de dados temporários de negócio: o JSON atual é específico para `LOGS`.

## Dependências reais do módulo

- Google Drive — WF016.
- Google Sheets — WF017 e WF018.
- WF017 — chamado por WF016 e WF018 e por diversos workflows dos módulos funcionais.

**Gemini e WhatsApp Cloud API não são integrações diretas dos JSONs administrativos atuais.**

## Documentação individual

- [`ADM-WF016.md`](../../documentacao/administracao/ADM-WF016.md)
- [`ADM-WF017.md`](../../documentacao/administracao/ADM-WF017.md)
- [`ADM-WF018.md`](../../documentacao/administracao/ADM-WF018.md)

## Manutenção

Mudanças em horários de Schedule, retenção de 30/90 dias, destino do backup, estrutura de `LOGS` ou contrato do WF017 devem atualizar o JSON e a documentação na mesma alteração.

