import type { InjectionToken } from '@nestjs/common';
import type { AuthConfig } from './domain/interfaces/authConfig';
import type { PasswordHasher } from './domain/interfaces/passwordHasher';
import type { RefreshTokenGenerator } from './domain/interfaces/refreshTokenGenerator';
import type { TokenHasher } from './domain/interfaces/tokenHasher';
import type { TokenIssuer } from './domain/interfaces/tokenIssuer';
import type { RefreshTokenRepository } from './domain/repositories/refreshToken.repository';

export const PASSWORD_HASHER: InjectionToken<PasswordHasher> =
  Symbol('PASSWORD_HASHER');
export const TOKEN_ISSUER: InjectionToken<TokenIssuer> = Symbol('TOKEN_ISSUER');
export const TOKEN_HASHER: InjectionToken<TokenHasher> = Symbol('TOKEN_HASHER');
export const REFRESH_TOKEN_GENERATOR: InjectionToken<RefreshTokenGenerator> =
  Symbol('REFRESH_TOKEN_GENERATOR');
export const REFRESH_TOKEN_REPOSITORY: InjectionToken<RefreshTokenRepository> =
  Symbol('REFRESH_TOKEN_REPOSITORY');
export const AUTH_CONFIG: InjectionToken<AuthConfig> = Symbol('AUTH_CONFIG');
