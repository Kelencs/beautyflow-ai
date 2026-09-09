import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import type { AgendaCancelarResponse, AgendaResponse } from '@beautyflow/shared-types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AgendaService } from './agenda.service';
import { parseAgendaCancelarBody } from './dto/agenda-cancelar.dto';
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

  /**
   * PATCH /agenda/:id/cancelar — body: `{ motivo?: string }`.
   *
   * `:id` é o único identificador do agendamento aceito (nunca outro no body — ver
   * seção 6 do pedido: idAgendamento alternativo é proibido). Deliberadamente NÃO lê do
   * body: `idEmpresa` (vem de `@CurrentUser()`), `status`/`dataCancelamento`/
   * `googleEventId`/`calendarId` (resolvidos/gerados inteiramente pelo backend/
   * integração) — mesmo esses campos estando presentes num body malicioso, este método
   * nunca os enxerga (só `@Body('motivo')` é lido).
   */
  @Patch(':id/cancelar')
  async cancelar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') idAgendamento: string,
    @Body('motivo') motivoRaw: unknown,
  ): Promise<AgendaCancelarResponse> {
    const { motivo } = parseAgendaCancelarBody(motivoRaw);
    return this.agendaService.cancelar(user, idAgendamento, motivo);
  }
}
