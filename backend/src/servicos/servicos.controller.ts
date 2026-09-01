import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { Servico, ServicosResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ServicosService } from './servicos.service';

@Controller('servicos')
@UseGuards(SupabaseAuthGuard)
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  /**
   * GET /servicos — não aceita id_empresa por querystring; vem sempre de @CurrentUser().
   * Assíncrono porque ServicosService pode chamar o APP-WF019 via HTTP quando
   * DATA_SOURCE_SERVICOS=n8n (ver servicos.service.ts).
   */
  @Get()
  listar(@CurrentUser() user: AuthenticatedUser): Promise<ServicosResponse> {
    return this.servicosService.listar(user);
  }

  /** GET /servicos/:id — 404 se o serviço não existir na empresa do usuário autenticado. */
  @Get(':id')
  buscarPorId(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<Servico> {
    return this.servicosService.buscarPorId(user, id);
  }
}
