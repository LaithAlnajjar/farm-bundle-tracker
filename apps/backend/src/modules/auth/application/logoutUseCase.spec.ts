import { LogoutUseCase } from './logoutUseCase';
import { RefreshToken } from '../domain/entities/refreshToken';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;
  let hash: jest.MockedFunction<TokenHasher['hash']>;
  let findByTokenHash: jest.MockedFunction<
    RefreshTokenRepository['findByTokenHash']
  >;
  let revoke: jest.MockedFunction<RefreshTokenRepository['revoke']>;

  beforeEach(() => {
    hash = jest.fn();
    findByTokenHash = jest.fn();
    revoke = jest.fn();

    const tokenHasher: TokenHasher = {
      hash,
      matches: jest.fn(),
    };
    const refreshTokenRepository: RefreshTokenRepository = {
      create: jest.fn(),
      findByTokenHash,
      markReplaced: jest.fn(),
      revoke,
      revokeAllForUser: jest.fn(),
    };

    logoutUseCase = new LogoutUseCase(tokenHasher, refreshTokenRepository);
  });

  it('revokes the refresh token session', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2099-01-01'),
      null,
      null,
      new Date(),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);

    await expect(
      logoutUseCase.execute('refresh-token'),
    ).resolves.toBeUndefined();

    expect(hash).toHaveBeenCalledWith('refresh-token');
    expect(findByTokenHash).toHaveBeenCalledWith('token-hash');
    expect(revoke).toHaveBeenCalledWith(10);
    expect(revoke).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the refresh token session does not exist', async () => {
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(null);

    await expect(
      logoutUseCase.execute('refresh-token'),
    ).resolves.toBeUndefined();

    expect(revoke).not.toHaveBeenCalled();
  });

  it('does nothing when the refresh token session is already revoked', async () => {
    const session = new RefreshToken(
      10,
      1,
      'token-hash',
      new Date('2099-01-01'),
      new Date(),
      null,
      new Date(),
    );
    hash.mockReturnValue('token-hash');
    findByTokenHash.mockResolvedValue(session);

    await expect(
      logoutUseCase.execute('refresh-token'),
    ).resolves.toBeUndefined();

    expect(revoke).not.toHaveBeenCalled();
  });
});
