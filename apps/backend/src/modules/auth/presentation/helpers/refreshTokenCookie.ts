import type { Request, Response } from 'express';
import type { AuthConfig } from '../../domain/interfaces/authConfig';

function isCookieRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getRefreshTokenFromRequest(
  req: Request,
  config: AuthConfig,
): string | undefined {
  if (!isCookieRecord(req.cookies)) {
    return undefined;
  }

  const token = req.cookies[config.refreshCookieName];
  return typeof token === 'string' ? token : undefined;
}

export function setRefreshTokenCookie(
  res: Response,
  token: string,
  config: AuthConfig,
): void {
  res.cookie(config.refreshCookieName, token, {
    httpOnly: true,
    secure: config.refreshCookieSecure,
    sameSite: config.refreshCookieSameSite,
    path: config.refreshCookiePath,
    maxAge: config.refreshCookieMaxAgeMs,
  });
}

export function clearRefreshTokenCookie(
  res: Response,
  config: AuthConfig,
): void {
  res.cookie(config.refreshCookieName, '', {
    httpOnly: true,
    secure: config.refreshCookieSecure,
    sameSite: config.refreshCookieSameSite,
    path: config.refreshCookiePath,
    maxAge: 0,
  });
}
