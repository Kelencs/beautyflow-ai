"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#para-quem-e", label: "Para quem é" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Navegação completa (âncoras reais das seções) + menu responsivo no mobile. "Entrar"
 * continua indo para /login (cliente já cadastrado). "Quero uma demonstração" (Fase 3:
 * renomeado de "Conhecer o BeautyFlow") é a ação para quem ainda não tem conta — sem
 * formulário/WhatsApp comercial ainda no projeto, aponta para a âncora `#demonstracao`
 * (a própria seção de CTA final, ver LandingCTA.tsx), nunca para /login: um visitante
 * novo não deve ser encaminhado direto para uma tela de login que ele não pode usar.
 */
export function LandingHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-bf-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuAberto(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bf-primary text-white">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-bf-heading">BeautyFlow</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-bf-text lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-bf-heading">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-bf-text transition hover:text-bf-heading"
          >
            Entrar
          </Link>
          <a
            href="#demonstracao"
            className="inline-flex items-center justify-center rounded-lg bg-bf-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-bf-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-bf-border text-bf-heading transition hover:bg-bf-lilac-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bf-primary lg:hidden"
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
              className="rounded-lg px-3 py-3 text-sm font-medium text-bf-text transition hover:bg-bf-lilac-light hover:text-bf-heading"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-bf-border pt-3">
            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-3 py-3 text-center text-sm font-semibold text-bf-text transition hover:bg-bf-lilac-light hover:text-bf-heading"
            >
              Entrar
            </Link>
            <a
              href="#demonstracao"
              onClick={() => setMenuAberto(false)}
              className="rounded-lg bg-bf-primary px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-bf-primary-hover"
            >
              Quero uma demonstração
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
