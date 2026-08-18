# ATD-WF003 — Identificar Intenção

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF003` |
| Workflow | Identificar Intenção |
| Arquivo n8n | `ATD-WF003-identificar-intencao.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow após o processamento de IA. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Normalizar a intenção identificada no atendimento e encaminhar a solicitação para o workflow funcional correto.

## Entradas principais

- `id_empresa`, `id_cliente`, telefone, nome e mensagem.
- `intencao` e `confianca`.
- Entidades como `servico`, `data`, `hora_inicio`, `periodo`, `profissional` e `id_agendamento` quando disponíveis.
- `phone_number_id`, `origem` e `resposta_cliente`.

## Fluxo principal

1. Recebe a saída estruturada do atendimento.
2. Normaliza a intenção para um conjunto conhecido.
3. Normaliza a confiança para valor numérico.
4. Executa o roteamento por `Switch/IF`.
5. Encaminha operações de agenda para WF004/WF005/WF006/WF007 conforme a intenção.
6. Para intenções não operacionais, mantém resposta conversacional sem executar alteração indevida.

## Fluxo resumido

```text
ATD-WF003 → AGE-WF004 a AGE-WF007 → COM-WF012 quando é necessário enviar resposta → ADM-WF017 para logs
```

## Integrações

- AGE-WF004 a AGE-WF007
- COM-WF012 quando é necessário enviar resposta
- ADM-WF017 para logs

## Regras de negócio e proteções

- Intenções reconhecidas incluem `AGENDAR`, `CONSULTAR_DISPONIBILIDADE`, `REAGENDAR` e `CANCELAR`.
- Fallback deve ser seguro: intenção desconhecida não pode criar, reagendar ou cancelar agendamento.
- Todos os dados de contexto devem manter `ID_EMPRESA`.

## Saídas esperadas

- Execução do workflow correspondente à intenção.
- Resposta/resultado consolidado para continuar a conversa.

## Tratamento de erros e logs

- Intenção ausente ou inválida deve cair no caminho de fallback.
- Falha do workflow chamado deve ser tratada como erro técnico, e não como regra de negócio.
- Registrar eventos relevantes no WF017.

## Dependências entre workflows

- Chamado por: `ATD-WF002`.
- Pode chamar: `AGE-WF004`, `AGE-WF005`, `AGE-WF006`, `AGE-WF007`, `COM-WF012`.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Uma execução para cada intenção suportada.
- [ ] Intenção em minúsculas/misturada para validar normalização.
- [ ] Intenção desconhecida.
- [ ] Confiança ausente ou em formato inesperado.
- [ ] Falha técnica em um subworkflow chamado.

## Cuidados na manutenção

Ao criar uma nova intenção no BeautyFlow, atualize simultaneamente o contrato da IA, o roteador WF003 e a documentação do workflow de destino.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

