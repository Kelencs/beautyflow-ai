# UC007 — Receber Lembretes

**Status:** Parcial  
**Ator principal:** Cliente

## Rastreabilidade
- RF: RF014
- RN: RN034, RN035
- Implementação: Chamador→WF013→WF012

## Fluxo principal
1. orquestrador chama WF013.
2. WF013 avalia elegibilidade/idempotência.
3. WF012 envia.

## Alternativas/observações
- já enviado não duplica.
- WF013 não possui schedule interno.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
