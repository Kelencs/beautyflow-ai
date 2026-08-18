# UC001 — Agendar Atendimento

**Status:** Implementado  
**Ator principal:** Cliente

## Rastreabilidade
- RF: RF001, RF002, RF003, RF008, RF009, RF010
- RN: RN006, RN007, RN008, RN009, RN010, RN040
- Implementação: WF001→WF002→WF003→WF005/WF004/WF012

## Fluxo principal
1. cliente solicita agendamento.
2. sistema identifica cliente/intenção.
3. WF005 valida disponibilidade via WF004.
4. cria/persiste.
5. envia confirmação via WF012.

## Alternativas/observações
- horário indisponível não cria efeito.
- erro técnico não vira 'sem horário'.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
