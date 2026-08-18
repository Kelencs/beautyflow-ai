# COM-WF013 — Lembrete

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF013` |
| Workflow | Lembrete |
| Arquivo n8n | `COM-WF013-lembrete.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow executado para processar lembretes de uma empresa/período. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Enviar lembretes de agendamentos elegíveis sem duplicar mensagens já enviadas e permitindo nova tentativa quando uma tentativa anterior falhou.

## Entradas principais

- `id_empresa` e contexto de execução do lembrete.

## Fluxo principal

1. Valida a empresa.
2. Busca a configuração da empresa, inclusive `WHATSAPP_PHONE_NUMBER_ID` e fuso.
3. Localiza agendamentos elegíveis para a janela de lembrete.
4. Define o tipo de lembrete (incluindo o lembrete de 24h).
5. Consulta `LEMBRETES` para verificar idempotência.
6. Se já houver o mesmo lembrete com status `ENVIADO`, retorna `LEMBRETE_JA_ENVIADO`.
7. Se não houver envio concluído, monta a mensagem.
8. Envia pelo WF012.
9. Somente após o resultado correspondente, registra/atualiza o controle do lembrete.
10. Registra a execução no WF017.

## Fluxo resumido

```text
COM-WF013 → Google Sheets: EMPRESAS, AGENDAMENTOS, LEMBRETES → COM-WF012 → ADM-WF017
```

## Integrações

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `LEMBRETES`
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- RN005: lembrete principal 24 horas antes do atendimento.
- Idempotência deve considerar agendamento + tipo de lembrete.
- Uma tentativa com falha não deve impedir uma futura repetição.
- Somente `STATUS=ENVIADO` deve bloquear duplicidade do mesmo lembrete.
- Configuração de WhatsApp deve vir da empresa correta.

## Saídas esperadas

- `LEMBRETE_ENVIADO`, `LEMBRETE_JA_ENVIADO`, bloqueio ou erro técnico por candidato.

## Tratamento de erros e logs

- Erro em Sheets precisa ser classificado como técnico.
- Falha do WhatsApp deve permanecer falha, e não criar falsa idempotência de sucesso.
- Vários candidatos podem gerar vários itens de saída; isso é esperado.

## Dependências entre workflows

- Chama: `COM-WF012` e `ADM-WF017`.
- Lê dados de empresa/agendamento/controle de lembrete.

## Checklist mínimo de teste

- [ ] Lembrete elegível enviado.
- [ ] Reexecução do mesmo lembrete retorna `LEMBRETE_JA_ENVIADO`.
- [ ] Tentativa anterior com falha permite retry.
- [ ] Nenhum agendamento na janela.
- [ ] Erro técnico na busca.
- [ ] Falha no envio do WhatsApp.

## Cuidados na manutenção

Preserve a distinção entre `ENVIADO` e tentativa falha. Usar simplesmente 'existe uma linha em LEMBRETES' como bloqueio quebraria o retry.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

