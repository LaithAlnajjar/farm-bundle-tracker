import { IsInt, Min } from 'class-validator';

export class SetSlotClaimRequestDto {
  @IsInt()
  @Min(1)
  claimantMembershipId!: number;
}
