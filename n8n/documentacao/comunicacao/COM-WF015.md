
# COM-WF015 — Follow-up / Reativação

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF015` |
| Workflow | Follow-up / Reativação |
| Arquivo n8n | `COM-WF015-follow-up.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow executado periodicamente por mecanismo externo para uma empresa. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Reengajar clientes inativos com consentimento de marketing, sem abordar quem já possui agendamento futuro e sem repetir a mesma tentativa dentro do mesmo ciclo de inatividade.

## Entradas principais

- `id_empresa` obrigatório.

## Fluxo principal

1. Valida empresa e carrega configuração de WhatsApp/fuso.
2. Busca clientes ativos e dados necessários da empresa.
3. Deriva o último atendimento real pelos `AGENDAMENTOS`, ignorando cancelados.
4. Exclui cliente com agendamento futuro não cancelado.
5. Verifica `ACEITA_MARKETING`.
6. Calcula a faixa de inatividade e determina tentativa 1 ou 2.
7. Consulta `FOLLOWUPS` para garantir idempotência do ciclo.
8. Monta mensagem de reativação.
9. Envia exclusivamente pelo WF012.
10. Registra o follow-up e o resultado.
11. Registra logs pelo WF017.

## Fluxo resumido

```text
COM-WF015 → Google Sheets: EMPRESAS, CLIENTES, AGENDAMENTOS, FOLLOWUPS → COM-WF012 → ADM-WF017
```

## Integrações

- Google Sheets: `EMPRESAS`, `CLIENTES`, `AGENDAMENTOS`, `FOLLOWUPS`
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- Somente cliente `ATIVO` e com `ACEITA_MARKETING=SIM`.
- Último atendimento deve ser derivado de agendamentos reais; não confiar cegamente em campo desatualizado do cadastro.
- Cliente com agendamento futuro não deve receber reativação.
- Tentativa 1: aproximadamente 30–33 dias após último atendimento.
- Tentativa 2: aproximadamente 45–48 dias após último atendimento.
- Máximo de 2 tentativas por ciclo de inatividade (RN008).
- Novo atendimento real inicia novo ciclo.
- Idempotência deve considerar empresa + cliente + último atendimento + número da tentativa.
- Envio deve passar pelo WF012; não duplicar HTTP da Meta neste workflow.

## Saídas esperadas

- Resultado por cliente: follow-up enviado, bloqueado, não elegível ou erro técnico.

## Tratamento de erros e logs

- Falha de consulta deve gerar `ERRO_FOLLOWUP`/resultado técnico equivalente, sem virar simples não elegível.
- Falha no envio não pode marcar tentativa como enviada com sucesso.
- É esperado haver múltiplos itens finais quando vários candidatos são avaliados.

## Dependências entre workflows

- Chama: `COM-WF012` e `ADM-WF017`.
- Necessita acionamento periódico externo; o workflow atual não deve ser presumido como cron autônomo.

## Checklist mínimo de teste

- [ ] Cliente com 30–33 dias sem atendimento.
- [ ] Cliente com 45–48 dias e uma tentativa anterior.
- [ ] Terceira tentativa bloqueada.
- [ ] Cliente com agendamento futuro.
- [ ] `ACEITA_MARKETING` diferente de SIM.
- [ ] Follow-up já enviado no mesmo ciclo.
- [ ] Novo atendimento cria novo ciclo.
- [ ] Erro técnico forçado em AGENDAMENTOS/CLIENTES/FOLLOWUPS.

## Cuidados na manutenção

Débito importante antes de produção: garanta que `ACEITA_MARKETING=SIM` represente consentimento real. O cadastro automático não deve conceder opt-in sem autorização do cliente.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.
