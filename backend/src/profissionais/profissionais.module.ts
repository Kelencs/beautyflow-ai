import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { N8nGatewayModule } from '../n8n-gateway/n8n-gateway.module';
import { ProfissionaisController } from './profissionais.controller';
import { ProfissionaisService } from './profissionais.service';

@Module({
  // N8nGatewayModule encapsulado aqui, mesmo padrão de Clientes/ServicosModule (Fases 1/2).
  imports: [AuthModule, N8nGatewayModule],
  controllers: [ProfissionaisController],
  providers: [ProfissionaisService],
  // Exportado para o DashboardModule reutilizar (ver agenda.module.ts para o motivo).
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
