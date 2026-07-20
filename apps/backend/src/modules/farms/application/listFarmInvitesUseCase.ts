import { Inject, Injectable } from '@nestjs/common';
import type { FarmInvite } from '../domain/entities/farmInvite';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

@Injectable()
export class ListFarmInvitesUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(farmId: number, userId: number): Promise<FarmInvite[]> {
    await this.authorizeFarmAction.execute(farmId, userId, 'manage-invites');
    return this.collaborationRepository.listInvites(farmId);
  }
}
