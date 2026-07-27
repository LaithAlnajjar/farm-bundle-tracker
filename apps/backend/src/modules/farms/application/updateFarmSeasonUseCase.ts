import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FarmSeason } from '../domain/entities/farm';
import type { FarmBoard } from '../domain/entities/farmBoard';
import type { FarmBoardRepository } from '../domain/repositories/farmBoard.repository';
import { FARM_BOARD_REPOSITORY } from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';
import { GetFarmBoardUseCase } from './getFarmBoardUseCase';

@Injectable()
export class UpdateFarmSeasonUseCase {
  constructor(
    @Inject(FARM_BOARD_REPOSITORY)
    private readonly boardRepository: FarmBoardRepository,
    private readonly authorize: AuthorizeFarmActionUseCase,
    private readonly getBoard: GetFarmBoardUseCase,
  ) {}

  async execute(
    farmId: number,
    actorUserId: number,
    season: FarmSeason,
  ): Promise<FarmBoard> {
    await this.authorize.execute(farmId, actorUserId, 'edit-board');
    if (!(await this.boardRepository.updateSeason(farmId, season))) {
      throw new NotFoundException('Farm not found');
    }
    return this.getBoard.execute(farmId, actorUserId);
  }
}
