import { Inject, Injectable } from '@nestjs/common';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { AUTH_CONFIG } from '../auth.tokens';
import { InvalidAccessTokenError } from '../domain/errors/invalidAccessToken.error';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { TokenVerifier } from '../domain/interfaces/tokenVerifier';

@Injectable()
export class JwtTokenVerifier implements TokenVerifier {
  constructor(@Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig) {}

  verify(token: string): { userId: number; email: string } {
    try {
      const payload = jwt.verify(token, this.authConfig.jwtSecret, {
        algorithms: [this.authConfig.jwtAlgorithm],
      });

      if (!this.isAccessTokenPayload(payload)) {
        throw new InvalidAccessTokenError();
      }

      return {
        userId: Number(payload.userId),
        email: payload.email,
      };
    } catch {
      throw new InvalidAccessTokenError();
    }
  }

  private isAccessTokenPayload(
    payload: string | JwtPayload,
  ): payload is JwtPayload & { userId: string | number; email: string } {
    if (typeof payload === 'string') {
      return false;
    }

    return (
      (typeof payload.userId === 'string' ||
        typeof payload.userId === 'number') &&
      Number.isInteger(Number(payload.userId)) &&
      typeof payload.email === 'string'
    );
  }
}
