# Regras de Integridade
- IDs de empresa não podem ser trocados entre tenants.
- pagamento deve referenciar agendamento válido.
- cobrança usa estado financeiro mais recente.
- lembrete/pesquisa/follow-up devem preservar chaves de idempotência.
- exclusão de logs usa retenção, não exclusão indiscriminada.
- writes do App devem validar IDs lógicos contra o gateway.
