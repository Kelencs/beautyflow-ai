
# FIN-WF011 — Cobrança

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `FIN-WF011` |
| Workflow | Cobrança |
| Arquivo n8n | `FIN-WF011-cobranca.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow por empresa; execução deve ocorrer dentro da janela operacional definida. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Localizar situações elegíveis para cobrança, evitar cobranças indevidas ou repetidas e enviar comunicação pelo canal central do BeautyFlow.

## Entradas principais

- `id_empresa` obrigatório.

## Fluxo principal

1. Valida `id_empresa` antes de qualquer busca multi-tenant.
2. Valida horário atual em `America/Sao_Paulo`.
3. Fora da janela, encerra com status controlado.
4. Carrega agendamentos/pagamentos necessários da empresa.
5. Consolida o estado financeiro mais recente por agendamento.
6. Descarta agendamentos já quitados.
7. Aplica regras de intervalo entre cobranças e limite de tentativas.
8. Obtém `phone_number_id` da empresa.
9. Envia a cobrança pelo fluxo de comunicação.
10. Registra a tentativa em `COBRANCAS` e o log no WF017.

## Fluxo resumido

```text
FIN-WF011 → Google Sheets: AGENDAMENTOS, PAGAMENTOS, COBRANCAS, EMPRESAS → COM-WF012 → ADM-WF017
```

## Integrações

- Google Sheets: `AGENDAMENTOS`, `PAGAMENTOS`, `COBRANCAS`, `EMPRESAS`
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- Executar cobrança apenas entre 09:00 e 18:00 no fuso de São Paulo.
- Fora do horário, retornar `FORA_HORARIO_COBRANCA`.
- Pagamento mais recente/consolidado prevalece: se já está quitado, não cobrar.
- Respeitar intervalo mínimo de 24h entre tentativas.
- Limite de 3 tentativas por cobrança/ciclo conforme regra implementada.
- Nunca executar busca global sem `ID_EMPRESA`.

## Saídas esperadas

- Resultado por agendamento elegível, bloqueado ou já quitado.
- Registro de cobrança quando efetivamente processada.

## Tratamento de erros e logs

- Erro na leitura financeira deve bloquear a cobrança.
- Falha de envio não pode ser registrada como cobrança enviada com sucesso.
- Concorrência entre vários agendamentos deve preservar o contexto de cada item.

## Dependências entre workflows

- Pode chamar: `COM-WF012`.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Pagamento parcial elegível para cobrança.
- [ ] Histórico com parcial antigo e pagamento posterior quitado.
- [ ] Execução fora do horário.
- [ ] Bloqueio de 24h.
- [ ] Limite de tentativas.
- [ ] Dois agendamentos simultâneos.
- [ ] Falha técnica no Sheets e no registro da cobrança.

## Cuidados na manutenção

Não volte a filtrar `PAGAMENTOS` somente por `STATUS=PARCIAL`. O workflow precisa enxergar o histórico suficiente para saber se houve quitação posterior.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.
