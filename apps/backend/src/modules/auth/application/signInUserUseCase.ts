import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import type { PasswordHasher } from '../domain/interfaces/passwordHasher';

@Injectable()
export class SignInUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
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
