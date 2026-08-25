import { criarPreviewMensagem } from './ia-mensagem.util';

describe('criarPreviewMensagem', () => {
  it('retorna o texto inteiro, sem reticências, quando cabe no limite', () => {
    const texto = 'Vocês têm horário livre no sábado de manhã?';
    expect(criarPreviewMensagem(texto, 120)).toBe(texto);
    expect(criarPreviewMensagem(texto, 120)).not.toContain('…');
  });

  it('trunca e adiciona reticências quando o texto ultrapassa o limite', () => {
    const texto =
      'Olá, gostaria de saber se a Ana possui horário disponível amanhã à tarde para fazer manutenção de gel e também gostaria de saber o valor.';
    const resultado = criarPreviewMensagem(texto, 120);

    expect(resultado.length).toBeLessThan(texto.length);
    expect(resultado.endsWith('…')).toBe(true);
  });

  it('o preview (sem contar a reticência) nunca ultrapassa o limite definido', () => {
    const texto = 'x'.repeat(300);
    const resultado = criarPreviewMensagem(texto, 120);

    expect(resultado.endsWith('…')).toBe(true);
    expect(resultado.slice(0, -1).length).toBeLessThanOrEqual(120);
  });

  it('recua até o último espaço para não partir uma palavra ao meio quando isso é barato', () => {
    const texto = `${'a'.repeat(115)} palavracompleta resto`;
    const resultado = criarPreviewMensagem(texto, 120);

    // Sem o corte "limpo" o resultado terminaria em "...palavr…" (palavra partida).
    expect(resultado.endsWith('…')).toBe(true);
    expect(resultado).not.toMatch(/palavracompl[a-z]*…$/);
  });

  it('corta na posição exata (sem recuar demais) quando não há espaço próximo o bastante do limite', () => {
    const texto = `${'palavraunicaenorme'.repeat(10)}`; // uma "palavra" só, sem espaços
    const resultado = criarPreviewMensagem(texto, 120);

    expect(resultado).toBe(`${texto.slice(0, 120)}…`);
  });

  it('remove espaços nas pontas antes de avaliar o limite', () => {
    const texto = '   Oi, tudo bem?   ';
    expect(criarPreviewMensagem(texto, 120)).toBe('Oi, tudo bem?');
  });

  it('é determinístico: mesma entrada sempre produz a mesma saída', () => {
    const texto = 'Preciso mudar meu horário de quinta para sexta, é possível?';
    const primeira = criarPreviewMensagem(texto, 40);
    const segunda = criarPreviewMensagem(texto, 40);
    expect(primeira).toBe(segunda);
  });

  it('usa 120 como limite padrão quando nenhum é informado', () => {
    const texto = 'a'.repeat(200);
    expect(criarPreviewMensagem(texto)).toBe(`${'a'.repeat(120)}…`);
  });

  describe('Unicode / emoji — corte seguro por code point', () => {
    const SURROGATE_SOLTO =
      /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

    it('emoji exatamente na região onde o corte por UTF-16 ocorreria não é partido ao meio', () => {
      // 119 'a's + 😀 (surrogate pair) = 120 code points. Um corte ingênuo por
      // `.slice(0, 120)` (unidades UTF-16) pegaria os 119 'a's + só a metade alta do
      // surrogate pair do emoji, produzindo um caractere inválido/quebrado no final.
      const texto = `${'a'.repeat(119)}😀 muito texto depois disso que ultrapassa o limite total`;
      const resultado = criarPreviewMensagem(texto, 120);

      expect(SURROGATE_SOLTO.test(resultado)).toBe(false);
      expect(resultado).not.toContain('�');
      expect(resultado.endsWith('…')).toBe(true);
      expect(
        Array.from(resultado.endsWith('…') ? resultado.slice(0, -1) : resultado).length,
      ).toBeLessThanOrEqual(120);
      expect(resultado.startsWith(`${'a'.repeat(119)}😀`)).toBe(true);
    });

    it('múltiplos emojis (💅✨😍❤️) permanecem íntegros, sem gerar surrogate solto nem "�"', () => {
      const texto = `Adorei o atendimento 💅✨😍❤️ de vocês, super recomendo para todas as amigas e clientes que conheço, foi incrível!`;
      const resultado = criarPreviewMensagem(texto, 40);

      expect(SURROGATE_SOLTO.test(resultado)).toBe(false);
      expect(resultado).not.toContain('�');
      expect(resultado.endsWith('…')).toBe(true);
    });

    it('é determinístico também para texto com emoji: mesma entrada sempre produz a mesma saída', () => {
      const texto = `Oi 😀 tudo bem? Queria saber se vocês têm horário livre essa semana 💅✨ para manicure e pedicure completas`;
      const primeira = criarPreviewMensagem(texto, 50);
      const segunda = criarPreviewMensagem(texto, 50);

      expect(primeira).toBe(segunda);
      expect(SURROGATE_SOLTO.test(primeira)).toBe(false);
    });

    it('texto comum (sem emoji) continua se comportando exatamente como antes', () => {
      const texto = 'Vocês têm horário livre no sábado de manhã?';
      expect(criarPreviewMensagem(texto, 120)).toBe(texto);
      expect(criarPreviewMensagem(texto, 120)).not.toContain('…');
    });
  });
});
