import { RefreshAccessTokenUseCase } from './refreshAccessTokenUseCase';
import { RefreshToken } from '../domain/entities/refreshToken';
import { InvalidRefreshTokenError } from '../domain/errors/invalidRefreshToken.error';
import { RefreshTokenReusedError } from '../domain/errors/refreshTokenReused.error';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { RefreshTokenGenerator } from '../domain/interfaces/refreshTokenGenerator';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';

describe('RefreshAccessTokenUseCase', () => {
  let refreshAccessTokenUseCase: RefreshAccessTokenUseCase;
  let findById: jest.MockedFunction<UserRepository['findById']>;
  let issue: jest.MockedFunction<TokenIssuer['issue']>;
  let generate: jest.MockedFunction<RefreshTokenGenerator['generate']>;
  let hash: jest.MockedFunction<TokenHasher['hash']>;
  let createSession: jest.MockedFunction<RefreshTokenRepository['create']>;
  let findByTokenHash: jest.MockedFunction<
    RefreshTokenRepository['findByTokenHash']
  >;
  let markReplaced: jest.MockedFunction<RefreshTokenRepository['markReplaced']>;
  let revokeAllForUser: jest.MockedFunction<
    RefreshTokenRepository['revokeAllForUser']
  >;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-17T00:00:00.000Z'));

    findById = jest.fn();
    issue = jest.fn();
    generate = jest.fn();
    hash = jest.fn();
    createSession = jest.fn();
    findByTokenHash = jest.fn();
    markReplaced = jest.fn();
    revokeAllForUser = jest.fn();

    const userRepository: UserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById,
    };
    const tokenIssuer: TokenIssuer = { issue };
    const refreshTokenGenerator: RefreshTokenGenerator = { generate };
    const tokenHasher: TokenHasher = {
      hash,
      matches: jest.fn(),
    };
    const refreshTokenRepository: RefreshTokenRepository = {
      create: createSession,
      findByTokenHash,
      markReplaced,
      revoke: jest.fn(),
      revokeAllForUser,
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

    refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
      userRepository,
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

  it('rotates a valid refresh token session', async () => {
    const session = new RefreshToken(
      10,
      1,
      'old-token-hash',
      new Date('2026-07-18T00:00:00.000Z'),
      null,
      null,
      new Date('2026-07-16T00:00:00.000Z'),
    );
    const mockDate = new Date();
    hash
      .mockReturnValueOnce('old-token-hash')
      .mockReturnValueOnce('new-token-hash');
    findByTokenHash.mockResolvedValue(session);
    findById.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      username: 'testuser',
      hashedPassword: 'hashed-password',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    issue.mockReturnValue('access-token');
    generate.mockReturnValue('new-refresh-token');
    createSession.mockResolvedValue({ id: 20 });

    await expect(
      refreshAccessTokenUseCase.execute('old-refresh-token'),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'new-refresh-token',
    });

    expect(findByTokenHash).toHaveBeenCalledWith('old-token-hash');
    expect(issue).toHaveBeenCalledWith({
      userId: 1,
      email: 'user@example.com',
    });
    expect(createSession).toHaveBeenCalledWith({
      userId: 1,
      tokenHash: 'new-token-hash',
      expiresAt: new Date('2026-07-24T00:00:00.000Z'),
    });
    expect(markReplaced).toHaveBeenCalledWith(10, 20);
  });

  it('throws InvalidRefreshTokenError when the session does not exist', async () => {
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(null);

    await expect(
      refreshAccessTokenUseCase.execute('refresh-token'),
    ).rejects.toThrow(InvalidRefreshTokenError);

    expect(findById).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('revokes all sessions when a replaced refresh token is reused', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2026-07-18T00:00:00.000Z'),
      null,
      20,
      new Date('2026-07-16T00:00:00.000Z'),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);

    await expect(
      refreshAccessTokenUseCase.execute('refresh-token'),
    ).rejects.toThrow(RefreshTokenReusedError);

    expect(revokeAllForUser).toHaveBeenCalledWith(1);
    expect(findById).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('throws InvalidRefreshTokenError when the session is revoked', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2026-07-18T00:00:00.000Z'),
      new Date('2026-07-16T00:00:00.000Z'),
      null,
      new Date('2026-07-16T00:00:00.000Z'),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);

    await expect(
      refreshAccessTokenUseCase.execute('refresh-token'),
    ).rejects.toThrow(InvalidRefreshTokenError);

    expect(findById).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('throws InvalidRefreshTokenError when the session is expired', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2026-07-16T00:00:00.000Z'),
      null,
      null,
      new Date('2026-07-15T00:00:00.000Z'),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);

    await expect(
      refreshAccessTokenUseCase.execute('refresh-token'),
    ).rejects.toThrow(InvalidRefreshTokenError);

    expect(findById).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('throws InvalidRefreshTokenError when the user does not exist', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2026-07-18T00:00:00.000Z'),
      null,
      null,
      new Date('2026-07-16T00:00:00.000Z'),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);
    findById.mockResolvedValue(null);

    await expect(
      refreshAccessTokenUseCase.execute('refresh-token'),
    ).rejects.toThrow(InvalidRefreshTokenError);

    expect(issue).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });
});
