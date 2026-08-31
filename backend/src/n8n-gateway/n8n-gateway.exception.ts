/**
 * Erro técnico controlado de uma chamada ao APP-WF019 — nunca carrega stack de rede,
 * corpo bruto da resposta, URL do gateway ou a API key. Quem captura esta exceção
 * (ver clientes.service.ts) decide a mensagem segura devolvida ao frontend; `code` e
 * `requestId` ficam disponíveis só para log técnico do lado NestJS (seção 26 do pedido).
 */
export class N8nGatewayException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly requestId: string,
  ) {
    super(message);
    this.name = 'N8nGatewayException';
  }
}
