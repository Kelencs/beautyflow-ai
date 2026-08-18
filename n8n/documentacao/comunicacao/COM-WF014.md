# WF014 — COM - WF014 - Pesquisa

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`COM-WF014-pesquisa.json`](../../workflows/comunicacao/COM-WF014-pesquisa.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Enviar pesquisa pós-atendimento na janela definida após o término do serviço, evitando duplicidade e registrando o resultado.

## 2. Identificação técnica

- **Workflow:** `COM - WF014 - Pesquisa`
- **ID funcional:** `WF014`
- **Arquivo JSON:** `COM-WF014-pesquisa.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger`; não existe Schedule/Cron no JSON atual.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa` obrigatório.

## 4. Fluxo real do workflow

1. Valida a empresa e a configuração de WhatsApp em `EMPRESAS`.
2. Consulta `AGENDAMENTOS`, `PESQUISAS`, `CLIENTES`, `PROFISSIONAIS` e `SERVICOS` da empresa.
3. Calcula o término real do atendimento usando data e `HORA_FIM`.
4. Seleciona apenas atendimentos dentro da janela pós-atendimento configurada.
5. Valida cliente/telefone e os dados necessários para personalizar a pesquisa.
6. Aplica idempotência usando registros já enviados em `PESQUISAS`.
7. Envia a mensagem pelo WF012.
8. Registra o resultado em `PESQUISAS`, consolida, chama WF017 e prepara a saída.

## 5. Regras e decisões implementadas

- `id_empresa` é obrigatório.
- Janela de elegibilidade atual: de 1 a 4 horas após o fim do atendimento (`HORA_FIM`).
- O código avalia o fim do atendimento; eventos futuros ou ainda não encerrados não são elegíveis.
- Idempotência bloqueia nova pesquisa quando já existe registro enviado para o agendamento; tentativa com falha não deve equivaler a envio concluído.
- O envio é delegado ao WF012, sem HTTP direto à Meta.

## 6. Integrações e dependências

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `PESQUISAS`, `CLIENTES`, `PROFISSIONAIS`, `SERVICOS`.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Resultados típicos: `PESQUISA_ENVIADA`, `PESQUISA_JA_ENVIADA`, `AGENDAMENTO_NAO_ELEGIVEL`, `ERRO_PESQUISA`, além de bloqueios de empresa/WhatsApp.

## 8. Tratamento de erros e bloqueios

- Erros técnicos nas consultas são tratados como erro, não como ausência de elegíveis.
- Sem empresa ou `WHATSAPP_PHONE_NUMBER_ID`, o processamento é bloqueado.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`.
- O workflow depende de um chamador/agendador externo para execução periódica.

## 10. Critério de manutenção desta documentação

Sempre que `COM-WF014-pesquisa.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
