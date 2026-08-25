import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithUser } from './supabase-auth.guard';
import type { AuthenticatedUser } from './types/authenticated-user.type';

/** Só use em rotas protegidas por @UseGuards(SupabaseAuthGuard) — é ele quem preenche request.user. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
