# WF002 — ATD - WF002 - IA Atendimento

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ATD-WF002-ia-atendimento.json`](../../workflows/atendimento/ATD-WF002-ia-atendimento.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Identificar ou cadastrar o cliente, consultar contexto conversacional, interpretar a mensagem com Google Gemini, registrar a interação e preparar o roteamento de intenção.

## 2. Identificação técnica

- **Workflow:** `ATD - WF002 - IA Atendimento`
- **ID funcional:** `WF002`
- **Arquivo JSON:** `ATD-WF002-ia-atendimento.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; é acionado pelo WF001 e recebe o contexto normalizado da mensagem.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `mensagem_id`, `telefone_cliente`, `nome_cliente`, `tipo_mensagem`, `mensagem_texto`, `timestamp`, `phone_number_id`, `origem`.

## 4. Fluxo real do workflow

1. `SET - Preparar Dados` normaliza os dados; `id_empresa` usa fallback `EMP001`, telefone é reduzido a dígitos, nome usa `Cliente` e origem usa `WHATSAPP` quando ausente.
2. `GS - Buscar Cliente` consulta CLIENTES por empresa e telefone.
3. `IF - Cliente Existe` reutiliza o cliente encontrado; quando não existe, chama `EXEC - WF008 - Cadastrar Cliente` e aguarda o retorno.
4. O fluxo converge e `GS - Buscar Memória` consulta `IA_MEMORIA` para o cliente, restringindo a memória ativa do tipo de contexto conversacional.
5. `SET - Montar Prompt` prepara contexto, mensagem e dados de negócio para a IA.
6. `Message a model` chama Google Gemini (`models/gemini-3-flash-preview`) com saída estruturada em JSON.
7. `CODE - Interpretar IA` transforma a resposta do modelo em intenção, confiança, entidades e resposta ao cliente.
8. `GS - Registrar Mensagem Recebida` grava a interação em `MENSAGENS`.
9. `SET - Preparar WF003` monta o contrato de roteamento e `EXEC - WF003 - Identificar Intenção` continua o atendimento.

## 5. Regras e decisões implementadas

- A busca de cliente é isolada por `ID_EMPRESA` e telefone; o fallback atual de empresa é `EMP001`.
- Cliente inexistente é criado pelo WF008 antes da consulta de memória.
- `IA_MEMORIA` é **consultada** para compor o contexto; o WF002 atual não contém node de append/update nessa aba.
- A mensagem processada é persistida em `MENSAGENS`.
- A interpretação da IA entrega intenção, confiança e campos como serviço, data, hora, período e profissional para o WF003.

## 6. Integrações e dependências

- Google Sheets: `CLIENTES`, `IA_MEMORIA`, `MENSAGENS`.
- Google Gemini.
- WF008 — Cadastrar Cliente.
- WF003 — Identificar Intenção.

## 7. Saídas e estados

- Contexto de atendimento preparado para o WF003, incluindo cliente, telefone, mensagem, intenção, confiança, entidades, `resposta_cliente`, `phone_number_id` e origem.

## 8. Tratamento de erros e bloqueios

- Falhas das integrações seguem a configuração dos nodes exportados; não há um logger WF017 direto neste workflow.

## 9. Observações do JSON atual

- O comportamento atual lê memória, mas não deve ser descrito como gravação/manutenção de `IA_MEMORIA` pelo próprio WF002.

## 10. Critério de manutenção desta documentação

Sempre que `ATD-WF002-ia-atendimento.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
