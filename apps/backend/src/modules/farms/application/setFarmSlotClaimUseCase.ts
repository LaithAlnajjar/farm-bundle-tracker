import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FarmBoard } from '../domain/entities/farmBoard';
import type { FarmBoardRepository } from '../domain/repositories/farmBoard.repository';
import { FARM_BOARD_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';
import { GetFarmBoardUseCase } from './getFarmBoardUseCase';

@Injectable()
export class SetFarmSlotClaimUseCase {
  constructor(
    @Inject(FARM_BOARD_REPOSITORY)
    private readonly boardRepository: FarmBoardRepository,
    private readonly authorize: AuthorizeFarmActionUseCase,
    private readonly getBoard: GetFarmBoardUseCase,
  ) {}

  async execute(input: {
    farmId: number;
    slotId: number;
    actorUserId: number;
    claimantMembershipId: number;
  }): Promise<FarmBoard> {
    await this.authorize.execute(input.farmId, input.actorUserId, 'edit-board');
    const result = await this.boardRepository.setClaim(input);
    if (result === 'not-found')
      throw new NotFoundException('Board slot or member not found');
    if (result === 'claimant-ineligible') {
      throw new ConflictException('Viewer memberships cannot receive claims');
    }
    if (result === 'not-claimable') {
      throw new ConflictException(
        'Collected or completed slots cannot be claimed',
      );
    }
    return this.getBoard.execute(input.farmId, input.actorUserId);
  }
}
