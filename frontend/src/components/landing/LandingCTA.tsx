import { ArrowRight } from "lucide-react";

/** Ver LandingHeader.tsx — mesmo link/mensagem, duplicado por não haver módulo de constantes compartilhado entre os componentes da landing. */
const WHATSAPP_URL =
  "https://wa.me/5534984320076?text=Olá%21%20Conheci%20o%20BeautyFlow%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20plataforma.";

/**
 * Seção final da landing (âncora `#demonstracao`, mantida como landmark ainda que nenhum
 * CTA role mais para ela — todos os CTAs de demonstração agora abrem o WhatsApp
 * diretamente, sem formulário intermediário). "/login" continua reservado exclusivamente
 * ao botão "Entrar" do Header.
 *
 * Layout totalmente centralizado (título, subtítulo e botão) — era texto-esquerda/botão-
 * direita antes. `isolate` continua necessário: `relative` sozinho não cria stacking
 * context; sem ele os filhos `-z-10` escapariam para o stacking context do wrapper
 * ancestral (bg-bf-cream em page.tsx) e o gradiente renderizaria abaixo do fundo opaco.
 */
export function LandingCTA() {
  return (
    <section id="demonstracao" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #B23A63 0%, #9D174D 55%, #701A3D 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 right-0 -z-10 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#F7DDE5" }}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="font-serif text-[28px] leading-[1.2] font-semibold tracking-tight text-white sm:text-[36px] lg:text-[38px]">
          Comece agora a transformar seu atendimento e seus resultados
        </h2>
        <p className="max-w-md text-sm text-bf-rose-light/90 sm:text-base">
          Mais tempo, mais organização e mais clientes satisfeitos.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-bf-wine shadow-sm transition hover:bg-bf-rose-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Quero conhecer a BeautyFlow
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
