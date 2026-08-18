# CLI-WF009 — Atualizar Cliente

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `CLI-WF009` |
| Workflow | Atualizar Cliente |
| Arquivo n8n | `CLI-WF009-atualizar-cliente.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow para alteração de cadastro. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Atualizar parcialmente os dados de um cliente existente sem apagar campos atuais quando a requisição não fornece novo valor.

## Entradas principais

- `id_empresa` e `id_cliente`/chave usada na busca.
- Objeto `dados` com os campos a atualizar.
- Metadados de origem quando necessários.

## Fluxo principal

1. Valida entrada tipada e empresa.
2. Busca o cliente na aba `CLIENTES`.
3. Avalia separadamente encontrado, não encontrado e erro técnico.
4. Monta atualização parcial mesclando novos campos com valores atuais.
5. Atualiza somente o registro correto.
6. Atualiza timestamp de última alteração.
7. Retorna resultado padronizado.
8. Registra o evento no WF017.

## Fluxo resumido

```text
CLI-WF009 → Google Sheets: CLIENTES → ADM-WF017
```

## Integrações

- Google Sheets: `CLIENTES`
- ADM-WF017

## Regras de negócio e proteções

- Campo ausente/vazio na requisição não deve apagar informação válida sem intenção explícita.
- `ID_EMPRESA` deve fazer parte da resolução do registro.
- Estados padronizados incluem `CLIENTE_ATUALIZADO`, `CLIENTE_NAO_ENCONTRADO` e `ERRO_ATUALIZACAO`.
- Erro do Sheets não pode ser convertido em cliente não encontrado.

## Saídas esperadas

- Cliente atualizado ou status de não encontrado/erro.
- Dados consolidados necessários ao chamador.

## Tratamento de erros e logs

- Falha na busca segue caminho técnico.
- Falha na atualização retorna `ERRO_ATUALIZACAO`.
- Logs devem apontar o node/origem real do erro.

## Dependências entre workflows

- Pode ser chamado pelo atendimento e, futuramente, pelo gateway do app.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Atualização de um único campo.
- [ ] Atualização de múltiplos campos.
- [ ] Campo não enviado preserva valor anterior.
- [ ] Cliente inexistente.
- [ ] Erro técnico na busca.
- [ ] Erro técnico na atualização.

## Cuidados na manutenção

Mantenha o contrato de atualização parcial. Não substitua o registro inteiro por um objeto incompleto vindo do chamador.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

