import { Inject, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../auth.tokens';
import { InvalidAccessTokenError } from '../domain/errors/invalidAccessToken.error';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { TokenVerifier } from '../domain/interfaces/tokenVerifier';

interface TokenPayload extends jwt.JwtPayload {
  userId: number;
  email: string;
}

@Injectable()
export class JwtTokenVerifier implements TokenVerifier {
  constructor(@Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig) {}

  verify(token: string): { userId: number; email: string } {
    try {
      const payload = jwt.verify(token, this.authConfig.jwtSecret, {
        algorithms: [this.authConfig.jwtAlgorithm],
      }) as TokenPayload;

      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch {
      throw new InvalidAccessTokenError();
    }
  }
}
