import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { ClienteDetalhado, ClientesResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from './clientes.service';

@Controller('clientes')
@UseGuards(SupabaseAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  /**
   * GET /clientes — não aceita id_empresa por querystring; vem sempre de @CurrentUser().
   * Assíncrono porque ClientesService pode chamar o APP-WF019 via HTTP quando
   * DATA_SOURCE_CLIENTES=n8n (ver clientes.service.ts).
   */
  @Get()
  listar(@CurrentUser() user: AuthenticatedUser): Promise<ClientesResponse> {
    return this.clientesService.listar(user);
  }

  /** GET /clientes/:id — 404 se o cliente não existir na empresa do usuário autenticado. */
  @Get(':id')
  buscarPorId(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<ClienteDetalhado> {
    return this.clientesService.buscarPorId(user, id);
  }
}
