# UC004 — Cancelar Atendimento

**Status:** Implementado  
**Ator principal:** Cliente

## Rastreabilidade
- RF: RF012, RF016
- RN: RN011, RN012, RN013, RN030, RN032
- Implementação: WF001→WF002→WF003→WF007→WF012

## Fluxo principal
1. localiza agendamento.
2. valida antecedência.
3. cancela/persiste.
4. comunica.

## Alternativas/observações
- fora da janela bloqueia.
- não encontrado não altera.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
