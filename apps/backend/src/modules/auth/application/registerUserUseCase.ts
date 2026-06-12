import { Injectable, ConflictException } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ConflictException();
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    await this.userRepository.create({ email, hashedPassword });
  }
}
