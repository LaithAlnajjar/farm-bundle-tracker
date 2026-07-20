import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddFarmMemberRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  identifier!: string;

  @IsOptional()
  @IsIn(['editor', 'viewer'])
  role?: 'editor' | 'viewer';
}
