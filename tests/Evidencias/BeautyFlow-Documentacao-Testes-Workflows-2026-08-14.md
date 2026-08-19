# BeautyFlow — Status Consolidado de Testes dos Workflows

**Data de consolidação:** 18/08/2026  
**Projeto:** BeautyFlow AI  
**Plataforma principal:** n8n Cloud  
**Escopo:** WF001–WF018

> Este documento complementa o relatório histórico de 14/08/2026. Ele não o substitui nem altera retroativamente o status que estava registrado naquela data.

## 1. Legenda

- ✅ **Validado** — evidência consolidada suficiente para os cenários críticos conhecidos.
- 🟡 **Parcialmente validado** — núcleo validado, mas existe pendência específica.
- ⚠️ **Integração externa a revalidar** — lógica validada, ambiente/credencial externa alvo deve ser confirmado.
- ⚪ **Revalidar evidência consolidada** — não há evidência consolidada suficiente nesta revisão para afirmar aprovação ou reprovação.
- ❌ **Reprovado** — comportamento atual diverge do esperado.

## 2. Resumo

| WF | Workflow | Caso | Status consolidado |
|---|---|---|---|
| WF001 | Receber WhatsApp | CT001 | ⚪ Revalidar evidência consolidada |
| WF002 | IA Atendimento | CT002 | ⚪ Revalidar evidência consolidada |
| WF003 | Identificar Intenção | CT003 | ⚪ Revalidar evidência consolidada |
| WF004 | Consultar Disponibilidade | CT004 | ⚪ Revalidar evidência consolidada |
| WF005 | Criar Agendamento | CT005 | ⚪ Revalidar evidência consolidada |
| WF006 | Reagendar | CT006 | ⚪ Revalidar evidência consolidada |
| WF007 | Cancelar Agendamento | CT007 | ⚪ Revalidar evidência consolidada |
| WF008 | Cadastrar Cliente | CT008 | ✅ Validado |
| WF009 | Atualizar Cliente | CT009 | ✅ Validado |
| WF010 | Registrar Pagamento | CT010 | ✅ Validado |
| WF011 | Cobrança | CT011 | ✅ Validado após fechamento de cenários posteriores ao relatório de 14/08 |
| WF012 | Comunicação WhatsApp | CT012 | ⚠️ Lógica validada; integração Meta deve ser revalidada no ambiente alvo |
| WF013 | Lembrete | CT013 | ✅ Validado |
| WF014 | Pesquisa | CT014 | 🟡 Parcialmente validado |
| WF015 | Follow-up | CT015 | ✅ Validado em rodada posterior ao relatório de 14/08 |
| WF016 | Backup | CT016 | ✅ Validado |
| WF017 | Logs | CT017 | ✅ Validado |
| WF018 | Limpeza | CT018 | ✅ Validado |

## 3. WF001–WF007

Os workflows possuem implementação e CTs atualizados, porém a consolidação histórica disponível utilizada nesta revisão não registra evidência suficiente, cenário a cenário, para marcá-los automaticamente como aprovados.

Isso **não significa reprovação**.

### Ação

Executar/reunir evidência dos CT001–CT007 antes de mudar para ✅.

## 4. WF008 — Cadastro Cliente

**Status:** ✅ Validado.

Cobertura consolidada:

- prevenção de duplicidade;
- cliente novo;
- erro técnico de busca;
- erro técnico não tratado como "cliente não encontrado";
- criação somente após avaliação válida.

### Gap de produto separado do status técnico

O comportamento atual relacionado a `PRIMEIRO_ATENDIMENTO`, `ULTIMO_ATENDIMENTO` e origem de `ACEITA_MARKETING` permanece documentado como gap de regra/semântica. Isso não invalida os testes técnicos de cadastro já executados.

## 5. WF009 — Atualizar Cliente

**Status:** ✅ Validado.

Cobertura:

- atualização parcial;
- múltiplos campos;
- preservação dos campos existentes;
- cliente não encontrado;
- erro técnico de busca/atualização;
- saída padronizada.

## 6. WF010 — Registrar Pagamento

**Status:** ✅ Validado.

Cobertura:

- valor positivo;
- pagamento parcial;
- cálculo de saldo;
- estado `PARCIAL`/`PAGO`;
- erro de busca;
- erro de registro;
- persistência transacional.

## 7. WF011 — Cobrança

**Status em 14/08:** 🟡 Parcial.  
**Status consolidado em 18/08:** ✅ Validado.

O relatório histórico de 14/08 registrou como pendência final a execução limpa de múltiplos itens atravessando logging/saída.

Validações posteriores fecharam o cenário, incluindo:

- estado financeiro mais recente;
- histórico PARCIAL seguido de PAGO não gera cobrança;
- saldo pendente correto;
- cobrança recente;
- limite de tentativas;
- múltiplos agendamentos sem mistura;
- erro técnico em buscas;
- falha de registro;
- registros/logs preservados por item;
- regressão com aba real.

O relatório de 14/08 deve continuar intocado como fotografia do estado daquela data.

## 8. WF012 — Comunicação

**Status:** ⚠️ Lógica validada; integração Meta a revalidar.

Cobertura conhecida:

- validação;
- montagem de mensagem;
- processamento de sucesso/erro;
- persistência;
- contrato de saída;
- logging.

Falhas Meta de autenticação/token observadas em testes devem ser tratadas como pendência externa do ambiente, não como reprovação automática da lógica do workflow.

## 9. WF013 — Lembrete

**Status:** ✅ Validado.

Cobertura consolidada:

- lógica de lembrete;
- idempotência;
- correções de Merge/Code;
- correlação/referências validadas na rodada registrada.

Observação: o WF013 não possui Schedule/Cron interno no JSON atual; sua execução periódica depende de chamador/orquestração.

## 10. WF014 — Pesquisa

**Status:** 🟡 Parcialmente validado.

Cenários já registrados:

- atendimento fora da janela;
- atendimento elegível;
- janela de 1h–4h após `HORA_FIM`;
- montagem da mensagem;
- integração WF014 → WF012;
- tratamento de erro real do WhatsApp;
- bloqueio de pesquisa já enviada.

### Pendência

Manter como parcial enquanto não houver evidência consolidada final do cenário técnico pendente de busca de pesquisas existentes / regressão correspondente.

WF014 é emissor da pesquisa. A captura de nota/comentário permanece feature de backlog separada.

## 11. WF015 — Follow-up

**Status:** ✅ Validado em rodada posterior ao relatório de 14/08.

Validações consolidadas:

- processamento de múltiplos clientes por item;
- execução de WF012/WF017 preservando correlação;
- tentativa 1 e tentativa 2 preservadas;
- bloqueio por agendamento futuro;
- bloqueio por ausência de configuração/telefone;
- idempotência;
- regressão normal com múltiplos itens;
- erro técnico em busca de AGENDAMENTOS;
- erro global ao registrar FOLLOWUPS;
- fan-out de erro para múltiplos candidatos quando o erro não possui `pairedItem`;
- execuções consecutivas sem contaminação entre runs.

## 12. WF016 — Backup

**Status:** ✅ Validado.

Cobertura:

- criação de cópia;
- retenção controlada;
- erro/resultado parcial;
- integração Google Drive;
- preservação do arquivo origem.

## 13. WF017 — Logs

**Status:** ✅ Validado.

Cobertura:

- normalização;
- gravação;
- campos opcionais;
- resposta ao chamador;
- comportamento de erro sem recursão.

## 14. WF018 — Limpeza

**Status:** ✅ Validado.

Cobertura:

- retenção de `LOGS` >90 dias;
- preservação de registros recentes;
- `row_number`;
- exclusão segura;
- múltiplas linhas;
- tratamento de falha.

## 15. Pendências abertas desta consolidação

1. Reunir/executar evidência consolidada CT001–CT007.
2. Revalidar WF012 no ambiente Meta alvo sempre que credenciais/número forem alterados.
3. Fechar a pendência técnica final do WF014.
4. Manter gaps funcionais de produto separados do status técnico dos testes.
5. Não confundir execução periódica de WF013–WF015 com lógica interna: os JSONs atuais dependem de orquestração externa.

## 16. Regra para próximas atualizações

Quando o status mudar:

1. não editar o relatório histórico de 14/08;
2. atualizar este documento ou criar nova consolidação datada;
3. anexar/referenciar evidência;
4. atualizar `tests/README.md` se necessário;
5. atualizar `tests/Matriz-de-Rastreabilidade.md`.
