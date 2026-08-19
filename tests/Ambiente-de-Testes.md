# Estratégia de Testes — BeautyFlow AI

**Código:** TEST001  
**Versão:** 2.0  
**Data:** 18/08/2026  
**Status:** Ativa  
**Escopo:** WF001–WF018 e integrações utilizadas pelo núcleo n8n

## 1. Objetivo

Definir como o BeautyFlow valida qualidade funcional e técnica dos workflows, evitando que:

- erro técnico seja tratado como regra de negócio;
- múltiplos itens percam correlação;
- efeitos externos sejam duplicados;
- documentação seja marcada como validada sem evidência;
- mudanças em um workflow quebrem subworkflows dependentes.

O JSON versionado representa o comportamento implementado atual. RF/RNF/RN/UC/US representam a intenção do produto. Divergências devem ser registradas como gaps.

## 2. Princípios

1. **Evidência antes de status:** um JSON atualizado não significa workflow validado.
2. **Erro técnico ≠ resultado de negócio:** falha de Sheets, Calendar, Meta ou Drive deve permanecer identificável.
3. **Regressão após correção:** todo fix crítico deve ser seguido de caminho normal e cenário de erro.
4. **Idempotência:** fluxos com efeito externo precisam bloquear duplicidade quando aplicável.
5. **Correlação multi-item:** IDs, valores, tentativas e contexto não podem se misturar.
6. **Dados sintéticos:** testes não devem depender de dados pessoais reais.
7. **Histórico imutável:** relatórios datados antigos não devem ser reescritos para parecer atuais.

## 3. Camadas de teste

### 3.1 Validação estrutural

Antes da execução funcional, conferir:

- JSON válido/importável;
- trigger correto;
- nodes esperados;
- conexões entre branches;
- chamadas `Execute Workflow`;
- credenciais referenciadas;
- `onError`;
- `alwaysOutputData`;
- modo de execução por item/lote;
- integração externa utilizada;
- campos obrigatórios do contrato.

### 3.2 Teste funcional

Executar o caminho principal esperado para cada CT.

Exemplos:

- WF004 retorna horários válidos;
- WF005 cria agendamento;
- WF008 cadastra cliente sem duplicar;
- WF010 registra pagamento;
- WF011 cobra somente saldo atual;
- WF015 seleciona apenas cliente elegível.

### 3.3 Teste de bloqueio de negócio

Exercitar condições como:

- serviço/agendamento/cliente inexistente;
- horário indisponível;
- cancelamento fora da janela;
- valor inválido;
- pagamento já quitado;
- cobrança recente;
- limite de tentativas;
- lembrete/pesquisa/follow-up já enviado;
- agendamento futuro bloqueando follow-up.

### 3.4 Teste de erro técnico

Forçar, em ambiente controlado:

- aba Sheets inexistente;
- erro de Calendar;
- erro de Meta;
- erro de Drive;
- falha de append/update/delete;
- erro global sem `pairedItem`, quando aplicável.

O teste deve confirmar que a falha técnica não se transforma em:

- "não encontrado";
- "não elegível";
- "sem horários";
- "já processado";
- outro resultado de negócio falso.

### 3.5 Regressão

Após correção:

1. repetir o cenário que falhava;
2. repetir o caminho normal;
3. repetir cenário de erro relevante;
4. validar efeitos externos;
5. validar saída final;
6. registrar evidência.

## 4. Estratégia para múltiplos itens

Workflows que processam listas ou múltiplos candidatos devem ser testados com:

- 0 itens legítimos;
- 1 item;
- 2 ou mais itens simultâneos;
- erro global sem `pairedItem`, quando tecnicamente possível;
- execuções consecutivas para detectar contaminação entre runs.

Validar a preservação de:

- `ID_EMPRESA`;
- `ID_CLIENTE`;
- `ID_AGENDAMENTO`;
- `ID_PAGAMENTO`;
- `ID_COBRANCA`;
- `ID_FOLLOWUP`;
- tentativa;
- valor;
- telefone;
- `phone_number_id`;
- status e mensagem.

## 5. Estratégia de idempotência

Prioridade nos workflows:

- WF008 — duplicidade de cliente;
- WF011 — cobrança recente/limite/estado financeiro atual;
- WF013 — lembrete já enviado;
- WF014 — pesquisa já enviada;
- WF015 — follow-up por ciclo/tentativa.

A repetição da mesma execução não deve criar efeito externo indevido.

## 6. Contratos entre subworkflows

Validar entradas e saídas entre:

- WF002 → WF008;
- WF002 → WF003;
- WF005/WF006 → WF004;
- workflows de domínio → WF012;
- workflows com logging → WF017.

Quando o node `Execute Workflow` receber múltiplos itens, validar conscientemente o modo de execução por item ou lote.

## 7. Integrações externas

### WhatsApp Cloud API / Meta

Validar:

- payload de entrada;
- dados obrigatórios de envio;
- resposta de sucesso;
- 4xx/5xx;
- token/credencial;
- persistência do resultado.

Falha de autenticação Meta não deve ser tratada automaticamente como falha da regra funcional.

### Google Gemini

Validar no WF002:

- resposta esperada;
- intenção reconhecível;
- retorno vazio/malformado;
- erro de credencial/quota;
- preservação de contexto.

### Google Calendar

Validar:

- consulta;
- criação;
- atualização/reagendamento conforme configuração atual;
- cancelamento;
- erro de integração;
- conflito de agenda.

### Google Sheets

Validar:

- encontrado;
- zero linhas legítimo;
- múltiplos itens;
- erro de busca;
- erro de append/update/delete;
- `row_number`;
- isolamento por `ID_EMPRESA` quando implementado.

### Google Drive

Validar WF016:

- cópia;
- identificação de backups;
- retenção >30 dias;
- erro de cópia/listagem/exclusão;
- proteção do arquivo origem.

## 8. Testes não funcionais

### Segurança

Cobrir:

- segredos;
- permissões;
- isolamento multiempresa;
- logs;
- rate limiting quando aplicável;
- LGPD/dados pessoais.

### Carga

Roteiros planejados:

- 100 mensagens;
- 1000 mensagens;
- stress test.

Não executar carga real contra clientes/contas externas sem ambiente apropriado.

### Aceitação

UAT por persona:

- Cliente;
- Profissional;
- Proprietário;
- Administrador.

A UAT do BeautyFlow App será ampliada à medida que as telas forem implementadas.

## 9. Status de validação

| Status | Critério |
|---|---|
| ✅ Validado | Evidência suficiente dos cenários críticos definidos |
| 🟡 Parcial | Núcleo validado, mas existe cenário relevante pendente |
| ⚠️ Externo | Lógica validada, porém integração/credencial alvo não confirmada |
| ❌ Reprovado | Comportamento diverge do esperado |
| ⚪ Revalidar | Evidência consolidada insuficiente para afirmar aprovação |

## 10. Critério de conclusão de um workflow

Para receber `✅ Validado`, conforme aplicável:

- caminho principal executado;
- bloqueios críticos exercitados;
- erro técnico relevante exercitado ou justificado;
- múltiplos itens validados;
- idempotência validada;
- efeitos externos conferidos;
- saída final conferida;
- regressão concluída;
- evidência registrada;
- CT e matriz sincronizados.

## 11. Fontes oficiais

- Plano: `tests/Plano-de-Testes.md`
- Ambiente: `tests/Ambiente-de-Testes.md`
- Matriz: `tests/Matriz-de-Rastreabilidade.md`
- Casos: `tests/Casos-de-Teste/`
- Evidências: `tests/Evidencias/`
- Workflows: `n8n/workflows/`
- Documentação técnica: `n8n/documentacao/`
