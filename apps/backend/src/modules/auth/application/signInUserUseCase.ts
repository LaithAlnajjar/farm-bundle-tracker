import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import { InvalidCredentialsError } from '../domain/errors/invalidCredentials.error';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import type { TokenIssuer } from '../domain/interfaces/tokenIssuer';
import { PASSWORD_HASHER, TOKEN_ISSUER } from '../auth.tokens';
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
  ) {}

  async execute(input: SignInInput): Promise<SignInResult> {
    const user = await this.userRepository.findByEmail(input.email);
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

    return { id: user.id, email: user.email, accessToken };
  }
}
