# AGE-WF004 — Consultar Disponibilidade

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `AGE-WF004` |
| Workflow | Consultar Disponibilidade |
| Arquivo n8n | `AGE-WF004-consultar-disponibilidade.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow chamado pelo roteamento de atendimento e por fluxos que precisam validar horário. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Calcular horários realmente disponíveis considerando serviço, duração, profissional, disponibilidade semanal, intervalos, agendamentos existentes e eventos do Google Calendar.

## Entradas principais

- `id_empresa`, cliente e telefone.
- `servico`, `data`, `hora_inicio` e/ou `periodo`.
- `profissional` ou identificador do profissional, quando informado.
- Contexto de origem e `phone_number_id`.

## Fluxo principal

1. Valida os dados mínimos da consulta.
2. Busca serviços ativos da empresa e resolve o serviço solicitado.
3. Obtém profissional(is) elegíveis e a disponibilidade cadastrada.
4. Carrega agendamentos não cancelados do período.
5. Obtém ocupações relevantes do Google Calendar.
6. Gera slots em intervalos de 30 minutos respeitando duração do serviço e intervalo configurado.
7. Remove conflitos com almoço/intervalos, Sheets e Calendar.
8. Aplica filtro de período (manhã/tarde/noite) ou horário mínimo solicitado.
9. Retorna até os primeiros horários disponíveis para apresentação ao cliente.

## Fluxo resumido

```text
AGE-WF004 → Google Sheets: SERVICOS, PROFISSIONAIS, DISPONIBILIDADES, AGENDAMENTOS → Google Calendar
```

## Integrações

- Google Sheets: `SERVICOS`, `PROFISSIONAIS`, `DISPONIBILIDADES`, `AGENDAMENTOS`
- Google Calendar

## Regras de negócio e proteções

- Serviço precisa estar ativo.
- Agendamentos cancelados não devem bloquear horário.
- Duração e tempo de intervalo do serviço precisam entrar no cálculo.
- Um slot só é livre se não conflitar com agenda interna nem Google Calendar.
- Manhã: antes de 12h; tarde: aproximadamente 12h–18h; noite: a partir de 18h, conforme disponibilidade cadastrada.
- Retorno deve diferenciar `OK` de `SEM_HORARIOS`.

## Saídas esperadas

- `status`, dados do serviço, duração, valor, profissional e data.
- Lista `horarios` disponíveis e `resposta_cliente` pronta para comunicação.

## Tratamento de erros e logs

- Erro técnico na busca de Sheets/Calendar não pode ser convertido em `SEM_HORARIOS`.
- Serviço não encontrado/inativo deve gerar resultado de negócio específico.
- Registrar erro técnico no WF017.

## Dependências entre workflows

- Chamado por: `ATD-WF003`, `AGE-WF005`, `AGE-WF006` e outros fluxos que precisem validar agenda.
- Não cria agendamento.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Dia totalmente livre.
- [ ] Conflito com AGENDAMENTOS.
- [ ] Conflito somente com Google Calendar.
- [ ] Bloqueio por intervalo/almoço.
- [ ] Período manhã/tarde/noite.
- [ ] Serviço inativo ou inexistente.
- [ ] Falha técnica do Google Sheets e do Google Calendar.

## Cuidados na manutenção

Não simplifique a disponibilidade para apenas uma fonte. A segurança do agendamento depende do cruzamento entre regras internas e ocupação real do calendário.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

