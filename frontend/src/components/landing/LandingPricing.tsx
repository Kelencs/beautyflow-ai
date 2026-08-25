interface Plano {
  nome: string;
  descricao: string;
  destaque?: boolean;
}

/**
 * Nenhum preço ou condição comercial real ainda existe para o BeautyFlow — "Em breve"
 * no lugar do valor, e nenhuma lista fechada de recursos por plano (ainda não definida).
 *
 * Fase 3: "Mais escolhido" → "Recomendado" (não há dado real que sustente uma afirmação
 * de popularidade); frase de abertura trocada por uma comunicação comercial neutra, sem
 * transmitir "projeto em desenvolvimento"; CTA de cada card agora é "Quero uma
 * demonstração" apontando para `#demonstracao` (não mais `/login` — ver LandingCTA.tsx).
 */
const PLANOS: Plano[] = [
  {
    nome: "Essencial",
    descricao: "Para operações menores que querem começar a organizar atendimento e gestão.",
  },
  {
    nome: "Profissional",
    descricao: "Para negócios que precisam de mais automação e organização da operação.",
    destaque: true,
  },
  {
    nome: "Business",
    descricao: "Para operações com necessidades maiores de gestão e equipe.",
  },
];

export function LandingPricing() {
  return (
    <section id="planos" className="border-t border-bf-border bg-bf-bg py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Planos
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Escolha o plano que melhor acompanha o momento do seu negócio.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANOS.map((plano) => (
            <div
              key={plano.nome}
              className={`flex flex-col gap-5 rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
                plano.destaque
                  ? "border-bf-primary bg-bf-surface shadow-[0_24px_70px_-30px_rgba(91,61,245,0.45)] lg:scale-105"
                  : "border-bf-border bg-bf-surface shadow-sm hover:shadow-md"
              }`}
            >
              {plano.destaque && (
                <span className="w-fit rounded-full bg-bf-primary px-3 py-1 text-xs font-semibold text-white">
                  Recomendado
                </span>
              )}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold text-bf-heading">{plano.nome}</h3>
                <p className="text-sm text-bf-text">{plano.descricao}</p>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-semibold text-bf-heading">Em breve</span>
                <span className="text-xs text-bf-text-muted">Consulte condições</span>
              </div>

              <a
                href="#demonstracao"
                className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary ${
                  plano.destaque
                    ? "bg-bf-primary text-white hover:bg-bf-primary-hover"
                    : "border border-bf-border text-bf-heading hover:bg-bf-lilac-light"
                }`}
              >
                Quero uma demonstração
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
