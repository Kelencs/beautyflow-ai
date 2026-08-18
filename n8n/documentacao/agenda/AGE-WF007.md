
# AGE-WF007 — Cancelar

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `AGE-WF007` |
| Workflow | Cancelar |
| Arquivo n8n | `AGE-WF007-cancelar.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow após intenção de cancelamento. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Cancelar um agendamento existente, respeitando a janela mínima definida pelo negócio e mantendo o status interno e o Google Calendar coerentes.

## Entradas principais

- `id_empresa` e `id_agendamento`.
- `motivo_cancelamento`, quando informado.
- Dados do cliente e `phone_number_id`.

## Fluxo principal

1. Busca o agendamento da empresa.
2. Valida existência e estado atual.
3. Calcula a antecedência entre o momento atual e o início do atendimento.
4. Aplica a regra de janela de cancelamento.
5. Atualiza o evento do Google Calendar conforme a estratégia do projeto.
6. Marca o agendamento como cancelado e grava data/motivo do cancelamento.
7. Envia comunicação ao cliente quando aplicável.
8. Registra o resultado no WF017.

## Fluxo resumido

```text
AGE-WF007 → Google Sheets: AGENDAMENTOS → Google Calendar → COM-WF012
```

## Integrações

- Google Sheets: `AGENDAMENTOS`
- Google Calendar
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- RN011 do projeto: cancelamento deve respeitar antecedência mínima de 2 horas.
- Somente registros da mesma empresa podem ser alterados.
- Cancelamento repetido deve ser tratado de forma idempotente/segura.
- Agendamento cancelado não deve continuar bloqueando disponibilidade no WF004.

## Saídas esperadas

- Resultado `CANCELADO` ou motivo de bloqueio.
- Dados atualizados de cancelamento e eventual resposta ao cliente.

## Tratamento de erros e logs

- Agendamento inexistente deve retornar resultado de negócio.
- Falha em Calendar/Sheets deve ser identificada como erro técnico.
- Nunca informar sucesso ao cliente se a persistência principal falhou.

## Dependências entre workflows

- Chamado por: `ATD-WF003`.
- Pode chamar: `COM-WF012`.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Cancelamento com mais de 2h de antecedência.
- [ ] Cancelamento dentro da janela bloqueada.
- [ ] Agendamento inexistente.
- [ ] Agendamento já cancelado.
- [ ] Falha no Google Calendar.
- [ ] Falha no Google Sheets.

## Cuidados na manutenção

Qualquer alteração na RN011 deve ser refletida no workflow, na documentação de regras de negócio e nos cenários de teste.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.
