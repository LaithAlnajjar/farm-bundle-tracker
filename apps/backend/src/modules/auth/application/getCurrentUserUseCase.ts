import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import { InvalidAccessTokenError } from '../domain/errors/invalidAccessToken.error';
import type { CurrentUserResult } from './dtos/currentUserResult';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<CurrentUserResult> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new InvalidAccessTokenError();
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
