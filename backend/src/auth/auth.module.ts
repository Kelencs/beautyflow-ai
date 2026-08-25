import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { SupabaseAuthGuard } from './supabase-auth.guard';

/**
 * Reexporta DatabaseModule (não só SupabaseAuthGuard): quando outro módulo (ex.:
 * AgendaModule) usa `@UseGuards(SupabaseAuthGuard)`, o Nest instancia o guard no
 * contexto injector desse módulo consumidor, não no do AuthModule — então a dependência
 * do próprio guard (SupabaseService) também precisa estar visível ali. Exportar só a
 * classe do guard não basta; sem este reexport, qualquer módulo que importe só
 * AuthModule (sem também importar DatabaseModule) falha com
 * "Nest can't resolve dependencies of the SupabaseAuthGuard ... SupabaseService ...
 * is available in the <ModuloConsumidor> module" ao instanciar o guard.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [SupabaseAuthGuard],
  exports: [SupabaseAuthGuard, DatabaseModule],
})
export class AuthModule {}
