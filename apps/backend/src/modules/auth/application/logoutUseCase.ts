import { Inject, Injectable } from '@nestjs/common';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';
import { REFRESH_TOKEN_REPOSITORY, TOKEN_HASHER } from '../auth.tokens';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_HASHER) private readonly tokenHasher: TokenHasher,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const tokenHash = this.tokenHasher.hash(refreshToken);
    const session =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!session || session.isRevoked()) {
      return;
    }

    await this.refreshTokenRepository.revoke(session.id);
  }
}
