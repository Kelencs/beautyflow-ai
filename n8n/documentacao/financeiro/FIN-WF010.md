# FIN-WF010 — Registrar Pagamento

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `FIN-WF010` |
| Workflow | Registrar Pagamento |
| Arquivo n8n | `FIN-WF010-registrar-pagamento.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow para registrar recebimento |
| Última revisão | 19/08/2026 |

## Objetivo

Validar e registrar uma transação de pagamento ligada ao agendamento/cliente, preservando o histórico transacional e calculando o estado financeiro pelo saldo consolidado.

## Entradas

- `id_empresa`;
- `id_agendamento`;
- `id_cliente`;
- `valor_pago_raw`;
- forma de pagamento;
- observações/origem/dados quando presentes.

## Fluxo

1. Normaliza a entrada.
2. Valida valor numérico maior que zero.
3. Busca o agendamento.
4. Busca pagamentos existentes.
5. Consolida o estado financeiro.
6. Valida o novo pagamento.
7. Gera ID da transação.
8. Registra em `PAGAMENTOS`.
9. Retorna parcial/quitado conforme saldo.
10. Registra resultado no WF017.

```text
FIN-WF010
  ├── AGENDAMENTOS
  ├── PAGAMENTOS
  └── WF017
```

## Regras globais atuais

- **RN041** — pagamento deve possuir valor válido maior que zero;
- **RN042** — não registrar pagamento indevido para agendamento cancelado;
- **RN043** — pagamentos são históricos/transacionais;
- **RN044** — total pago não pode exceder o total devido;
- **RN045** — estado financeiro deve ser derivado do saldo consolidado.

A antiga referência `RN003` não é válida para este workflow.

## Proteções

- linha histórica `PARCIAL` não representa sozinha o estado atual;
- erro de busca não deve virar "não encontrado" artificial;
- erro no append não pode virar sucesso;
- preservar `ID_EMPRESA`;
- não sobrescrever histórico transacional para simular estado final.

## Saídas

Conforme cenário:
pagamento registrado, valor inválido, agendamento bloqueado, parcial, pago ou erro técnico.

## Dependências

- Google Sheets: `AGENDAMENTOS`, `PAGAMENTOS`;
- ADM-WF017.

## Checklist

- [ ] Valor inválido.
- [ ] Parcial.
- [ ] Quitação.
- [ ] Múltiplos pagamentos do mesmo agendamento.
- [ ] Agendamento cancelado.
- [ ] Erro técnico de busca.
- [ ] Erro técnico de registro.
- [ ] Logging.
