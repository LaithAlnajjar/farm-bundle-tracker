import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from '@/modules/auth/presentation/filters/domainException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
