import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { InvalidCredentialsError } from '../../domain/errors/invalidCredentials.error';
import { InvalidRefreshTokenError } from '../../domain/errors/invalidRefreshToken.error';
import { RefreshTokenReusedError } from '../../domain/errors/refreshTokenReused.error';

@Catch(
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  RefreshTokenReusedError,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | InvalidCredentialsError
      | InvalidRefreshTokenError
      | RefreshTokenReusedError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse<Response>();
    const message =
      exception instanceof InvalidCredentialsError
        ? 'Unauthorized'
        : 'Invalid refresh token';

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
    });
  }
}
