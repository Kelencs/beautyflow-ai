import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import type { AuthenticatedUser } from './types/authenticated-user.type';

/**
 * Endpoint auxiliar para comprovar que o backend resolve a identidade corretamente a
 * partir do token — útil para testar a integração frontend -> backend sem depender do
 * AgendaController. Nunca retorna token, segredos ou dados internos do Supabase.
 */
@Controller('auth')
export class AuthController {
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
