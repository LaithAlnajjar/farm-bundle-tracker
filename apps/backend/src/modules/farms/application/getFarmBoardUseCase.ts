import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FARM_BOARD_REPOSITORY } from '../farms.tokens';
import type { FarmBoard } from '../domain/entities/farmBoard';
import type { FarmBoardRepository } from '../domain/repositories/farmBoard.repository';
import { deriveFarmBoard } from '../domain/policies/farmBoard.policy';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

@Injectable()
export class GetFarmBoardUseCase {
  constructor(
    @Inject(FARM_BOARD_REPOSITORY)
    private readonly boardRepository: FarmBoardRepository,
    private readonly authorize: AuthorizeFarmActionUseCase,
  ) {}

  async execute(farmId: number, actorUserId: number): Promise<FarmBoard> {
    await this.authorize.execute(farmId, actorUserId, 'view');
    const source = await this.boardRepository.load(farmId, actorUserId);
    if (!source) throw new NotFoundException('Farm not found');
    return deriveFarmBoard(source);
  }
}
