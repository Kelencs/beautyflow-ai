import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('reports not configured and refuses to build a client when env vars are absent', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
      providers: [SupabaseService],
    }).compile();
    const service = moduleRef.get(SupabaseService);

    expect(service.isConfigured()).toBe(false);
    expect(() => service.getClient()).toThrow(/Supabase não configurado/);
  });

  it('reports configured and builds a client once placeholder env vars are present', async () => {
    // Valores fictícios apenas para exercitar a lógica de configuração — nunca credenciais reais.
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'placeholder-key-for-test';

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
      providers: [SupabaseService],
    }).compile();
    const service = moduleRef.get(SupabaseService);

    expect(service.isConfigured()).toBe(true);
    expect(() => service.getClient()).not.toThrow();
  });
});
