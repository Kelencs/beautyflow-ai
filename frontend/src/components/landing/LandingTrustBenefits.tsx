import type { LucideIcon } from "lucide-react";
import { Headphones, Package, RefreshCw, Wrench } from "lucide-react";

interface Beneficio {
  icon: LucideIcon;
  linha1: string;
  linha2: string;
}

const BENEFICIOS: Beneficio[] = [
  { icon: Wrench, linha1: "Implantação rápida", linha2: "e sem complicação" },
  { icon: Headphones, linha1: "Suporte humanizado", linha2: "sempre que precisar" },
  { icon: Package, linha1: "Planos acessíveis", linha2: "para todos os tamanhos" },
  { icon: RefreshCw, linha1: "Atualizações constantes", linha2: "e novas funcionalidades" },
];

/**
 * Faixa final de confiança, entre o CTA e o Footer — minimalista de propósito: sem cards,
 * sem sombra pesada, só ícone (esquerda) + texto (direita), uma linha fina no desktop.
 * Ícones do próprio Lucide já usado no projeto (nenhuma dependência nova).
 */
export function LandingTrustBenefits() {
  return (
    <section className="border-t border-bf-border bg-bf-cream py-10 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 sm:px-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {BENEFICIOS.map((beneficio) => (
          <div key={beneficio.linha1} className="flex items-center gap-3">
            <beneficio.icon className="h-6 w-6 shrink-0 text-bf-wine" aria-hidden="true" strokeWidth={1.5} />
            <span className="text-sm leading-tight text-bf-text">
              {beneficio.linha1}
              <br />
              {beneficio.linha2}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
