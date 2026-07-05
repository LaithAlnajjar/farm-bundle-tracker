import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_VERIFIER } from '../auth.tokens';
import type { TokenVerifier } from '../domain/interfaces/tokenVerifier';

@Injectable()
export class VerifyTokenUseCase {
  constructor(
    @Inject(TOKEN_VERIFIER) private readonly tokenVerifier: TokenVerifier,
  ) {}

  async execute(token: string): Promise<{ userId: number; email: string }> {
    const { userId, email } = await this.tokenVerifier.verify(token);

    return { userId, email };
  }
}
