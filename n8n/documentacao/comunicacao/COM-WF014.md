
# COM-WF014 — Pesquisa de Satisfação

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `COM-WF014` |
| Workflow | Pesquisa de Satisfação |
| Arquivo n8n | `COM-WF014-pesquisa.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow para processar pesquisas pós-atendimento de uma empresa. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Identificar atendimentos concluídos elegíveis, enviar pesquisa de satisfação e impedir duplicidade de pesquisas já enviadas com sucesso.

## Entradas principais

- `id_empresa` obrigatório.

## Fluxo principal

1. Valida empresa.
2. Busca configurações da empresa e fuso/WhatsApp.
3. Carrega atendimentos elegíveis após a conclusão.
4. Consulta a aba `PESQUISAS` para idempotência.
5. Se já existe pesquisa `ENVIADA` para o agendamento, retorna `PESQUISA_JA_ENVIADA`.
6. Monta uma mensagem pós-atendimento personalizada.
7. Envia pelo WF012.
8. Registra a pesquisa somente de acordo com o resultado do envio.
9. Registra log pelo WF017.

## Fluxo resumido

```text
COM-WF014 → Google Sheets: EMPRESAS, AGENDAMENTOS, PESQUISAS → COM-WF012 → ADM-WF017
```

## Integrações

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `PESQUISAS`
- COM-WF012
- ADM-WF017

## Regras de negócio e proteções

- Pesquisa é pós-atendimento; não confundir com follow-up de reativação.
- Pesquisa já enviada com sucesso deve bloquear duplicata.
- Tentativa falha não deve bloquear retry futuro.
- `ID_EMPRESA` deve ser obrigatório para leitura e escrita.

## Saídas esperadas

- `PESQUISA_ENVIADA`, `PESQUISA_JA_ENVIADA`, bloqueio ou erro técnico.

## Tratamento de erros e logs

- Falha no WhatsApp não pode virar pesquisa enviada.
- Falha no Sheets deve ser erro técnico.
- Persistir contexto suficiente para auditoria pelo WF017.

## Dependências entre workflows

- Chama: `COM-WF012` e `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Atendimento elegível gera pesquisa.
- [ ] Reexecução após sucesso gera `PESQUISA_JA_ENVIADA`.
- [ ] Falha de WhatsApp e retry posterior.
- [ ] Sem atendimentos elegíveis.
- [ ] Erro técnico na busca/registro.

## Cuidados na manutenção

A janela de envio pós-atendimento deve permanecer alinhada às regras de experiência do cliente. Se a janela mudar, ajuste o teste de elegibilidade e este documento.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.
