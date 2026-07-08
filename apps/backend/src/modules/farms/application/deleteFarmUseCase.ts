import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FarmRepository } from '../domain/repositories/farm.repository';
import { FARM_REPOSITORY } from '../farms.tokens';

export type DeleteFarmInput = {
  id: number;
  userId: number;
};

@Injectable()
export class DeleteFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY) private readonly farmRepository: FarmRepository,
  ) {}

  async execute(input: DeleteFarmInput): Promise<void> {
    const deleted = await this.farmRepository.softDelete(
      input.id,
      input.userId,
    );

    if (!deleted) {
      throw new NotFoundException('Farm not found');
    }
  }
}
