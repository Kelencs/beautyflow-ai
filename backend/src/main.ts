import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Dev: frontend roda em localhost:3000, backend em localhost:3001 (origens diferentes).
  // A autenticação usa `Authorization: Bearer <token>`, não cookies — por isso
  // `credentials: true` não é necessário aqui. CORS_ORIGIN é configurável (aceita uma
  // lista separada por vírgula) para produção, mas nenhum deploy foi implementado nesta
  // etapa; só a leitura da variável.
  const corsOrigin = configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get<string>('PORT') ?? 3001;
  await app.listen(port);
}
void bootstrap();
