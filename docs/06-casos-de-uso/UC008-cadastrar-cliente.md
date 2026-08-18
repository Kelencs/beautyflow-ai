# UC008 — Cadastrar Cliente

**Status:** Implementado  
**Ator principal:** Cliente

## Rastreabilidade
- RF: RF003
- RN: RN016, RN018, RN019, RN037
- Implementação: WF002→WF008

## Fluxo principal
1. busca duplicidade.
2. se vazio legítimo cria ID/registro.
3. retorna ao chamador.

## Alternativas/observações
- erro técnico não gera cliente novo.
- revisar consentimento/semântica de atendimento.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
