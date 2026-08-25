import type { StatusComunicacao } from "./types";

/**
 * Único ponto de mapeamento entre status de comunicação e rótulo/cor. Só dois valores
 * reais existem (ver comentário em libs/shared-types/src/comunicacao.ts): nenhuma aba
 * auditada grava PENDENTE/ENTREGUE/LIDA — o status só é gravado depois da tentativa de
 * envio ser concluída, com sucesso ou falha.
 */
export const COMUNICACAO_STATUS_META: Record<
  StatusComunicacao,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ENVIADA: {
    label: "Enviada",
    badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    dotClass: "bg-emerald-500",
  },
  FALHA: {
    label: "Falha",
    badgeClass: "bg-rose-50 text-rose-800 ring-rose-600/20",
    dotClass: "bg-rose-500",
  },
};
