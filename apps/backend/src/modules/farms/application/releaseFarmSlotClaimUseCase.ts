import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FarmBoard } from '../domain/entities/farmBoard';
import type { FarmBoardRepository } from '../domain/repositories/farmBoard.repository';
import { FARM_BOARD_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';
import { GetFarmBoardUseCase } from './getFarmBoardUseCase';

@Injectable()
export class ReleaseFarmSlotClaimUseCase {
  constructor(
    @Inject(FARM_BOARD_REPOSITORY)
    private readonly boardRepository: FarmBoardRepository,
    private readonly authorize: AuthorizeFarmActionUseCase,
    private readonly getBoard: GetFarmBoardUseCase,
  ) {}

  async execute(
    farmId: number,
    slotId: number,
    actorUserId: number,
  ): Promise<FarmBoard> {
    await this.authorize.execute(farmId, actorUserId, 'edit-board');
    const result = await this.boardRepository.releaseClaim(farmId, slotId);
    if (result === 'not-found')
      throw new NotFoundException('Board slot not found');
    return this.getBoard.execute(farmId, actorUserId);
  }
}
