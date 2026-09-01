import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { N8nGatewayModule } from '../n8n-gateway/n8n-gateway.module';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';

@Module({
  // N8nGatewayModule encapsulado aqui, mesmo padrão de ClientesModule (Fase 1).
  imports: [AuthModule, N8nGatewayModule],
  controllers: [ServicosController],
  providers: [ServicosService],
  // Exportado para o DashboardModule reutilizar (ver agenda.module.ts para o motivo).
  exports: [ServicosService],
})
export class ServicosModule {}
