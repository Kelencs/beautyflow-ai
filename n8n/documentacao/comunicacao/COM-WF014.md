# COM-WF014 — Pesquisa de Satisfação

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF014` |
| Workflow | Pesquisa de Satisfação |
| Arquivo n8n | `COM-WF014-pesquisa.json` |
| Status | 🟡 Versionado; validação consolidada parcial |
| Trigger | Subworkflow |
| Última revisão | 19/08/2026 |

## Objetivo

Identificar atendimentos concluídos elegíveis, enviar pesquisa de satisfação e impedir duplicidade de pesquisas já enviadas com sucesso.

## Orquestração

WF014 **não possui Schedule/Cron interno no JSON atual**. A execução periódica depende de mecanismo externo.

## Janela atual

A elegibilidade implementada considera atendimento cuja `HORA_FIM` esteja aproximadamente entre **1 e 4 horas antes da execução**.

Se essa janela mudar no código, atualizar RN052, CT014 e esta documentação.

## Fluxo

1. Valida `id_empresa`.
2. Consulta configuração da empresa.
3. Busca atendimentos concluídos.
4. Aplica janela de 1h–4h.
5. Verifica `PESQUISAS`.
6. Bloqueia pesquisa já enviada.
7. Monta mensagem.
8. Envia via WF012.
9. Registra pesquisa conforme resultado.
10. Registra log via WF017.

```text
WF014
 ├── EMPRESAS
 ├── AGENDAMENTOS
 ├── PESQUISAS
 ├── WF012
 └── WF017
```

## Escopo funcional

WF014 **envia** a pesquisa.

Ele não captura/processa nota ou comentário recebido. A captura da resposta é requisito separado de backlog.

## Regras globais

- **RN052** — janela pós-atendimento;
- **RN053** — idempotência da pesquisa;
- **RN054** — preservar dados relacionados.

## Status de teste

A lógica principal e cenários relevantes já foram exercitados, mas a consolidação oficial mantém WF014 como **parcialmente validado** enquanto o cenário técnico pendente não for fechado com evidência final.

## Proteções

- falha WhatsApp não pode virar `PESQUISA_ENVIADA`;
- falha Sheets deve permanecer erro técnico;
- tentativa falha não deve bloquear retry futuro;
- `ID_EMPRESA` deve ser preservado.

## Checklist

- [ ] Fora da janela.
- [ ] Elegível 1h–4h.
- [ ] Pesquisa já enviada.
- [ ] Falha WhatsApp.
- [ ] Erro técnico de busca.
- [ ] Erro de registro.
- [ ] Regressão final do cenário técnico pendente.
