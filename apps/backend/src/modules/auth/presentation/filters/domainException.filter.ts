import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { InvalidCredentialsError } from '../../domain/errors/invalidCredentials.error';

@Catch(InvalidCredentialsError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(_exception: InvalidCredentialsError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  }
}
