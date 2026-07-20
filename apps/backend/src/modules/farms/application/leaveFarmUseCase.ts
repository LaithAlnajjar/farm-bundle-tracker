import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import { FARM_COLLABORATION_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

@Injectable()
export class LeaveFarmUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(farmId: number, userId: number): Promise<void> {
    const membership = await this.authorizeFarmAction.execute(
      farmId,
      userId,
      'view',
    );
    if (membership.role === 'owner') {
      throw new BadRequestException(
        'Transfer ownership before leaving the farm',
      );
    }
    if (!(await this.collaborationRepository.leaveFarm(farmId, userId))) {
      throw new NotFoundException('Farm membership not found');
    }
  }
}
