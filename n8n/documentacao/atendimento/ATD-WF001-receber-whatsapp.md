# ATD-WF001 — Receber WhatsApp

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF001` |
| Workflow | Receber WhatsApp |
| Arquivo n8n | `ATD-WF001-receber-whatsapp.json` |
| Status | Versionado no repositório |
| Trigger | Webhook da Meta/WhatsApp Cloud API (GET para validação e POST para eventos). |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Ser a porta de entrada do BeautyFlow para mensagens recebidas pelo WhatsApp. O workflow valida o evento, normaliza o payload da Meta e encaminha somente o contexto necessário para o atendimento inteligente.

## Entradas principais

- `hub.mode`, `hub.verify_token` e `hub.challenge` na validação do webhook.
- Payload de mensagens da WhatsApp Cloud API no POST.
- Dados extraídos: telefone, nome, texto, tipo da mensagem, `phone_number_id`, identificador da mensagem e timestamp.

## Fluxo principal

1. Recebe a chamada do webhook da Meta.
2. Responde ao desafio de verificação quando a chamada é de validação do webhook.
3. Extrai a primeira mensagem válida do payload recebido.
4. Normaliza telefone, nome, texto, identificadores e origem.
5. Descarta/encerra eventos que não representam uma mensagem utilizável.
6. Monta o contrato interno do BeautyFlow.
7. Executa o `ATD-WF002 — IA Atendimento` e aguarda o processamento.

## Fluxo resumido

```text
ATD-WF001 → WhatsApp Cloud API / Meta → ATD-WF002 — IA Atendimento
```

## Integrações

- WhatsApp Cloud API / Meta
- ATD-WF002 — IA Atendimento

## Regras de negócio e proteções

- O WF001 não deve conter regra de negócio de agenda, cliente ou financeiro.
- O payload externo deve ser convertido para um contrato interno estável antes de chamar outros workflows.
- O telefone deve ser sanitizado para reduzir diferenças de formatação.
- O `phone_number_id` precisa ser preservado para que os workflows de comunicação saibam por qual número responder.
- Eventos sem mensagem válida não devem seguir para IA.

## Saídas esperadas

- `id_empresa`, `mensagem_id`, `telefone_cliente`, `nome_cliente`, `tipo_mensagem`, `mensagem_texto`, `timestamp`, `phone_number_id` e `origem`.
- Encaminhamento do contexto para o WF002.

## Tratamento de erros e logs

- Payload inesperado deve terminar de forma controlada, sem criar dados indevidos.
- Falhas técnicas devem ser registradas no padrão de logs do projeto quando houver contexto suficiente.
- Nunca registrar token da Meta ou credenciais completas em logs.

## Dependências entre workflows

- Chama: `ATD-WF002`.
- É chamado por: Meta/WhatsApp Cloud API.
- Logs centralizados: `ADM-WF017`, quando aplicável.

## Checklist mínimo de teste

- [ ] Validar o GET do webhook com token correto.
- [ ] Validar uma mensagem de texto real recebida no POST.
- [ ] Validar evento sem mensagem e confirmar que não chama o WF002.
- [ ] Validar telefone com caracteres de formatação.
- [ ] Validar propagação correta de `phone_number_id`.

## Cuidados na manutenção

Evite adicionar consultas ao Google Sheets diretamente neste workflow. Ele deve continuar pequeno, rápido e dedicado à recepção/normalização do WhatsApp.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

