import { Clock, Globe } from "lucide-react";
import { DIA_SEMANA_LABEL, DIA_SEMANA_ORDEM } from "./dia-semana";
import type { ConfiguracoesAgenda } from "./types";

interface AgendaSectionProps {
  agenda: ConfiguracoesAgenda;
}

/**
 * Somente leitura — nenhum campo aqui tem hoje um caminho de escrita real (nem
 * EMPRESAS nem DISPONIBILIDADES têm workflow de `append`/`update`, ver auditoria em
 * configuracoes.ts). Disponibilidade é modelada POR PROFISSIONAL (schema real de
 * DISPONIBILIDADES), não como um horário único do estabelecimento.
 */
export function AgendaSection({ agenda }: AgendaSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Fuso horário e cancelamento</h2>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <div>
              <dt className="text-xs text-zinc-500">Fuso horário</dt>
              <dd className="text-sm font-medium text-zinc-800">{agenda.timezone}</dd>
              <dd className="mt-0.5 text-xs text-zinc-400">Somente leitura — não configurável nesta etapa.</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <div>
              <dt className="text-xs text-zinc-500">Janela de cancelamento</dt>
              <dd className="text-sm font-medium text-zinc-800">
                Até {agenda.janelaCancelamentoMinutos} minutos antes do horário marcado
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Regras atuais da agenda</h2>
        <dl className="flex flex-col gap-2.5 text-sm">
          <div className="flex flex-col gap-0.5 border-b border-zinc-100 pb-2.5 sm:flex-row sm:items-baseline sm:justify-between">
            <dt className="font-medium text-zinc-700">Cancelamento</dt>
            <dd className="text-zinc-500">Até {agenda.janelaCancelamentoMinutos} minutos antes do horário marcado.</dd>
          </div>
          <div className="flex flex-col gap-0.5 border-b border-zinc-100 pb-2.5 sm:flex-row sm:items-baseline sm:justify-between">
            <dt className="font-medium text-zinc-700">Conflito de horário</dt>
            <dd className="text-zinc-500">Verificado automaticamente ao criar ou reagendar um atendimento.</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
            <dt className="font-medium text-zinc-700">Reagendamento</dt>
            <dd className="text-zinc-500">Aplicado conforme a regra atual do sistema.</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Disponibilidade dos profissionais</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Cada profissional possui seus próprios dias e horários de atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {agenda.disponibilidadePorProfissional.map((profissional) => (
            <div key={profissional.profissionalNome} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
              <p className="mb-2 text-sm font-semibold text-zinc-800">{profissional.profissionalNome}</p>
              <ul className="flex flex-col gap-1 text-xs">
                {DIA_SEMANA_ORDEM.map((dia) => {
                  const horario = profissional.dias.find((item) => item.diaSemana === dia);
                  return (
                    <li key={dia} className="flex items-center justify-between gap-2">
                      <span className="text-zinc-500">{DIA_SEMANA_LABEL[dia]}</span>
                      {horario?.aberto ? (
                        <span className="font-medium text-zinc-700">
                          {horario.horaInicio} – {horario.horaFim}
                          {horario.intervaloInicio && horario.intervaloFim && (
                            <span className="ml-1 text-zinc-400">
                              (intervalo {horario.intervaloInicio}–{horario.intervaloFim})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-zinc-400">Fechado</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
