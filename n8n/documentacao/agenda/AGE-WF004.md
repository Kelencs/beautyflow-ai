# WF004 — AGE - WF004 - Consultar Disponibilidade

> **Sincronização:** 18/08/2026  
> **Fonte da verdade:** [`AGE-WF004-consultar-disponibilidade.json`](../../workflows/agenda/AGE-WF004-consultar-disponibilidade.json) no branch `main`.  
> **Escopo:** este documento descreve o comportamento efetivamente presente no JSON versionado. Regras ou intenções arquiteturais que não aparecem no workflow atual não são tratadas como implementadas.

## 1. Objetivo

Calcular horários disponíveis para um serviço/profissional em uma data, cruzando regras operacionais do Google Sheets com ocupações do Google Calendar.

## 2. Identificação técnica

- **Workflow:** `AGE - WF004 - Consultar Disponibilidade`
- **ID funcional:** `WF004`
- **Arquivo JSON:** `AGE-WF004-consultar-disponibilidade.json`
- **Status `active` no JSON versionado:** `true`
- **Gatilho:** `Execute Workflow Trigger`; pode ser chamado pelo WF003, WF005 e WF006.

> `active` acima representa o valor exportado no arquivo do Git. Ele não é usado neste documento como evidência de teste nem como confirmação do estado do workflow no n8n Cloud.

## 3. Entradas

- Contexto de empresa/cliente e agenda: `id_empresa`, `id_cliente`, `telefone_cliente`, `nome_cliente`, `servico`, `dados`, `data`, `hora_inicio`, `periodo`, `id_profissional`, `profissional`, `id_agendamento`, `google_event_id`, `origem`, `resposta_cliente`, `motivo_cancelamento`.

## 4. Fluxo real do workflow

1. Consulta `SERVICOS` ativos da empresa.
2. Consulta `PROFISSIONAIS` ativos da empresa.
3. Consulta `DISPONIBILIDADES` ativas da empresa.
4. Consulta `AGENDAMENTOS` da empresa.
5. Consulta eventos do Google Calendar no intervalo da data solicitada.
6. `CODE - Calcular Horários Livres` resolve serviço, profissional e data e calcula horários disponíveis considerando duração, disponibilidade, agendamentos e eventos do Calendar.
7. O resultado é enviado ao WF017 para registro de log e depois formatado pelo SET de saída.

## 5. Regras e decisões implementadas

- O serviço é procurado primeiro por correspondência normalizada e depois por correspondência parcial.
- Profissional pode ser resolvido por ID, por nome ou, quando aplicável, por profissional ativo disponível no conjunto retornado.
- A data aceita formatos tratados pelo código, incluindo referências como hoje/amanhã e datas formatadas.
- O cálculo cruza indisponibilidades já registradas em AGENDAMENTOS e eventos do Google Calendar.
- O Calendar está configurado diretamente nos nodes com o calendário cacheado como **BeautyFlow - Studio Bella**; não é resolvido dinamicamente por empresa no JSON atual.

## 6. Integrações e dependências

- Google Sheets: `SERVICOS`, `PROFISSIONAIS`, `DISPONIBILIDADES`, `AGENDAMENTOS`.
- Google Calendar — calendário configurado diretamente no workflow.
- WF017 — Logs.

## 7. Saídas e estados

- Campos principais: `status`, empresa/cliente, serviço, data/período/profissional, `horarios[]`, `duracao_min`, `valor`, `resposta_cliente` e origem.
- Status de negócio observados no código incluem `OK`, `SEM_HORARIOS`, `SERVICO_NAO_ENCONTRADO`, `SEM_PROFISSIONAL` e `DATA_INVALIDA`.

## 8. Tratamento de erros e bloqueios

- Ausência de serviço/profissional/data válida é convertida em status de negócio pelo código de cálculo.

## 9. Observações do JSON atual

- Não envia mensagem diretamente ao cliente; sua responsabilidade é calcular e devolver disponibilidade.

## 10. Critério de manutenção desta documentação

Sempre que `AGE-WF004-consultar-disponibilidade.json` for alterado, este arquivo deve ser revisado na mesma mudança. Em caso de divergência, o JSON versionado é a referência para o comportamento implementado, e a documentação deve ser atualizada para refletir o fluxo real.
