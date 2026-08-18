# UC014 — Executar Cobrança Automática

**Status:** Implementado  
**Ator principal:** Sistema/Proprietário

## Rastreabilidade
- RF: RF022
- RN: RN046–RN051
- Implementação: WF011→WF012

## Fluxo principal
1. valida janela.
2. consolida estado financeiro.
3. aplica 24h/3 tentativas.
4. envia saldo pendente.
5. registra resultado.

## Alternativas/observações
- PAGO nunca recebe cobrança.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
