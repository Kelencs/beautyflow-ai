import type { LucideIcon } from "lucide-react";
import { BellOff, CalendarClock, CheckCheck, Clock, FolderOpen, MessageCircle, Search } from "lucide-react";

interface Problema {
  icon: LucideIcon;
  texto: string;
}

const PROBLEMAS: Problema[] = [
  { icon: MessageCircle, texto: "Mensagens chegando durante o atendimento" },
  { icon: Clock, texto: "Clientes esperando resposta" },
  { icon: CalendarClock, texto: "Precisar conferir horários manualmente" },
  { icon: CheckCheck, texto: "Confirmações feitas uma a uma" },
  { icon: BellOff, texto: "Clientes esquecendo o horário marcado" },
  { icon: FolderOpen, texto: "Informações espalhadas em vários lugares" },
  { icon: Search, texto: "Dificuldade para acompanhar quem não retornou" },
];

/**
 * Seção comercial: dores cotidianas, sem estatística/claim alarmista.
 *
 * Fase 3: trocado CSS Grid por Flexbox com `justify-center` — com 7 itens, a segunda
 * linha (3 cards) ficava desalinhada à esquerda num grid de 4 colunas; em flex-wrap com
 * largura fixa por item, a última linha centraliza naturalmente. Hover ficou mais
 * discreto (só borda + leve elevação, sem sombra pesada).
 */
export function LandingProblems() {
  return (
    <section id="problemas" className="bg-bf-surface py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Seu tempo deveria estar nos atendimentos — não preso ao WhatsApp.
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Você provavelmente reconhece pelo menos um desses momentos na sua rotina.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {PROBLEMAS.map((problema) => (
            <div
              key={problema.texto}
              className="flex w-full flex-col gap-3 rounded-2xl border border-bf-border bg-bf-surface p-5 transition hover:-translate-y-0.5 hover:border-bf-lilac sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-bf-lilac-light text-bf-primary">
                <problema.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-bf-heading">{problema.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
