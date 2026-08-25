import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUsuarioAutenticado } from "@/lib/auth/dal";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const usuario = await getUsuarioAutenticado();

  return <AppShell usuario={usuario}>{children}</AppShell>;
}
