import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ConfiguracoesEmpresa } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ConfiguracoesService } from './configuracoes.service';

@Controller('configuracoes')
@UseGuards(SupabaseAuthGuard)
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  /**
   * GET /configuracoes — não aceita id_empresa por querystring; vem sempre de
   * @CurrentUser(). Restrito a owner (403 para qualquer outro perfil — ver
   * configuracoes.service.ts).
   */
  @Get()
  obterConfiguracoes(@CurrentUser() user: AuthenticatedUser): ConfiguracoesEmpresa {
    return this.configuracoesService.obterConfiguracoes(user);
  }
}
