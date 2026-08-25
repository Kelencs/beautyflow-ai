import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

/** Placeholder visual para módulos ainda não implementados — nunca uma rota ausente/em branco. */
export function ModulePlaceholder({ title, description, icon: Icon = Construction }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-zinc-700">Este módulo ainda está em desenvolvimento.</p>
        <p className="max-w-sm text-sm text-zinc-400">
          Em breve você poderá gerenciar {title.toLowerCase()} diretamente por aqui.
        </p>
      </div>
    </div>
  );
}
