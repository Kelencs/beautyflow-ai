# Financeiro — WF010 e WF011

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** JSONs em `n8n/workflows/financeiro/`.

## Visão geral

O módulo Financeiro registra pagamentos como histórico transacional e executa cobrança automatizada de saldos pendentes conforme as regras implementadas.

## Workflows

| ID | Workflow | Arquivo | Responsabilidade principal | `active` no JSON |
|---|---|---|---|---|
| WF010 | Registrar Pagamento | `FIN-WF010-registrar-pagamento.json` | Registrar transação e recalcular estado financeiro | `false` |
| WF011 | Cobrança | `FIN-WF011-cobranca.json` | Identificar saldos elegíveis e executar cobrança | `false` |

## Integrações reais

### WF010
- Google Sheets: `AGENDAMENTOS`, `PAGAMENTOS`.
- WF017 — Logs.

### WF011
- Google Sheets: `EMPRESAS`, `PAGAMENTOS`, `COBRANCAS`, `CLIENTES`.
- WF012 — envio de comunicação/WhatsApp.
- WF017 — Logs.

**Gemini não é integração direta do módulo Financeiro.**

## WF010 — Registrar Pagamento

Fluxo conceitual atual:

```text
entrada da transação
       ↓
valida valor pago
       ↓
busca agendamento
       ↓
busca histórico de PAGAMENTOS
       ↓
registra nova transação
       ↓
recalcula pago/pendente/status
       ↓
WF017
       ↓
saída financeira
```

Regras importantes:

- `valor_pago` deve ser numérico e maior que zero.
- `PAGAMENTOS` é histórico transacional; linhas anteriores não são apagadas para representar apenas o último estado.
- O estado financeiro é recalculado a partir das transações acumuladas.
- Busca vazia legítima e falha técnica do Sheets são tratadas separadamente.
- O JSON atual possui fallback `EMP001` em sua preparação de dados.

## WF011 — Cobrança

Fluxo conceitual atual:

```text
id_empresa obrigatório
       ↓
EMPRESAS / WhatsApp configurado?
       ↓
janela 09:00–18:00
       ↓
PAGAMENTOS + COBRANCAS + CLIENTES
       ↓
consolida estado financeiro mais recente
       ↓
aplica regras de elegibilidade
       ↓
WF012
       ↓
registra tentativa em COBRANCAS
       ↓
WF017
```

Regras atuais:

- `id_empresa` obrigatório.
- Horário permitido: 09:00 até antes das 18:00 em `America/Sao_Paulo`.
- O estado financeiro mais recente por `ID_AGENDAMENTO` é usado para decidir cobrança.
- `PAGO` ou saldo `<= 0` bloqueia cobrança.
- Controle de cobrança ocorre por agendamento.
- Máximo de 3 tentativas automáticas.
- Intervalo mínimo de 24 horas desde a última cobrança automática do agendamento.
- Saída de sucesso: `COBRANCA_ENVIADA`; bloqueios e erros possuem estados próprios no JSON.

## Documentação individual

- [`FIN-WF010.md`](../../documentacao/financeiro/FIN-WF010.md)
- [`FIN-WF011.md`](../../documentacao/financeiro/FIN-WF011.md)

## Manutenção

Qualquer alteração na semântica transacional de `PAGAMENTOS`, cálculo do saldo, janelas/limites de cobrança ou dependência do WF012/WF017 deve atualizar a documentação na mesma mudança.

