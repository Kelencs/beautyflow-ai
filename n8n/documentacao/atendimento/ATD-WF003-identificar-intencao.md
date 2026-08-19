# ATD-WF003 — Identificar Intenção

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF003` |
| Workflow | Identificar Intenção |
| Arquivo n8n | `ATD-WF003-identificar-intencao.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow após WF002 |
| Última revisão | 19/08/2026 |

## Objetivo

Normalizar a intenção recebida do atendimento e encaminhar a solicitação ao workflow funcional correspondente.

## Entradas

- `id_empresa`;
- `id_cliente`;
- telefone/nome/mensagem;
- `intencao`;
- `confianca`;
- entidades como serviço, data, horário, período, profissional e agendamento;
- `phone_number_id`;
- resposta conversacional.

## Roteamento atual

```text
WF003
├── AGENDAR                    → WF005
├── CONSULTAR_DISPONIBILIDADE  → WF004
├── REAGENDAR                  → WF006
├── CANCELAR                   → WF007
└── OUTRO/fallback             → WF012
```

O WF003 não chama genericamente Clientes, Financeiro ou Administração.

## Integrações

- WF004;
- WF005;
- WF006;
- WF007;
- WF012.

**WF003 não chama WF017 diretamente no JSON atual.**

## Proteções

- intenção desconhecida não pode alterar agenda;
- confiança deve ser normalizada conforme o fluxo;
- `ID_EMPRESA` e contexto devem ser preservados;
- falha de subworkflow deve permanecer erro técnico;
- nova intenção exige atualização coordenada de IA, roteador, requisito e testes.

## Saída

Resultado do workflow correspondente ou fallback conversacional.

## Logging

Não atribuir logging direto ao WF017. Os workflows de domínio podem executar logging conforme suas próprias implementações.

## Checklist

- [ ] AGENDAR → WF005.
- [ ] CONSULTAR_DISPONIBILIDADE → WF004.
- [ ] REAGENDAR → WF006.
- [ ] CANCELAR → WF007.
- [ ] OUTRO/fallback → WF012.
- [ ] Intenção desconhecida não altera agenda.
- [ ] Nenhuma dependência direta fictícia de WF017.
