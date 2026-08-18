
# ADM-WF016 — Backup

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ADM-WF016` |
| Workflow | Backup |
| Arquivo n8n | `ADM-WF016-backup.json` |
| Status | Versionado; workflow administrativo |
| Trigger | Schedule diário às 02:00 e possibilidade de execução como subworkflow. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Criar cópia diária segura da planilha principal do BeautyFlow no Google Drive e aplicar retenção aos backups antigos sem risco de excluir a planilha original.

## Entradas principais

- Execução agendada ou manual/subworkflow.
- Escopo administrativo global.

## Fluxo principal

1. Define o contexto global da execução.
2. Gera nome do backup com data/hora.
3. Copia a planilha `BEAUTYFLOW3.1` no Google Drive.
4. Valida se a cópia foi criada.
5. Lista arquivos que correspondem ao padrão de backup.
6. Calcula idade dos backups.
7. Seleciona somente cópias acima do período de retenção.
8. Exclui somente backups elegíveis e nunca o arquivo original.
9. Consolida sucessos/falhas e registra log no WF017.

## Fluxo resumido

```text
ADM-WF016 → Google Drive → ADM-WF017
```

## Integrações

- Google Drive
- ADM-WF017

## Regras de negócio e proteções

- Execução diária prevista às 02:00.
- Nome do backup deve conter prefixo identificável e timestamp.
- Retenção atual: 30 dias.
- Nunca excluir o ID da planilha original.
- Nunca excluir arquivos que não correspondam claramente ao padrão de backup.
- Arquivo sem `createdTime` válido não deve ser apagado automaticamente.

## Saídas esperadas

- Resultado da cópia.
- Quantidade/lista de backups expirados processados.
- Resumo de falhas de exclusão, se houver.

## Tratamento de erros e logs

- Falha na cópia deve impedir interpretação de backup concluído.
- Falha ao listar ou excluir arquivos deve ser registrada no WF017.
- Exclusões devem ser conservadoras: em dúvida, preservar o arquivo.

## Dependências entre workflows

- Chamado por: Schedule ou execução administrativa.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Criar backup manualmente e confirmar nome/arquivo.
- [ ] Confirmar que a planilha original nunca entra na lista de exclusão.
- [ ] Arquivo de backup com menos de 30 dias.
- [ ] Arquivo de backup com mais de 30 dias.
- [ ] Arquivo de nome não compatível.
- [ ] Falha forçada no Google Drive.

## Cuidados na manutenção

Antes de alterar filtro de exclusão ou retenção, teste com arquivos fictícios. Rotinas destrutivas devem preferir falso-negativo (não apagar) a falso-positivo (apagar arquivo válido).

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.
