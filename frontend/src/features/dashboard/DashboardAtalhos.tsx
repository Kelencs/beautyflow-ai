import Link from "next/link";
import { Calendar, Scissors, UserSquare2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Atalho {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Só módulos já funcionais — nunca linkar Financeiro/Comunicação/Relatórios/IA como se estivessem prontos. */
const ATALHOS: Atalho[] = [
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/profissionais", label: "Profissionais", icon: UserSquare2 },
];

export function DashboardAtalhos() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Acesso rápido</h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {ATALHOS.map((atalho) => (
          <Link
            key={atalho.href}
            href={atalho.href}
            className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 px-3 py-3.5 text-center transition hover:border-violet-300 hover:bg-violet-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <atalho.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium text-zinc-700">{atalho.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
