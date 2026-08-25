import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Calendar,
  MessageCircle,
  Scissors,
  Sparkles,
  UserSquare2,
  Users,
  Wallet,
} from "lucide-react";

interface Recurso {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  destaque?: boolean;
}

/**
 * Um card por área real do produto (nenhuma funcionalidade além do escopo já existente
 * no App — ver frontend/src/components/layout/nav-items.ts para os módulos reais).
 *
 * Fase 3: Agenda/Atendimento com IA/Comunicação recebem um destaque visual leve (borda e
 * fundo do ícone em lilás, ícone levemente maior) — não uma reformulação de tamanho, só
 * uma diferença sutil de peso visual, evitando aparência de dashboard.
 */
const RECURSOS: Recurso[] = [
  {
    icon: Calendar,
    titulo: "Agenda",
    descricao: "Agendamentos organizados e a rotina do seu dia sempre à vista.",
    destaque: true,
  },
  {
    icon: Bot,
    titulo: "Atendimento com IA",
    descricao: "A IA auxilia o atendimento das suas clientes diretamente pelo WhatsApp.",
    destaque: true,
  },
  {
    icon: Users,
    titulo: "Clientes",
    descricao: "Cadastro com as informações e o histórico relevante de cada cliente.",
  },
  {
    icon: Scissors,
    titulo: "Serviços",
    descricao: "Seus serviços organizados, com duração e valor sempre à mão.",
  },
  {
    icon: UserSquare2,
    titulo: "Profissionais",
    descricao: "Gerencie sua equipe e a agenda de cada profissional.",
  },
  {
    icon: MessageCircle,
    titulo: "Comunicação",
    descricao: "Confirmações, lembretes, follow-up e pesquisa de satisfação, sem esforço manual.",
    destaque: true,
  },
  {
    icon: Wallet,
    titulo: "Financeiro",
    descricao: "Pagamentos, cobranças e o financeiro da operação sempre acompanhados.",
  },
  {
    icon: BarChart3,
    titulo: "Relatórios",
    descricao: "Uma visão consolidada de como o seu negócio está indo.",
  },
  {
    icon: Sparkles,
    titulo: "IA",
    descricao: "Recursos inteligentes integrados a toda a operação do seu negócio.",
  },
];

export function LandingFeatures() {
  return (
    <section id="recursos" className="bg-bf-surface py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Tudo para deixar sua rotina mais organizada
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Um único sistema conectando o WhatsApp da sua cliente à agenda, ao financeiro e à
            comunicação do seu negócio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map((recurso) => (
            <div
              key={recurso.titulo}
              className={`flex flex-col gap-3 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                recurso.destaque ? "border-bf-lilac bg-bf-lilac-light/40" : "border-bf-border bg-bf-surface"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-lg bg-bf-lilac-light text-bf-primary ${
                  recurso.destaque ? "h-11 w-11" : "h-10 w-10"
                }`}
              >
                <recurso.icon className={recurso.destaque ? "h-5.5 w-5.5" : "h-5 w-5"} aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-bf-heading">{recurso.titulo}</h3>
              <p className="text-sm text-bf-text">{recurso.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
