# UC002 — Consultar Horários Disponíveis

**Status:** Implementado  
**Ator principal:** Cliente

## Rastreabilidade
- RF: RF008
- RN: RN001–RN010, RN025, RN040
- Implementação: WF001→WF002→WF003→WF004

## Fluxo principal
1. cliente pergunta horários.
2. WF004 carrega configuração e ocupação.
3. calcula slots.
4. retorna horários ou status.

## Alternativas/observações
- não inventar slots.
- erro técnico deve ser distinto.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
