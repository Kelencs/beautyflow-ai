import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { ComunicacaoItem, ComunicacaoResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ComunicacaoService } from './comunicacao.service';
import { parseComunicacaoQuery } from './dto/comunicacao-query.dto';

@Controller('comunicacao')
@UseGuards(SupabaseAuthGuard)
export class ComunicacaoController {
  constructor(private readonly comunicacaoService: ComunicacaoService) {}

  /**
   * GET /comunicacao?dataInicio&dataFim&tipo&status
   * Todos os parâmetros são opcionais (dataInicio/dataFim default para o mês corrente).
   * Não aceita id_empresa por querystring de propósito — vem sempre de @CurrentUser().
   */
  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query('dataInicio') dataInicioRaw: unknown,
    @Query('dataFim') dataFimRaw: unknown,
    @Query('tipo') tipoRaw: unknown,
    @Query('status') statusRaw: unknown,
  ): ComunicacaoResponse {
    const query = parseComunicacaoQuery(dataInicioRaw, dataFimRaw, tipoRaw, statusRaw);
    return this.comunicacaoService.listar(user, query);
  }

  /** GET /comunicacao/:id — 404 se não existir na empresa/escopo do usuário autenticado. */
  @Get(':id')
  buscarPorId(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): ComunicacaoItem {
    return this.comunicacaoService.buscarPorId(user, id);
  }
}
