import { Inject, Injectable } from '@nestjs/common';
import type { Farm } from '../domain/entities/farm';
import type { FarmRepository } from '../domain/repositories/farm.repository';
import { FARM_REPOSITORY } from '../farms.tokens';

@Injectable()
export class ListFarmsUseCase {
  constructor(
    @Inject(FARM_REPOSITORY) private readonly farmRepository: FarmRepository,
  ) {}

  async execute(userId: number): Promise<Farm[]> {
    return this.farmRepository.listByUserId(userId);
  }
}
