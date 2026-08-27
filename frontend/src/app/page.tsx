import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingAudience } from "@/components/landing/LandingAudience";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingIntegrations } from "@/components/landing/LandingIntegrations";
import { LandingTrustBenefits } from "@/components/landing/LandingTrustBenefits";

/**
 * Landing page comercial, pública (ver PUBLIC_ROUTE_PREFIXES/isPublicRoute em
 * lib/supabase/middleware.ts — "/" não exige sessão). Quem já está autenticado continua
 * indo direto para "/agenda" (mesmo comportamento de antes, verificado aqui como uma
 * segunda camada, igual ao padrão já usado em app/(auth)/login/page.tsx), e quem não está
 * vê a landing.
 *
 * Estrutura: Header, Hero, Funcionalidades (`#funcionalidades`), Integrações
 * (`#integracoes`), Para quem é (`#para-quem-e`), FAQ (`#faq`), CTA final
 * (`#demonstracao`), faixa final de confiança (LandingTrustBenefits, sem id — não é
 * âncora de nav), Footer. LandingProblems, LandingHowItWorks, LandingBeforeAfter,
 * LandingProductPreview, LandingPricing continuam fora da renderização (não apagados).
 */

// SEO — não inventa domínio/URL oficial; título e descrição só desta rota, sobrescrevendo
// o metadata genérico de app/layout.tsx.
export const metadata: Metadata = {
  title: "BeautyFlow — Atendimento, Agenda e Gestão para Profissionais da Beleza",
  description:
    "O BeautyFlow reúne atendimento, agenda, clientes e gestão em uma plataforma pensada para salões, nail designers, lash designers, cabeleireiras e esteticistas.",
  openGraph: {
    title: "BeautyFlow — Atendimento, Agenda e Gestão para Profissionais da Beleza",
    description:
      "O BeautyFlow reúne atendimento, agenda, clientes e gestão em uma plataforma pensada para salões, nail designers, lash designers, cabeleireiras e esteticistas.",
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
    <div className="flex min-h-dvh flex-col bg-bf-cream">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingIntegrations />
        <LandingAudience />
        <LandingFAQ />
        <LandingCTA />
        <LandingTrustBenefits />
      </main>
      <LandingFooter />
    </div>
  );
}
