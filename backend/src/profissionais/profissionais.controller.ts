import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { Profissional, ProfissionaisResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ProfissionaisService } from './profissionais.service';

@Controller('profissionais')
@UseGuards(SupabaseAuthGuard)
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  /** GET /profissionais — não aceita id_empresa por querystring; vem sempre de @CurrentUser(). */
  @Get()
  listar(@CurrentUser() user: AuthenticatedUser): ProfissionaisResponse {
    return this.profissionaisService.listar(user);
  }

  /** GET /profissionais/:id — 404 se o profissional não existir na empresa do usuário autenticado. */
  @Get(':id')
  buscarPorId(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Profissional {
    return this.profissionaisService.buscarPorId(user, id);
  }
}
