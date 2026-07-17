import { SignInUserUseCase } from './signInUserUseCase';
import { InvalidCredentialsError } from '../domain/errors/invalidCredentials.error';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import type { RefreshTokenGenerator } from '../domain/interfaces/refreshTokenGenerator';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';

describe('SignInUserUseCase', () => {
  let signInUserUseCase: SignInUserUseCase;
  let findByEmail: jest.MockedFunction<UserRepository['findByEmail']>;
  let compare: jest.MockedFunction<PasswordHasher['compare']>;
  let issue: jest.MockedFunction<TokenIssuer['issue']>;
  let generate: jest.MockedFunction<RefreshTokenGenerator['generate']>;
  let hash: jest.MockedFunction<TokenHasher['hash']>;
  let createSession: jest.MockedFunction<RefreshTokenRepository['create']>;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-17T00:00:00.000Z'));

    findByEmail = jest.fn();
    compare = jest.fn();
    issue = jest.fn();
    generate = jest.fn();
    hash = jest.fn();
    createSession = jest.fn();

    const userRepository: UserRepository = {
      create: jest.fn(),
      findByEmail,
      findByUsername: jest.fn(),
      findById: jest.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: jest.fn(),
      compare,
    };
    const tokenIssuer: TokenIssuer = { issue };
    const refreshTokenGenerator: RefreshTokenGenerator = { generate };
    const tokenHasher: TokenHasher = {
      hash,
      matches: jest.fn(),
    };
    const refreshTokenRepository: RefreshTokenRepository = {
      create: createSession,
      findByTokenHash: jest.fn(),
      markReplaced: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };
    const authConfig: AuthConfig = {
      jwtSecret: 'secret',
      jwtAccessExpiresIn: '15m',
      jwtRefreshExpiresIn: '7d',
      jwtAlgorithm: 'HS256',
      refreshCookieName: 'refresh_token',
      refreshCookiePath: '/',
      refreshCookieMaxAgeMs: 604_800_000,
      refreshCookieSecure: false,
      refreshCookieSameSite: 'lax',
    };

    signInUserUseCase = new SignInUserUseCase(
      userRepository,
      passwordHasher,
      tokenIssuer,
      refreshTokenGenerator,
      tokenHasher,
      refreshTokenRepository,
      authConfig,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('signs in a user and creates a refresh token session', async () => {
    const mockDate = new Date();
    findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      username: 'testuser',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    compare.mockResolvedValue(true);
    issue.mockReturnValue('access-token');
    generate.mockReturnValue('refresh-token');
    hash.mockReturnValue('refresh-token-hash');
    createSession.mockResolvedValue({ id: 10 });

    await expect(
      signInUserUseCase.execute({
        email: '  USER@Example.COM  ',
        password: 'password',
      }),
    ).resolves.toEqual({
      id: 1,
      email: 'user@example.com',
      username: 'testuser',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(compare).toHaveBeenCalledWith('password', 'hashed-password');
    expect(issue).toHaveBeenCalledWith({
      userId: 1,
      email: 'user@example.com',
    });
    expect(hash).toHaveBeenCalledWith('refresh-token');
    expect(createSession).toHaveBeenCalledWith({
      userId: 1,
      tokenHash: 'refresh-token-hash',
      expiresAt: new Date('2026-07-24T00:00:00.000Z'),
    });
  });

  it('throws InvalidCredentialsError when the user does not exist', async () => {
    findByEmail.mockResolvedValue(null);

    await expect(
      signInUserUseCase.execute({
        email: 'user@example.com',
        password: 'password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(compare).not.toHaveBeenCalled();
    expect(issue).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('throws InvalidCredentialsError when the password is incorrect', async () => {
    const mockDate = new Date();
    findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      username: 'testuser',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    compare.mockResolvedValue(false);

    await expect(
      signInUserUseCase.execute({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
    expect(issue).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });
});
