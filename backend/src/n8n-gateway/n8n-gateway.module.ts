import { Module } from '@nestjs/common';
import { N8nGatewayClient } from './n8n-gateway.client';

/**
 * `ConfigModule` não precisa ser importado aqui: já é global via
 * `ConfigModule.forRoot({ isGlobal: true })` em app.module.ts.
 */
@Module({
  providers: [N8nGatewayClient],
  exports: [N8nGatewayClient],
})
export class N8nGatewayModule {}
