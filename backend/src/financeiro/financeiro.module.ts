import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';

@Module({
  imports: [AuthModule],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
  // Exportado para o RelatoriosModule reutilizar recebido/pendente do mesmo período (ver
  // agenda.module.ts para o motivo do padrão) — evita o relatório divergir do Financeiro.
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
