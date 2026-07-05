import 'dotenv/config';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import { parseDurationToMs } from '../domain/utils/duration';

export function createAuthConfig(): AuthConfig {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }
  if (process.env.NODE_ENV === 'production' && jwtSecret === 'secret') {
    throw new Error('JWT_SECRET must be changed in production');
  }

  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
  const sameSite = process.env.REFRESH_COOKIE_SAME_SITE;

  return {
    jwtSecret,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    jwtRefreshExpiresIn,
    jwtAlgorithm: 'HS256',
    refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? 'refresh_token',
    refreshCookiePath: process.env.REFRESH_COOKIE_PATH ?? '/auth',
    refreshCookieMaxAgeMs: parseDurationToMs(jwtRefreshExpiresIn),
    refreshCookieSecure: process.env.NODE_ENV === 'production',
    refreshCookieSameSite:
      sameSite === 'strict' || sameSite === 'none' ? sameSite : 'lax',
  };
}
