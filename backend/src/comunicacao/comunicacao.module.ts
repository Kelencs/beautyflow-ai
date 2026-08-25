import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ComunicacaoController } from './comunicacao.controller';
import { ComunicacaoService } from './comunicacao.service';

@Module({
  imports: [AuthModule],
  controllers: [ComunicacaoController],
  providers: [ComunicacaoService],
  // Exportado para o RelatoriosModule reutilizar enviadas/comFalha do mesmo período (ver
  // agenda.module.ts para o motivo do padrão).
  exports: [ComunicacaoService],
})
export class ComunicacaoModule {}
