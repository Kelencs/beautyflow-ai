import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { RelatoriosResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { parseRelatoriosQuery } from './dto/relatorios-query.dto';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
@UseGuards(SupabaseAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  /**
   * GET /relatorios?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD (ambos obrigatórios).
   * Não aceita id_empresa por querystring de propósito — vem sempre de @CurrentUser().
   */
  @Get()
  obterRelatorio(
    @CurrentUser() user: AuthenticatedUser,
    @Query('dataInicio') dataInicioRaw: unknown,
    @Query('dataFim') dataFimRaw: unknown,
  ): Promise<RelatoriosResponse> {
    const query = parseRelatoriosQuery(dataInicioRaw, dataFimRaw);
    return this.relatoriosService.obterRelatorio(user, query);
  }
}
