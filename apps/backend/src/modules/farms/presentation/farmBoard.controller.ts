import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/domain/interfaces/authUser';
import { GetFarmBoardUseCase } from '../application/getFarmBoardUseCase';
import { ReleaseFarmSlotClaimUseCase } from '../application/releaseFarmSlotClaimUseCase';
import { SetFarmSlotClaimUseCase } from '../application/setFarmSlotClaimUseCase';
import { SetFarmSlotCollectionUseCase } from '../application/setFarmSlotCollectionUseCase';
import { UpdateFarmSeasonUseCase } from '../application/updateFarmSeasonUseCase';
import type { FarmBoard } from '../domain/entities/farmBoard';
import {
  SetSlotClaimRequestDto,
  SetSlotCollectionRequestDto,
  UpdateFarmSeasonRequestDto,
} from './dtos';

@Controller('farms/:farmId/board')
export class FarmBoardController {
  constructor(
    private readonly getBoard: GetFarmBoardUseCase,
    private readonly updateSeason: UpdateFarmSeasonUseCase,
    private readonly setCollection: SetFarmSlotCollectionUseCase,
    private readonly setClaim: SetFarmSlotClaimUseCase,
    private readonly releaseClaim: ReleaseFarmSlotClaimUseCase,
  ) {}

  @Get()
  get(
    @Param('farmId', ParseIntPipe) farmId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmBoard> {
    return this.getBoard.execute(farmId, user.id);
  }

  @Put('season')
  setSeason(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Body() dto: UpdateFarmSeasonRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmBoard> {
    return this.updateSeason.execute(farmId, user.id, dto.season);
  }

  @Put('slots/:slotId/collection')
  collect(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Body() dto: SetSlotCollectionRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmBoard> {
    return this.setCollection.execute({
      farmId,
      slotId,
      actorUserId: user.id,
      collected: dto.collected,
    });
  }

  @Put('slots/:slotId/claim')
  claim(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Body() dto: SetSlotClaimRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmBoard> {
    return this.setClaim.execute({
      farmId,
      slotId,
      actorUserId: user.id,
      claimantMembershipId: dto.claimantMembershipId,
    });
  }

  @Delete('slots/:slotId/claim')
  release(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmBoard> {
    return this.releaseClaim.execute(farmId, slotId, user.id);
  }
}
