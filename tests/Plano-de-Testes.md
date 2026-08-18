# Plano de Testes — BeautyFlow AI

> **Versão:** 2.0  
> **Data:** 18/08/2026  
> **Escopo atual:** WF001–WF018 e integrações utilizadas por eles.

## 1. Objetivo

Validar que cada workflow executa o comportamento implementado no JSON versionado, preserva dados entre subworkflows, diferencia erro técnico de regra de negócio e não produz efeitos colaterais indevidos.

## 2. Itens em escopo

- Atendimento: WF001–WF003.
- Agenda: WF004–WF007.
- Clientes: WF008–WF009.
- Financeiro: WF010–WF011.
- Comunicação: WF012–WF015.
- Administração: WF016–WF018.
- Integrações: Meta/WhatsApp, Gemini, Calendar, Sheets e Drive.
- Regressão de chamadas entre workflows.
- Tratamento de múltiplos itens, correlação e idempotência.

## 3. Fora do escopo desta rodada

- BeautyFlow App completo (frontend/backend ainda deve possuir plano próprio por fase).
- infraestrutura interna da Meta/Google;
- disponibilidade contratual de terceiros;
- testes de produção com dados reais de clientes;
- Coexistence/Embedded Signup, enquanto não fizer parte do ambiente alvo da rodada.

## 4. Tipos de teste

- funcional;
- integração;
- erro técnico;
- idempotência;
- regressão;
- segurança;
- carga/performance;
- aceitação;
- contrato entre subworkflows.

## 5. Critério de entrada

- JSON versionado e importável no n8n;
- credenciais de teste configuradas;
- dados sintéticos preparados;
- planilha/abas necessárias disponíveis;
- CT correspondente atualizado.

## 6. Critério de saída

Um workflow só recebe `✅ Validado` quando:

- caminho principal foi executado;
- principais bloqueios de negócio foram verificados;
- falha técnica relevante foi exercitada ou justificada;
- efeitos externos foram conferidos;
- saída final foi validada;
- evidência foi registrada;
- regressão crítica passou.

## 7. Severidade

| Severidade | Definição |
|---|---|
| P0 | risco de segurança, corrupção de dados, empresa errada, duplicação crítica |
| P1 | regra de negócio principal incorreta ou fluxo indisponível |
| P2 | erro parcial com contorno operacional |
| P3 | documentação, nomenclatura ou UX sem impacto funcional crítico |

## 8. Dados de teste

Utilizar apenas dados sintéticos. IDs de teste devem ser reconhecíveis, por exemplo `AGE_TESTE_*`, `CLI_TESTE_*`, `PAG_TESTE_*`.

## 9. Regressão obrigatória

Toda correção em:
- `onError`;
- `alwaysOutputData`;
- `pairedItem`;
- `Run once for each item/all items`;
- Merge/Code de consolidação;
- consultas por `ID_EMPRESA`;
- idempotência;
- chamadas WF012/WF017

deve ser seguida por regressão de cenário normal e cenário de erro.
