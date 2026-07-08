import { InjectionToken } from '@nestjs/common';
import { FarmRepository } from './domain/repositories/farm.repository';

export const FARM_REPOSITORY: InjectionToken<FarmRepository> =
  Symbol('FARM_REPOSITORY');
