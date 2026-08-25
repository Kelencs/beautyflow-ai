import { CalendarCheck2, MessageCircle, Sparkles } from "lucide-react";

/**
 * O painel de conversa é uma ILUSTRAÇÃO conceitual do produto (texto genérico,
 * condizente com as intenções reais que o módulo IA já identifica — AGENDAR/CONSULTAR
 * DISPONIBILIDADE), não uma captura de tela real, nem depoimento, nem cliente real —
 * ver legenda abaixo do painel.
 *
 * Fase 3: headline reduzida de 64px para 54px no desktop e coluna de texto alargada
 * (grid assimétrico 1.1fr/0.9fr) para caber em ~4-5 linhas em vez de 6-7, preservando a
 * mensagem original e o destaque em roxo.
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo: gradiente muito claro + glows discretos, sem elementos com foco (decorativos). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #F7F5FF 50%, #FFF5F8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: "#7C5CFC" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-16 -z-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "#B7A7FF" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "#F4B4CD" }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-bf-lilac/40 bg-bf-lilac-light px-3 py-1 text-xs font-semibold text-bf-primary">
            Feito para negócios da área da beleza
          </span>

          <h1 className="max-w-xl text-[34px] leading-[1.12] font-semibold tracking-tight text-bf-heading sm:text-[42px] lg:text-[48px] xl:text-[54px]">
            Seu salão <span className="text-bf-primary">atendendo, agendando e cuidando</span> dos
            clientes até quando você está ocupada.
          </h1>

          <p className="max-w-lg text-base text-bf-text sm:text-lg">
            O BeautyFlow reúne WhatsApp, inteligência artificial, agenda e gestão para automatizar
            tarefas do dia a dia do seu negócio de beleza.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#demonstracao"
              className="inline-flex items-center justify-center rounded-lg bg-bf-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-bf-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary"
            >
              Quero uma demonstração
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-lg border border-bf-border bg-white px-5 py-3 text-sm font-semibold text-bf-heading shadow-sm transition hover:bg-bf-lilac-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary"
            >
              Ver como funciona
            </a>
          </div>
          <p className="text-sm text-bf-text-muted">
            Já tem uma conta? Use o botão &ldquo;Entrar&rdquo; com o acesso enviado pelo
            administrador do seu salão.
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col gap-3 rounded-2xl border border-bf-border bg-white p-5 shadow-[0_24px_70px_-28px_rgba(91,61,245,0.4)] ring-1 ring-black/[0.02] transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_-28px_rgba(91,61,245,0.45)]">
            <div className="flex items-center justify-between gap-2 border-b border-bf-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-bf-heading">WhatsApp</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-bf-lilac-light px-2.5 py-1 text-xs font-semibold text-bf-primary">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                IA
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-bf-text">
                Tem horário amanhã para manicure?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-bf-primary px-4 py-2.5 text-sm text-white">
                Tenho estes horários disponíveis: 10h ou 15h com a Ana. Qual prefere?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-bf-text">
                15h está ótimo!
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <CalendarCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Agendamento confirmado ✓
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-bf-text-muted">
            Ilustração da experiência do produto — não é uma captura de tela real do sistema.
          </p>
        </div>
      </div>
    </section>
  );
}
