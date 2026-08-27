import type { ReactElement, SVGProps } from "react";
import { Eye, Flower2, Scissors } from "lucide-react";

/**
 * Ícones outline finos desenhados à mão (sem nova dependência) para os conceitos que o
 * Lucide não cobre literalmente — frasco de esmalte e rosto/cabelo — com a mesma
 * assinatura de props dos ícones do Lucide (`SVGProps`), para aceitar `className` e
 * `aria-hidden` do mesmo jeito e não destoar visualmente (mesmo stroke-width/proporção).
 */
function IconEsmalte(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="10" y="2.5" width="4" height="2.5" rx="0.6" />
      <path d="M9.3 10V6.5a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1V10" />
      <rect x="6.5" y="10" width="11" height="11.5" rx="2.2" />
    </svg>
  );
}

function IconCabelo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 11c0-3.6 2.4-6.5 5.5-6.5s5.5 2.9 5.5 6.5" />
      <path d="M6.5 11v2.5c0 3.6 2.4 6.5 5.5 6.5s5.5-2.9 5.5-6.5V11" />
      <path d="M5.3 9.8c-.9 1.2-1.2 3.1-.6 4.9" />
      <path d="M18.7 9.8c.9 1.2 1.2 3.1.6 4.9" />
    </svg>
  );
}

function IconRosto(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8.5" r="4" />
      <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    </svg>
  );
}

interface Publico {
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  nome: string;
}

const PUBLICO: Publico[] = [
  { Icon: Scissors, nome: "Salões de Beleza" },
  { Icon: IconEsmalte, nome: "Nail Designers" },
  { Icon: Eye, nome: "Lash Designers" },
  { Icon: IconCabelo, nome: "Cabeleireiras" },
  { Icon: Flower2, nome: "Esteticistas" },
  { Icon: IconRosto, nome: "e muito mais..." },
];

/**
 * Card grande arredondado, fundo quase branco/blush, borda rosa muito suave — reproduz a
 * faixa "Feito para quem faz a beleza acontecer" da referência. Ícones sem badge/círculo
 * (removido o `bg-white rounded-full shadow-sm` que existia antes) — na referência os
 * ícones aparecem direto sobre a seção, outline fino, em vinho.
 */
export function LandingAudience() {
  return (
    <section id="para-quem-e" className="relative z-10 bg-bf-cream px-4 py-4 sm:px-6 sm:py-5 lg:-mt-6">
      {/* `max-w-6xl` primeiro (limita a 1152px), `w-[92%]` depois — precisam ser elementos
          diferentes: no mesmo elemento, `max-width` sempre venceria e `w-[92%]` nunca teria
          efeito acima de ~1252px de viewport. */}
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto w-[92%] rounded-[32px] border border-bf-rose/20 bg-bf-blush/60 px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="text-center font-serif text-[24px] font-semibold tracking-tight text-bf-heading sm:text-[30px] lg:text-[34px]">
            Feito para quem faz a beleza acontecer
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:flex lg:flex-row lg:items-start lg:justify-between">
            {PUBLICO.map((publico) => (
              <div key={publico.nome} className="flex flex-col items-center gap-2.5 text-center">
                <publico.Icon className="h-9 w-9 text-bf-wine" aria-hidden="true" />
                <span className="text-sm font-medium text-bf-heading">{publico.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
