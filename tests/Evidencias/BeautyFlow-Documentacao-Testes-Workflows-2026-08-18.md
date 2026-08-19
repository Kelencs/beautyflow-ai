# BeautyFlow — Status Consolidado de Testes dos Workflows

**Data de consolidação:** 18/08/2026  
**Projeto:** BeautyFlow AI  
**Plataforma:** n8n Cloud  
**Escopo:** WF001–WF018

> Este documento complementa o relatório histórico de 14/08/2026. Não altera retroativamente aquele relatório.

## 1. Legenda

- ✅ Validado
- 🟡 Parcialmente validado
- ⚠️ Integração externa a revalidar
- ⚪ Revalidar evidência consolidada
- ❌ Reprovado

## 2. Resumo

| WF | Workflow | CT | Status |
|---|---|---|---|
| WF001 | Receber WhatsApp | CT001 | ⚪ Revalidar evidência consolidada |
| WF002 | IA Atendimento | CT002 | ⚪ Revalidar evidência consolidada |
| WF003 | Identificar Intenção | CT003 | ⚪ Revalidar evidência consolidada |
| WF004 | Consultar Disponibilidade | CT004 | ⚪ Revalidar evidência consolidada |
| WF005 | Criar Agendamento | CT005 | ⚪ Revalidar evidência consolidada |
| WF006 | Reagendar | CT006 | ⚪ Revalidar evidência consolidada |
| WF007 | Cancelar | CT007 | ⚪ Revalidar evidência consolidada |
| WF008 | Cadastrar Cliente | CT008 | ✅ Validado |
| WF009 | Atualizar Cliente | CT009 | ✅ Validado |
| WF010 | Registrar Pagamento | CT010 | ✅ Validado |
| WF011 | Cobrança | CT011 | ✅ Validado |
| WF012 | Comunicação WhatsApp | CT012 | ⚠️ Lógica validada; integração Meta a revalidar |
| WF013 | Lembrete | CT013 | ✅ Validado |
| WF014 | Pesquisa | CT014 | 🟡 Parcialmente validado |
| WF015 | Follow-up | CT015 | ✅ Validado |
| WF016 | Backup | CT016 | ✅ Validado |
| WF017 | Logs | CT017 | ✅ Validado |
| WF018 | Limpeza | CT018 | ✅ Validado |

## 3. WF001–WF007

Os CTs existem e os workflows estão versionados, mas a consolidação histórica analisada não contém evidência suficiente para marcá-los automaticamente como aprovados.

**Isso não significa reprovação.**

Ação: reunir/executar evidência CT001–CT007.

## 4. WF008

✅ Validado.

Cobertura:

- duplicidade;
- novo cliente;
- erro técnico de busca;
- erro não tratado como “cliente não encontrado”;
- criação somente após avaliação válida.

Gaps de `PRIMEIRO_ATENDIMENTO`, `ULTIMO_ATENDIMENTO` e consentimento permanecem separados.

## 5. WF009

✅ Validado.

Cobertura:

- atualização parcial;
- preservação de campos;
- cliente não encontrado;
- erro técnico;
- saída padronizada.

## 6. WF010

✅ Validado.

Cobertura:

- valor positivo;
- parcial;
- saldo;
- PAGO;
- erro de busca;
- erro de registro;
- persistência transacional.

## 7. WF011

✅ Validado após validações posteriores ao relatório de 14/08.

Cobertura consolidada:

- estado financeiro mais recente;
- PARCIAL seguido de PAGO não cobra;
- saldo pendente correto;
- cobrança recente;
- máximo de tentativas;
- multi-item;
- falha de registro;
- logs por item;
- regressão com aba real.

## 8. WF012

⚠️ Lógica validada; integração Meta deve ser revalidada no ambiente alvo.

Cobertura conhecida:

- validação;
- mensagem;
- sucesso/erro;
- persistência;
- contrato de saída;
- logging.

Erro de token/Meta é pendência externa, não reprovação automática da lógica.

## 9. WF013

✅ Validado.

Cobertura:

- lógica de lembrete;
- idempotência;
- correções de convergência;
- correlação.

Observação: sem Schedule/Cron interno.

## 10. WF014

🟡 Parcialmente validado.

Cobertura:

- fora da janela;
- elegível;
- janela de 1h–4h;
- montagem;
- WF014 → WF012;
- erro WhatsApp;
- pesquisa já enviada.

Pendência: cenário técnico final de busca/regressão.

WF014 envia a pesquisa; captura de resposta permanece backlog.

## 11. WF015

✅ Validado.

Cobertura:

- multi-item;
- WF012/WF017 por item;
- tentativa 1/2;
- agendamento futuro;
- bloqueios;
- idempotência;
- erro de busca;
- erro global de registro;
- fan-out;
- execuções consecutivas sem contaminação.

## 12. WF016

✅ Validado.

Cobertura:

- cópia;
- retenção;
- erro/parcial;
- Drive;
- preservação da origem.

## 13. WF017

✅ Validado.

Cobertura:

- normalização;
- gravação;
- campos opcionais;
- retorno;
- erro sem recursão.

## 14. WF018

✅ Validado.

Cobertura:

- LOGS >90 dias;
- preservação de recentes;
- `row_number`;
- exclusão segura;
- múltiplas linhas;
- falha.

## 15. Pendências

1. Evidência consolidada CT001–CT007.
2. Revalidar WF012 no ambiente Meta alvo.
3. Fechar pendência final do WF014.
4. Manter gaps de produto separados do status técnico.
5. Não confundir orquestração periódica de WF013–WF015 com Cron interno.

## 16. Atualizações futuras

Quando status mudar:

1. manter relatório histórico de 14/08;
2. atualizar ou criar nova consolidação;
3. registrar evidência;
4. atualizar README/Matriz quando necessário.
