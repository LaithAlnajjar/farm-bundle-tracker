import { IsIn } from 'class-validator';
import type { FarmRole } from '../../domain/entities/farm';

export class UpdateFarmMemberRequestDto {
  @IsIn(['owner', 'editor', 'viewer'])
  role!: FarmRole;
}
