"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";
import type { UsuarioAutenticado } from "@/features/auth/types";

interface AppShellProps {
  usuario: UsuarioAutenticado;
  children: ReactNode;
}

export function AppShell({ usuario, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-50">
      <AppSidebar perfil={usuario.perfil} />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} perfil={usuario.perfil} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader usuario={usuario} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
