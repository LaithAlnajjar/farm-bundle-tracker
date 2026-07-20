import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import type { FarmRole } from '../domain/entities/farm';
import type { FarmMembership } from '../domain/entities/farmMembership';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

export type AddFarmMemberInput = {
  farmId: number;
  actorUserId: number;
  identifier: string;
  role: Exclude<FarmRole, 'owner'>;
};

@Injectable()
export class AddFarmMemberUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(input: AddFarmMemberInput): Promise<FarmMembership> {
    await this.authorizeFarmAction.execute(
      input.farmId,
      input.actorUserId,
      'manage-members',
    );
    const identifier = input.identifier.trim().toLowerCase();
    if (!identifier) {
      throw new BadRequestException('Username or email is required');
    }
    const user = identifier.includes('@')
      ? await this.userRepository.findByEmail(identifier)
      : await this.userRepository.findByUsername(identifier);
    if (!user) throw new NotFoundException('User not found');

    const membership = await this.collaborationRepository.addMember(
      input.farmId,
      user.id,
      input.role,
    );
    if (!membership) {
      throw new ConflictException('User is already a farm member');
    }
    return membership;
  }
}
