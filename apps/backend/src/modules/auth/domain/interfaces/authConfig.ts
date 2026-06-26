export interface AuthConfig {
  jwtSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  jwtAlgorithm: 'HS256';
  refreshCookieName: string;
  refreshCookiePath: string;
  refreshCookieMaxAgeMs: number;
  refreshCookieSecure: boolean;
  refreshCookieSameSite: 'strict' | 'lax';
}
