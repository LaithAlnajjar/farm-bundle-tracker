import { IsIn } from 'class-validator';
import type { FarmSeason } from '../../domain/entities/farm';

export class UpdateFarmSeasonRequestDto {
  @IsIn(['spring', 'summer', 'fall', 'winter'])
  season!: FarmSeason;
}
