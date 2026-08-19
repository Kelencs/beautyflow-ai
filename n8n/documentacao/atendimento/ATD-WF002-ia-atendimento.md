# ATD-WF002 — IA Atendimento

> Documentação técnica do BeautyFlow AI — n8n

## Identificação

| Campo | Valor |
|---|---|
| Código | `ATD-WF002` |
| Workflow | IA Atendimento |
| Arquivo n8n | `ATD-WF002-ia-atendimento.json` |
| Status | Versionado no repositório |
| Trigger | Subworkflow chamado pelo WF001 |
| Última revisão | 19/08/2026 |

## Objetivo

Resolver o contexto do cliente, consultar dados conversacionais disponíveis, executar o Google Gemini e entregar uma saída estruturada ao WF003.

## Entradas principais

- `id_empresa`;
- telefone;
- nome;
- mensagem;
- `phone_number_id`;
- origem;
- identificadores de contexto quando disponíveis.

## Fluxo principal

1. Recebe o contrato do WF001.
2. Busca/resolve cliente.
3. Quando necessário, chama WF008 para cadastro.
4. Consulta contexto disponível, incluindo `IA_MEMORIA`.
5. Monta entrada do Gemini.
6. Executa o modelo.
7. Interpreta/estrutura a resposta.
8. Registra dados previstos em `MENSAGENS`.
9. Chama WF003.

```text
WF001
  ↓
WF002
  ├── Google Sheets
  ├── Google Gemini
  ├── WF008 quando necessário
  ↓
WF003
```

## Memória conversacional

O workflow **lê** `IA_MEMORIA`.

Não documentar que o WF002 mantém/atualiza a memória como capacidade garantida enquanto não houver escrita explícita correspondente no JSON atual.

## Integrações

- Google Gemini;
- Google Sheets;
- WF008;
- WF003.

WF002 não chama WF017 diretamente.

## Multiempresa

O contrato deve preservar `ID_EMPRESA`, mas o código atual ainda possui fallback legado para `EMP001`.

Isso permanece como gap de hardening multiempresa.

## Proteções

- não inventar disponibilidade;
- disponibilidade real deve vir do domínio de agenda;
- cadastro deve ser delegado ao WF008;
- falha de Sheets não pode virar "cliente inexistente";
- não enviar segredo ao modelo;
- não expor erro interno cru ao cliente.

## Saídas

Conforme disponibilidade no fluxo:
empresa/cliente, telefone/nome, mensagem, intenção, confiança, entidades extraídas, resposta ao cliente e dados necessários ao WF003.

## Logging

O projeto possui WF017 como logger central, porém o **WF002 não possui chamada direta ao WF017 no JSON atual**.

## Checklist

- [ ] Cliente existente.
- [ ] Cliente novo via WF008.
- [ ] Contexto/memória lido.
- [ ] Gemini retorna resposta válida.
- [ ] Erro Gemini.
- [ ] Erro Sheets.
- [ ] Saída chega ao WF003.
- [ ] Não afirmar escrita em IA_MEMORIA sem node correspondente.
