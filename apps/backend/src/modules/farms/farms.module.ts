import { Module } from '@nestjs/common';
import {
  FARM_BOARD_REPOSITORY,
  FARM_LIST_READ_REPOSITORY,
  FARM_REPOSITORY,
} from './farms.tokens';
import { DrizzleFarmRepository } from './infrastructure/repositories/farm.repository';
import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { CreateFarmUseCase } from './application/createFarmUseCase';
import { DeleteFarmUseCase } from './application/deleteFarmUseCase';
import { GetFarmUseCase } from './application/getFarmUseCase';
import { ListFarmsUseCase } from './application/listFarmsUseCase';
import { UpdateFarmUseCase } from './application/updateFarmUseCase';
import { FarmsController } from './presentation/farms.controller';
import { UsersModule } from '../users/users.module';
import {
  FARM_COLLABORATION_REPOSITORY,
  FARM_INVITE_TOKEN_SERVICE,
} from './farms.tokens';
import { DrizzleFarmCollaborationRepository } from './infrastructure/repositories/farmCollaboration.repository';
import { CryptoFarmInviteTokenService } from './infrastructure/cryptoFarmInviteTokenService';
import { AddFarmMemberUseCase } from './application/addFarmMemberUseCase';
import { AuthorizeFarmActionUseCase } from './application/authorizeFarmActionUseCase';
import { CreateFarmInviteUseCase } from './application/createFarmInviteUseCase';
import { LeaveFarmUseCase } from './application/leaveFarmUseCase';
import { ListFarmInvitesUseCase } from './application/listFarmInvitesUseCase';
import { ListFarmMembersUseCase } from './application/listFarmMembersUseCase';
import { PreviewFarmInviteUseCase } from './application/previewFarmInviteUseCase';
import { RedeemFarmInviteUseCase } from './application/redeemFarmInviteUseCase';
import { RemoveFarmMemberUseCase } from './application/removeFarmMemberUseCase';
import { RevokeFarmInviteUseCase } from './application/revokeFarmInviteUseCase';
import { UpdateFarmMemberRoleUseCase } from './application/updateFarmMemberRoleUseCase';
import { FarmMembersController } from './presentation/farmMembers.controller';
import { FarmInvitesController } from './presentation/farmInvites.controller';
import { FarmInviteRedemptionController } from './presentation/farmInviteRedemption.controller';
import { DrizzleFarmBoardRepository } from './infrastructure/repositories/farmBoard.repository';
import { GetFarmBoardUseCase } from './application/getFarmBoardUseCase';
import { ReleaseFarmSlotClaimUseCase } from './application/releaseFarmSlotClaimUseCase';
import { SetFarmSlotClaimUseCase } from './application/setFarmSlotClaimUseCase';
import { SetFarmSlotCollectionUseCase } from './application/setFarmSlotCollectionUseCase';
import { UpdateFarmSeasonUseCase } from './application/updateFarmSeasonUseCase';
import { FarmBoardController } from './presentation/farmBoard.controller';
import { DrizzleFarmListReadRepository } from './infrastructure/repositories/farmListRead.repository';

@Module({
  imports: [DrizzleModule, UsersModule],
  providers: [
    { provide: FARM_REPOSITORY, useClass: DrizzleFarmRepository },
    { provide: FARM_BOARD_REPOSITORY, useClass: DrizzleFarmBoardRepository },
    {
      provide: FARM_LIST_READ_REPOSITORY,
      useClass: DrizzleFarmListReadRepository,
    },
    {
      provide: FARM_COLLABORATION_REPOSITORY,
      useClass: DrizzleFarmCollaborationRepository,
    },
    {
      provide: FARM_INVITE_TOKEN_SERVICE,
      useClass: CryptoFarmInviteTokenService,
    },
    AddFarmMemberUseCase,
    AuthorizeFarmActionUseCase,
    CreateFarmUseCase,
    CreateFarmInviteUseCase,
    DeleteFarmUseCase,
    GetFarmUseCase,
    GetFarmBoardUseCase,
    LeaveFarmUseCase,
    ListFarmInvitesUseCase,
    ListFarmMembersUseCase,
    ListFarmsUseCase,
    PreviewFarmInviteUseCase,
    RedeemFarmInviteUseCase,
    RemoveFarmMemberUseCase,
    ReleaseFarmSlotClaimUseCase,
    RevokeFarmInviteUseCase,
    SetFarmSlotClaimUseCase,
    SetFarmSlotCollectionUseCase,
    UpdateFarmUseCase,
    UpdateFarmMemberRoleUseCase,
    UpdateFarmSeasonUseCase,
  ],
  controllers: [
    FarmsController,
    FarmMembersController,
    FarmInvitesController,
    FarmInviteRedemptionController,
    FarmBoardController,
  ],
  exports: [],
})
export class FarmsModule {}
