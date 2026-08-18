# WF013 — COM - WF013 - Lembrete

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`COM-WF013-lembrete.json`](../../workflows/comunicacao/COM-WF013-lembrete.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Identificar agendamentos próximos e enviar lembretes nas janelas de 24h e 2h, com idempotência e registro de cada tentativa.

## 2. Identificação técnica

- **Workflow:** `COM - WF013 - Lembrete`
- **ID funcional:** `WF013`
- **Arquivo JSON:** `COM-WF013-lembrete.json`
- **Status `active` no JSON versionado:** `false`
- **Gatilho:** `Execute Workflow Trigger`; o JSON atual não contém Schedule/Cron. A execução periódica precisa ser acionada externamente.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa` obrigatório.

## 4. Fluxo real do workflow

1. Valida `id_empresa` e busca a empresa em `EMPRESAS`.
2. Obtém `WHATSAPP_PHONE_NUMBER_ID` e timezone da empresa; usa `America/Sao_Paulo` como referência quando previsto pelo código.
3. Consulta `AGENDAMENTOS`, `LEMBRETES`, `CLIENTES`, `PROFISSIONAIS` e `SERVICOS`, sempre no escopo da empresa.
4. Avalia agendamentos `AGENDADO` futuros e cria candidatos às janelas de lembrete.
5. Verifica cliente/telefone, profissional e serviço necessários para montar a mensagem.
6. Aplica idempotência contra `LEMBRETES` já enviados.
7. Cada candidato elegível é enviado por WF012.
8. Registra o resultado em `LEMBRETES`, consolida o resultado, grava log pelo WF017 e prepara a saída.

## 5. Regras e decisões implementadas

- `id_empresa` é obrigatório.
- Lembrete de 24h: janela entre 22 e 26 horas antes do atendimento.
- Lembrete de 2h: janela entre 1 e 3 horas antes do atendimento.
- Somente agendamentos futuros com `STATUS=AGENDADO` são elegíveis.
- Idempotência considera `ID_AGENDAMENTO + TIPO_LEMBRETE` com registro `STATUS=ENVIADO`; falha anterior não bloqueia nova tentativa.
- Envio é sempre delegado ao WF012.

## 6. Integrações e dependências

- Google Sheets: `EMPRESAS`, `AGENDAMENTOS`, `LEMBRETES`, `CLIENTES`, `PROFISSIONAIS`, `SERVICOS`.
- WF012 — Comunicação.
- WF017 — Logs.

## 7. Saídas e estados

- Resultados típicos: `LEMBRETE_ENVIADO`, `LEMBRETE_JA_ENVIADO`, `AGENDAMENTO_NAO_ELEGIVEL`, `ERRO_LEMBRETE` e bloqueios de configuração de empresa/WhatsApp.

## 8. Tratamento de erros e bloqueios

- Falha técnica de busca é diferenciada de ausência legítima de registros.
- Empresa inexistente ou sem `WHATSAPP_PHONE_NUMBER_ID` bloqueia os envios.

## 9. Observações do JSON atual

- No arquivo versionado, `active` está `false`.
- O JSON não agenda a própria execução; não documentar horário diário inexistente.

## 10. Critério de manutenção desta documentação

Sempre que `COM-WF013-lembrete.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
