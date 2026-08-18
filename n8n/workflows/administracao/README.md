# Administração — WF016–WF018

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Executar processos técnicos de backup, logging e retenção controlada.

Esses workflows não são fluxos conversacionais do cliente.

## Workflows

| ID | Função |
|---|---|
| WF016 | Backup |
| WF017 | Logs |
| WF018 | Limpeza / retenção de LOGS |

## Dependências

```text
WF016 ──► WF017
WF018 ──► WF017
```

WF017 é o logger central utilizado pelos workflows que explicitamente o chamam.

WF001, WF002 e WF003 **não chamam WF017 diretamente** no estado atual.

## Integrações diretas

### WF016
- Google Drive;
- WF017.

WF016 não usa node Google Sheets diretamente para realizar o backup; ele copia o arquivo da planilha no Drive.

### WF017
- Google Sheets (`LOGS`).

### WF018
- Google Sheets (`LOGS`);
- WF017.

**Gemini e WhatsApp não são dependências diretas deste módulo.**

## WF016 — Backup

Comportamento atual:

- possui Schedule de 02:00 no JSON;
- cria cópia integral da planilha no Google Drive;
- aplica retenção a backups elegíveis com mais de 30 dias;
- a limpeza deve ocorrer somente conforme a lógica implementada;
- o JSON exportado pode estar `active:false`, o que não prova o estado atual do Cloud.

Regras globais: RN062–RN063.

## WF017 — Logs

Responsabilidades:

- normalizar evento;
- registrar log central;
- devolver resultado ao chamador;
- evitar recursão quando o próprio logger falhar.

Regra global: RN064.

Não exigir que "todo workflow" obrigatoriamente chame WF017: a arquitetura deve refletir o JSON real.

## WF018 — Retenção de LOGS

Comportamento atual:

- possui Schedule de 03:00 no JSON;
- identifica registros de `LOGS` com mais de 90 dias conforme critérios implementados;
- remove somente linhas elegíveis;
- preserva segurança de `row_number`/ordem conforme o workflow;
- registra resultado pelo WF017;
- o JSON exportado pode estar `active:false`.

Regra global: RN065.

## Política correta de exclusão

É incorreto documentar:

> nunca apagar logs  
> nunca apagar backups

A regra correta é:

> nunca excluir dados fora das políticas de retenção implementadas, testadas e autorizadas.

## Documentação

- `n8n/documentacao/administracao/`
- `docs/04-regras-de-negocio/`
- `tests/Casos-de-Teste/CT016...CT018`
