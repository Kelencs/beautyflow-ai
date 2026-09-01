import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { N8nGatewayModule } from '../n8n-gateway/n8n-gateway.module';
import { ProfissionaisModule } from '../profissionais/profissionais.module';
import { ConfiguracoesController } from './configuracoes.controller';
import { ConfiguracoesService } from './configuracoes.service';

@Module({
  // N8nGatewayModule encapsulado aqui, mesmo padrão de Clientes/Servicos/
  // ProfissionaisModule. ProfissionaisModule importado para reutilizar
  // ProfissionaisService (resolve profissionalNome nas disponibilidades no modo n8n) —
  // nunca duplica a lógica de tenant/normalização de Profissionais aqui.
  imports: [AuthModule, N8nGatewayModule, ProfissionaisModule],
  controllers: [ConfiguracoesController],
  providers: [ConfiguracoesService],
})
export class ConfiguracoesModule {}
