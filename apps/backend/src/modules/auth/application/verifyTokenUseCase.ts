import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_VERIFIER } from '../auth.tokens';
import type { TokenVerifier } from '../domain/interfaces/tokenVerifier';

@Injectable()
export class VerifyTokenUseCase {
  constructor(
    @Inject(TOKEN_VERIFIER) private readonly tokenVerifier: TokenVerifier,
  ) {}

  execute(token: string): Promise<{ userId: number; email: string }> {
    const { userId, email } = this.tokenVerifier.verify(token);

    return Promise.resolve({ userId, email });
  }
}
