import type { Perfil } from "./types";

/** Rótulos neutros e amigáveis para exibição — não usados para nenhuma decisão de acesso. */
const PERFIL_LABEL: Record<Perfil, string> = {
  owner: "Proprietário(a)",
  profissional: "Profissional",
  platform_admin: "Administrador(a) da plataforma",
};

export function formatPerfil(perfil: Perfil): string {
  return PERFIL_LABEL[perfil];
}

/** Iniciais para o avatar (ex.: "Ana Martins" -> "AM"), a partir do nome real do usuário. */
export function getIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}
