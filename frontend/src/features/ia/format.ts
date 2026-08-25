export function formatDataHoraBR(iso: string): string {
  const data = new Date(iso);
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    data,
  );
  const horaFormatada = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(data);
  return `${dataFormatada} às ${horaFormatada}`;
}

export function formatConfianca(confianca: number): string {
  return `${Math.round(confianca * 100)}%`;
}

/** "models/gemini-3-flash-preview" -> "Gemini 3 Flash (Preview)" — só embelezamento visual, nunca troca o valor real. */
export function formatModelo(modelo: string): string {
  const semPrefixo = modelo.replace(/^models\//, "");
  const partes = semPrefixo.split("-");

  return partes
    .map((parte) => {
      if (parte === "gemini") return "Gemini";
      if (parte === "preview") return "(Preview)";
      if (/^\d+$/.test(parte)) return parte;
      return parte.charAt(0).toUpperCase() + parte.slice(1);
    })
    .join(" ");
}
