import { Controller, Get, UseGuards } from '@nestjs/common';
import type { IaConfiguracao } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { IaService } from './ia.service';

@Controller('ia')
@UseGuards(SupabaseAuthGuard)
export class IaController {
  constructor(private readonly iaService: IaService) {}

  /**
   * GET /ia — não aceita id_empresa por querystring; vem sempre de @CurrentUser().
   * Restrito a owner (403 para qualquer outro perfil — ver ia.service.ts).
   *
   * Sem GET /ia/interacoes/:id: a lista de interações devolve somente `previewMensagem`
   * (prévia truncada no backend por `criarPreviewMensagem` — ver ia-mensagem.util.ts). A
   * mensagem completa não faz parte do contrato público e nenhum outro dado adicional
   * justificaria um endpoint de detalhe separado (seção 23 do pedido — escopo mínimo).
   */
  @Get()
  obterConfiguracao(@CurrentUser() user: AuthenticatedUser): IaConfiguracao {
    return this.iaService.obterConfiguracao(user);
  }
}
