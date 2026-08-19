# COM-WF013 — Lembrete

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF013` |
| Workflow | Lembrete |
| Arquivo n8n | `COM-WF013-lembrete.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow |
| Última revisão | 19/08/2026 |

## Objetivo

Enviar lembretes de agendamentos elegíveis sem duplicar lembretes já enviados com sucesso e permitindo nova tentativa após falha.

## Orquestração

WF013 **não possui Schedule/Cron interno no JSON atual**. A execução periódica depende de chamador/orquestração externa.

## Fluxo

1. Valida empresa.
2. Consulta configuração.
3. Busca agendamentos elegíveis.
4. Identifica a janela/tipo do lembrete.
5. Verifica `LEMBRETES`.
6. Bloqueia duplicidade somente quando aplicável.
7. Monta mensagem.
8. Envia via WF012.
9. Registra controle do lembrete.
10. Registra log via WF017.

```text
WF013
 ├── EMPRESAS
 ├── AGENDAMENTOS
 ├── LEMBRETES
 ├── WF012
 └── WF017
```

## Regras globais

- **RN034** — lembrete de 24 horas;
- **RN035** — lembrete de 2 horas;
- idempotência por agendamento/tipo;
- tentativa falha não deve criar falsa idempotência;
- configuração WhatsApp deve corresponder à empresa.

A antiga referência `RN005` não deve ser utilizada.

## Saídas

- `LEMBRETE_ENVIADO`;
- `LEMBRETE_JA_ENVIADO`;
- bloqueio/não elegível;
- erro técnico.

## Checklist

- [ ] Janela de 24h.
- [ ] Janela de 2h.
- [ ] Duplicidade.
- [ ] Retry após falha.
- [ ] Nenhum elegível.
- [ ] Erro Sheets.
- [ ] Falha WF012/WhatsApp.
- [ ] Múltiplos candidatos.
