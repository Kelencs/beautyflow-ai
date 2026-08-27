import { Check } from "lucide-react";

const FUNCIONALIDADES = [
  "Atendimento automático via WhatsApp 24h",
  "Agendamento inteligente e sem conflitos",
  "Lembretes automáticos que ajudam a reduzir faltas",
  "Cadastro e histórico completo de clientes",
  "Divulgação e promoções na hora certa",
  "Relatórios para apoiar suas decisões",
  "Integração com Google Agenda e Google Sheets",
];

/**
 * "Tudo que você precisa em um só lugar" — só título, subtítulo e lista, tudo centralizado
 * num container de largura controlada (max-w-[820px]). O mockup de celular que existia
 * aqui foi removido por instrução explícita (não substituído por nenhuma outra imagem).
 */
export function LandingFeatures() {
  return (
    <section id="funcionalidades" className="bg-bf-cream py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-10 px-4 text-center sm:px-6">
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-serif text-[30px] font-semibold tracking-tight sm:text-[40px] lg:text-[44px]">
            <span className="block text-bf-heading">Tudo que você precisa</span>
            <span className="block text-bf-rose">em um só lugar</span>
          </h2>
          <p className="max-w-md text-base text-bf-text sm:text-lg">
            Recursos pensados para simplificar o atendimento, organizar a rotina e dar mais
            visibilidade ao seu negócio.
          </p>
        </div>

        <ul className="flex flex-col items-center gap-3.5">
          {FUNCIONALIDADES.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-bf-text sm:text-base">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bf-wine text-white">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
