# WF011 — FIN - WF011 - Cobrança

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`FIN-WF011-cobranca.json`](../../workflows/financeiro/FIN-WF011-cobranca.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Executar cobrança automática de saldos pendentes com janela de horário, limite de tentativas, intervalo mínimo e proteção contra cobrança de agendamentos já quitados.

## 2. Identificação técnica

- **Workflow:** `FIN - WF011 - Cobrança`
- **ID funcional:** `WF011`
- **Arquivo JSON:** `FIN-WF011-cobranca.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger`; entrada obrigatória: `id_empresa`.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa` obrigatório.

## 4. Fluxo real do workflow

1. `CODE - Validar Empresa` bloqueia execução sem `id_empresa` para impedir busca multiempresa sem escopo.
2. Busca `EMPRESAS` e `CODE - Avaliar WhatsApp Empresa` exige empresa existente e `WHATSAPP_PHONE_NUMBER_ID` configurado.
3. `CODE - Validar Horário Permitido` aceita cobrança automática somente entre 09:00 (inclusive) e 18:00 (exclusive), em `America/Sao_Paulo`.
4. Em horário válido, consulta em paralelo `PAGAMENTOS`, `COBRANCAS` e `CLIENTES` da empresa.
5. `CODE - Avaliar Cobranças Elegíveis` detecta erros técnicos explicitamente e consolida o estado financeiro mais recente por `ID_AGENDAMENTO`.
6. Agendamento já quitado, saldo inválido, cobrança recente ou limite atingido são bloqueados sem envio.
7. Cobranças elegíveis são enviadas pelo WF012.
8. O resultado do envio é processado e uma linha é adicionada em `COBRANCAS` para registrar a tentativa.
9. Falha de registro em COBRANCAS preserva a correlação do item e retorna `ERRO_COBRANCA`.
10. WF017 registra cada resultado e o SET final expõe o contrato.

## 5. Regras e decisões implementadas

- `id_empresa` é obrigatório; não há fallback multiempresa neste workflow.
- Janela de envio: 09:00–18:00, timezone `America/Sao_Paulo`.
- Como `PAGAMENTOS` é transacional, somente o registro mais recente de cada `ID_AGENDAMENTO` representa o estado financeiro atual.
- `STATUS=PAGO` ou `VALOR_PENDENTE<=0` bloqueia cobrança como `PAGAMENTO_JA_QUITADO`.
- Estado inesperado diferente de `PAGO`/`PARCIAL` com saldo é bloqueado como `VALOR_PENDENTE_INVALIDO`.
- Controle de cobrança é por `ID_AGENDAMENTO`, não por parcela/`ID_PAGAMENTO`.
- Máximo de 3 tentativas automáticas por agendamento.
- Deve haver pelo menos 24 horas desde a última cobrança automática do mesmo agendamento.

## 6. Integrações e dependências

- Google Sheets: `EMPRESAS`, `PAGAMENTOS`, `COBRANCAS`, `CLIENTES`.
- WF012 — Comunicação/WhatsApp.
- WF017 — Logs.

## 7. Saídas e estados

- Sucesso: `COBRANCA_ENVIADA`.
- Bloqueios/estados: `PAGAMENTO_JA_QUITADO`, `PAGAMENTO_NAO_ENCONTRADO`, `COBRANCA_RECENTE`, `LIMITE_COBRANCAS_ATINGIDO`, `FORA_HORARIO_COBRANCA`, `VALOR_PENDENTE_INVALIDO`, `EMPRESA_NAO_ENCONTRADA`, `WHATSAPP_NAO_CONFIGURADO`.
- Falhas técnicas: `ERRO_COBRANCA`.

## 8. Tratamento de erros e bloqueios

- Falhas de leitura em PAGAMENTOS/COBRANCAS/CLIENTES/EMPRESAS são identificadas pelo campo `error`, não pela contagem de itens.
- Falha ao persistir a cobrança em `COBRANCAS` retorna `ERRO_COBRANCA` com os dados correlacionados.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`.

## 10. Critério de manutenção desta documentação

Sempre que `FIN-WF011-cobranca.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
