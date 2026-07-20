import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

@Injectable()
export class RevokeFarmInviteUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(
    farmId: number,
    inviteId: number,
    userId: number,
  ): Promise<void> {
    await this.authorizeFarmAction.execute(farmId, userId, 'manage-invites');
    if (!(await this.collaborationRepository.revokeInvite(farmId, inviteId))) {
      throw new NotFoundException('Active farm invite not found');
    }
  }
}
