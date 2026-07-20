import { Inject, Injectable } from '@nestjs/common';
import type { FarmMembership } from '../domain/entities/farmMembership';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

@Injectable()
export class ListFarmMembersUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(
    farmId: number,
    actorUserId: number,
  ): Promise<FarmMembership[]> {
    await this.authorizeFarmAction.execute(farmId, actorUserId, 'view');
    return this.collaborationRepository.listMembers(farmId);
  }
}
