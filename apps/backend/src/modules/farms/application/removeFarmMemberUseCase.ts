import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

export type RemoveFarmMemberInput = {
  farmId: number;
  actorUserId: number;
  membershipId: number;
};

@Injectable()
export class RemoveFarmMemberUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(input: RemoveFarmMemberInput): Promise<void> {
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
      throw new BadRequestException('The farm owner cannot be removed');
    }
    const removed = await this.collaborationRepository.removeMember(
      input.farmId,
      input.membershipId,
    );
    if (!removed) throw new NotFoundException('Farm member not found');
  }
}
