import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientesModule } from '../clientes/clientes.module';
import { N8nGatewayModule } from '../n8n-gateway/n8n-gateway.module';
import { ProfissionaisModule } from '../profissionais/profissionais.module';
import { ServicosModule } from '../servicos/servicos.module';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';

@Module({
  // ClientesModule/ProfissionaisModule/ServicosModule importados para o modo `n8n` de
  // AgendaService fazer o join (idCliente/idProfissional/idServico -> nome) reutilizando
  // os services já existentes (Promise.all), em vez de duplicar mock/gateway aqui — sem
  // ciclo de DI: nenhum dos três importa AgendaModule de volta. N8nGatewayModule
  // encapsulado aqui, mesmo padrão de Clientes/Serviços/ProfissionaisModule.
  imports: [AuthModule, N8nGatewayModule, ClientesModule, ProfissionaisModule, ServicosModule],
  controllers: [AgendaController],
  providers: [AgendaService],
  // Exportado para o DashboardModule/RelatoriosModule reutilizarem a mesma lógica/
  // filtragem de multi-tenancy via injeção de dependência, em vez de duplicar o mock/
  // regras (ver dashboard.service.ts/relatorios.service.ts). Não altera o contrato HTTP
  // público deste módulo.
  exports: [AgendaService],
})
export class AgendaModule {}
