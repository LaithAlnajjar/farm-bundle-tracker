import { Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthUser } from '@/modules/auth/domain/interfaces/authUser';
import { PreviewFarmInviteUseCase } from '../application/previewFarmInviteUseCase';
import { RedeemFarmInviteUseCase } from '../application/redeemFarmInviteUseCase';
import type { FarmInvitePreviewResponseDto, FarmResponseDto } from './dtos';

@Controller('farm-invites')
export class FarmInviteRedemptionController {
  constructor(
    private readonly previewFarmInviteUseCase: PreviewFarmInviteUseCase,
    private readonly redeemFarmInviteUseCase: RedeemFarmInviteUseCase,
  ) {}

  @Public()
  @Get(':token')
  async preview(
    @Param('token') token: string,
  ): Promise<FarmInvitePreviewResponseDto> {
    const preview = await this.previewFarmInviteUseCase.execute(token);
    return {
      farmName: preview.farmName,
      expiresAt: preview.expiresAt.toISOString(),
    };
  }

  @Post(':token/redeem')
  async redeem(
    @Param('token') token: string,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmResponseDto> {
    const farm = await this.redeemFarmInviteUseCase.execute(token, user.id);
    return {
      id: farm.id,
      name: farm.name,
      userId: farm.userId,
      catalogVersionId: farm.catalogVersionId,
      currentSeason: farm.currentSeason,
      membershipRole: farm.membershipRole ?? 'editor',
      createdAt: farm.createdAt.toISOString(),
      updatedAt: farm.updatedAt.toISOString(),
    };
  }
}
