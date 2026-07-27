import { ValidationPipe, type INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from '@/modules/auth/presentation/filters/domainException.filter';

export function configureApplication(app: INestApplication) {
  const frontendOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: frontendOrigins, credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  return app;
}
