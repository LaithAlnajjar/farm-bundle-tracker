import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';
import { PASSWORD_HASHER } from '../auth.tokens';

export type RegisterInput = {
  email: string;
  password: string;
  username: string;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(
    input: RegisterInput,
  ): Promise<{ email: string; username: string }> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim().toLowerCase();

    const existingByEmail = await this.userRepository.findByEmail(email);

    if (existingByEmail) {
      throw new ConflictException('Email is already registered');
    }

    const existingByUsername =
      await this.userRepository.findByUsername(username);

    if (existingByUsername) {
      throw new ConflictException('Username is already registered');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    await this.userRepository.create({
      email,
      hashedPassword,
      username,
    });

    return { email, username };
  }
}
