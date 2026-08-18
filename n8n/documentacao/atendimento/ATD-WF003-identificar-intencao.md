# WF003 — ATD - WF003 - Identificar Intenção

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`ATD-WF003-identificar-intencao.json`](../../workflows/atendimento/ATD-WF003-identificar-intencao.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Normalizar a intenção identificada pela IA e rotear o atendimento para o workflow funcional correspondente ou para uma resposta conversacional.

## 2. Identificação técnica

- **Workflow:** `ATD - WF003 - Identificar Intenção`
- **ID funcional:** `WF003`
- **Arquivo JSON:** `ATD-WF003-identificar-intencao.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; recebe o resultado interpretado pelo WF002.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- `id_empresa`, `id_cliente`, `telefone_cliente`, `nome_cliente`, `mensagem_texto`, `intencao`, `confianca`, `servico`, `data`, `hora_inicio`, `periodo`, `profissional`, `resposta_cliente`, `phone_number_id`, `origem`.

## 4. Fluxo real do workflow

1. `SET - Normalizar Intenção1` padroniza a intenção em caixa alta, converte confiança para número e preserva o contexto.
2. O node de Switch avalia a intenção.
3. `AGENDAR` chama WF005 — Criar Agendamento.
4. `CONSULTAR_DISPONIBILIDADE` chama WF004 — Consultar Disponibilidade.
5. `REAGENDAR` chama WF006 — Reagendar.
6. `CANCELAR` chama WF007 — Cancelar.
7. Qualquer intenção fora das rotas configuradas segue para WF012, utilizando a `resposta_cliente` preparada pela IA.

## 5. Regras e decisões implementadas

- O WF003 é um roteador: não consulta planilhas nem executa regras de agenda diretamente.
- As chamadas de subworkflow aguardam o workflow de destino conforme configuração exportada.

## 6. Integrações e dependências

- WF004, WF005, WF006 e WF007 — Agenda.
- WF012 — Comunicação/WhatsApp para fallback conversacional.

## 7. Saídas e estados

- O resultado final é produzido pelo workflow de destino acionado pela rota selecionada.

## 8. Tratamento de erros e bloqueios

- Intenção não reconhecida não é descartada: cai no ramo de comunicação pelo WF012.

## 9. Observações do JSON atual

- O JSON atual não possui chamada direta ao WF017.
- Nomes de alguns nodes permanecem com sufixos/genéricos (`Switch1`, `...1`) porque esta documentação espelha o JSON atual.

## 10. Critério de manutenção desta documentação

Sempre que `ATD-WF003-identificar-intencao.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
