# ADM-WF018 — Limpeza

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ADM-WF018` |
| Workflow | Limpeza |
| Arquivo n8n | `ADM-WF018-limpeza.json` |
| Status | Versionado; rotina destrutiva deve permanecer sob validação controlada |
| Trigger | Schedule diário às 03:00 e execução como subworkflow/manual. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Remover somente registros técnicos antigos da aba `LOGS` de acordo com a retenção definida, preservando integralmente os dados operacionais do BeautyFlow.

## Entradas principais

- Execução agendada/manual.
- Linhas atuais da aba `LOGS`.

## Fluxo principal

1. Carrega os registros de `LOGS` com número real da linha.
2. Calcula a data limite de retenção.
3. Seleciona somente logs anteriores ao limite e com `row_number` válido.
4. Se não houver elegíveis, finaliza sem exclusão.
5. Exclui exatamente as linhas elegíveis, uma a uma/conforme configuração do node.
6. Consolida sucessos e falhas.
7. Registra a execução no WF017.
8. Retorna resumo da limpeza.

## Fluxo resumido

```text
ADM-WF018 → Google Sheets: LOGS → ADM-WF017
```

## Integrações

- Google Sheets: `LOGS`
- ADM-WF017

## Regras de negócio e proteções

- Retenção atual de logs: 90 dias.
- Somente `LOGS` faz parte do escopo atual.
- Nunca excluir linha se data ou `row_number` não forem confiáveis.
- Não limpar `AGENDAMENTOS`, `CLIENTES`, `PAGAMENTOS`, `COBRANCAS`, `EMPRESAS`, `DISPONIBILIDADES`, `PROFISSIONAIS`, `SERVICOS`, `FOLLOWUPS`, `LEMBRETES` ou `PESQUISAS`.
- `MENSAGENS` e `IA_MEMORIA` não fazem parte da limpeza atual até decisão explícita de retenção.

## Saídas esperadas

- Quantidade de logs elegíveis/excluídos.
- Resumo de sucessos, falhas e itens preservados.

## Tratamento de erros e logs

- Erro ao listar LOGS deve impedir exclusões.
- Erro em uma exclusão deve ser registrado sem mascarar as demais.
- Qualquer incerteza de referência de linha deve resultar em preservação.

## Dependências entre workflows

- Chamado por: Schedule ou execução administrativa.
- Logs da própria rotina: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Log com menos de 90 dias permanece.
- [ ] Log com mais de 90 dias é elegível.
- [ ] Linha sem data válida permanece.
- [ ] Linha sem `row_number` válido permanece.
- [ ] Planilhas operacionais não são tocadas.
- [ ] Falha forçada em uma exclusão.
- [ ] Antes de ativar em produção, validar a operação exata de delete-row do node Google Sheets.

## Cuidados na manutenção

Este workflow é destrutivo. Faça backup antes de alterações, valide em dados de teste e mantenha o escopo explicitamente limitado à aba `LOGS` enquanto não houver política aprovada para outros dados.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

