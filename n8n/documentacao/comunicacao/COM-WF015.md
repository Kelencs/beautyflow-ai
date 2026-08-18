# WF015 — COM - WF015 - Follow-up

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`COM-WF015-follow-up.json`](../../workflows/comunicacao/COM-WF015-follow-up.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Reengajar clientes inativos em janelas de aproximadamente 30 e 45 dias, respeitando marketing, agendamentos futuros, ciclo de inatividade e idempotência.

## 2. Identificação técnica

- **Workflow:** `COM - WF015 - Follow-up`
- **ID funcional:** `WF015`
- **Arquivo JSON:** `COM-WF015-follow-up.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger`; não existe Schedule/Cron no JSON atual.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa` obrigatório.

## 4. Fluxo real do workflow

1. Valida `id_empresa`, busca a empresa e verifica configuração de WhatsApp/timezone.
2. Consulta `CLIENTES`, `AGENDAMENTOS` e `FOLLOWUPS` da empresa.
3. Para cada cliente apto, deriva o último atendimento **real** a partir de `AGENDAMENTOS`, ignorando cancelados e usando atendimentos já encerrados.
4. Bloqueia cliente que possua agendamento futuro não cancelado.
5. Calcula a tentativa de reengajamento conforme dias desde o último atendimento real.
6. Aplica idempotência por ciclo de inatividade e tentativa.
7. Envia cada follow-up elegível pelo WF012.
8. Registra o resultado em `FOLLOWUPS`; os ramos de erro/sucesso preservam correlação multi-item.
9. Consolida resultados, registra logs no WF017 e prepara a saída final.

## 5. Regras e decisões implementadas

- `id_empresa` é obrigatório.
- Somente clientes com `STATUS=ATIVO` e `ACEITA_MARKETING=SIM` são elegíveis.
- O último atendimento é derivado de `AGENDAMENTOS`; `CLIENTES.ULTIMO_ATENDIMENTO` não é usado como fonte da decisão.
- Agendamento futuro com status diferente de `CANCELADO` bloqueia follow-up.
- Tentativa 1: entre 30 e 33 dias após o último atendimento real.
- Tentativa 2: entre 45 e 48 dias.
- Máximo de 2 tentativas por ciclo de inatividade.
- Um novo atendimento real altera a chave do ciclo e permite um novo ciclo futuro.
- Idempotência usa empresa + cliente + último atendimento + tentativa; somente follow-up efetivamente enviado bloqueia repetição correspondente.
- Envio é sempre via WF012.

## 6. Integrações e dependências

- Google Sheets: `EMPRESAS`, `CLIENTES`, `AGENDAMENTOS`, `FOLLOWUPS`.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Resultados cobrem follow-up enviado, já enviado, cliente não elegível, cliente com agendamento futuro e `ERRO_FOLLOWUP`, além de bloqueios de empresa/WhatsApp.

## 8. Tratamento de erros e bloqueios

- Falhas técnicas de busca são separadas de “nenhum cliente elegível”.
- Falha global ao registrar follow-up é expandida/correlacionada para os candidatos correspondentes antes da consolidação.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`.
- Existe dependência funcional do campo `ACEITA_MARKETING`; o WF008 atual cria novos clientes com esse campo em `SIM`.
- O JSON não possui Schedule/Cron e depende de acionamento externo periódico.

## 10. Critério de manutenção desta documentação

Sempre que `COM-WF015-follow-up.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
