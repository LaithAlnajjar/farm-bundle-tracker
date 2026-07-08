import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Farm } from '../domain/entities/farm';
import type { FarmRepository } from '../domain/repositories/farm.repository';
import { FARM_REPOSITORY } from '../farms.tokens';

export type GetFarmInput = {
  id: number;
  userId: number;
};

@Injectable()
export class GetFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY) private readonly farmRepository: FarmRepository,
  ) {}

  async execute(input: GetFarmInput): Promise<Farm> {
    const farm = await this.farmRepository.findByIdForUser(
      input.id,
      input.userId,
    );

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return farm;
  }
}
