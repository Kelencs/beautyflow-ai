"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/cn";
import type { Perfil } from "@/features/auth/types";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  perfil: Perfil;
}

export function MobileNav({ open, onClose, perfil }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  const itensVisiveis = NAV_ITEMS.filter((item) => !item.ownerOnly || perfil === "owner");

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <button type="button" aria-label="Fechar menu" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />

      <div className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between gap-2 border-b border-zinc-100 px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-900">BeautyFlow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {itensVisiveis.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                    {!item.available && (
                      <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                        Em breve
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
