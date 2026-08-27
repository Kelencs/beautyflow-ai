import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Serif editorial só para títulos da landing (`font-serif`, mapeado em globals.css) — o
 * App autenticado nunca usa essa classe, então continua 100% Geist/sans, sem alteração.
 */
const editorialSerif = Playfair_Display({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeautyFlow",
  description: "Plataforma de gestão e automação de atendimentos para salões de beleza.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${editorialSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
