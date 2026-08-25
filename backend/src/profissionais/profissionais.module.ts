import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfissionaisController } from './profissionais.controller';
import { ProfissionaisService } from './profissionais.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfissionaisController],
  providers: [ProfissionaisService],
  // Exportado para o DashboardModule reutilizar (ver agenda.module.ts para o motivo).
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
