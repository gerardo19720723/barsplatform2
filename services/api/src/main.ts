import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// CORRECCIÓN: Importación por defecto para Helmet v7+
import helmet from 'helmet'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad con Helmet (v7+ syntax)
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Validación Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API corriendo en: http://localhost:${port}`);
}
bootstrap();
