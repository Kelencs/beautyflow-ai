/**
 * Perfis existentes em public.usuarios.perfil (ver
 * supabase/migrations/20260813160001_create_usuarios.sql). Não inventar novos valores
 * aqui sem antes alterar a migration.
 */
export type Perfil = "owner" | "profissional" | "platform_admin";

/** Formato exato da linha de public.usuarios usada pela DAL (src/lib/auth/dal.ts). */
export interface UsuarioRow {
  id_usuario: string;
  id_empresa: string | null;
  id_profissional: string | null;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
}

/**
 * Dados do usuário autenticado disponibilizados ao layout `(app)` — camelCase,
 * já sem o campo `ativo` (a checagem acontece na DAL, antes de este tipo existir).
 */
export interface UsuarioAutenticado {
  idUsuario: string;
  idEmpresa: string | null;
  idProfissional: string | null;
  nome: string;
  email: string;
  perfil: Perfil;
}

/** Estado retornado pela Server Action de login (src/features/auth/actions.ts) ao formulário. */
export interface LoginState {
  error: string;
}
