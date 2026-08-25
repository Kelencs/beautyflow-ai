import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { ComunicacaoModule } from './comunicacao/comunicacao.module';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module';
import { validateEnv } from './config/env.validation';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { IaModule } from './ia/ia.module';
import { ProfissionaisModule } from './profissionais/profissionais.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { ServicosModule } from './servicos/servicos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    AuthModule,
    AgendaModule,
    ClientesModule,
    ServicosModule,
    ProfissionaisModule,
    DashboardModule,
    FinanceiroModule,
    ComunicacaoModule,
    RelatoriosModule,
    ConfiguracoesModule,
    IaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
