import { ChevronDown } from "lucide-react";

interface Pergunta {
  pergunta: string;
  resposta: string;
}

/**
 * Respostas conferidas contra o comportamento real do módulo IA/Agenda/Profissionais já
 * implementado no App (ver backend/src/ia, backend/src/agenda, backend/src/profissionais)
 * — nenhuma capacidade inventada. Onde algo ainda depende de uma etapa futura (edição de
 * disponibilidade/bloqueios pela tela), a resposta usa a redação transparente pedida.
 *
 * Fase 3 (revisão de promessas): "Preciso trocar meu WhatsApp?" e "O BeautyFlow substitui
 * meu WhatsApp?" foram reescritas — a versão anterior afirmava de forma definitiva que
 * nenhuma configuração seria necessária, o que o projeto não garante (a configuração real
 * da integração depende da estrutura adotada pelo estabelecimento). A nova redação é
 * comercial, mas não promete algo que ainda não está definido tecnicamente.
 */
const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Preciso trocar meu WhatsApp?",
    resposta:
      "O BeautyFlow foi pensado para funcionar integrado ao atendimento pelo WhatsApp. A configuração necessária depende da estrutura utilizada pelo estabelecimento e é orientada durante a implantação.",
  },
  {
    pergunta: "O cliente precisa instalar algum aplicativo?",
    resposta: "Não. A cliente continua conversando pelo WhatsApp normalmente, sem instalar nada novo.",
  },
  {
    pergunta: "A IA pode ajudar no atendimento?",
    resposta:
      "Sim. A IA identifica o que a cliente está pedindo — agendar, consultar horário, remarcar ou cancelar — e ajuda a conduzir o atendimento.",
  },
  {
    pergunta: "Posso cadastrar vários profissionais?",
    resposta: "Sim. O BeautyFlow foi feito para equipes, com agenda própria para cada profissional.",
  },
  {
    pergunta: "Consigo organizar meus horários?",
    resposta:
      "Sim, pela Agenda do sistema, com visão por dia, semana ou mês. A edição de horários recorrentes e bloqueios por profissional faz parte da evolução planejada do BeautyFlow.",
  },
  {
    pergunta: "O BeautyFlow funciona para salão com vários profissionais?",
    resposta: "Sim. Cada profissional tem sua própria agenda, sem misturar horários da equipe.",
  },
  {
    pergunta: "Posso acessar minha agenda pelo sistema?",
    resposta:
      "Sim. Além do atendimento pelo WhatsApp, você acompanha e organiza tudo pelo painel do BeautyFlow, no computador ou no celular.",
  },
  {
    pergunta: "O BeautyFlow substitui meu WhatsApp?",
    resposta:
      "Não. Ele funciona integrado ao WhatsApp que o seu negócio já usa, automatizando parte do atendimento — não é uma substituição do aplicativo nem do canal que sua cliente já conhece.",
  },
];

/** Accordion nativo (<details>/<summary>) — acessível por teclado/leitor de tela sem JS. */
export function LandingFAQ() {
  return (
    <section id="faq" className="bg-bf-surface py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[48px]">
            Perguntas frequentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {PERGUNTAS.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-2xl border border-bf-border bg-bf-bg open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-bf-heading marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary">
                {item.pergunta}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-bf-primary transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-4 text-sm text-bf-text">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
