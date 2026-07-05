import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import { InvalidCredentialsError } from '../domain/errors/invalidCredentials.error';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import type { RefreshTokenGenerator } from '../domain/interfaces/refreshTokenGenerator';
import type { TokenHasher } from '../domain/interfaces/tokenHasher';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import type { RefreshTokenRepository } from '../domain/repositories/refreshToken.repository';
import { addDurationFromNow } from '../domain/utils/duration';
import {
  AUTH_CONFIG,
  PASSWORD_HASHER,
  REFRESH_TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_ISSUER,
} from '../auth.tokens';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import type { SignInResult } from './dtos/signInResult';

export type SignInInput = {
  email: string;
  password: string;
};

@Injectable()
export class SignInUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_ISSUER) private readonly tokenIssuer: TokenIssuer,
    @Inject(REFRESH_TOKEN_GENERATOR)
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    @Inject(TOKEN_HASHER) private readonly tokenHasher: TokenHasher,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  async execute(input: SignInInput): Promise<SignInResult> {
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenIssuer.issue({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = this.refreshTokenGenerator.generate();
    const tokenHash = this.tokenHasher.hash(refreshToken);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt: addDurationFromNow(this.authConfig.jwtRefreshExpiresIn),
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      accessToken,
      refreshToken,
    };
  }
}
