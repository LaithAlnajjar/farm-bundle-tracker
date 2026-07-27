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
export class SetFarmSlotCollectionUseCase {
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
    collected: boolean;
  }): Promise<FarmBoard> {
    await this.authorize.execute(input.farmId, input.actorUserId, 'edit-board');
    const result = await this.boardRepository.setCollection(input);
    if (result === 'not-found')
      throw new NotFoundException('Board slot not found');
    if (result !== 'ok')
      throw new ConflictException('Board slot could not be updated');
    return this.getBoard.execute(input.farmId, input.actorUserId);
  }
}
