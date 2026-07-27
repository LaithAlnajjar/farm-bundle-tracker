import { Inject, Injectable } from '@nestjs/common';
import type { FarmListItem } from '../domain/entities/farmListItem';
import type { FarmListReadRepository } from '../domain/repositories/farmListRead.repository';
import { FARM_LIST_READ_REPOSITORY } from '../farms.tokens';

@Injectable()
export class ListFarmsUseCase {
  constructor(
    @Inject(FARM_LIST_READ_REPOSITORY)
    private readonly farmListReadRepository: FarmListReadRepository,
  ) {}

  async execute(userId: number): Promise<FarmListItem[]> {
    return this.farmListReadRepository.listForUser(userId);
  }
}
