import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import { InvalidRefreshTokenError } from '../domain/errors/invalidRefreshToken.error';
import { RefreshTokenReusedError } from '../domain/errors/refreshTokenReused.error';
import type { RefreshTokenGenerator } from '../domain/interfaces/refreshTokenGenerator';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';
import { addDurationFromNow } from '../domain/utils/duration';
import {
  AUTH_CONFIG,
  REFRESH_TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_ISSUER,
} from '../auth.tokens';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { RefreshAccessTokenResult } from './dtos/refreshAccessTokenResult';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuer,
    @Inject(REFRESH_TOKEN_GENERATOR)
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    @Inject(TOKEN_HASHER) private readonly tokenHasher: TokenHasher,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  async execute(refreshToken: string): Promise<RefreshAccessTokenResult> {
    const tokenHash = this.tokenHasher.hash(refreshToken);
    const session =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new InvalidRefreshTokenError();
    }

    if (session.wasReplaced()) {
      await this.refreshTokenRepository.revokeAllForUser(session.userId);
      throw new RefreshTokenReusedError();
    }

    if (session.isRevoked() || session.isExpired()) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    const accessToken = this.tokenIssuer.issue({
      userId: user.id,
      email: user.email,
    });

    const newRefreshToken = this.refreshTokenGenerator.generate();
    const newTokenHash = this.tokenHasher.hash(newRefreshToken);

    const { id: newSessionId } = await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt: addDurationFromNow(this.authConfig.jwtRefreshExpiresIn),
    });

    await this.refreshTokenRepository.markReplaced(session.id, newSessionId);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
