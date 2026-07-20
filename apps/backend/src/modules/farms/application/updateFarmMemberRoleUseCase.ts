import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FarmRole } from '../domain/entities/farm';
import type { FarmMembership } from '../domain/entities/farmMembership';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

export type UpdateFarmMemberRoleInput = {
  farmId: number;
  actorUserId: number;
  membershipId: number;
  role: FarmRole;
};

@Injectable()
export class UpdateFarmMemberRoleUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(input: UpdateFarmMemberRoleInput): Promise<FarmMembership> {
    await this.authorizeFarmAction.execute(
      input.farmId,
      input.actorUserId,
      'manage-members',
    );
    const target = await this.collaborationRepository.findMembershipById(
      input.farmId,
      input.membershipId,
    );
    if (!target) throw new NotFoundException('Farm member not found');
    if (target.role === 'owner') {
      throw new BadRequestException(
        'Transfer ownership to another member before changing the owner role',
      );
    }

    if (input.role === 'owner') {
      const transferred = await this.collaborationRepository.transferOwnership(
        input.farmId,
        input.actorUserId,
        input.membershipId,
      );
      if (!transferred) {
        throw new ConflictException('Ownership transfer failed');
      }
      return transferred;
    }

    const updated = await this.collaborationRepository.changeMemberRole(
      input.farmId,
      input.membershipId,
      input.role,
    );
    if (!updated) throw new NotFoundException('Farm member not found');
    return updated;
  }
}
