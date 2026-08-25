import type { DiaSemana } from "./types";

/** Ordem de exibição (semana começa na segunda) — nunca a ordem alfabética/do enum. */
export const DIA_SEMANA_ORDEM: DiaSemana[] = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

export const DIA_SEMANA_LABEL: Record<DiaSemana, string> = {
  SEGUNDA: "Segunda",
  TERCA: "Terça",
  QUARTA: "Quarta",
  QUINTA: "Quinta",
  SEXTA: "Sexta",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};
