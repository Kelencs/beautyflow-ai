import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseService } from '../database/supabase.service';
import type { AuthenticatedUser, UsuarioRow } from './types/authenticated-user.type';

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader || !authorizationHeader.startsWith(BEARER_PREFIX)) {
    return null;
  }
  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

/**
 * Resolve a identidade autenticada a partir do header `Authorization: Bearer <token>`
 * enviado pelo frontend (ver frontend/src/lib/supabase/server.ts — o access_token da
 * sessão Supabase). Nunca confia em id_empresa/perfil/id_profissional vindos do
 * navegador: tudo é resolvido aqui, a partir do token validado + public.usuarios.
 *
 * Reutiliza o client existente do SupabaseService (Secret Key) em vez de criar um
 * segundo client "público" só para isso — `auth.getUser(token)` valida o JWT contra o
 * servidor de Auth independentemente de qual chave criou o client.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Token de acesso ausente.');
    }

    const supabase = this.supabaseService.getClient();

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) {
      throw new UnauthorizedException('Token de acesso inválido ou expirado.');
    }

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id_usuario, id_empresa, id_profissional, nome, email, perfil, ativo')
      .eq('id_usuario', authData.user.id)
      .maybeSingle()
      .overrideTypes<UsuarioRow, { merge: false }>();

    if (usuarioError || !usuario) {
      throw new ForbiddenException('Conta sem perfil configurado no BeautyFlow.');
    }

    if (!usuario.ativo) {
      throw new ForbiddenException('Conta inativa.');
    }

    request.user = {
      idUsuario: usuario.id_usuario,
      idEmpresa: usuario.id_empresa,
      idProfissional: usuario.id_profissional,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    return true;
  }
}
