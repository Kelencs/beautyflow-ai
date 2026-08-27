import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarCheck2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

interface Beneficio {
  icon: LucideIcon;
  linha1: string;
  linha2: string;
}

/** Ver LandingHeader.tsx — mesmo link/mensagem, duplicado por não haver módulo de constantes compartilhado entre os componentes da landing. */
const WHATSAPP_URL =
  "https://wa.me/5534984320076?text=Olá%21%20Conheci%20o%20BeautyFlow%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20plataforma.";

/** Rótulos/ícones fiéis à imagem de referência aprovada. */
const BENEFICIOS: Beneficio[] = [
  { icon: MessageCircle, linha1: "Atendimento", linha2: "Automático" },
  { icon: CalendarCheck, linha1: "Agenda", linha2: "Inteligente" },
  { icon: Users, linha1: "Clientes", linha2: "Organizados" },
  { icon: TrendingUp, linha1: "Mais Tempo e", linha2: "Resultados" },
];

function CardCliente({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-bf-border bg-white/90 p-3.5 shadow-[0_16px_36px_-18px_rgba(157,23,77,0.4)] backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-bf-heading">Cliente</span>
      </div>
      <p className="mt-1.5 text-sm text-bf-text">Queria agendar um horário.</p>
    </div>
  );
}

function CardBeautyFlow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-bf-border bg-white/90 p-3.5 shadow-[0_16px_36px_-18px_rgba(157,23,77,0.4)] backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {/* Ícone oficial da marca — sem círculo/fundo aplicado, exibido como fornecido (fundo transparente). */}
        <Image src="/brand/beautyflow-icon.png" alt="" width={28} height={28} className="h-[26px] w-[26px]" />
        <span className="text-xs font-semibold text-bf-heading">BeautyFlow</span>
      </div>
      <p className="mt-1.5 text-sm text-bf-text">Claro! Qual serviço e melhor horário para você?</p>
    </div>
  );
}

function CardConfirmacao({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-[0_16px_36px_-18px_rgba(157,23,77,0.4)] ${className}`}>
      <div className="flex items-center gap-1.5">
        <CalendarCheck2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
        <span className="text-xs font-semibold text-emerald-700">Agendamento confirmado!</span>
      </div>
      <p className="mt-1.5 text-sm text-bf-text">Sexta-feira às 14:00 — Manicure</p>
    </div>
  );
}

function CardVinho({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-bf-wine p-4 text-white shadow-[0_16px_36px_-16px_rgba(112,26,61,0.6)] ${className}`}>
      <Sparkles className="h-4 w-4 text-bf-rose-light" aria-hidden="true" />
      <p className="mt-1.5 text-xs leading-snug font-medium">
        Atenda mais clientes sem perder a qualidade e o seu tempo.
      </p>
    </div>
  );
}

/**
 * Abaixo de `md` (768px): a arte final `beautyflow-hero-mobile.png` já traz headline,
 * subtítulo, benefícios, cards e a foto da profissional embutidos na própria imagem — só
 * o CTA continua HTML real (a imagem foi criada de propósito sem ele).
 *
 * `md` e acima: composição 100% HTML/CSS (nunca rasterizada) — headline, subtítulo,
 * benefícios, CTA e os cards flutuantes são elementos reais; `beautyflow-hero-profissional.png`
 * é usada SOMENTE como fotografia (dentro do container da foto, com `object-cover`), nunca
 * como composição completa. Os dois blocos (`md:hidden` / `hidden md:block`) são mutuamente
 * exclusivos — nunca os dois aparecem ao mesmo tempo.
 *
 * Correção de sobreposição: os 3 cards de conversa + o card vinho são filhos diretos do
 * container `relative` da FOTO (não mais um bloco irmão posicionado em relação ao Hero
 * inteiro) — `top`/`left` em % ficam sempre entre 0–100% dessa caixa, então nunca podem
 * visualmente invadir a coluna da headline/benefícios, só encostar na borda esquerda da
 * própria foto. Um único conjunto de cards agora cobre `sm:`/`md:`/`lg:`/`xl:` (antes havia
 * dois conjuntos duplicados, um só para tablet e outro só para desktop).
 *
 * Todo o conteúdo `md:` (copy + foto + cards) vive dentro de um `mx-auto max-w-[1440px]` —
 * o mesmo max-width do Header — para não esticar indefinidamente em monitores largos. O
 * fundo (gradiente + blobs) continua full-bleed, fora desse wrapper. Colunas 48% copy / 52%
 * foto, altura mínima 680px.
 *
 * `priority` nos dois `<Image>` significa que o navegador faz preload de ambos os arquivos
 * independente do viewport — só um é exibido, mas os dois são baixados; aceito como troca
 * consciente para não arriscar regressão em nenhuma das duas versões.
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(160deg, #FFF9F7 0%, #FFF1F4 55%, #FDEDF1 100%)",
        }}
      />
      {/* Formas decorativas florais abstratas, extremamente sutis, só do lado esquerdo. */}
      <div
        aria-hidden="true"
        className="absolute top-0 -left-32 -z-10 h-96 w-96 rounded-full opacity-[0.12] blur-3xl"
        style={{ backgroundColor: "#E66A8D" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-20 -z-10 h-72 w-72 rounded-full opacity-[0.10] blur-3xl"
        style={{ backgroundColor: "#F7DDE5" }}
      />

      {/* Mobile (< md): arte final com tudo embutido + CTA real em HTML, único elemento que a imagem não inclui de propósito. */}
      <div className="md:hidden">
        <Image
          src="/landing/beautyflow-hero-mobile.png"
          alt="BeautyFlow — Automatize, encante e fidelize: atendimento, agenda e gestão para profissionais da beleza, com exemplo de conversa e agendamento confirmado pelo WhatsApp"
          width={941}
          height={1672}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="px-4 py-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex h-[60px] w-full max-w-[420px] items-center justify-center gap-2 rounded-full bg-bf-wine px-6 text-base font-semibold text-white shadow-[0_18px_44px_-16px_rgba(157,23,77,0.55)] transition hover:bg-bf-wine-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-wine"
          >
            Quero transformar meu atendimento
            <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* md e acima: implementação atual, inalterada. */}
      <div className="hidden md:block">
      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative flex flex-col lg:min-h-[680px] lg:flex-row lg:items-stretch">
          <div className="flex flex-col justify-start gap-5 px-4 pt-8 pb-8 sm:px-6 sm:pt-10 lg:w-[48%] lg:justify-center lg:gap-6 lg:py-10 lg:pl-10 lg:pr-6 xl:pl-16">
            <h1 className="font-serif text-[44px] leading-[0.97] font-semibold tracking-tight sm:text-[58px] lg:text-[72px] xl:text-[76px]">
              <span className="block text-bf-heading">Automatize.</span>
              <span className="block text-bf-rose">Encante.</span>
              <span className="block text-bf-wine-dark">Fidelize.</span>
            </h1>

            <p className="max-w-[420px] text-base text-bf-text sm:text-lg">
              O sistema completo para profissionais da beleza atenderem melhor, organizarem sua
              agenda e fazerem seu negócio crescer.
            </p>

            <div id="beneficios" className="flex max-w-[480px] flex-wrap gap-x-5 gap-y-4">
              {BENEFICIOS.map((beneficio) => (
                <div key={beneficio.linha1} className="flex flex-1 min-w-[95px] flex-col items-center gap-2 text-center">
                  <beneficio.icon className="h-7 w-7 text-bf-wine" aria-hidden="true" strokeWidth={1.75} />
                  <span className="text-xs leading-tight font-medium text-bf-text">
                    {beneficio.linha1}
                    <br />
                    {beneficio.linha2}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[60px] w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-bf-wine px-8 text-base font-semibold text-white shadow-[0_18px_44px_-16px_rgba(157,23,77,0.55)] transition hover:bg-bf-wine-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-wine"
            >
              Quero transformar meu atendimento
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </a>

            <span className="inline-flex items-start gap-1.5 text-sm text-bf-text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-bf-wine" aria-hidden="true" />
              Mais organização, mais clientes e mais liberdade para você
            </span>
          </div>

          {/* Foto — sem borda/radius/sombra de card, ocupa 52% e encosta no limite direito do container de 1440px.
              É o container `relative` dos cards flutuantes: todos os cards abaixo são filhos
              diretos dela (não mais um bloco separado posicionado em relação ao Hero inteiro),
              então `left`/`top` em % nunca podem escapar para a coluna da headline — no
              máximo encostam na borda esquerda da própria foto. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:w-[52%]">
            <Image
              src="/landing/beautyflow-hero-profissional.png"
              alt="Profissional da beleza sorrindo enquanto usa o celular em um salão"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover object-[60%_20%] sm:object-[60%_center]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#FFF9F7] to-transparent lg:block"
            />

            {/* Sequência vertical: Cliente → BeautyFlow → Agendamento confirmado, encostados na
                borda esquerda da foto, nunca invadindo a coluna da headline. */}
            <CardCliente className="absolute top-[8%] left-[6%] w-[70%] max-w-[225px] -rotate-1" />
            <CardBeautyFlow className="absolute top-[33%] left-[9%] w-[72%] max-w-[235px] rotate-1" />
            <CardConfirmacao className="absolute top-[59%] left-[6%] w-[74%] max-w-[240px] -rotate-1" />
            <CardVinho className="absolute right-[5%] bottom-[6%] max-w-[180px]" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
