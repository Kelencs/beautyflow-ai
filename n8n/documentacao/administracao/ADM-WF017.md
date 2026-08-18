# ADM-WF017 — Logs

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ADM-WF017` |
| Workflow | Logs |
| Arquivo n8n | `ADM-WF017-logs.json` |
| Status | Versionado e usado como serviço central |
| Trigger | Subworkflow chamado pelos demais workflows. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Centralizar a auditoria técnica e funcional do BeautyFlow em uma estrutura de log consistente, sem interromper o workflow chamador quando o próprio registro de log falha.

## Entradas principais

- `id_empresa`, `workflow`, `node`, `tipo`, `evento`, `status`, `mensagem`.
- `dados` (objeto/string) e `execution_id`.

## Fluxo principal

1. Recebe o evento de log.
2. Normaliza campos obrigatórios sem esconder ausência de informação.
3. Serializa `dados` para JSON/string consistente.
4. Gera `ID_LOG` único e `DATA_HORA`.
5. Registra a linha na aba `LOGS`.
6. Se o append funcionar, retorna `log_registrado=true`.
7. Se o append falhar, captura o erro e retorna `log_registrado=false` sem derrubar o chamador.

## Fluxo resumido

```text
ADM-WF017 → Google Sheets: LOGS
```

## Integrações

- Google Sheets: `LOGS`

## Regras de negócio e proteções

- `node` deve ser dinâmico e representar a origem real do evento.
- Campos ausentes relevantes devem ficar explícitos (`NAO_INFORMADO`) em vez de serem inventados.
- `dados` objeto deve ser serializado de forma segura.
- Falha do próprio logger não deve causar cascata de falhas no workflow de negócio.
- Nunca gravar senhas, tokens, secret keys ou credenciais completas.

## Saídas esperadas

- `log_registrado`, `id_log`, `data_hora` e `erro`.
- Contrato de saída estável tanto em sucesso quanto em falha.

## Tratamento de erros e logs

- Erro de append é capturado pelo próprio WF017.
- O logger deve retornar erro descritivo, mas não lançar exceção desnecessária ao chamador.

## Dependências entre workflows

- Chamado por: workflows WF001–WF016 e rotinas administrativas quando aplicável.
- É infraestrutura transversal do projeto.

## Checklist mínimo de teste

- [ ] Log simples de sucesso.
- [ ] Log técnico com objeto em `dados`.
- [ ] `dados` já em string JSON.
- [ ] Campos opcionais ausentes.
- [ ] Falha forçada no append de LOGS.
- [ ] Confirmar que o chamador continua recebendo saída controlada.

## Cuidados na manutenção

Qualquer mudança de colunas em `LOGS` deve ser tratada como alteração de contrato compartilhado. Teste pelo menos um workflow de cada domínio após modificar o WF017.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

