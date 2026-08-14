# BeautyFlow — Documentação Consolidada de Testes dos Workflows

**Data de consolidação:** 14/08/2026  
**Projeto:** BeautyFlow AI  
**Plataforma de testes:** n8n Cloud  
**Objetivo:** registrar os cenários de teste já executados, seus resultados, correções encontradas durante os testes e pendências conhecidas.

> Esta documentação consolida apenas cenários que foram efetivamente discutidos/testados e resultados que ficaram registrados no histórico. Onde o detalhe completo de um teste antigo não está mais disponível, isso é indicado explicitamente para evitar inventar evidências.

## Legenda de status

- ✅ **Validado** — cenário executado e comportamento esperado confirmado.
- 🟡 **Parcialmente validado** — parte importante dos cenários passou, mas existe pendência específica.
- ⚠️ **Pendência externa/configuração** — lógica validada, mas depende de credencial, token ou integração externa.
- ❌ **Falhou no teste** — comportamento incorreto detectado.
- 🔧 **Corrigido durante os testes** — falha encontrada e correção aplicada/confirmada.

## Resumo executivo

| Workflow | Nome | Status atual |
|---|---|---|
| WF008 | Cadastro Cliente | ✅ Validado anteriormente |
| WF009 | Atualizar Cadastro | ✅ Validado |
| WF010 | Registrar Pagamento | ✅ Testado |
| WF011 | Cobrança | 🟡 Parcialmente validado |
| WF012 | Confirmação / Comunicação | ✅ Lógica validada / ⚠️ WhatsApp real pendente |
| WF013 | Lembrete | ✅ Validado anteriormente |
| WF014 | Pesquisa | 🟡 Parcialmente validado |
| WF015 | Follow-up | ⏳ Ainda não documentado nesta rodada |
| WF016 | Backup | ✅ Validado |
| WF017 | Logs | ✅ Validado |
| WF018 | Limpeza | ✅ Validado |

---

# WF008 — Cadastro Cliente

## Status

✅ **Validado anteriormente.**

## Evidências registradas

O WF008 foi revisado e utilizado como workflow de cadastro de cliente com fluxo de busca de duplicidade, criação e registro de log via WF017.

Estrutura registrada:

- TRG
- GS Buscar Cliente
- IF Cliente Existe
- GS Criar Cliente
- EXEC WF017 Logs
- SET Saída

## Observação

O histórico disponível confirma a validação do workflow, porém não preserva neste momento a lista completa, cenário a cenário, de todas as execuções feitas no n8n Cloud. Para manter a documentação fiel, não foram inventados casos adicionais.

---

# WF009 — Atualizar Cadastro

## Status

✅ **VALIDADO**

## Validações registradas

- 6/6 Code nodes revisados.
- 21 cenários de teste.
- 26/26 verificações aprovadas.

## Regras validadas

- Atualização parcial de cliente.
- Atualização de múltiplos campos.
- Tratamento de cliente não encontrado.
- Tratamento de erro de busca.
- Tratamento de erro de localização/identificação.
- Preparação correta da atualização parcial.
- Consolidação do resultado final.
- Saída padronizada do WF009.

## Estrutura corrigida/validada

- SET Preparar Atualização
- CODE Preparar Erro Busca
- CODE Avaliar Cliente Encontrado
- IF Cliente Encontrado
- CODE Preparar Erro Localização
- CODE Montar Atualização Parcial
- SET Cliente Atualizado
- CODE Preparar Erro Atualização
- MERGE Resultado Atualização
- SET Saída WF009

---

# WF010 — Registrar Pagamento

## Status

✅ **TESTADO**

## Cenários observados durante os testes no n8n Cloud

### 1. Pagamento parcial

Foram usados dados como:

- `ID_AGENDAMENTO = AGE004`
- `VALOR_TOTAL = 100`
- `VALOR_PAGO = 20`
- `FORMA_PAGAMENTO = PIX`

Resultado esperado/observado:

- pagamento tratado como parcial;
- `VALOR_PENDENTE` calculado;
- `STATUS = PARCIAL`;
- registro preparado para a aba PAGAMENTOS.

✅ Aprovado.

### 2. Validação de valor e limite

O fluxo validou:

- valor informado;
- agendamento existente;
- possibilidade de registrar;
- cálculo do pagamento;
- valor dentro do limite.

✅ Aprovado durante a rodada de testes.

### 3. Erro técnico ao buscar agendamento

Foi testado apontando temporariamente a busca para uma aba inválida.

Resultado esperado:

- não registrar pagamento indevido;
- produzir evento de erro técnico;
- preservar dados do contexto para saída/log.

✅ Tratamento confirmado.

### 4. Erro técnico ao registrar pagamento

Foi testado forçando falha no Google Sheets.

Resultado observado:

- `evento_resultado = ERRO_REGISTRO_PAGAMENTO`
- `pagamento_registrado = false`
- mensagem técnica preservada na saída.

✅ Tratamento confirmado.

### 5. Correção de mapeamento no GS Registrar Pagamento

Todos os campos da aba PAGAMENTOS foram preenchidos explicitamente:

- ID_PAGAMENTO
- ID_EMPRESA
- ID_AGENDAMENTO
- ID_CLIENTE
- VALOR_TOTAL
- VALOR_PAGO
- VALOR_PENDENTE
- FORMA_PAGAMENTO
- STATUS
- DATA_HORA
- TRANSACAO_ID
- OBSERVACOES

✅ Confirmado.

---

# WF011 — Cobrança

## Status

🟡 **PARCIALMENTE VALIDADO**

A maior parte das regras de negócio e dos cenários de erro foi validada. Ficou uma pendência específica relacionada ao comportamento de múltiplos itens atravessando `EXEC - WF017 Logs → SET - Preparar Saída WF011` em uma execução limpa.

## Causa raiz encontrada durante os testes

A aba PAGAMENTOS é transacional: cada pagamento gera uma nova linha.

Exemplo real usado:

`PARCIAL 60 → PARCIAL 30 → PAGO 0`

O workflow antigo buscava apenas `STATUS = PARCIAL`, portanto não enxergava a linha mais recente `PAGO`. Isso fazia linhas parciais históricas parecerem dívidas atuais.

### Correção

O workflow passou a:

- buscar todos os pagamentos da empresa;
- agrupar por `ID_AGENDAMENTO`;
- ordenar por `DATA_HORA`;
- considerar apenas o estado financeiro mais recente;
- controlar janela de cobrança e tentativas por `ID_AGENDAMENTO`.

## Simulações automatizadas

Harness Node.js executando o JS real extraído do workflow:

**30/30 checks aprovados.**

### Casos cobertos

#### Caso A — Parcial → Parcial → Pago

Resultado: `PAGAMENTO_JA_QUITADO` e nenhuma cobrança enviada.

✅ Aprovado.

#### Caso B — Variante do pagamento quitado

Mesma lógica com outros valores.

✅ Aprovado.

#### Caso C — Pagamento parcial atual

Estado mais recente com `STATUS = PARCIAL` e saldo > 0.

Resultado:

- exatamente 1 cobrança elegível;
- tentativa incrementada corretamente.

✅ Aprovado.

#### Caso C — Regra de 24 horas

Cobrança anterior com menos de 24h.

Resultado: `COBRANCA_RECENTE`.

✅ Aprovado.

#### Caso C — Limite de 3 tentativas

Histórico já atingiu três cobranças automáticas.

Resultado: `LIMITE_COBRANCAS_ATINGIDO`.

✅ Aprovado.

#### Caso D — Duas linhas PARCIAL históricas

Sem linha PAGO posterior.

Resultado:

- uma única dívida avaliada;
- utilizado o `VALOR_PENDENTE` da linha mais recente.

✅ Aprovado.

#### Múltiplos agendamentos

Mais de um agendamento elegível na mesma execução.

Resultado:

- 1 item por agendamento;
- dados preservados separadamente.

✅ Simulação aprovada.

## Testes reais no n8n Cloud

### 1. Pagamentos da empresa

A busca passou a trazer todas as linhas por empresa, sem filtro de STATUS.

✅ Aprovado.

### 2. Pagamento já quitado

Saída observada:

- `precisa_enviar = false`
- `evento_resultado = PAGAMENTO_JA_QUITADO`

✅ Aprovado.

### 3. Cobrança recente

Saída observada em AGE004:

- `valor_pendente = 60`
- `tentativa = 1`
- `precisa_enviar = false`
- `evento_resultado = COBRANCA_RECENTE`

✅ Aprovado.

### 4. Duas linhas PARCIAL do mesmo agendamento

Teste:

- `PAG_TESTE_WF011_D1`: saldo 80
- `PAG_TESTE_WF011_D2`: saldo 50, mais recente

Resultado:

- somente D2 foi considerado;
- `valor_pendente = 50`
- `precisa_enviar = true`

✅ Aprovado.

### 5. Erro técnico na busca de PAGAMENTOS

Aba inexistente utilizada propositalmente.

Resultado:

- `evento_resultado = ERRO_COBRANCA`
- mensagem técnica preservada.

✅ Aprovado.

### 6. Erro técnico na busca de COBRANCAS

Aba inexistente utilizada propositalmente.

Resultado: `evento_resultado = ERRO_COBRANCA`.

✅ Aprovado.

### 7. Erro técnico na busca de CLIENTES

Aba inexistente utilizada propositalmente.

Resultado: `evento_resultado = ERRO_COBRANCA`.

✅ Aprovado.

### 8. Erro técnico na busca de EMPRESA

Aba inexistente utilizada propositalmente.

Resultado:

- erro técnico não foi confundido com empresa inexistente;
- `pode_prosseguir = false`.

✅ Aprovado.

### 9. Falha ao registrar COBRANCA

`GS - Registrar Cobrança` foi apontado para aba inexistente.

Correção importante:

- o `CODE - Erro Registro Cobrança` não deve usar `.item`/`.first()` de forma que misture itens paralelos;
- dados foram preservados por item.

Saída confirmada com:

- id_empresa correto;
- id_pagamento correto;
- id_agendamento correto;
- id_cliente correto;
- valor_pendente correto;
- tentativa correta;
- `cobranca_enviada = false`;
- `status_cobranca = FALHA_ENVIO`.

✅ Aprovado.

### 10. Concorrência com duas cobranças

Foram usados dois itens simultâneos:

**A**
- `PAG_TESTE_WF011_D2`
- `AGE_TESTE_WF011_D`
- valor pendente 50
- tentativa 1

**B**
- `PAG_TESTE_WF011_E1`
- `AGE_TESTE_WF011_E`
- valor pendente 35
- tentativa 2

Foi confirmado no `GS - Registrar Cobrança`:

- 2 itens gravados;
- IDs distintos;
- valores distintos;
- tentativas distintas;
- sem mistura de dados.

✅ Até `SET - Cobrança Registrada`, aprovado.

## Pendência do WF011

⏳ Falta validar em uma execução limpa:

`2 itens → EXEC - WF017 Logs → SET - Preparar Saída WF011`

Durante testes manuais houve acúmulo de runs parciais no editor. Também foi identificado que `Run once for each item` está marcado como depreciado na versão atual do n8n.

O WF011 permanece **NÃO totalmente validado** até essa última checagem.

---

# WF012 — Confirmação / Comunicação

## Status

✅ **Lógica e estrutura validadas**  
⚠️ **Envio real do WhatsApp pendente por autenticação Meta**

## Simulações registradas

- 12 cenários simulados.
- 29/29 checks aprovados.

## Comportamento validado

- montagem de mensagem;
- decisão `Pode Enviar`;
- processamento de resposta do WhatsApp;
- processamento de erro de validação;
- merge do resultado;
- registro de mensagem;
- log via WF017;
- saída padronizada;
- eco de dados usados por workflows chamadores.

## Problema externo atual

Nos testes reais, a Meta retornou:

- HTTP 401
- `OAuthException`
- code 190
- `Authentication Error`

Isso indica pendência de token/autenticação, não falha da lógica central do WF012.

## Contrato importante

O campo `dados` no `TRG - Receber Dados WF012` está configurado como `Type = Object`.

✅ Confirmado.

---

# WF013 — Lembrete

## Status

✅ **Validado anteriormente**

## Correções registradas

- substituição de Merge problemático por Code em trecho de resultado;
- correção de referência `.item` para uma forma compatível com o caso de item único;
- reconciliação entre versão testada no n8n Cloud e arquivo do repositório.

## Observação

O histórico atual não preserva a matriz completa dos casos executados no WF013. O workflow foi tratado como validado anteriormente, mas esta consolidação não inventa cenários ausentes.

---

# WF014 — Pesquisa

## Status

🟡 **PARCIALMENTE VALIDADO**

Vários cenários importantes já passaram. Ficou pendente terminar o teste de erro técnico em `GS - Buscar Pesquisas Existentes`.

## Regra funcional validada

A pesquisa só pode ser enviada quando:

- o agendamento está elegível;
- o atendimento terminou;
- está dentro da janela de **1h a 4h após HORA_FIM**;
- não existe pesquisa anterior `STATUS = ENVIADA` para o mesmo agendamento.

## Teste 1 — Nenhum agendamento elegível na janela

Saída final observada:

- `status = AGENDAMENTO_NAO_ELEGIVEL`
- `enviado = false`
- erro informando que não havia agendamento dentro da janela de 1h–4h.

✅ Aprovado.

## Teste 2 — Agendamento elegível

Foi criado `AGE_TESTE_WF014_01` com:

- empresa EMP001
- cliente CLI001
- profissional PRO001
- serviço SER001
- data 14/08/2026
- hora início 12:30
- duração 60 min
- hora fim 13:30
- status AGENDADO

O `CODE - Avaliar Pesquisas Elegíveis` identificou:

- `id_agendamento = AGE_TESTE_WF014_01`
- `precisa_enviar = true`
- cliente Juliana Martins
- serviço Alongamento Gel
- profissional Maria Silva

Mensagem montada corretamente.

✅ Aprovado.

## Bug encontrado — integração WF014 → WF012

Erro inicial:

`Invalid input for 'dados' [item 0]`

`'dados' expects a string but we got object`

Foi confirmado no WF012 que `dados = Object`.

## Bug encontrado — CODE Processar Resultado Envio

Erro:

`Cannot read properties of undefined (reading 'error')`

Causa:

uso de referência `$('CODE - Avaliar Pesquisas Elegíveis').item.json` atravessando o limite do `EXEC - WF012 Comunicação`.

### Correção

O node passou a reconstruir o contexto a partir do próprio `$json` retornado pelo WF012 e de `$json.dados`.

Também passou a aceitar `erro` como:

- string;
- objeto;
- vazio.

✅ Correção confirmada.

## Teste — erro real do WhatsApp

WF012 retornou:

- `status = ERRO_WHATSAPP`
- `enviado = false`
- HTTP 401 Authentication Error.

O `CODE - Processar Resultado Envio` passou a gerar corretamente:

- `STATUS = FALHA`
- `enviada = false`
- `evento_resultado = ERRO_WHATSAPP`
- erro técnico preservado.

✅ Aprovado.

## Criação da aba de pesquisas

Foi criada a estrutura de pesquisa com os cabeçalhos:

- ID_PESQUISA
- ID_EMPRESA
- ID_AGENDAMENTO
- ID_CLIENTE
- TELEFONE
- STATUS
- NOTA
- COMENTARIO
- DATA_HORA
- WHATSAPP_MESSAGE_ID
- OBSERVACOES

O workflow passou a usar a aba válida `PESQUISA` no teste corrente.

## Teste — registrar pesquisa com falha de WhatsApp

`GS - Registrar Pesquisa` gravou:

- ID_PESQUISA;
- EMP001;
- AGE_TESTE_WF014_01;
- CLI001;
- telefone;
- `STATUS = FALHA`;
- nota vazia;
- comentário vazio;
- data/hora;
- WhatsApp message id vazio;
- observações com erro 401.

✅ Aprovado.

## Bug encontrado — enviado = null

No `SET - Pesquisa Registrada`, o output apareceu como `enviado = null`.

Causa:

- o Code devolvia o campo `enviada`;
- o SET tentava ler `enviado`.

### Correção

Expressão ajustada para ler `...json.enviada ?? false`.

Resultado: `enviado = false`.

✅ Aprovado.

## Teste — trecho final com WF017

Foi utilizado mock no `MERGE - Resultado Pesquisa` para evitar repetir envio/registro.

O trecho:

`MERGE → EXEC WF017 Logs → SET Preparar Saída WF014`

retornou corretamente:

- id_empresa;
- id_agendamento;
- id_cliente;
- id_pesquisa;
- enviado false;
- status `ERRO_WHATSAPP`;
- mensagem;
- erro.

✅ Aprovado.

## Teste — idempotência / pesquisa duplicada

Foi inserido um registro:

- `ID_PESQUISA = PES_TESTE_WF014_DUP`
- `ID_AGENDAMENTO = AGE_TESTE_WF014_01`
- `STATUS = ENVIADA`

O `GS - Buscar Pesquisas Existentes` encontrou corretamente o registro.

O `CODE - Avaliar Pesquisas Elegíveis` retornou:

- `precisa_enviar = false`
- `enviado = false`
- `evento_resultado = PESQUISA_JA_ENVIADA`
- erro informando que já existia pesquisa enviada com sucesso.

O `IF - Precisa Enviar` seguiu pelo ramo **false** e não chamou WF012.

✅ **Teste de duplicidade aprovado.**

## Teste pendente — erro técnico na busca de pesquisas

A busca foi temporariamente apontada para:

`PESQUISA_TESTE_ERRO_WF014`

Resultado obtido:

`Sheet with name PESQUISA_TESTE_ERRO_WF014 not found`

Foi identificado:

- `Always Output Data = ON`
- `On Error = Continue (using error output)`

Isso fazia aparecer:

- item vazio no Success Branch;
- item com erro no Error Branch.

### Próximo passo já definido

Alterar:

`On Error → Continue`

Descrição no n8n:

`Pass error message as item in regular output`

Manter:

`Always Output Data = ON`

Depois:

1. executar novamente a busca com a aba inexistente;
2. ajustar `CODE - Avaliar Pesquisas Elegíveis` para detectar erro pelo campo `.error`, e não pela contagem de itens;
3. validar retorno `ERRO_PESQUISA`;
4. confirmar `precisa_enviar = false`;
5. reverter a aba para `PESQUISA`.

⏳ Pendente.

---

# WF015 — Follow-up

## Status

⏳ **Ainda não documentado nesta rodada de testes.**

Será o próximo workflow de comunicação após o fechamento do WF014.

---

# WF016 — Backup

## Status

✅ **VALIDADO**

## Correções/testes registrados

- workflow reconstruído;
- correção de bug relacionado a node fixo;
- correção de mascaramento de falha ao listar backups;
- checagem corrigida para avaliar corretamente quantidade de itens;
- teste real de cópia de planilha realizado com sucesso.

✅ Backup real confirmado.

---

# WF017 — Logs

## Status

✅ **VALIDADO**

## Correções registradas

- `GS Registrar Log` com tratamento de erro;
- remoção de serialização dupla em `DADOS`;
- contrato final de campos confirmado:
  - ID_LOG
  - DATA_HORA
  - ID_EMPRESA
  - WORKFLOW
  - NODE
  - TIPO
  - EVENTO
  - STATUS
  - MENSAGEM
  - DADOS
  - EXECUTION_ID

## Testes

- gravação manual em LOGS;
- chamadas por múltiplos workflows;
- retorno:
  - `log_registrado = true`
  - `id_log`
  - `data_hora`
  - erro vazio em sucesso.

✅ Validado.

---

# WF018 — Limpeza

## Status

✅ **VALIDADO**

## Testes registrados

- ajustes em `Prepare Clean`;
- tratamento de linha/coluna;
- execução com múltiplos itens;
- `Success Branch` validado;
- `Error Branch` validado.

Foi observada execução com `Success Branch (19 items)` e tratamento do ramo de erro.

✅ Validado.

---

# Pendências gerais

## 1. WF011

Finalizar teste limpo de concorrência passando:

`2 itens → WF017 → saída final WF011`

Sem reaproveitar runs antigas do editor.

## 2. WF012

Resolver autenticação Meta/WhatsApp Cloud API:

- HTTP 401
- OAuthException
- code 190

A lógica interna do WF012 já está validada.

## 3. WF014

Finalizar teste de erro técnico em `GS - Buscar Pesquisas Existentes`:

- mudar `On Error` para `Continue`;
- detectar `.error` no Code;
- validar `ERRO_PESQUISA`;
- reverter Sheet para `PESQUISA`.

## 4. WF015

Ainda precisa passar pela rodada de testes/documentação.

---

# Conclusão

Até 14/08/2026, os testes já executados mostram que a arquitetura do BeautyFlow está evoluindo para um padrão consistente de:

- validação de entrada;
- tratamento de erro técnico;
- prevenção de duplicidade;
- preservação do contexto entre workflows;
- registro em Google Sheets;
- centralização de logs no WF017;
- saída padronizada por workflow.

Os principais bugs encontrados durante os testes foram relacionados a:

1. referências `.item` atravessando `Execute Sub-workflow`;
2. `Always Output Data` combinado com tratamento de erro;
3. diferenciação entre erro técnico e “nenhum resultado”;
4. schemas de entrada entre workflows;
5. preservação correta de múltiplos itens concorrentes;
6. nomes/configurações de abas do Google Sheets;
7. autenticação externa do WhatsApp Cloud API.

A documentação deve ser atualizada a cada novo cenário aprovado ou correção aplicada.
