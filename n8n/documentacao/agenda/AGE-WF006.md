# AGE-WF006 — Reagendar

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `AGE-WF006` |
| Workflow | Reagendar |
| Arquivo n8n | `AGE-WF006-reagendar.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow após intenção de reagendamento. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Alterar data/horário de um agendamento existente com validação de elegibilidade e de nova disponibilidade, mantendo Google Sheets e Google Calendar sincronizados.

## Entradas principais

- `id_empresa` e `id_agendamento`.
- Nova `data`, `hora_inicio`, período e/ou profissional.
- Dados do cliente e `phone_number_id` para confirmação.

## Fluxo principal

1. Busca o agendamento da empresa pelo identificador informado.
2. Valida se o agendamento existe e pode ser reagendado.
3. Aplica a regra de limite de reagendamento definida no projeto.
4. Executa o WF004 para verificar o novo horário.
5. Atualiza o evento correspondente no Google Calendar.
6. Atualiza os campos do agendamento na aba `AGENDAMENTOS`.
7. Registra a alteração/timestamp necessário.
8. Aciona o WF012 para comunicar o novo horário.
9. Registra o resultado via WF017.

## Fluxo resumido

```text
AGE-WF006 → Google Sheets: AGENDAMENTOS → Google Calendar → AGE-WF004
```

## Integrações

- Google Sheets: `AGENDAMENTOS`
- Google Calendar
- AGE-WF004
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- Regra RN014 do projeto: no máximo um reagendamento por agendamento.
- Novo horário deve ser validado antes da alteração.
- Agendamento deve pertencer ao mesmo `ID_EMPRESA` recebido.
- Não alterar agendamento cancelado/concluído quando a regra de negócio não permitir.
- Preservar vínculo com o evento correto do Google Calendar.

## Saídas esperadas

- Status de reagendamento e dados atualizados.
- Resposta de confirmação ao cliente.

## Tratamento de erros e logs

- Agendamento não encontrado é erro de negócio, não erro técnico.
- Novo horário indisponível não deve alterar dados existentes.
- Falhas parciais entre Sheets e Calendar precisam ser registradas e tratadas de forma explícita.

## Dependências entre workflows

- Chamado por: `ATD-WF003`.
- Chama: `AGE-WF004`, `COM-WF012`, `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Primeiro reagendamento válido.
- [ ] Tentativa de segundo reagendamento.
- [ ] Agendamento inexistente.
- [ ] Novo horário indisponível.
- [ ] Falha no Calendar.
- [ ] Falha no Sheets após alteração do Calendar.

## Cuidados na manutenção

Se a forma de registrar a quantidade/histórico de reagendamentos mudar no JSON, atualize esta documentação e os testes da RN014.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

