import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AgendaResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AgendaService } from './agenda.service';
import { parseAgendaQuery } from './dto/agenda-query.dto';

@Controller('agenda')
@UseGuards(SupabaseAuthGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  /**
   * GET /agenda?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
   * Não aceita id_empresa por querystring de propósito — vem sempre de @CurrentUser().
   */
  @Get()
  async listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query('dataInicio') dataInicioRaw: unknown,
    @Query('dataFim') dataFimRaw: unknown,
  ): Promise<AgendaResponse> {
    const query = parseAgendaQuery(dataInicioRaw, dataFimRaw);
    return this.agendaService.listar(user, query);
  }
}
