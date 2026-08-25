import { CalendarCheck, ClipboardList, MessagesSquare, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Passo {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
}

/**
 * Explicação comercial: nenhuma menção a n8n/webhook/workflow/API/banco/LLM — só o que
 * o negócio percebe, na linguagem da dona do salão, não do desenvolvedor.
 *
 * Fase 3 (correção de copy): removidas as frases "sem nenhum passo manual"/"sem passo
 * manual" do subtítulo e do passo 4 — prometiam automação absoluta/ausência total de
 * intervenção humana, o que o projeto não garante. Substituídas por redação mais segura
 * ("com menos tarefas manuais"/"reduzindo tarefas repetitivas").
 *
 * Fase 3.1: removido "pelo número de sempre" do passo 1 — sugeria que o BeautyFlow
 * sempre manteria o mesmo número de WhatsApp do estabelecimento, algo que depende da
 * configuração real da integração (ainda não definida) e não deve ser prometido aqui.
 */
const PASSOS: Passo[] = [
  {
    icon: MessagesSquare,
    titulo: "Cliente chama no WhatsApp",
    descricao: "A cliente continua usando o WhatsApp normalmente, sem precisar aprender um sistema novo.",
  },
  {
    icon: Sparkles,
    titulo: "O BeautyFlow entende o que ele precisa",
    descricao: "Identifica se é para agendar, remarcar, cancelar ou só consultar um horário.",
  },
  {
    icon: ClipboardList,
    titulo: "Consulta a agenda e as informações necessárias",
    descricao: "Verifica horários livres, profissional disponível e o histórico do cliente.",
  },
  {
    icon: CalendarCheck,
    titulo: "O atendimento continua e a operação fica organizada",
    descricao:
      "Agenda, cadastro e comunicação são atualizados automaticamente, reduzindo tarefas repetitivas ao longo da operação.",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-bf-border bg-bf-lilac-light py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Como funciona
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Do primeiro &ldquo;oi&rdquo; no WhatsApp ao atendimento concluído, com menos tarefas
            manuais para você.
          </p>
        </div>

        {/* Conector visual 1→2→3→4, só no desktop — linha discreta atrás dos números. */}
        <div className="relative hidden lg:grid lg:grid-cols-4 lg:gap-6">
          <div className="absolute inset-x-[12.5%] top-5 h-px bg-bf-lilac" aria-hidden="true" />
          {PASSOS.map((passo, indice) => (
            <div key={passo.titulo} className="relative z-10 flex justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bf-primary text-sm font-semibold text-white ring-4 ring-bf-lilac-light">
                {indice + 1}
              </span>
            </div>
          ))}
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, indice) => (
            <li
              key={passo.titulo}
              className="flex flex-col gap-3 rounded-2xl border border-bf-border bg-bf-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bf-primary text-sm font-semibold text-white">
                  {indice + 1}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bf-lilac-light text-bf-primary">
                  <passo.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
              </div>
              <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-bf-lilac-light text-bf-primary lg:flex">
                <passo.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-bf-heading">{passo.titulo}</h3>
              <p className="text-sm text-bf-text">{passo.descricao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
