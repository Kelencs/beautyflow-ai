import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';

@Module({
  imports: [AuthModule],
  controllers: [ServicosController],
  providers: [ServicosService],
  // Exportado para o DashboardModule reutilizar (ver agenda.module.ts para o motivo).
  exports: [ServicosService],
})
export class ServicosModule {}
