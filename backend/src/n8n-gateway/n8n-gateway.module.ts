import { Module } from '@nestjs/common';
import { N8nGatewayCommandsClient } from './n8n-gateway-commands.client';
import { N8nGatewayClient } from './n8n-gateway.client';

/**
 * `ConfigModule` não precisa ser importado aqui: já é global via
 * `ConfigModule.forRoot({ isGlobal: true })` em app.module.ts.
 *
 * `N8nGatewayCommandsClient` (APP-WF020, comandos/mutações da Agenda) vive no mesmo
 * módulo que `N8nGatewayClient` (APP-WF019, read-only) — são duas classes deliberadamente
 * separadas (variáveis de ambiente próprias, sem risco de uma reconfiguração cruzada),
 * mas ambas são "clientes do gateway n8n" e não justificam módulos Nest distintos.
 */
@Module({
  providers: [N8nGatewayClient, N8nGatewayCommandsClient],
  exports: [N8nGatewayClient, N8nGatewayCommandsClient],
})
export class N8nGatewayModule {}
