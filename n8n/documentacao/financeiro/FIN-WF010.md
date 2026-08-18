# FIN-WF010 — Registrar Pagamento

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `FIN-WF010` |
| Workflow | Registrar Pagamento |
| Arquivo n8n | `FIN-WF010-registrar-pagamento.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow para registrar recebimento de um agendamento. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Validar e registrar uma transação de pagamento, relacioná-la ao agendamento/cliente e calcular corretamente o estado financeiro sem sobrescrever o histórico transacional.

## Entradas principais

- `id_empresa`, `id_agendamento`, `id_cliente`.
- `valor_pago_raw`.
- `forma_pagamento`, `observacoes`, `origem` e `dados`.

## Fluxo principal

1. Normaliza o payload de entrada.
2. Valida se o valor pago é numérico e maior que zero.
3. Busca o agendamento correspondente.
4. Busca pagamentos existentes necessários à consolidação.
5. Gera identificador da nova transação.
6. Registra a linha em `PAGAMENTOS`.
7. Consolida o total pago versus o valor do agendamento.
8. Retorna situação como pagamento parcial ou quitado conforme o total.
9. Atualiza os dados correlatos quando previsto.
10. Registra o resultado no WF017.

## Fluxo resumido

```text
FIN-WF010 → Google Sheets: AGENDAMENTOS, PAGAMENTOS → ADM-WF017
```

## Integrações

- Google Sheets: `AGENDAMENTOS`, `PAGAMENTOS`
- ADM-WF017

## Regras de negócio e proteções

- Valor inválido/zero/negativo deve retornar `VALOR_INVALIDO`.
- `PAGAMENTOS` é histórico transacional: não presumir que uma linha antiga `PARCIAL` representa o estado financeiro atual.
- Estado financeiro deve ser calculado pelo conjunto/histórico relevante do agendamento.
- RN003 do projeto: o registro de pagamento deve respeitar a política definida para o dia do atendimento.
- Todos os registros devem manter `ID_EMPRESA`.

## Saídas esperadas

- Identificador do pagamento.
- Valor registrado e total consolidado.
- Status financeiro, como parcial ou pago.

## Tratamento de erros e logs

- Erro ao buscar agendamento/pagamentos deve ser técnico, não `não encontrado` artificial.
- Erro no append não pode resultar em sucesso.
- Registrar falha no WF017 com contexto do agendamento.

## Dependências entre workflows

- Pode ser chamado pelo atendimento e futuramente pelo app/gateway.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Pagamento total.
- [ ] Pagamento parcial.
- [ ] Segundo pagamento que quita o restante.
- [ ] Valor zero, negativo e texto inválido.
- [ ] Agendamento inexistente.
- [ ] Erro técnico em busca e em append.

## Cuidados na manutenção

Sempre consolide o estado pelo histórico atual. Não filtre apenas linhas `PARCIAL`, pois uma transação posterior pode ter quitado o agendamento.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

