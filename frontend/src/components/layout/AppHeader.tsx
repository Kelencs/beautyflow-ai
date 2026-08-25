"use client";

import { LogOut, Menu, Sparkles } from "lucide-react";
import { logout } from "@/features/auth/actions";
import { formatPerfil, getIniciais } from "@/features/auth/format";
import type { UsuarioAutenticado } from "@/features/auth/types";

interface AppHeaderProps {
  usuario: UsuarioAutenticado;
  onMenuClick: () => void;
}

export function AppHeader({ usuario, onMenuClick }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu de navegação"
        className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Só abaixo de lg (mesmo breakpoint em que a AppSidebar, com a marca, fica oculta) — nunca duplica a sidebar. */}
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">BeautyFlow</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2.5">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-zinc-800">{usuario.nome}</p>
          <p className="text-xs text-zinc-400">{formatPerfil(usuario.perfil)}</p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700"
          aria-hidden="true"
        >
          {getIniciais(usuario.nome)}
        </span>

        <form action={logout}>
          <button
            type="submit"
            aria-label="Sair da conta"
            title="Sair"
            className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
