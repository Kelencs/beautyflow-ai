import type { StatusProfissional } from "./types";

/**
 * Único ponto de mapeamento entre status de profissional e rótulo/cor — mesmo padrão de
 * features/clientes/status.ts e features/servicos/status.ts. Mantido separado (não
 * reaproveitando o de Serviços) mesmo sendo estruturalmente idêntico: ATIVO/INATIVO de
 * um profissional e de um serviço são conceitos diferentes, e os outros dois módulos já
 * seguem esse mesmo padrão de badge próprio por domínio.
 */
export const PROFISSIONAL_STATUS_META: Record<
  StatusProfissional,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ATIVO: {
    label: "Ativo",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
  },
  INATIVO: {
    label: "Inativo",
    badgeClass: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
    dotClass: "bg-zinc-400",
  },
};
