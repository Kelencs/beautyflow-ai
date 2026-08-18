# CLI-WF008 — Cadastrar Cliente

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `CLI-WF008` |
| Workflow | Cadastrar Cliente |
| Arquivo n8n | `CLI-WF008-cadastrar-cliente.json` |
| Status | Versionado e validado em testes |
| Trigger | Subworkflow chamado quando o atendimento precisa resolver/cadastrar um cliente. |
| Última revisão desta documentação | 18/08/2026 |

## Objetivo

Localizar um cliente pelo telefone dentro da empresa e, se não existir, criar um novo cadastro sem gerar duplicidade.

## Entradas principais

- `id_empresa`.
- `telefone_cliente`.
- `nome_cliente`.
- `origem`.

## Fluxo principal

1. Normaliza empresa, telefone, nome e origem.
2. Busca em `CLIENTES` usando `ID_EMPRESA` + telefone.
3. Avalia explicitamente três situações: encontrado, vazio legítimo e erro técnico.
4. Se já existe, retorna o cliente sem criar nova linha.
5. Se não existe, gera um identificador único `CLI-...`.
6. Monta o cadastro com status ativo e timestamps.
7. Registra o novo cliente em `CLIENTES`.
8. Retorna o identificador e o status da operação.

## Fluxo resumido

```text
CLI-WF008 → Google Sheets: CLIENTES → ADM-WF017 para logs
```

## Integrações

- Google Sheets: `CLIENTES`
- ADM-WF017 para logs

## Regras de negócio e proteções

- A chave prática de duplicidade é empresa + telefone normalizado.
- Busca vazia legítima não pode ser confundida com erro do Google Sheets.
- Erro técnico na verificação bloqueia a criação.
- Cadastro existente deve retornar `CLIENTE_EXISTENTE`.
- Novo cadastro deve retornar identificador próprio e status ativo.

## Saídas esperadas

- `id_cliente` e dados normalizados.
- Status como `CLIENTE_EXISTENTE` ou cliente cadastrado com sucesso.

## Tratamento de erros e logs

- Erro na busca deve sair por ramo técnico e não criar cliente.
- Erro no append deve retornar erro de cadastro.
- Registrar contexto no WF017 sem mascarar a causa.

## Dependências entre workflows

- Pode ser chamado por: `ATD-WF002` e outros fluxos de cliente.
- Logs: `ADM-WF017`.

## Checklist mínimo de teste

- [ ] Cliente novo.
- [ ] Cliente duplicado.
- [ ] Cliente existente com telefone formatado de outra forma.
- [ ] Erro técnico forçado na busca de CLIENTES.
- [ ] Erro técnico no registro do novo cliente.

## Cuidados na manutenção

Ponto de atenção do projeto: o fluxo atual trabalha com `ACEITA_MARKETING` como padrão. Antes de produção comercial, implemente consentimento real/opt-in e ajuste o WF015.

## Convenções do projeto

- Manter isolamento multiempresa por `ID_EMPRESA` em toda leitura/gravação operacional.
- Diferenciar regra de negócio, resultado vazio legítimo e erro técnico.
- Evitar mascarar falhas do Google Sheets como “não encontrado”.
- Usar `ADM-WF017` para auditoria centralizada sempre que o workflow precisar registrar execução/erro.
- Não versionar credenciais, tokens, API keys ou valores secretos no Git.

