import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import { PASSWORD_HASHER } from '../auth.tokens';

@Injectable()
export class SignInUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
  }
}
