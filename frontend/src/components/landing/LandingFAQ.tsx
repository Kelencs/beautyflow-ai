"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Pergunta {
  pergunta: string;
  resposta: string;
}

const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "O que é o BeautyFlow?",
    resposta:
      "O BeautyFlow é uma plataforma criada para ajudar profissionais e negócios da área da beleza a organizar atendimento, agenda, clientes e rotinas de gestão em um só lugar.",
  },
  {
    pergunta: "O BeautyFlow pode atender clientes pelo WhatsApp?",
    resposta:
      "A proposta do BeautyFlow inclui automação de atendimento pelo WhatsApp, permitindo apoiar conversas, identificar necessidades dos clientes e facilitar ações como consulta e agendamento de horários.",
  },
  {
    pergunta: "Como funciona o agendamento?",
    resposta:
      "O BeautyFlow organiza horários, profissionais e serviços para ajudar a evitar conflitos de agenda e tornar o acompanhamento dos atendimentos mais simples.",
  },
  {
    pergunta: "Posso organizar os dados dos meus clientes?",
    resposta:
      "Sim. A plataforma foi projetada para centralizar informações e histórico dos clientes, facilitando o acompanhamento do relacionamento e dos atendimentos.",
  },
  {
    pergunta: "O BeautyFlow envia lembretes de agendamento?",
    resposta:
      "A proposta inclui lembretes automáticos antes dos atendimentos, ajudando o estabelecimento a manter clientes informados e a reduzir esquecimentos.",
  },
  {
    pergunta: "Quais ferramentas podem ser integradas ao BeautyFlow?",
    resposta:
      "O projeto contempla integrações como WhatsApp Cloud API, Google Agenda, Google Sheets e recursos de Inteligência Artificial, de acordo com a configuração e a evolução da plataforma.",
  },
  {
    pergunta: "O BeautyFlow serve apenas para salões de beleza?",
    resposta:
      "Não. Ele foi pensado para diferentes profissionais e negócios da beleza, como nail designers, lash designers, cabeleireiras, esteticistas e salões.",
  },
  {
    pergunta: "Preciso instalar algum programa?",
    resposta:
      "O BeautyFlow é pensado como uma aplicação web, permitindo o acesso pelo navegador nos dispositivos compatíveis, sem necessidade de instalar um sistema tradicional no computador.",
  },
];

/**
 * Accordion controlado (não mais `<details>` nativo) — só uma resposta aberta por vez,
 * com botão real (`aria-expanded`/`aria-controls`) e animação suave via
 * `grid-template-rows` (0fr → 1fr), técnica que anima altura sem medir pixels em JS.
 */
export function LandingFAQ() {
  const [abertaIndex, setAbertaIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-bf-blush/40 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="font-serif text-[30px] font-semibold tracking-tight sm:text-[40px] lg:text-[44px]">
            <span className="text-bf-heading">Perguntas </span>
            <span className="text-bf-rose">frequentes</span>
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            Confira algumas das principais dúvidas sobre o BeautyFlow.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {PERGUNTAS.map((item, indice) => {
            const aberta = abertaIndex === indice;
            const botaoId = `faq-botao-${indice}`;
            const painelId = `faq-painel-${indice}`;

            return (
              <div
                key={item.pergunta}
                className="rounded-2xl border border-bf-border bg-white transition hover:border-bf-rose/50"
              >
                <h3>
                  <button
                    type="button"
                    id={botaoId}
                    aria-expanded={aberta}
                    aria-controls={painelId}
                    onClick={() => setAbertaIndex(aberta ? null : indice)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-bf-heading focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-wine sm:text-base"
                  >
                    {item.pergunta}
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-bf-wine transition-transform duration-300 ${aberta ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={painelId}
                  role="region"
                  aria-labelledby={botaoId}
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: aberta ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-bf-text sm:text-base">{item.resposta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
