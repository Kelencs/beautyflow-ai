/**
 * Perfis existentes em public.usuarios.perfil (ver
 * supabase/migrations/20260813160001_create_usuarios.sql). Não inventar novos valores
 * aqui sem antes alterar a migration.
 */
export type Perfil = 'owner' | 'profissional' | 'platform_admin';

/** Formato exato da linha de public.usuarios consultada pelo SupabaseAuthGuard. */
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
 * Identidade resolvida pelo SupabaseAuthGuard e injetada nos controllers via
 * @CurrentUser(). Nunca construída a partir de dados enviados pelo navegador — sempre
 * derivada do token validado + da linha correspondente em public.usuarios.
 */
export interface AuthenticatedUser {
  idUsuario: string;
  idEmpresa: string | null;
  idProfissional: string | null;
  nome: string;
  email: string;
  perfil: Perfil;
}
