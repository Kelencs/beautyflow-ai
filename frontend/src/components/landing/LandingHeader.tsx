"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#para-quem-e", label: "Para quem é" },
  { href: "#faq", label: "Dúvidas" },
];

/**
 * Link direto para o WhatsApp comercial do BeautyFlow (número fornecido pelo usuário),
 * com mensagem inicial pré-preenchida — nunca um formulário intermediário. Usado pelo
 * CTA principal do Header (desktop e menu mobile); mesma constante duplicada em
 * LandingHero.tsx e LandingCTA.tsx (arquivos landing são intencionalmente
 * autocontidos neste projeto, sem um módulo de constantes compartilhado).
 */
const WHATSAPP_URL =
  "https://wa.me/5534984320076?text=Olá%21%20Conheci%20o%20BeautyFlow%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20plataforma.";

/**
 * Nav reflete as seções reais da página: Funcionalidades, Integrações, Para quem é,
 * Dúvidas (FAQ). "Entrar" vai para /login; "Quero uma demonstração" abre o WhatsApp em
 * nova aba (não é mais uma âncora interna — ver LandingCTA.tsx/LandingHero.tsx para o
 * mesmo padrão).
 */
export function LandingHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-bf-border/30 bg-white/85 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuAberto(false)}>
          <Image
            src="/brand/beautyflow-icon.png"
            alt="BeautyFlow"
            width={38}
            height={38}
            priority
            className="h-7 w-7 lg:h-9 lg:w-9"
          />
          <span className="font-serif text-lg font-semibold tracking-tight">
            <span className="text-bf-heading">Beauty</span>
            <span className="text-bf-rose">Flow</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 text-sm font-medium text-bf-text lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-bf-wine">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-bf-text transition hover:text-bf-wine"
          >
            Entrar
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-bf-wine px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-bf-wine-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-wine"
          >
            Quero uma demonstração
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile-landing"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="col-start-3 flex h-10 w-10 items-center justify-center justify-self-end rounded-lg border border-bf-border text-bf-heading transition hover:bg-bf-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-wine lg:hidden"
        >
          {menuAberto ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile-landing"
          className="flex flex-col gap-1 border-t border-bf-border bg-white px-4 py-4 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-bf-text transition hover:bg-bf-blush hover:text-bf-wine"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-bf-border pt-3">
            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-3 py-3 text-center text-sm font-semibold text-bf-text transition hover:bg-bf-blush hover:text-bf-wine"
            >
              Entrar
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuAberto(false)}
              className="rounded-full bg-bf-wine px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-bf-wine-dark"
            >
              Quero uma demonstração
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
