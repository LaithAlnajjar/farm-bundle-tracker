import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { FarmRepository } from '../domain/repositories/farm.repository';
import { FARM_REPOSITORY } from '../farms.tokens';
import type { Farm } from '../domain/entities/farm';

export type CreateFarmInput = {
  name: string;
  userId: number;
};

@Injectable()
export class CreateFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY) private readonly farmRepository: FarmRepository,
  ) {}

  async execute(input: CreateFarmInput): Promise<Farm> {
    const name = input.name.trim();

    if (!name) {
      throw new BadRequestException('Farm name is required');
    }

    try {
      return await this.farmRepository.create({
        name,
        userId: input.userId,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'ACTIVE_CATALOG_UNAVAILABLE'
      ) {
        throw new ServiceUnavailableException(
          'Active catalog is not available',
        );
      }
      throw error;
    }
  }
}
