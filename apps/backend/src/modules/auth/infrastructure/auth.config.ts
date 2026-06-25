import 'dotenv/config';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtAlgorithm: 'HS256';
}

export function createAuthConfig(): AuthConfig {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  return {
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    jwtAlgorithm: 'HS256',
  };
}
