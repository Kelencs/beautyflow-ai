import { Sparkles } from "lucide-react";

const PUBLICO = [
  "Nail Designers",
  "Manicures",
  "Salões de beleza",
  "Lash Designers",
  "Designers de sobrancelhas",
  "Esteticistas",
  "Studios de beleza",
];

/**
 * Fase 3: pills soltas trocadas por uma grade de cards compactos, reduzindo o espaço
 * vazio da seção. Um único ícone (Sparkles) compartilhado por todos os cards — de
 * propósito, para não recorrer a ícones literais por nicho (evita clichê visual).
 */
export function LandingAudience() {
  return (
    <section id="para-quem-e" className="bg-bf-surface py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Feito para quem vive da beleza.
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Profissionais independentes ou equipes inteiras — o BeautyFlow se adapta ao tamanho do
            seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PUBLICO.map((publico) => (
            <div
              key={publico}
              className="flex items-center gap-2.5 rounded-2xl border border-bf-border bg-bf-surface p-4 transition hover:-translate-y-0.5 hover:border-bf-lilac hover:shadow-md"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bf-lilac-light text-bf-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-bf-heading">{publico}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
