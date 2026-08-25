import { Controller, Get, UseGuards } from '@nestjs/common';
import type { DashboardResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(SupabaseAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /dashboard — não aceita id_empresa por querystring; vem sempre de @CurrentUser().
   * Nunca recebe data de referência do cliente — sempre a data real de hoje (ver
   * DashboardService.obterResumo, cujo parâmetro de teste não é exposto aqui).
   */
  @Get()
  obterResumo(@CurrentUser() user: AuthenticatedUser): DashboardResponse {
    return this.dashboardService.obterResumo(user);
  }
}
