import { Module } from '@nestjs/common';
import { AgendaModule } from '../agenda/agenda.module';
import { AuthModule } from '../auth/auth.module';
import { ClientesModule } from '../clientes/clientes.module';
import { ProfissionaisModule } from '../profissionais/profissionais.module';
import { ServicosModule } from '../servicos/servicos.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AuthModule, AgendaModule, ClientesModule, ServicosModule, ProfissionaisModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
