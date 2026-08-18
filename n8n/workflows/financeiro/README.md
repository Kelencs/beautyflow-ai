# Financeiro — WF010–WF011

> **Sincronização:** 18/08/2026  
> **Fonte de verdade:** JSONs desta pasta.

## Objetivo

Registrar pagamentos como histórico transacional e executar cobrança controlada de saldos pendentes.

## Workflows

| ID | Função |
|---|---|
| WF010 | Registrar Pagamento |
| WF011 | Cobrança |

## Dependências

```text
WF010 ───────────────────────────────► WF017

WF011 ──► WF012 — envio da cobrança
      └──► WF017 — logging
```

## Integrações diretas

- Google Sheets;
- n8n Execute Workflow.

WF011 usa WhatsApp **indiretamente** pelo WF012.

**Gemini não é integração direta deste módulo.**

## WF010 — Pagamento

Regras atuais:

- `valor_pago` deve ser numérico e maior que zero;
- agendamento cancelado não recebe pagamento;
- pagamentos são transações históricas;
- pagamento acumulado não pode exceder o total devido;
- saldo maior que zero resulta em estado parcial;
- saldo zerado resulta em pago;
- agendamento já quitado não recebe nova transação indevida.

Regras globais relacionadas: RN041–RN045.

## WF011 — Cobrança

Regras atuais:

- consolidar PAGAMENTOS por `ID_AGENDAMENTO`;
- considerar o estado financeiro mais recente;
- cobrar somente saldo pendente;
- nunca cobrar item já quitado;
- usar `VALOR_PENDENTE`, não o valor total original;
- respeitar intervalo mínimo de 24h;
- máximo de 3 tentativas;
- envio automático somente na janela técnica atual de 09h–18h;
- preservar correlação quando houver múltiplos agendamentos.

Regras globais relacionadas: RN046–RN051.

## Dados operacionais

Conforme o fluxo:

- `AGENDAMENTOS`
- `PAGAMENTOS`
- `COBRANCAS`
- `CLIENTES`
- `EMPRESAS`
- `LOGS`

## Tratamento de erro

Erro técnico de busca/registro não pode ser interpretado como:

- agendamento inexistente;
- pagamento já quitado;
- cobrança recente;
- limite de tentativas;
- nenhuma pendência.

## Documentação

- `n8n/documentacao/financeiro/`
- `docs/04-regras-de-negocio/`
- `tests/Casos-de-Teste/CT010...CT011`
