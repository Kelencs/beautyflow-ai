import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { N8nGatewayModule } from '../n8n-gateway/n8n-gateway.module';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

@Module({
  // N8nGatewayModule fica encapsulado aqui: quem importa ClientesModule (ex.:
  // DashboardModule/RelatoriosModule) só recebe ClientesService já pronto, sem precisar
  // conhecer sua dependência interna do gateway.
  imports: [AuthModule, N8nGatewayModule],
  controllers: [ClientesController],
  providers: [ClientesService],
  // Exportado para o DashboardModule reutilizar (ver agenda.module.ts para o motivo).
  exports: [ClientesService],
})
export class ClientesModule {}
