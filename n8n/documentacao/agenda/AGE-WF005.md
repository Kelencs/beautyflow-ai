# AGE-WF005 — Criar Agendamento

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `AGE-WF005` |
| Workflow | Criar Agendamento |
| Arquivo n8n | `AGE-WF005-criar-agendamento.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow após intenção de agendar. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Criar um agendamento somente após validar disponibilidade, persistindo o compromisso no Google Sheets e no Google Calendar e disparando a confirmação ao cliente.

## Entradas principais

- `id_empresa`, `id_cliente`, telefone e nome.
- `servico`, `data`, `hora_inicio`, período e profissional.
- `phone_number_id`, `origem` e demais dados de atendimento.

## Fluxo principal

1. Recebe os dados solicitados para o agendamento.
2. Executa o WF004 para revalidar a disponibilidade no momento da criação.
3. Interrompe a criação se o horário não estiver mais disponível.
4. Gera um `ID_AGENDAMENTO` único.
5. Monta data/hora de início, fim, duração, valor e status inicial.
6. Cria o evento correspondente no Google Calendar.
7. Registra o agendamento na aba `AGENDAMENTOS`, preservando o `GOOGLE_EVENT_ID`.
8. Aciona o WF012 para enviar confirmação ao cliente.
9. Registra o resultado no WF017.

## Fluxo resumido

```text
AGE-WF005 → AGE-WF004 → Google Sheets: AGENDAMENTOS → Google Calendar
```

## Integrações

- AGE-WF004
- Google Sheets: `AGENDAMENTOS`
- Google Calendar
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- Nunca criar sem revalidar disponibilidade.
- `ID_EMPRESA` deve estar presente em todas as leituras e gravações.
- O identificador do evento do Calendar deve permanecer vinculado ao agendamento.
- Em caso de conflito de horário, devolver regra de negócio sem gravar parcialmente o compromisso.
- Status e timestamps devem ser definidos de forma consistente.

## Saídas esperadas

- Agendamento criado com identificador interno e `GOOGLE_EVENT_ID`.
- Resposta de confirmação/resultado para o fluxo chamador.

## Tratamento de erros e logs

- Diferenciar conflito de agenda de falha técnica.
- Falha ao criar/registrar uma das partes exige tratamento para evitar divergência entre Sheets e Calendar.
- Falhas de comunicação não devem apagar silenciosamente um agendamento já criado; devem ser registradas.

## Dependências entre workflows

- Chamado por: `ATD-WF003`.
- Chama: `AGE-WF004`, `COM-WF012`, `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Criação em horário livre.
- [ ] Concorrência: horário fica ocupado entre consulta e criação.
- [ ] Falha ao criar evento no Calendar.
- [ ] Falha ao registrar em AGENDAMENTOS.
- [ ] Falha no envio de confirmação.
- [ ] Conferir IDs, horários, valor, status e timestamps gravados.

## Cuidados na manutenção

Alterações na ordem de Calendar/Sheets devem considerar compensação em caso de falha. Não aceite um fluxo que possa terminar como sucesso com apenas metade do agendamento persistido.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

