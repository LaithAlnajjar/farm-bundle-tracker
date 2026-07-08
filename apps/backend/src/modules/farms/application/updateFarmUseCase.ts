import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Farm } from '../domain/entities/farm';
import type { FarmRepository } from '../domain/repositories/farm.repository';
import { FARM_REPOSITORY } from '../farms.tokens';

export type UpdateFarmInput = {
  id: number;
  userId: number;
  name: string;
};

@Injectable()
export class UpdateFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY) private readonly farmRepository: FarmRepository,
  ) {}

  async execute(input: UpdateFarmInput): Promise<Farm> {
    const name = input.name.trim();

    if (!name) {
      throw new BadRequestException('Farm name is required');
    }

    const farm = await this.farmRepository.updateName({
      id: input.id,
      userId: input.userId,
      name,
    });

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return farm;
  }
}
