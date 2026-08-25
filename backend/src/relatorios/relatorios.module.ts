import { Module } from '@nestjs/common';
import { AgendaModule } from '../agenda/agenda.module';
import { AuthModule } from '../auth/auth.module';
import { ClientesModule } from '../clientes/clientes.module';
import { ComunicacaoModule } from '../comunicacao/comunicacao.module';
import { FinanceiroModule } from '../financeiro/financeiro.module';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

/**
 * Não importa ServicosModule/ProfissionaisModule: RelatoriosService não injeta
 * ServicosService/ProfissionaisService (ver justificativa no cabeçalho de
 * relatorios.service.ts) — importar esses módulos aqui seria dependência por precaução,
 * que o pedido do módulo pede explicitamente para evitar (seção 6).
 */
@Module({
  imports: [AuthModule, AgendaModule, ClientesModule, FinanceiroModule, ComunicacaoModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
