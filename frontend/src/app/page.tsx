import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingAudience } from "@/components/landing/LandingAudience";
import { LandingBeforeAfter } from "@/components/landing/LandingBeforeAfter";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingProblems } from "@/components/landing/LandingProblems";
import { LandingProductPreview } from "@/components/landing/LandingProductPreview";

/**
 * Landing page comercial, pública (ver PUBLIC_ROUTE_PREFIXES/isPublicRoute em
 * lib/supabase/middleware.ts — "/" não exige sessão). Quem já está autenticado continua
 * indo direto para "/agenda" (mesmo comportamento de antes, verificado aqui como uma
 * segunda camada, igual ao padrão já usado em app/(auth)/login/page.tsx), e quem não está
 * vê a landing. Ordem das seções — Fase 2 (seção 30 do pedido): Header, Hero, Problemas,
 * Como funciona, Recursos, Antes×Depois, Produto, Para quem é, Planos, FAQ, CTA, Footer.
 */

// SEO da Fase 2 (seção 25 do pedido) — não inventa domínio/URL oficial; título e
// descrição só desta rota, sobrescrevendo o metadata genérico de app/layout.tsx.
export const metadata: Metadata = {
  title: "BeautyFlow — Gestão e automação para negócios de beleza",
  description:
    "Atendimento, agenda, clientes, comunicação e gestão reunidos em uma plataforma criada para negócios da área da beleza.",
  openGraph: {
    title: "BeautyFlow — Gestão e automação para negócios de beleza",
    description:
      "Atendimento, agenda, clientes, comunicação e gestão reunidos em uma plataforma criada para negócios da área da beleza.",
    type: "website",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/agenda");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bf-bg">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingProblems />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingBeforeAfter />
        <LandingProductPreview />
        <LandingAudience />
        <LandingPricing />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
