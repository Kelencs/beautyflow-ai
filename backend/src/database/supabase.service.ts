import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase server-side, autenticado com a Secret Key (novo sistema de API Keys
 * do Supabase — sb_secret_..., substitui a chave legada service_role neste projeto, que
 * é novo e não precisa manter compatibilidade com o esquema antigo), conforme
 * docs/arquitetura/beautyflow-app-arquitetura.md ("Estrutura de pastas propostas" -> backend/src/database).
 *
 * A leitura das variáveis de ambiente e a criação do client são adiadas até o primeiro
 * uso (getClient), não feitas no construtor: isso permite que o módulo seja carregado
 * (build/test) mesmo antes de um projeto Supabase real existir, sem exigir credenciais.
 *
 * Reutilizado também para validar tokens de acesso do frontend (SupabaseAuthGuard, ver
 * src/auth/) via `getClient().auth.getUser(accessToken)` — essa chamada valida o JWT
 * contra o servidor de Auth independentemente de qual chave foi usada para criar o
 * client, então não há necessidade de um segundo client "público" só para isso.
 */
@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(
      this.configService.get<string>('SUPABASE_URL') &&
      this.configService.get<string>('SUPABASE_SECRET_KEY'),
    );
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseSecretKey = this.configService.get<string>('SUPABASE_SECRET_KEY');

      if (!supabaseUrl || !supabaseSecretKey) {
        throw new Error(
          'Supabase não configurado: defina SUPABASE_URL e SUPABASE_SECRET_KEY (ver backend/.env.example).',
        );
      }

      this.client = createClient(supabaseUrl, supabaseSecretKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }

    return this.client;
  }
}
