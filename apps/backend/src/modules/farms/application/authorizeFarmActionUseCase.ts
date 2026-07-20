import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FarmMembership } from '../domain/entities/farmMembership';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import {
  canAccessFarm,
  type FarmCapability,
} from '../domain/policies/farmAuthorization.policy';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';

@Injectable()
export class AuthorizeFarmActionUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
  ) {}

  async execute(
    farmId: number,
    userId: number,
    capability: FarmCapability,
  ): Promise<FarmMembership> {
    const membership = await this.collaborationRepository.findMembership(
      farmId,
      userId,
    );
    if (!membership) throw new NotFoundException('Farm not found');
    if (!canAccessFarm(membership.role, capability)) {
      throw new ForbiddenException('You do not have permission for this farm');
    }
    return membership;
  }
}
