# WF016 — ADM - WF016 - Backup

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ADM-WF016-backup.json`](../../workflows/administracao/ADM-WF016-backup.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Criar backup integral da planilha BeautyFlow no Google Drive e aplicar retenção de backups antigos.

## 2. Identificação técnica

- **Workflow:** `ADM - WF016 - Backup`
- **ID funcional:** `WF016`
- **Arquivo JSON:** `ADM-WF016-backup.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** Dois gatilhos: `Execute Workflow Trigger` e Schedule diário configurado para 02:00.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Pode ser acionado como subworkflow; a rotina opera em contexto global (`id_empresa=GLOBAL`) e sobre a planilha principal configurada.

## 4. Fluxo real do workflow

1. `CODE - Preparar Backup` gera nome `BEAUTYFLOW3.1-backup-AAAA-MM-DD-HHmm` usando timezone `America/Sao_Paulo`.
2. `DRIVE - Copiar Planilha` cria uma cópia integral do arquivo Google Sheets no Google Drive.
3. Valida a criação da cópia e captura o ID do novo arquivo.
4. Lista arquivos de backup no Drive e filtra apenas os nomes com o prefixo de backup esperado.
5. Calcula a idade de cada backup e seleciona os com mais de 30 dias.
6. Exclui os backups expirados, preservando a planilha original.
7. Consolida o resultado em sucesso, sucesso parcial ou erro.
8. WF017 registra o evento em logs.

## 5. Regras e decisões implementadas

- Backup é uma cópia do arquivo da planilha, preservando as abas e estrutura do documento copiado.
- Nome do backup inclui data/hora.
- Retenção de backups: 30 dias.
- A limpeza considera somente arquivos com o prefixo de backup previsto; a planilha original não deve ser excluída.
- O contexto de log utiliza `GLOBAL`, pois a rotina é administrativa da infraestrutura.

## 6. Integrações e dependências

- Google Drive.
- WF017 — Logs.

## 7. Saídas e estados

- `BACKUP_CONCLUIDO` quando cópia e limpeza terminam sem falha; `SUCESSO_PARCIAL` quando o backup foi criado, mas houve problema na etapa de limpeza/listagem; `ERRO_BACKUP` quando a cópia falha.

## 8. Tratamento de erros e bloqueios

- Falha de cópia impede tratar a rotina como concluída.
- Problemas de retenção podem produzir sucesso parcial sem invalidar a cópia já criada.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`; portanto o Schedule existente no JSON não executa automaticamente enquanto o workflow permanecer inativo.
- Este workflow usa Google Drive; não executa backup por leitura linha a linha do Google Sheets.

## 10. Critério de manutenção desta documentação

Sempre que `ADM-WF016-backup.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
