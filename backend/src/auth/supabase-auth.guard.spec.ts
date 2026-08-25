import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../database/supabase.service';
import { SupabaseAuthGuard, type RequestWithUser } from './supabase-auth.guard';
import type { UsuarioRow } from './types/authenticated-user.type';

interface FakeSupabaseOptions {
  authUser?: { id: string } | null;
  authErrorMessage?: string;
  usuarioRow?: UsuarioRow | null;
  usuarioErrorMessage?: string;
}

/** Fake mínimo do client Supabase — só o suficiente para o que o guard chama. */
function createFakeSupabaseClient(options: FakeSupabaseOptions): SupabaseClient {
  const fake = {
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: options.authUser ?? null },
          error: options.authErrorMessage ? { message: options.authErrorMessage } : null,
        }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => ({
            overrideTypes: () =>
              Promise.resolve({
                data: options.usuarioRow ?? null,
                error: options.usuarioErrorMessage
                  ? { message: options.usuarioErrorMessage }
                  : null,
              }),
          }),
        }),
      }),
    }),
  };
  return fake as unknown as SupabaseClient;
}

function createContext(authorizationHeader: string | undefined): {
  context: ExecutionContext;
  request: RequestWithUser;
} {
  const request = { headers: { authorization: authorizationHeader } } as unknown as RequestWithUser;
  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
  return { context, request };
}

const USUARIO_ATIVO: UsuarioRow = {
  id_usuario: 'uid-1',
  id_empresa: 'EMP001',
  id_profissional: 'PROF001',
  nome: 'Ana Martins',
  email: 'ana@exemplo.com',
  perfil: 'profissional',
  ativo: true,
};

describe('SupabaseAuthGuard', () => {
  function buildGuard(options: FakeSupabaseOptions): SupabaseAuthGuard {
    const supabaseService = {
      getClient: () => createFakeSupabaseClient(options),
    } as unknown as SupabaseService;
    return new SupabaseAuthGuard(supabaseService);
  }

  it('rejeita com 401 quando o header Authorization está ausente', async () => {
    const guard = buildGuard({});
    const { context } = createContext(undefined);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita com 401 quando o token é inválido/expirado', async () => {
    const guard = buildGuard({ authUser: null, authErrorMessage: 'invalid token' });
    const { context } = createContext('Bearer token-invalido');

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita com 403 quando o usuário Auth não tem registro em public.usuarios', async () => {
    const guard = buildGuard({ authUser: { id: 'uid-1' }, usuarioRow: null });
    const { context } = createContext('Bearer token-valido');

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejeita com 403 quando o usuário está inativo', async () => {
    const guard = buildGuard({
      authUser: { id: 'uid-1' },
      usuarioRow: { ...USUARIO_ATIVO, ativo: false },
    });
    const { context } = createContext('Bearer token-valido');

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('permite acesso e preenche request.user para um usuário válido', async () => {
    const guard = buildGuard({ authUser: { id: 'uid-1' }, usuarioRow: USUARIO_ATIVO });
    const { context, request } = createContext('Bearer token-valido');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({
      idUsuario: 'uid-1',
      idEmpresa: 'EMP001',
      idProfissional: 'PROF001',
      nome: 'Ana Martins',
      email: 'ana@exemplo.com',
      perfil: 'profissional',
    });
  });
});
