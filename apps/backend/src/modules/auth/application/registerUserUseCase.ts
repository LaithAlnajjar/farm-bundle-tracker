import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import { PASSWORD_HASHER } from '../auth.tokens';

export type RegisterInput = {
  email: string;
  password: string;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);
    if (user) {
      throw new ConflictException();
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    await this.userRepository.create({ email: input.email, hashedPassword });
  }
}
