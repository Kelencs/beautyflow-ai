# ATD-WF002 — IA Atendimento

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF002` |
| Workflow | IA Atendimento |
| Arquivo n8n | `ATD-WF002-ia-atendimento.json` |
| Status | ⚠️ Documentação criada pelo contrato atual; exportar o JSON do n8n e versionar no Git |
| Trigger | Subworkflow chamado pelo ATD-WF001. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Executar o atendimento conversacional com IA, recuperar o contexto necessário do cliente, manter memória conversacional e devolver uma resposta estruturada que possa ser roteada pelo WF003.

## Entradas principais

- `id_empresa`, `telefone_cliente`, `nome_cliente`, `mensagem_texto`, `phone_number_id` e `origem` vindos do WF001.
- Identificação do cliente, quando já conhecida.
- Contexto/memória armazenado para a conversa.

## Fluxo principal

1. Recebe a mensagem normalizada pelo WF001.
2. Resolve o cliente existente ou aciona o cadastro pelo WF008 quando necessário.
3. Consulta a memória/contexto da conversa na aba `IA_MEMORIA`.
4. Monta o contexto para o modelo Gemini sem misturar dados de empresas diferentes.
5. Solicita ao modelo uma resposta e, quando aplicável, uma intenção estruturada.
6. Registra a mensagem/contexto necessário em `MENSAGENS` e/ou `IA_MEMORIA`.
7. Entrega ao WF003 dados estruturados como intenção, confiança, serviço, data, horário, período e profissional quando identificados.

## Fluxo resumido

```text
ATD-WF002 → Google Gemini → Google Sheets: CLIENTES, MENSAGENS, IA_MEMORIA → CLI-WF008 — Cadastrar Cliente
```

## Integrações

- Google Gemini
- Google Sheets: `CLIENTES`, `MENSAGENS`, `IA_MEMORIA`
- CLI-WF008 — Cadastrar Cliente
- ATD-WF003 — Identificar Intenção

## Regras de negócio e proteções

- Toda leitura de dados deve respeitar `ID_EMPRESA`.
- A IA não deve inventar disponibilidade; horários reais devem ser consultados no domínio de agenda.
- O cadastro de um novo cliente deve ser delegado ao WF008.
- A saída deve ser estruturada o suficiente para o WF003 fazer o roteamento sem interpretar texto livre novamente.
- Informações sensíveis e credenciais não devem ser enviadas ao modelo nem gravadas em logs.

## Saídas esperadas

- `id_empresa`, `id_cliente`, telefone, nome e mensagem do cliente.
- `intencao`, `confianca` e entidades extraídas, quando disponíveis.
- `resposta_cliente` e dados necessários ao próximo workflow.

## Tratamento de erros e logs

- Falha do Gemini deve gerar saída técnica controlada, evitando apresentar erro interno cru ao cliente.
- Falha em Sheets não deve ser tratada como cliente inexistente.
- Erros devem ser enviados ao padrão de logging do WF017.

## Dependências entre workflows

- Chamado por: `ATD-WF001`.
- Pode chamar: `CLI-WF008`.
- Encaminha para: `ATD-WF003`.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Cliente já cadastrado.
- [ ] Cliente novo, validando criação via WF008.
- [ ] Mensagem com intenção de agendar.
- [ ] Mensagem sem intenção operacional clara.
- [ ] Falha forçada no Gemini.
- [ ] Falha forçada na leitura de `IA_MEMORIA`.
- [ ] Confirmar isolamento por `ID_EMPRESA`.

## Cuidados na manutenção

Antes de considerar esta documentação definitiva, exporte o WF002 atual do n8n, salve o JSON em `n8n/workflows/atendimento/` e reconcilie nomes de nodes/campos com este documento.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

