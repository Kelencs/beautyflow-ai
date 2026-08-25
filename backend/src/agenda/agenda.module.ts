import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';

@Module({
  imports: [AuthModule],
  controllers: [AgendaController],
  providers: [AgendaService],
  // Exportado para o DashboardModule reutilizar a mesma lógica/filtragem de
  // multi-tenancy via injeção de dependência, em vez de duplicar o mock/regras (ver
  // dashboard.service.ts). Não altera o contrato HTTP público deste módulo.
  exports: [AgendaService],
})
export class AgendaModule {}
