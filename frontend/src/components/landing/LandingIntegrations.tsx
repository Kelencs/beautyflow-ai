import type { ReactElement } from "react";
import { Lock } from "lucide-react";

/**
 * Ícones desenhados à mão em SVG inline (sem nova dependência) — representações visuais
 * inspiradas nas marcas reais (cores reconhecíveis), não reproduções pixel-a-pixel dos
 * logos oficiais. Vetoriais, então nunca perdem nitidez em nenhum tamanho de tela.
 */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        d="M12 5.3a6.4 6.4 0 0 0-5.5 9.6L5.6 18.4l3.6-1a6.4 6.4 0 1 0 2.8-12.1Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.2"
      />
      <path
        d="M9.7 9.2c.2-.4.4-.4.6-.4h.3c.15 0 .3 0 .4.3.15.35.5 1.2.55 1.3.05.1.08.2 0 .35-.08.15-.12.25-.25.4-.12.15-.25.28-.1.5.15.25.6 1 1.35 1.65.9.8 1.35.9 1.55.8.2-.1.3-.25.4-.4.1-.15.2-.15.35-.1.15.05.9.45 1.05.55.15.08.25.12.3.2.05.08.05.5-.15.9-.2.45-1 .85-1.4.9-.4.05-.7.2-2.4-.5-1.7-.7-2.75-2.5-2.85-2.65-.1-.15-.75-1-.75-1.9s.5-1.35.65-1.55Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function GoogleAgendaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" fill="#FFFFFF" stroke="#DADCE0" strokeWidth="1" />
      <rect x="3" y="4.5" width="18" height="4.5" rx="2" fill="#4285F4" />
      <rect x="3" y="7" width="18" height="2" fill="#4285F4" />
      <rect x="6.8" y="3" width="1.6" height="3" rx="0.8" fill="#1A56D6" />
      <rect x="15.6" y="3" width="1.6" height="3" rx="0.8" fill="#1A56D6" />
      <text x="12" y="17.5" fontSize="7.5" fontWeight="700" textAnchor="middle" fill="#4285F4">
        31
      </text>
    </svg>
  );
}

function GoogleSheetsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path d="M6.5 2.5h7.2l4 4v14a1 1 0 0 1-1 1h-10.2a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z" fill="#0F9D58" />
      <path d="M13.7 2.5l4 4h-3a1 1 0 0 1-1-1v-3Z" fill="#0B8043" />
      <rect x="7.7" y="10.2" width="8.6" height="7.6" fill="#FFFFFF" />
      <line x1="7.7" y1="12.7" x2="16.3" y2="12.7" stroke="#0F9D58" strokeWidth="0.7" />
      <line x1="7.7" y1="15.2" x2="16.3" y2="15.2" stroke="#0F9D58" strokeWidth="0.7" />
      <line x1="11" y1="10.2" x2="11" y2="17.8" stroke="#0F9D58" strokeWidth="0.7" />
      <line x1="13.4" y1="10.2" x2="13.4" y2="17.8" stroke="#0F9D58" strokeWidth="0.7" />
    </svg>
  );
}

function AiSparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <defs>
        <linearGradient id="bf-ai-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.2c.45 3.35 1.15 5.2 2.4 6.45 1.25 1.25 3.1 1.95 6.45 2.4-3.35.45-5.2 1.15-6.45 2.4-1.25 1.25-1.95 3.1-2.4 6.45-.45-3.35-1.15-5.2-2.4-6.45-1.25-1.25-3.1-1.95-6.45-2.4 3.35-.45 5.2-1.15 6.45-2.4 1.25-1.25 1.95-3.1 2.4-6.45Z"
        fill="url(#bf-ai-gradient)"
      />
    </svg>
  );
}

interface Integracao {
  Icon: () => ReactElement;
  nome: string;
  descricao: string;
}

/**
 * As 4 integrações reais/previstas do projeto (WF001 WhatsApp, WF004-007 Google Agenda,
 * Google Sheets como banco atual, IA/Gemini) — nenhuma marcada como "em evolução" porque
 * todas já fazem parte da arquitetura descrita em CLAUDE.md.
 */
const INTEGRACOES: Integracao[] = [
  {
    Icon: WhatsAppIcon,
    nome: "WhatsApp Cloud API",
    descricao: "Automatize conversas e facilite o atendimento aos seus clientes.",
  },
  {
    Icon: GoogleAgendaIcon,
    nome: "Google Agenda",
    descricao: "Mantenha compromissos e horários organizados.",
  },
  {
    Icon: GoogleSheetsIcon,
    nome: "Google Sheets",
    descricao: "Apoie registros, controles e automações do seu negócio.",
  },
  {
    Icon: AiSparkleIcon,
    nome: "Inteligência Artificial",
    descricao: "Auxilia no atendimento e na interpretação das necessidades dos clientes.",
  },
];

export function LandingIntegrations() {
  return (
    <section id="integracoes" className="bg-bf-blush/50 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="font-serif text-[30px] font-semibold tracking-tight text-bf-heading sm:text-[40px] lg:text-[44px]">
            <span className="block">Integrações que</span>
            <span className="block">
              <span className="text-bf-rose">facilitam</span> sua vida
            </span>
          </h2>
          <p className="text-base text-bf-text sm:text-lg">
            O BeautyFlow conecta ferramentas importantes da rotina para deixar seu atendimento
            mais simples e organizado.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRACOES.map((integracao) => (
            <div
              key={integracao.nome}
              className="flex flex-col items-start gap-3 rounded-2xl border border-bf-rose/20 bg-white p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-bf-border bg-white">
                <integracao.Icon />
              </span>
              <h3 className="text-sm font-semibold text-bf-heading">{integracao.nome}</h3>
              <p className="text-sm text-bf-text">{integracao.descricao}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl bg-bf-rose-light px-5 py-4 text-sm text-bf-heading">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-bf-wine" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">Seus dados seguros e organizados.</span>
            <span className="text-bf-text">
              O BeautyFlow foi pensado para manter as informações de cada empresa separadas e
              organizadas com segurança.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
