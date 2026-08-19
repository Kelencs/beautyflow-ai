# COM-WF015 — Follow-up / Reativação

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF015` |
| Workflow | Follow-up / Reativação |
| Arquivo n8n | `COM-WF015-follow-up.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow executado por mecanismo externo |
| Última revisão | 19/08/2026 |

## Objetivo

Reengajar clientes inativos elegíveis, respeitando consentimento, agendamento futuro, janelas de inatividade e idempotência por tentativa/ciclo.

## Orquestração

WF015 **não possui Schedule/Cron interno no JSON atual**.

## Fluxo

1. Valida empresa/configuração.
2. Busca clientes.
3. Busca agendamentos.
4. Deriva o último atendimento real.
5. Bloqueia agendamento futuro.
6. Valida `ACEITA_MARKETING`.
7. Determina tentativa.
8. Consulta `FOLLOWUPS`.
9. Monta mensagem.
10. Envia via WF012.
11. Registra follow-up.
12. Registra logs via WF017.

## Regras globais

- **RN055** — cliente elegível;
- **RN056** — último atendimento pelo histórico;
- **RN057** — agendamento futuro bloqueia;
- **RN058** — tentativa 1: 30–33 dias;
- **RN059** — tentativa 2: 45–48 dias;
- **RN060** — máximo de 2 tentativas por ciclo;
- **RN061** — idempotência.

A antiga referência `RN008` para o limite de tentativas não deve ser utilizada.

## Consentimento

WF015 exige `ACEITA_MARKETING=SIM`.

A origem/default desse campo no processo de cadastro permanece como gap conhecido e deve ser corrigida na origem, não escondida nesta documentação.

## Múltiplos itens

O fluxo foi ajustado/testado para preservar correlação por cliente/candidato, inclusive em erro global de registro e execuções consecutivas.

## Saídas

Resultado por candidato:
- enviado;
- bloqueado;
- não elegível;
- erro técnico.

## Proteções

- erro de busca não pode virar simples "não elegível";
- falha no envio não pode registrar sucesso;
- preservar `phone_number_id`;
- não misturar itens/runs;
- não duplicar envio HTTP da Meta: usar WF012.

## Checklist

- [ ] Tentativa 1.
- [ ] Tentativa 2.
- [ ] Máximo RN060.
- [ ] Agendamento futuro.
- [ ] Sem consentimento.
- [ ] Duplicidade.
- [ ] Multi-item.
- [ ] Erro de busca.
- [ ] Erro global no registro.
- [ ] Execuções consecutivas sem contaminação.
