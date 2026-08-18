# UC013 — Registrar Pagamento

**Status:** Implementado  
**Ator principal:** Operador autorizado

## Rastreabilidade
- RF: RF021
- RN: RN041–RN045
- Implementação: WF010

## Fluxo principal
1. valida valor/agendamento.
2. consolida pagamentos.
3. calcula saldo.
4. registra transação.
5. retorna PARCIAL/PAGO.

## Alternativas/observações
- cancelado/quitado/valor inválido não registra.

## Critério
O status deste UC só muda após implementação e evidência correspondentes.
