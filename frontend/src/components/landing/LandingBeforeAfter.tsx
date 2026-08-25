import { Check, X } from "lucide-react";

const SEM_BEAUTYFLOW = [
  "Responder mensagens manualmente",
  "Conferir a agenda manualmente",
  "Lembrar de confirmar cada cliente",
  "Informações em lugares diferentes",
  "Tarefas repetitivas ocupando o dia",
];

const COM_BEAUTYFLOW = [
  "Atendimento auxiliado por automação e IA",
  "Agenda integrada",
  "Comunicações automatizadas",
  "Informações centralizadas",
  "Menos tarefas operacionais repetitivas",
];

/**
 * Comparação sem claims quantitativos ("zero faltas", "100% automático" etc.) — só o que
 * muda na rotina. Fase 3: lado "Com o BeautyFlow" com destaque roxo mais evidente (fundo
 * em gradiente lilás + borda sólida + barra de acento no topo), mantendo a estrutura.
 */
export function LandingBeforeAfter() {
  return (
    <section className="border-t border-bf-border bg-bf-bg py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Antes e depois do BeautyFlow
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            O que muda na sua rotina quando a operação passa a rodar com automação e IA.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-bf-border bg-bf-surface p-6 sm:p-7">
            <h3 className="text-xs font-semibold tracking-wide text-bf-text-muted uppercase">
              Sem o BeautyFlow
            </h3>
            <ul className="flex flex-col gap-4">
              {SEM_BEAUTYFLOW.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-bf-text">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                    <X className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-bf-primary bg-gradient-to-br from-bf-lilac-light to-white p-6 shadow-[0_20px_60px_-28px_rgba(91,61,245,0.4)] sm:p-7">
            <span className="absolute inset-x-0 top-0 h-1 bg-bf-primary" aria-hidden="true" />
            <h3 className="text-xs font-semibold tracking-wide text-bf-primary uppercase">
              Com o BeautyFlow
            </h3>
            <ul className="flex flex-col gap-4">
              {COM_BEAUTYFLOW.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-bf-heading">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bf-primary text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
