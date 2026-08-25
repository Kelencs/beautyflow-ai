import { Sparkles } from "lucide-react";

const NAV_PRODUTO = [
  { href: "#produto", label: "Produto" },
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Termos/Privacidade/Contato ainda não existem como página real no projeto — em vez de
 * criar link quebrado só para preencher espaço, aparecem como texto "em breve" (não
 * clicável), conforme instruído na Fase 2.
 */
const INSTITUCIONAL_EM_BREVE = ["Termos", "Privacidade", "Contato"];

export function LandingFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-bf-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bf-primary text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-bf-heading">BeautyFlow</span>
          </div>
          <p className="text-sm text-bf-text-muted">
            Gestão e automação para negócios da área da beleza.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <span className="text-xs font-semibold tracking-wide text-bf-text-muted uppercase">
            Produto
          </span>
          {NAV_PRODUTO.map((item) => (
            <a key={item.href} href={item.href} className="text-bf-text transition hover:text-bf-heading">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-xs font-semibold tracking-wide text-bf-text-muted uppercase">
            Institucional
          </span>
          {INSTITUCIONAL_EM_BREVE.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-bf-text-muted">
              {item}
              <span className="rounded-full bg-bf-lilac-light px-1.5 py-0.5 text-[10px] font-medium text-bf-primary">
                em breve
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-bf-border px-4 py-5 text-center sm:px-6">
        <p className="text-xs text-bf-text-muted">© {ano} BeautyFlow. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
