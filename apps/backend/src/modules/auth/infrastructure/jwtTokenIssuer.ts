import { Inject, Injectable } from '@nestjs/common';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import { AUTH_CONFIG } from '../auth.tokens';
import type { AuthConfig } from './auth.config';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(@Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig) {}

  issue(payload: { userId: number; email: string }): string {
    const options: SignOptions = {
      expiresIn: this.authConfig.jwtExpiresIn as SignOptions['expiresIn'],
      algorithm: this.authConfig.jwtAlgorithm,
    };

    return jwt.sign(
      { sub: payload.userId, email: payload.email },
      this.authConfig.jwtSecret,
      options,
    );
  }
}
