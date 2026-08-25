import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { FinanceiroResponse, Pagamento } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { parseFinanceiroQuery } from './dto/financeiro-query.dto';
import { FinanceiroService } from './financeiro.service';

@Controller('financeiro')
@UseGuards(SupabaseAuthGuard)
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  /**
   * GET /financeiro?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD&status=PAGO|PENDENTE|PARCIAL
   * Todos os parâmetros são opcionais (dataInicio/dataFim default para o mês corrente).
   * Não aceita id_empresa por querystring de propósito — vem sempre de @CurrentUser().
   */
  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query('dataInicio') dataInicioRaw: unknown,
    @Query('dataFim') dataFimRaw: unknown,
    @Query('status') statusRaw: unknown,
  ): FinanceiroResponse {
    const query = parseFinanceiroQuery(dataInicioRaw, dataFimRaw, statusRaw);
    return this.financeiroService.listar(user, query);
  }

  /** GET /financeiro/:id — :id é o idAgendamento (ver financeiro.service.ts). */
  @Get(':id')
  buscarPorId(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Pagamento {
    return this.financeiroService.buscarPorId(user, id);
  }
}
