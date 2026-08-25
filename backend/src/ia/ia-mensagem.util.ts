/**
 * Minimização de dados (GET /ia nunca devolve a mensagem completa do cliente — ver
 * comentário em libs/shared-types/src/ia.ts): gera a prévia curta que compõe
 * `IaInteracao.previewMensagem` a partir do texto completo guardado só no mock interno
 * do backend (`IaInteracaoMockRecord.mensagem`, nunca mapeado para o DTO público).
 */
export const LIMITE_PADRAO_PREVIEW_MENSAGEM = 120;

/**
 * - `trim()` antes de tudo;
 * - texto que já cabe no limite volta inteiro, sem reticências;
 * - o corte é feito por code point (`Array.from`), não por unidade UTF-16 (`.length`/
 *   `.slice()` cru) — um emoji fora do BMP ocupa 2 unidades UTF-16 (surrogate pair);
 *   cortar no meio dele geraria um surrogate solto (caractere quebrado/`�` na renderização).
 *   Cortando por code point, o emoji inteiro entra ou fica de fora, nunca pela metade;
 * - texto maior é cortado no limite (contado em code points) e, quando há um espaço
 *   "próximo o bastante" do corte (>= 60% do limite), recua até ele para não partir uma
 *   palavra ao meio à toa — corte "limpo" só quando é barato; senão, corta na posição
 *   exata mesmo;
 * - reticências só aparecem quando o texto foi de fato truncado.
 */
export function criarPreviewMensagem(
  texto: string,
  limite: number = LIMITE_PADRAO_PREVIEW_MENSAGEM,
): string {
  const aparado = texto.trim();
  const pontosDeCodigo = Array.from(aparado);
  if (pontosDeCodigo.length <= limite) {
    return aparado;
  }

  const cortado = pontosDeCodigo.slice(0, limite).join('');
  const ultimoEspaco = cortado.lastIndexOf(' ');
  const semPalavraPartida = ultimoEspaco >= limite * 0.6 ? cortado.slice(0, ultimoEspaco) : cortado;

  return `${semPalavraPartida.trimEnd()}…`;
}
