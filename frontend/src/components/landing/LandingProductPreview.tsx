import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Calendar,
  LayoutDashboard,
  MessageCircle,
  Scissors,
  UserSquare2,
  Users,
  Wallet,
} from "lucide-react";

interface ModuloSecundario {
  icon: LucideIcon;
  nome: string;
}

const MODULOS_SECUNDARIOS: ModuloSecundario[] = [
  { icon: Users, nome: "Clientes" },
  { icon: UserSquare2, nome: "Profissionais" },
  { icon: Scissors, nome: "Serviços" },
  { icon: Wallet, nome: "Financeiro" },
  { icon: MessageCircle, nome: "Comunicação" },
  { icon: BarChart3, nome: "Relatórios" },
];

/** Moldura de janela compartilhada pelos 3 cards em destaque — só o conteúdo interno muda. */
function MolduraModulo({
  icon: Icon,
  nome,
  children,
}: {
  icon: LucideIcon;
  nome: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-2xl border border-bf-border bg-bf-surface shadow-[0_20px_60px_-30px_rgba(91,61,245,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-30px_rgba(91,61,245,0.4)]">
      <div className="flex items-center gap-2 border-b border-bf-border bg-bf-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-bf-border" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-bf-border" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-bf-border" aria-hidden="true" />
        <span className="ml-2 flex items-center gap-1.5 text-xs font-medium text-bf-text-muted">
          <Icon className="h-3.5 w-3.5 text-bf-primary" aria-hidden="true" />
          {nome} — BeautyFlow
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">{children}</div>
      <figcaption className="border-t border-bf-border px-4 py-2.5 text-center text-xs text-bf-text-muted">
        Interface ilustrativa — representação visual, não uma captura de tela real.
      </figcaption>
    </figure>
  );
}

/**
 * Sem screenshots reais disponíveis no repositório (nenhum asset do App foi encontrado —
 * ver relatório da Fase 3) — cada um dos 3 módulos prioritários (Dashboard, Agenda, IA)
 * ganha uma mini-ilustração própria (não mais uma barra-esqueleto genérica repetida),
 * para comunicar "apresentação de produto" em vez de "catálogo de placeholders". Os
 * outros 6 módulos aparecem como uma lista compacta complementar, sem competir em peso
 * visual com os 3 prioritários.
 */
export function LandingProductPreview() {
  return (
    <section id="produto" className="bg-bf-lilac-light py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Um sistema de verdade por trás da automação
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            O BeautyFlow vai além do atendimento pelo WhatsApp: você também conta com uma
            aplicação para acompanhar e organizar sua operação.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <MolduraModulo icon={LayoutDashboard} nome="Dashboard">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-bf-lilac-light p-2.5">
                <div className="h-2 w-8 rounded-full bg-bf-primary/40" aria-hidden="true" />
                <div className="mt-2 h-4 w-10 rounded bg-bf-primary/70" aria-hidden="true" />
              </div>
              <div className="rounded-lg bg-bf-rose-light p-2.5">
                <div className="h-2 w-8 rounded-full bg-bf-rose" aria-hidden="true" />
                <div className="mt-2 h-4 w-10 rounded bg-bf-rose/80" aria-hidden="true" />
              </div>
              <div className="rounded-lg bg-bf-bg p-2.5">
                <div className="h-2 w-8 rounded-full bg-bf-text-muted/40" aria-hidden="true" />
                <div className="mt-2 h-4 w-10 rounded bg-bf-text-muted/60" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-bf-bg p-3">
              {[40, 65, 50, 80, 60, 90, 45].map((altura, indice) => (
                <div
                  key={indice}
                  className="flex-1 rounded-t bg-bf-primary/70"
                  style={{ height: `${altura}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </MolduraModulo>

          <MolduraModulo icon={Calendar} nome="Agenda">
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-medium text-bf-text-muted">
              {["S", "T", "Q", "Q", "S"].map((dia, indice) => (
                <span key={indice}>{dia}</span>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-5 gap-1.5">
              {Array.from({ length: 15 }).map((_, indice) => {
                const ocupado = [2, 4, 7, 8, 12].includes(indice);
                return (
                  <div
                    key={indice}
                    className={`h-5 rounded ${ocupado ? "bg-bf-primary/70" : "bg-bf-bg"}`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-bf-lilac-light px-3 py-2 text-xs font-medium text-bf-primary">
              15h — Manicure com Ana
            </div>
          </MolduraModulo>

          <MolduraModulo icon={Bot} nome="IA">
            <div className="flex flex-col gap-1.5">
              <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-bf-bg px-3 py-2 text-xs text-bf-text">
                Tem horário amanhã?
              </div>
              <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-bf-primary px-3 py-2 text-xs text-white">
                Tenho às 10h e às 15h.
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between rounded-lg bg-bf-lilac-light px-3 py-2 text-xs font-medium text-bf-primary">
              Intenção identificada: Agendar
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px]">92%</span>
            </div>
          </MolduraModulo>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-medium text-bf-text-muted">
            E também: Clientes, Profissionais, Serviços, Financeiro, Comunicação e Relatórios
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {MODULOS_SECUNDARIOS.map((modulo) => (
              <span
                key={modulo.nome}
                className="inline-flex items-center gap-1.5 rounded-full border border-bf-border bg-bf-surface px-3.5 py-2 text-xs font-medium text-bf-heading"
              >
                <modulo.icon className="h-3.5 w-3.5 text-bf-primary" aria-hidden="true" />
                {modulo.nome}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
