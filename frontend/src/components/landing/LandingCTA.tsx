/**
 * Seção final da landing — também o ponto de "demonstração/interesse" da página (âncora
 * `#demonstracao`, referenciada por todos os CTAs de demonstração do Header/Hero/Planos).
 * Ainda não existe formulário de contato, WhatsApp comercial ou fluxo de demonstração no
 * projeto — o botão aponta para a própria âncora (não navega para lugar nenhum, não
 * inventa telefone/e-mail/formulário externo), até que um desses fluxos exista de fato.
 * "/login" continua reservado exclusivamente ao botão "Entrar" do Header (cliente que já
 * tem conta) — nenhum CTA de demonstração encaminha um visitante novo para lá.
 *
 * Fase 3: redesenhada como o fechamento premium da página — fundo em gradiente roxo
 * BeautyFlow, heading branco, texto em lilás muito claro, botão branco com texto roxo
 * (inverso do padrão do resto da página, para contraste sobre o fundo escuro) e um glow
 * discreto. Headline preservada.
 *
 * Fase 3.1 (correção de contraste): `relative` sozinho NÃO cria um stacking context
 * (só cria quando combinado com z-index != auto). Sem isolamento próprio, os filhos
 * `-z-10` (gradiente + glows) escapavam para o stacking context do wrapper ancestral
 * (frontend/src/app/page.tsx, `bg-bf-bg`) e renderizavam ABAIXO do fundo opaco desse
 * wrapper — a seção mostrava o off-white da página em vez do gradiente roxo, deixando o
 * texto branco quase invisível. `isolate` força esta seção a conter seu próprio stacking
 * context, mantendo o gradiente/glows contidos localmente. Confirmado no DevTools antes
 * da correção: `elementFromPoint` num pixel do gradiente retornava a `<section>` (não o
 * div do gradiente), e a cor computada ali era a do wrapper ancestral, não a do gradiente.
 */
export function LandingCTA() {
  return (
    <section id="demonstracao" className="relative isolate overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #6C4CFF 0%, #5B3DF5 55%, #4930D8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 right-0 -z-10 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#F4B4CD" }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="text-[30px] font-semibold tracking-tight text-white sm:text-[40px] lg:text-[48px]">
          Menos tempo respondendo mensagens. Mais tempo atendendo clientes.
        </h2>
        <p className="max-w-xl text-base text-bf-lilac-light/90 sm:text-lg">
          O BeautyFlow cuida das tarefas repetitivas do dia a dia para que você possa focar no que
          só você pode fazer: o atendimento.
        </p>
        <a
          href="#demonstracao"
          className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-bf-primary shadow-sm transition hover:bg-bf-lilac-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Quero uma demonstração
        </a>
      </div>
    </section>
  );
}
