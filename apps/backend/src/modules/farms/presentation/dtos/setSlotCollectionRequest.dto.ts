import { IsBoolean } from 'class-validator';

export class SetSlotCollectionRequestDto {
  @IsBoolean()
  collected!: boolean;
}
